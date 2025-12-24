# 🔍 Análise Técnica Exaustiva - X-Chrome Site Blocker

**Data:** Dezembro 2025  
**Escopo:** Código-fonte completo, arquitetura, configuração e artefatos de build  
**Metodologia:** Análise de segurança, performance, maintainability e lógica de negócio

---

## 📊 Sumário Executivo

- **Risco Crítico:** 3 vulnerabilidades de segurança e lógica
- **Risco Alto:** 5 problemas de design e performance
- **Risco Médio:** 8 ineficiências técnicas
- **Recomendações:** 16 ações imediatas identificadas

---

## 🚨 PROBLEMAS CRÍTICOS (Risco Alto → Máxima Prioridade)

### 1. **Race Condition: Duplicate Pass Consumption** ⚠️ CRÍTICO

**Localização:** `src/content-script/content-script.ts` (linhas 62-69)  
**Tipo:** Falha Lógica Concorrente

```typescript
const blockStatus = await checkIfBlocked();
if (blockStatus.remainingPasses > 0) {
    const domain = new URL(window.location.href).hostname;
    chrome.runtime.sendMessage({
        type: "USE_PASS",
        payload: { domain },
    } as any);
}
```

**Problema Detalhado:**
- O content-script verifica se há passes (`remainingPasses > 0`)
- Logo após, envia mensagem `USE_PASS` de forma **assíncrona sem await**
- Se múltiplas abas do mesmo site bloqueado forem abertas simultaneamente:
  1. Aba 1 verifica: `remainingPasses = 3` ✓
  2. Aba 2 verifica: `remainingPasses = 3` ✓
  3. Ambas enviam `USE_PASS` quase simultaneamente
  4. Race condition → ambas consomem 1 pass, mas estado não sincroniza
  5. Resultado: Passes gastos em duplicata, usuário pode perder acessos

**Impacto:**
- Usuário perde acesso liberado prematuramente
- Não intuitivo: justificativa funcionaria para 1 aba, falha para 2+
- Violação de contrato: "máximo 3 acessos" não é respeitado

**Recomendação:**
Remover o `USE_PASS` automático do content-script. Deixar o pass ser consumido apenas quando houver **sucesso efetivo** no carregamento da página-alvo:

```typescript
// INCORRETO (atual):
if (blockStatus.remainingPasses > 0) {
    chrome.runtime.sendMessage({ type: "USE_PASS", payload: { domain } });
}

// CORRETO:
// Remover esta lógica do content-script. Adicionar em block-page:
// Quando usuário clica "Prosseguir" após justificativa bem-sucedida,
// use pass no destino, não na verificação inicial
```

---

### 2. **Session ID Nunca Utilizado - Design Flaw** ⚠️ CRÍTICO

**Localização:** `src/background/background.ts` (linhas 208-224)

```typescript
case "SUBMIT_JUSTIFICATION": {
    const sessionId = `session-${Date.now()}-${Math.random()}`;
    state.justifications.set(normalizedDomain, {
        remainingPasses: 3,
        sessionId, // ← NUNCA UTILIZADO!
    });
```

**Problema:**
- `sessionId` é gerado mas **nunca checado em nenhum lugar**
- Estrutura sugere sistema multi-sessão, mas implementação é single-passthrough
- Campo de dados inútil aumenta footprint de memória
- Código morto reduz legibilidade (leitura confusa: por que existe?)

**Impacto:**
- Confusão para future maintainers
- Overhead de memória (pequeno mas real)
- Sugestão de funcionalidade que não existe

**Recomendação:**

Opção A (Remover, se realmente não for usar):
```typescript
state.justifications.set(normalizedDomain, {
    remainingPasses: 3,
    timestamp: Date.now(), // Adicionar para controle
});
```

Opção B (Implementar corretamente, se for usar):
```typescript
// Se houver requisito de multi-tab sessions:
state.justifications.set(normalizedDomain, {
    remainingPasses: 3,
    sessionId,
    tabIds: [tab.id], // Rastrear abas específicas
});
// Depois verificar: tabId !== tabIds incluso
```

