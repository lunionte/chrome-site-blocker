# Guia de Desenvolvimento

## Ambiente de Desenvolvimento

### Setup Inicial

```bash
node --version  # v16.0.0+
npm --version   # v8.0.0+
```

### Hot Reload durante desenvolvimento

```bash
npm run dev
```

Isso inicia o Vite em modo watch. As mudanças são compiladas automaticamente. Recarregue a extensão em `chrome://extensions/`.

## Fluxo de Desenvolvimento

### 1. Fazer Alterações

Edite arquivos em `src/`. Exemplos:

```typescript
// Adicionar novo tipo
// src/types/index.ts
export interface NewType {
    // ...
}

// Usar em componente
// src/popup/components/MyComponent.tsx
import { NewType } from "@/types/index";
```

### 2. Compilar

```bash
npm run build
```

Gera a pasta `dist/` com toda a extensão pronta.

### 3. Testar no Chrome

1. `chrome://extensions/`
2. Clique em "Recarregar" ou remova e re-adicione

### 4. Debug

Abra o DevTools:

-   **Popup**: Clique direito no popup → Inspecionar
-   **Background**: Em `chrome://extensions/` → Clique em "background.js" em detalhes da extensão
-   **Content Script**: Normal F12 em qualquer aba

## Estrutura de Arquivos Detalhada

### `/src/types`

Define interfaces e enums compartilhados entre contextos:

```typescript
// MessageType enum para type-safety em mensagens
enum MessageType {
    UPDATE_DOMAINS = "UPDATE_DOMAINS",
    // ...
}

// Interfaces tipadas
interface BlockedDomain {
    id: string;
    domain: string;
    addedAt: number;
}
```

### `/src/background`

Service Worker que roda continuamente:

```typescript
// Escuta mensagens
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Processa mensagens com type-safety
    switch (message.type) {
        case MessageType.UPDATE_DOMAINS:
        // lógica
    }
});

// Persiste em storage
await chrome.storage.local.set({ blockingState: data });
```

### `/src/content-script`

Executado em todas as abas:

```typescript
// Verifica se página atual está bloqueada
async function checkIfBlocked(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { type: MessageType.IS_BLOCKED, payload: { url: ... } },
      (response) => resolve(response?.isBlocked)
    );
  });
}
```

### `/src/popup`

Interface para gerenciamento:

```
popup/
├── index.tsx           # Render point
├── popup.html          # HTML root
├── store.ts            # Zustand state management
└── components/
    ├── App.tsx         # Layout principal
    ├── DomainForm.tsx  # CRUD input
    ├── DomainList.tsx  # Listagem
    ├── TimerControl.tsx # Timer
    └── ErrorAlert.tsx  # Erros
```

#### Zustand Store Pattern

```typescript
const usePopupStore = create<PopupStore>((set, get) => ({
  // State
  domains: [],

  // Actions
  addDomain: async (domain: string) => {
    // Validação
    if (!isValidDomain(domain)) {
      set({ error: 'Inválido' });
      return;
    }

    // Enviar mensagem ao background
    await sendMessage({ type: MessageType.UPDATE_DOMAINS, ... });

    // Atualizar estado
    set({ domains: [...] });
  },
}));
```

### `/src/block-page`

Página de interceptação com Zustand:

```
block-page/
├── index.tsx           # Render point
├── block-page.html     # HTML root
├── store.ts            # State management
└── components/
    ├── App.tsx         # Coordenador de etapas
    ├── WarningStep.tsx    # Step 1
    ├── FormStep.tsx       # Step 2
    ├── ConfirmationStep.tsx # Step 3
    └── SubmittedStep.tsx  # Step 4
```

#### Fluxo de Estados

```
warning → form → confirmation → submitted
   ↑                               ↓
   +───────────── goBack ──────────+
```

## Padrões de Código

### Tipagem Estrita

```typescript
// ✅ Bom
interface Props {
    domain: string;
    onSubmit: (domain: string) => Promise<void>;
    loading?: boolean; // opcional com padrão
}

const Component: React.FC<Props> = ({ domain, onSubmit, loading = false }) => {
    // ...
};

// ❌ Ruim
function Component(props) {
    // sem tipos
}
```

### Mensagens Tipadas

```typescript
// ✅ Bom
const response = await sendMessage({
  type: MessageType.UPDATE_DOMAINS,
  payload: { domain, action: 'add' }
} as ChromeMessage);

// ❌ Ruim
chrome.runtime.sendMessage({ type: 'UPDATE_DOMAINS', ... });
```

### Validação

```typescript
// ✅ Validar input
function isValidDomain(domain: string): boolean {
    const regex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9]...$/i;
    return regex.test(domain);
}

// ✅ Tratamento de erro
try {
    await operation();
} catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    set({ error: message });
}
```

## Adicionando Novas Features

### 1. Adicionar novo tipo de mensagem

```typescript
// src/types/index.ts
enum MessageType {
    // ... existing
    MY_NEW_MESSAGE = "MY_NEW_MESSAGE",
}

interface MyNewPayload {
    // tipos do payload
}
```

### 2. Implementar no Service Worker

```typescript
// src/background/background.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case MessageType.MY_NEW_MESSAGE: {
      const { ... } = message.payload as MyNewPayload;
      // lógica
      sendResponse({ success: true });
      break;
    }
  }
});
```

### 3. Consumir do Popup/Content

```typescript
// Enviar mensagem
await new Promise((resolve) => {
  chrome.runtime.sendMessage(
    { type: MessageType.MY_NEW_MESSAGE, payload: { ... } },
    resolve
  );
});
```

## Debugging

### Service Worker Console

```
chrome://extensions/ → Clique em "background.js" em detalhes da extensão
```

### Logs Estruturados

```typescript
// ✅ Bom
console.log("[Service Worker] Domínio bloqueado:", domain);
console.error("[Content Script] Erro ao verificar:", error);

// ❌ Ruim
console.log("Erro");
```

### DevTools no Chrome

-   **Network**: Verifique requisições bloqueadas
-   **Storage**: Veja dados em `chrome.storage.local`
-   **Sources**: Debug com breakpoints

## Testing (Exemplo)

### Testar validação de domínio

```typescript
// Abra DevTools no popup
const { usePopupStore } = await import("popup/store");

// Teste adição
await usePopupStore.getState().addDomain("google.com");
await usePopupStore.getState().addDomain("invalid domain"); // erro
```

## Build e Deploy

### Verificar Errors

```bash
npm run type-check
```

### Build Production

```bash
npm run build
```

Gera `dist/` otimizado.

### Publicar Chrome Web Store

1. Empacotar: `dist/` → `.zip`
2. Ir para [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Upload do `.zip`

## Troubleshooting Comum

| Problema                       | Solução                              |
| ------------------------------ | ------------------------------------ |
| "Manifest.json não encontrado" | Verificar `src/manifest.json`        |
| Popup não atualiza             | Recarregar em `chrome://extensions/` |
| Content script não funciona    | Verificar `matches` em manifest      |
| Storage não persiste           | Usar `await` e verificar permissões  |
| TypeScript errors              | Rodar `npm run type-check`           |

## Recursos Úteis

-   [Manifest V3 Docs](https://developer.chrome.com/docs/extensions/mv3/)
-   [Chrome API Reference](https://developer.chrome.com/docs/extensions/reference/)
-   [React Best Practices](https://react.dev/)
-   [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Última Atualização:** Dezembro 2025
