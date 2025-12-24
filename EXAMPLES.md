# Exemplos de Uso e Testes

## 📌 Exemplo 1: Adicionar Domínio via Popup

### Resultado Esperado

1. Usuário abre o popup
2. Digita `github.com`
3. Clica "Adicionar"
4. O domínio aparece na lista

### O que acontece nos bastidores

```typescript
// 1. Popup (React Component)
const handleAddDomain = async (domain: string) => {
    // Valida domínio
    if (!isValidDomain("github.com")) return;

    // 2. Envia mensagem ao Service Worker
    chrome.runtime.sendMessage({
        type: MessageType.UPDATE_DOMAINS,
        payload: { domain: "github.com", action: "add" },
    });
};

// 3. Service Worker recebe
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === MessageType.UPDATE_DOMAINS) {
        const { domain, action } = message.payload;

        // Adiciona ao mapa em memória
        state.blockedDomains.set("github.com", {
            id: "github.com-1703487600000",
            domain: "github.com",
            addedAt: Date.now(),
        });

        // 4. Persiste em storage
        await persistState(); // Salva em chrome.storage.local
    }
});

// 5. Popup recarrega estado
const { domains } = await sendMessage({
    type: MessageType.GET_BLOCKING_STATE,
});
// domains agora inclui github.com
```

---

## 📌 Exemplo 2: Acessar um Site Bloqueado

### Cenário

1. Usuário tenta acessar `github.com`
2. Content Script verifica
3. É bloqueado
4. Redireciona para Block Page

### O que acontece

```typescript
// 1. Content Script rodando em github.com
async function performInitialCheck() {
  // Extrai domínio
  const domain = 'github.com';

  // 2. Verifica se está bloqueado
  const response = await sendMessage({
    type: MessageType.IS_BLOCKED,
    payload: { url: 'https://github.com/...' }
  });

  if (response.isBlocked) {
    // 3. Redireciona
    window.location.href =
      'block-page.html?target=' +
      encodeURIComponent('https://github.com/...') +
      '&domain=' + encodeURIComponent('github.com');
  }
}

// 4. Service Worker valida
case MessageType.IS_BLOCKED: {
  const domain = extractDomain(url); // 'github.com'

  // Verifica se está no mapa
  const isBlocked = state.blockedDomains.has('github.com');

  sendResponse({ isBlocked: true });
}

// 5. Block Page carrega com parâmetros
// ?target=https://github.com/...&domain=github.com
```

---

## 📌 Exemplo 3: Fluxo Completo de Justificativa

### Etapa 1: Warning

```typescript
// Block Page monta
const [step, setStep] = useState("warning");

// Usuário vê:
// ⚠️ Site Bloqueado
// Você está tentando acessar: github.com
// [Desejo Prosseguir] [Voltar]

// Ao clicar "Desejo Prosseguir":
setStep("form");
```

### Etapa 2: Form

```typescript
const [reason, setReason] = useState("");

// Usuário vê form com validações
// - Mínimo 10 caracteres
// - Máximo 500 caracteres
// - Campo obrigatório

// Preenche: "Preciso estudar sobre padrões de design"
// Clica "Enviar Justificativa"

// Validações
if (reason.trim().length < 10) {
    setError("Mínimo 10 caracteres");
    return;
}

// Vai para próxima etapa
setStep("confirmation");
```

### Etapa 3: Confirmation

```typescript
// Mostra resumo:
// Domínio: github.com
// Justificativa: "Preciso estudar sobre..."
//
// ✓ Ao prosseguir, você concorda:
//   • Que esta justificativa é verdadeira
//   • Que abusos resultam em bloqueios adicionais
//   • Que seus dados serão registrados

// Usuário clica "Confirmar e Enviar"

// Valida novamente
if (!reason.trim()) {
    setError("Justificativa vazia");
    return;
}

// Envia para Service Worker
await sendMessage({
    type: MessageType.SUBMIT_JUSTIFICATION,
    payload: {
        timestamp: Date.now(),
        reason: "Preciso estudar sobre...",
        domain: "github.com",
        justified: true,
    },
});
```

### Etapa 4: Submitted

```typescript
// Service Worker recebe e armazena
case MessageType.SUBMIT_JUSTIFICATION: {
  const justification = message.payload;

  // Poderia enviar para servidor aqui
  console.log('Justificativa:', justification);

  sendResponse({ success: true });
}

// Block Page mostra sucesso
// ✅ Justificativa Enviada!
// Redirecionando em 5 segundos...
// (contador regressivo)

// Redireciona
setTimeout(() => {
  window.location.href = targetUrl; // github.com
}, 2000);
```