---

### 3. **No Error Handling for Chrome Message Failures** ⚠️ CRÍTICO

**Localização:** Múltiplos (popup/store.ts, block-page/store.ts, content-script.ts)

```typescript
// popup/store.ts (linhas 68-73)
await new Promise<{ success: boolean }>((resolve) => {
    chrome.runtime.sendMessage(
        { type: MessageType.UPDATE_DOMAINS, payload: { domain: normalizedDomain, action: "add" } } as ChromeMessage,
        resolve
    );
});
// ↑ Sem timeout, sem error handler, resolve nunca chamado se service worker falha

// content-script.ts (linhas 62-68)
chrome.runtime.sendMessage({
    type: "USE_PASS",
    payload: { domain },
} as any);
// ↑ Fire-and-forget: nem resolve, nem tratamento de erro
```

**Problema:**
1. **Sem Timeout:** Se Service Worker falhar (crash, unload), Promise **nunca resolve** → UI fica travada
2. **Fire-and-Forget:** `USE_PASS` é enviado sem confirmação
3. **Sem Fallback:** User nunca fica sabendo que a ação falhou
4. **Memory Leak Potencial:** Promise pendente forever

**Cenário Real:**
- User clica "Adicionar domínio"
- Service Worker falha/atualiza
- UI fica em loading infinito
- User fecha popup frustrado, acredita que nada aconteceu

**Impacto:**
- UX ruim (travamentos indefinidos)
- Impossível debugar falhas de comunicação
- Reduz confiabilidade (silent failures)

**Recomendação:**

Criar helper com timeout e error handling:

```typescript
// utils/chromeSend.ts
export function sendChromeMessage<T>(
    message: ChromeMessage,
    timeoutMs: number = 5000
): Promise<T> {
    return Promise.race([
        new Promise<T>((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else if (!response) {
                    reject(new Error("Sem resposta do Service Worker"));
                } else {
                    resolve(response as T);
                }
            });
        }),
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout na comunicação")), timeoutMs)
        ),
    ]);
}

// Uso:
try {
    const result = await sendChromeMessage(message);
    set({ success: true });
} catch (error) {
    set({ error: error.message });
    console.error("Falha na comunicação:", error);
}
```

---

## ⚠️ PROBLEMAS ALTA PRIORIDADE (Risco Alto)

### 4. **No Persistence of Justification State After Service Worker Restart**

**Localização:** `src/background/background.ts` (linhas 46-67)

```typescript
async function persistState(): Promise<void> {
    const justificationsArray = Array.from(state.justifications.entries()).map(([domain]) => ({
        domain,
        reason: "", // ← VAZIO!
        justified: true,
        timestamp: Date.now(),
    }));
    // Salva em storage, mas...
}

// No initializeState():
if (stored?.blockedDomains) {
    stored.blockedDomains.forEach((domain) => {
        state.blockedDomains.set(domain.domain, domain);
    });
}
// ↑ Recarrega blockedDomains, mas onde recarrega justifications?
```

**Problema:**
1. Justificações são salvas em storage com reason vazio
2. Ao reiniciar Service Worker, `initializeState()` **não recarrega justifications**
3. Resultado: Passes se perdem quando SW reinicia (frequente em Chrome)

**Cenário:**
- User justifica acesso: Passes = 3
- Chrome reinicia Service Worker (por memory pressure, update, etc)
- User abre site: Passes foram perdidos! Bloqueado novamente

**Impacto:**
- Justificativas desaparecem espontaneamente
- Experiência inconsistente (imprevisível)
- User reclama: "Desbloqueei mas foi refeito bloqueio"

**Recomendação:**

```typescript
async function initializeState(): Promise<void> {
    try {
        const result = await chrome.storage.local.get("blockingState");
        const stored = result.blockingState as Partial<StorageData> | undefined;

        if (stored?.blockedDomains) {
            stored.blockedDomains.forEach((domain) => {
                state.blockedDomains.set(domain.domain, domain);
            });
        }

        // ✅ NOVO: Recarregar justificações
        if (stored?.justifications) {
            stored.justifications.forEach((just) => {
                state.justifications.set(just.domain, {
                    remainingPasses: 3, // ou buscar de stored
                    sessionId: `restored-${Date.now()}`,
                });
            });
        }

        console.log("[Service Worker] Estado inicializado:", state);
    } catch (error) {
        console.error("[Service Worker] Erro ao inicializar estado:", error);
    }
}
```

---

### 5. **URL Decode Vulnerability in Block Page Redirection**

**Localização:** `src/content-script/content-script.ts` (linhas 36-42)

```typescript
function redirectToBlockPage(): void {
    const blockPageUrl = chrome.runtime.getURL("block-page.html");
    const targetUrl = encodeURIComponent(window.location.href);
    const domain = encodeURIComponent(new URL(window.location.href).hostname);

    window.location.href = `${blockPageUrl}?target=${targetUrl}&domain=${domain}`;
}

// Depois em block-page:
// URL params são decodificados automaticamente pelo browser
// Problema: XSS se params não forem re-validados
```

**Problema:**
1. URL é passada via query param (público, visível)
2. Se block-page usar param diretamente em `window.location.href`, permite XSS:
   - `?target=javascript:alert('xss')`
3. Mesmo encodificado, precisa de validação

**Impacto:**
- Potencial XSS (local, baixo impacto, mas ainda vulnerability)
- User pode ser redirecionado para URL maliciosa

**Recomendação:**

```typescript
// block-page/index.tsx
function getTargetUrl(): string {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("target");
    
    if (!target) return "about:blank";
    
    try {
        const url = new URL(decodeURIComponent(target));
        // ✅ Validar: apenas http/https
        if (!["http:", "https:"].includes(url.protocol)) {
            console.warn("Invalid protocol:", url.protocol);
            return "about:blank";
        }
        return url.toString();
    } catch (e) {
        console.error("Invalid URL:", e);
        return "about:blank";
    }
}
```

---

### 6. **Case Sensitivity Bugs in Domain Comparison**

**Localização:** `src/popup/store.ts` (linhas 58-68)

```typescript
const normalizedDomain = domain.toLowerCase().trim();
if (!normalizedDomain || !isValidDomain(normalizedDomain)) {
    set({ error: "Domínio inválido" });
    return;
}

if (get().domains.some((d) => d.domain === normalizedDomain)) {
    // ✓ Okay aqui (compara lowercase)
}

// Mas no background:
state.blockedDomains.set(domain, newDomain);
// ↑ Pode salvar como domain (não-normalizado) dependendo de quem chamou
```

**Problema:**
- Popup normaliza para lowercase antes de enviar
- Mas background.ts pode receber domain já normalizado ou não
- Inconsistência: `YOUTUBE.COM` vs `youtube.com` vs `YouTube.com`
- Map lookup case-sensitive

**Cenário:**
- User entra `YouTube.com`
- Popup normaliza → `youtube.com`
- Ao bloquear, pode comparar `YOUTUBE.COM` vs `youtube.com` → não encontra
- Resultado: Site não é bloqueado

**Impacto:**
- Bypass de bloqueio com uppercase variations
- Difícil de debugar (intermitente)

**Recomendação:**

Padronizar **sempre** em background:

```typescript
// src/background/background.ts
case "UPDATE_DOMAINS": {
    const { domain, action } = message.payload as { domain: string; action: "add" | "remove" };
    const normalizedDomain = domain.toLowerCase().trim();
    
    if (action === "add") {
        const newDomain: BlockedDomain = {
            id: `${normalizedDomain}-${Date.now()}`,
            domain: normalizedDomain, // ✅ Sempre lowercase
            addedAt: Date.now(),
        };
        state.blockedDomains.set(normalizedDomain, newDomain);
    } else if (action === "remove") {
        state.blockedDomains.delete(normalizedDomain);
    }
```