---

## 📌 Exemplo 4: Timer Global

### Ativar Timer (30 minutos)

```typescript
// Usuário no Popup
const handleStartTimer = async () => {
  const newTimer = {
    enabled: true,
    startTime: Date.now(),  // Agora
    duration: 30,           // 30 minutos
    justificationRequired: true
  };

  // Envia para Service Worker
  await sendMessage({
    type: MessageType.UPDATE_TIMER,
    payload: newTimer
  });
};

// Service Worker recebe
case MessageType.UPDATE_TIMER: {
  state.blockingTimer = timerData;

  // Inicia verificação periódica
  startTimerCheck(); // verifica a cada 5s

  await persistState();
}

// A cada 5 segundos
setInterval(() => {
  const elapsed = Date.now() - startTime;
  const durationMs = 30 * 60 * 1000; // 30 min em ms

  if (elapsed >= durationMs) {
    // Timer expirou!
    state.blockingTimer.enabled = false;

    // Notifica todas as abas abertas
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'TIMER_EXPIRED'
        });
      });
    });
  }
}, 5000);
```

### Popup mostra Timer Ativo

```typescript
// Componente TimerControl
const [remainingTime, setRemainingTime] = useState(0);

useEffect(() => {
    if (timer.enabled && timer.startTime) {
        const updateRemaining = () => {
            const elapsed = Date.now() - timer.startTime;
            const durationMs = timer.duration * 60 * 1000;
            const remaining = Math.max(0, durationMs - elapsed);

            setRemainingTime(Math.ceil(remaining / 1000));
        };

        updateRemaining();
        const interval = setInterval(updateRemaining, 1000);

        return () => clearInterval(interval);
    }
}, [timer]);

// Mostra: "29m 45s" → "29m 44s" → ...
// Quando chegar a 0, vai para "Parado"
```

---

## 🧪 Teste Manual Completo

### Checklist

-   [ ] **Instalar**

    ```bash
    npm install
    npm run build
    ```

-   [ ] **Carregar extensão**

    -   chrome://extensions/ → Carregar sem empacotar → dist/

-   [ ] **Adicionar domínio**

    -   Popup → "youtube.com" → Adicionar
    -   ✓ Deve aparecer na lista

-   [ ] **Testar bloqueio**

    -   youtube.com → Vê página de bloqueio
    -   Formulário aparece
    -   Preenche justificativa
    -   Envia com sucesso

-   [ ] **Testar timer**

    -   Popup → Timer → 1 minuto
    -   Clica "Iniciar"
    -   Timer conta regressivamente
    -   Após 1 min, volta a "Parado"

-   [ ] **Remover domínio**

    -   Popup → youtube.com → Remover
    -   Recarrega página
    -   youtube.com abre normalmente

-   [ ] **Debug**
    -   F12 em qualquer aba
    -   Popup → Inspecionar
    -   chrome://extensions/ → background.js
    -   Sem erros vermelhos

---

## 💾 Dados Persistidos

Você pode ver os dados salvos:

1. **Chrome DevTools**

    - F12 → Application → Storage → Chrome Storage local
    - Procure por `blockingState`

2. **Estrutura**
    ```json
    {
        "blockingState": {
            "blockedDomains": [
                {
                    "id": "youtube.com-1703487600000",
                    "domain": "youtube.com",
                    "addedAt": 1703487600000
                }
            ],
            "blockingTimer": {
                "enabled": false,
                "startTime": null,
                "duration": 30,
                "justificationRequired": true
            },
            "justifications": [
                {
                    "timestamp": 1703487600000,
                    "reason": "Preciso estudar",
                    "domain": "youtube.com",
                    "justified": true
                }
            ]
        }
    }
    ```

---

## 🔍 Verificar Console Logs

### Service Worker

```
[Service Worker] Estado inicializado: { ... }
[Service Worker] Domínio bloqueado: youtube.com
[Service Worker] Timer iniciado por 30 minutos
[Service Worker] Justificativa recebida: { ... }
```

### Content Script

```
[Content Script] Carregado em: https://youtube.com/...
[Content Script] Redirecionando para block page
[Content Script] Timer expirado
```

### Popup

```
[PopupStore] Estado carregado com sucesso
[PopupStore] Domínio adicionado
[PopupStore] Erro ao remover domínio
```

---

**Exemplos finalizados! Teste cada cenário e documente descobertas. 🎯**