---

## ⚠️ PROBLEMAS MÉDIOS (Risco Médio)

### 7. **No Expiration Logic for Passes - Indefinite Validity**

**Localização:** `src/background/background.ts` (linhas 208-224)

```typescript
state.justifications.set(normalizedDomain, {
    remainingPasses: 3,
    sessionId,
});
// Passes nunca expiram!
```

**Problema:**
- User justifica acesso, recebe 3 passes
- Passes nunca expiram (indefinidamente válidos)
- Design original (24h) foi descartado, mas sem substituição
- Pode resultar em: "Desbloqueei um domínio 6 meses atrás, ainda funciona"

**Impacto:**
- Violação do propósito da extensão (controle de tempo)
- Passes não consumidos acumulam

**Recomendação:**

```typescript
state.justifications.set(normalizedDomain, {
    remainingPasses: 3,
    sessionId,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24h
});

// No isDomainBlocked():
const justification = state.justifications.get(normalizedDomain);
if (justification) {
    if (Date.now() > justification.expiresAt) {
        state.justifications.delete(normalizedDomain);
        return true; // Bloqueado novamente
    }
    if (justification.remainingPasses > 0) {
        return false;
    }
}
```

---

### 8. **Unbounded Storage Growth - No Cleanup Mechanism**

**Localização:** `src/background/background.ts` (persistState)

```typescript
const storageData: StorageData = {
    blockedDomains: Array.from(state.blockedDomains.values()),
    blockingTimer: state.blockingTimer,
    justifications: justificationsArray,
};
await chrome.storage.local.set({ blockingState: storageData });
// Nenhuma lógica de cleanup, limpeza ou limite
```

**Problema:**
1. Justificações antigas nunca são removidas (mesmo expiradas)
2. Se user adicionar 1000 domínios, storage cresce indefinidamente
3. Chrome storage.local limite: ~10MB, pode ficar perto desse limite
4. Performance degrada com dados crescentes

**Cenário:**
- User active por 6 meses: 100 justificações salvas
- Storage cresceu 10KB (pequeno) mas continua
- Leitura de storage fica lenta progressivamente

**Impacto:**
- Possível exceder quota de storage (erro silencioso)
- Degração de performance
- Sem monitoramento

**Recomendação:**

```typescript
async function persistState(): Promise<void> {
    try {
        // ✅ Filtrar justificações expiradas antes de salvar
        const now = Date.now();
        const justificationsArray = Array.from(state.justifications.entries())
            .filter(([_, data]) => {
                if (data.expiresAt && now > data.expiresAt) {
                    return false; // Remover expiradas
                }
                return true;
            })
            .map(([domain, data]) => ({
                domain,
                reason: "",
                justified: true,
                timestamp: data.expiresAt || now,
            }));

        // ✅ Limitar domínios bloqueados a N máximo
        const maxDomains = 500;
        const blockedDomains = Array.from(state.blockedDomains.values()).slice(0, maxDomains);

        const storageData: StorageData = {
            blockedDomains,
            blockingTimer: state.blockingTimer,
            justifications: justificationsArray,
        };

        await chrome.storage.local.set({ blockingState: storageData });
        
        // ✅ Log tamanho aproximado
        const sizeKB = JSON.stringify(storageData).length / 1024;
        if (sizeKB > 5000) {
            console.warn(`[Service Worker] Armazenamento grande: ${sizeKB.toFixed(1)}KB`);
        }
    } catch (error) {
        console.error("[Service Worker] Erro ao persistir estado:", error);
    }
}
```

---

### 9. **Missing Validation in Block Page Step Transitions**

**Localização:** `src/block-page/store.ts` (linhas 28-30)

```typescript
setStep: (step) => set({ step }),
// ✓ Permite qualquer transição de step, sem validação

// Exemplo de bug:
useBlockPageStore.setState({ step: "submitted" }); // Sem preencher reason
// UI renderiza "sucesso" mesmo sem justificativa
```

**Problema:**
1. User pode manipular via DevTools: mudar step para "submitted" sem enviar
2. Transições inválidas: "warning" → "submitted" diretamente
3. Sem guarda de negócio

**Impacto:**
- User technically sofisticado pode burlar fluxo
- Lógica de negócio fraca

**Recomendação:**

```typescript
interface BlockPageState {
    step: "warning" | "form" | "confirmation" | "submitted";
    // ... resto
    
    // ✅ Adicionar método com validação
    setStepSafe: (newStep: BlockPageState["step"]) => void;
}

export const useBlockPageStore = create<BlockPageState>((set, get) => ({
    // ... outros campos
    
    setStepSafe: (newStep) => {
        const { step, reason } = get();
        
        // Validação de transições
        const validTransitions: Record<string, string[]> = {
            "warning": ["form"],
            "form": ["confirmation", "warning"],
            "confirmation": ["submitted", "form"],
            "submitted": [], // Terminal state
        };
        
        if (!validTransitions[step]?.includes(newStep)) {
            console.warn(`Transição inválida: ${step} → ${newStep}`);
            return;
        }
        
        // Validação de dados necessários
        if (newStep === "confirmation" && (!reason || reason.length < 10)) {
            set({ error: "Justificativa inválida" });
            return;
        }
        
        set({ step: newStep });
    },
}));
```

---

### 10. **Synchronous DOM Manipulation in Message Handler**

**Localização:** `src/content-script/content-script.ts` (linhas 36-42)

```typescript
chrome.runtime.onMessage.addListener((message: any) => {
    if (message.type === "TIMER_EXPIRED") {
        console.log("[Content Script] Timer expirado, atualizando status");
        // ← Listener não faz nada com essa informação!
    }
});
```

**Problema:**
1. Handler não retorna nada
2. Listener não faz update de UI
3. User fica sem saber se timer expirou
4. Chrome pode descartar o listener em alguns casos

**Impacto:**
- Feature incompleta (listener inútil)
- User não recebe feedback

**Recomendação:**

```typescript
chrome.runtime.onMessage.addListener((message: any, _sender, sendResponse) => {
    if (message.type === "TIMER_EXPIRED") {
        console.log("[Content Script] Timer expirou, atualizando acesso");
        
        // ✅ Se há passes, recheca se ainda pode acessar
        checkIfBlocked().then((status) => {
            if (status.isBlocked) {
                // Recarrega página para reativar bloqueio
                window.location.reload();
            }
        });
        
        sendResponse({ ok: true });
    }
    return true; // Keep channel open
});
```

---

## 📋 PROBLEMAS SECUNDÁRIOS (Risco Baixo-Médio)

### 11. **Redundant Domain Normalization Calls**

**Localização:** Multiple files

```typescript
// popup/store.ts
const normalizedDomain = domain.toLowerCase().trim();

// block-page/store.ts (não normaliza, espera receber já normalizado)

// background.ts
const normalizedDomain = domain.toLowerCase();
```

**Impacto:** Pequeno, mas code smell. Recommend centralizar em helper.

---

### 12. **Console.log Left in Production Code**

**Localização:** background.ts (linhas 43, 78-82, 95 etc)

```typescript
console.log("[Service Worker] Estado inicializado:", state);
console.log(`[Service Worker] Domínios bloqueados: ${Array.from(state.blockedDomains.keys()).join(", ")}`);
```

**Recomendação:** Adicionar debug flag ou remover em prod

---

### 13. **No Internationalization (i18n) - Hard-coded Portuguese**

**Impacto:** Extensão só funciona em português. Chrome Web Store exige múltiplos idiomas.

---

### 14. **Missing Icon Assets in Manifest**

**manifest.json:**
```json
"action": {
    "default_popup": "popup.html",
    // Faltam: default_icons, ou icons em geral
}
```

**Impacto:** Chrome Web Store rejeitará sem ícones

---

### 15. **No Unit Tests**

**Impacto:** Zero coverage, impossível validar refactorings. Recomendação: Adicionar Jest + React Testing Library

---

### 16. **Memory Leak: setInterval Without Cleanup on Content Script**

**content-script.ts:**
```typescript
// performInitialCheck() é chamada, mas performInitialCheck não tem cleanup
// Se página recarrega muito, múltiplos listeners podem estar ativos
```

---

## 🎯 MATRIZ DE PRIORIZAÇÃO

| # | Problema | Severidade | Esforço | P = S×E | Status |
|---|----------|-----------|--------|---------|--------|
| 1 | Race Condition Passes | CRÍTICA | Alto | 9 | 🔴 Fazer agora |
| 2 | SessionID Inútil | CRÍTICA | Baixo | 6 | 🔴 Fazer agora |
| 3 | No Error Handling | CRÍTICA | Médio | 8 | 🔴 Fazer agora |
| 4 | Persist Justifications | Alta | Médio | 6 | 🟠 Próximas 2h |
| 5 | URL Decode XSS | Alta | Baixo | 5 | 🟠 Próximas 2h |
| 6 | Case Sensitivity | Alta | Baixo | 4 | 🟠 Próximas 2h |
| 7 | Pass Expiration | Alta | Médio | 6 | 🟠 Próximas 2h |
| 8 | Storage Growth | Alta | Médio | 6 | 🟠 Próximas 2h |
| 9 | Step Validation | Média | Médio | 4 | 🟡 Backlog |
| 10 | Timer Handler | Média | Baixo | 3 | 🟡 Backlog |
| 11-16 | Secundárias | Baixa | Vários | <3 | 🟡 Backlog |

---

## ✅ CHECKLIST IMPLEMENTAÇÃO RECOMENDADA

### Fase 1: Crítica (4h)
- [ ] Implementar error handling com timeout (Problema 3)
- [ ] Remover USE_PASS automático do content-script (Problema 1)
- [ ] Remover ou implementar sessionId (Problema 2)
- [ ] Adicionar validação de URL (Problema 5)

### Fase 2: Alta (6h)
- [ ] Recarregar justifications em initializeState (Problema 4)
- [ ] Normalizar domain em background (Problema 6)
- [ ] Adicionar expiração de passes (Problema 7)
- [ ] Implementar cleanup de storage (Problema 8)

### Fase 3: Melhorias (8h)
- [ ] Adicionar validação de transições (Problema 9)
- [ ] Implementar timer handler completo (Problema 10)
- [ ] Remover console.logs ou adicionar debug flag
- [ ] Centralizar helpers de domínio
- [ ] Adicionar ícones

### Fase 4: Robustez (indefinido)
- [ ] Unit tests (Jest)
- [ ] Integração tests (Playwright)
- [ ] i18n (português, inglês, espanhol)
- [ ] Performance profiling

---

## 📚 PONTOS FORTES DO PROJETO

1. **Arquitetura bem separada:** Componentes claramente divididos (background, popup, block-page, content-script)
2. **TypeScript + Zustand:** Type safety e state management modern
3. **Vite + Tailwind:** Build chain otimizada e UI polida
4. **Documentação:** 11 documentos detalhados, excelente para onboarding
5. **Manifest V3:** Usar padrão moderno (não deprecated MV2)

---

## 🔒 RECOMENDAÇÕES FINAIS

1. **Imediato:** Corrigir os 3 problemas críticos (1, 2, 3)
2. **Este sprint:** Implementar handlers de erro robustos
3. **Antes do Web Store:** Adicionar ícones, validações, i18n
4. **Roadmap:** Tests, monitoring, analytics

**Esforço Total Estimado:** 20-25 horas para todas as correções
**Status de Produção:** ⚠️ **Não recomendado para Web Store ainda**

