# 🏗️ Arquitetura da Extensão

## Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                    CHROME BROWSER                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────┐     │
│  │         SERVICE WORKER (Background)          │     │
│  │  ✓ Gerencia estado global                    │     │
│  │  ✓ Armazena domínios bloqueados              │     │
│  │  ✓ Mantém timer ativo                        │     │
│  │  ✓ Persiste em chrome.storage.local          │     │
│  └────────────────┬─────────────────────────────┘     │
│                   │                                    │
│         (Mensagens via chrome.runtime)                │
│                   │                                    │
│        ┌──────────┴──────────┐                        │
│        │                     │                        │
│  ┌─────▼──────┐      ┌──────▼──────┐                 │
│  │  POPUP     │      │  CONTENT    │                 │
│  │            │      │  SCRIPT     │                 │
│  │ • Form     │      │             │                 │
│  │ • List     │      │ • Verifica  │                 │
│  │ • Timer    │      │   bloqueio  │                 │
│  │            │      │ • Redireciona  │             │
│  └────────────┘      └─────────────┘                 │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │     BLOCK PAGE (Página de Bloqueio)          │   │
│  │  ✓ Warning (Etapa 1)                         │   │
│  │  ✓ Form (Etapa 2)                            │   │
│  │  ✓ Confirmation (Etapa 3)                    │   │
│  │  ✓ Success (Etapa 4)                         │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Fluxo de Bloqueio

```
┌─────────────────────┐
│  Usuário acessa     │
│   exemplo.com       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Content Script verificar       │
│  se está na lista de bloqueio   │
└──────────┬──────────────────────┘
           │
      ┌────┴────┐
      │          │
      ▼          ▼
  Bloqueado   Não Bloqueado
      │          │
      │          └──► Deixa acessar
      │
      ▼
┌─────────────────────────────────┐
│ Redireciona para Block Page     │
│ (block-page.html)               │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ ⚠️  WARNING STEP                 │
│  "Este site está bloqueado"     │
│  [Desejo Prosseguir] [Voltar]   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ 📝 FORM STEP                    │
│  Campo: Justificativa           │
│  "Por que você quer acessar?"   │
│  [Enviar] [Voltar]              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ ✓  CONFIRMATION STEP            │
│  Revise os dados                │
│  [Confirmar] [Editar]           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Service Worker recebe           │
│ justificativa                   │
│ Armazena em storage             │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ ✅ SUCCESS STEP                 │
│  "Justificativa enviada!"       │
│  Redirecionando em 2s...        │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Redireciona para exemplo.com    │
│ (URL original)                  │
└─────────────────────────────────┘
```

## Fluxo de Estado do Service Worker

```
┌──────────────────────────────────┐
│ Inicializar Service Worker       │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Carregar estado de storage       │
│ (blockedDomains, timer, etc)     │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Se timer estava ativo:           │
│ Reiniciar verificação periódica  │
│ (a cada 5s)                      │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Aguardando mensagens:            │
│                                  │
│ UPDATE_DOMAINS                   │
│  ├─ add: adiciona domínio        │
│  └─ remove: remove domínio       │
│                                  │
│ UPDATE_TIMER                     │
│  ├─ enabled: true/false          │
│  └─ duration: minutos            │
│                                  │
│ IS_BLOCKED                       │
│  └─ verifica se URL bloqueada    │
│                                  │
│ SUBMIT_JUSTIFICATION             │
│  └─ armazena justificativa       │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Sempre persiste em storage       │
│ após cada mudança                │
└──────────────────────────────────┘
```

## Estrutura de Mensagens

### UPDATE_DOMAINS

```typescript
// Enviado pelo: Popup
// Recebido por: Service Worker

{
  type: MessageType.UPDATE_DOMAINS,
  payload: {
    domain: "youtube.com",
    action: "add" | "remove"
  }
}

// Resposta:
{
  success: true
}
```

### UPDATE_TIMER

```typescript
// Enviado pelo: Popup
// Recebido por: Service Worker

{
  type: MessageType.UPDATE_TIMER,
  payload: {
    enabled: true,
    startTime: 1703487600000,
    duration: 30,  // minutos
    justificationRequired: true
  }
}

// Resposta:
{
  success: true
}
```

### IS_BLOCKED

```typescript
// Enviado pelo: Content Script
// Recebido por: Service Worker

{
  type: MessageType.IS_BLOCKED,
  payload: {
    url: "https://youtube.com/watch?v=123"
  }
}

// Resposta:
{
  isBlocked: true
}
```

### GET_BLOCKING_STATE

```typescript
// Enviado pelo: Popup
// Recebido por: Service Worker

{
  type: MessageType.GET_BLOCKING_STATE
}

// Resposta:
{
  domains: [
    { id: "youtube.com-1703487600000", domain: "youtube.com", addedAt: 1703487600000 }
  ],
  timer: {
    enabled: true,
    startTime: 1703487600000,
    duration: 30,
    justificationRequired: true
  }
}
```

### SUBMIT_JUSTIFICATION

```typescript
// Enviado pelo: Block Page
// Recebido por: Service Worker

{
  type: MessageType.SUBMIT_JUSTIFICATION,
  payload: {
    timestamp: 1703487600000,
    reason: "Preciso estudar sobre esse tópico",
    domain: "youtube.com",
    justified: true
  }
}

// Resposta:
{
  success: true
}
```

## Componentes React

### Popup (Dashboard)

```
PopupApp
├── DomainForm
│   ├── Input (domínio)
│   └── Button (Adicionar)
│
├── DomainList
│   ├── DomainItem (map)
│   │   ├── Domain text
│   │   ├── Data added
│   │   └── Button (Remover)
│   └── Empty state
│
├── TimerControl
│   ├── Status badge
│   ├── Duration input
│   └── Button (Iniciar/Parar)
│
└── ErrorAlert
    ├── Mensagem
    └── Button (Fechar)
```

### Block Page (4 Etapas)

```
BlockPageApp
│
├─ WarningStep
│  ├── Ícone de aviso
│  ├── Título
│  ├── Domínio bloqueado
│  ├── Info box
│  └── Botões [Prosseguir] [Voltar]
│
├─ FormStep
│  ├── Título
│  ├── Domínio (display)
│  ├── TextArea (justificativa)
│  ├── Counter (caracteres)
│  └── Botões [Enviar] [Voltar]
│
├─ ConfirmationStep
│  ├── Título
│  ├── Resumo (domínio + justificativa)
│  ├── Termos de concordância
│  └── Botões [Confirmar] [Editar]
│
└─ SubmittedStep
   ├── Ícone de sucesso
   ├── Mensagem
   ├── Contador de redirecionamento
   └── Info box
```

## Estado (Zustand)

### PopupStore

```typescript
{
  // State
  domains: BlockedDomain[],
  timer: BlockingTimer,
  loading: boolean,
  error: string | null,

  // Actions
  loadState: () => Promise<void>,
  addDomain: (domain: string) => Promise<void>,
  removeDomain: (domain: string) => Promise<void>,
  updateTimer: (timer: BlockingTimer) => Promise<void>,
  clearError: () => void
}
```

### BlockPageStore

```typescript
{
  // State
  step: 'warning' | 'form' | 'confirmation' | 'submitted',
  domain: string,
  targetUrl: string,
  reason: string,
  loading: boolean,
  error: string | null,

  // Actions
  setStep: (step) => void,
  setReason: (reason) => void,
  submitJustification: () => Promise<void>,
  goBack: () => void,
  clearError: () => void
}
```

## Storage (chrome.storage.local)

```typescript
{
  blockingState: {
    blockedDomains: [
      {
        id: "youtube.com-1703487600000",
        domain: "youtube.com",
        addedAt: 1703487600000,
        reason?: "Social media"
      }
    ],
    blockingTimer: {
      enabled: true,
      startTime: 1703487600000,
      duration: 30,
      justificationRequired: true
    },
    justifications: [
      {
        timestamp: 1703487600000,
        reason: "Preciso estudar",
        domain: "youtube.com",
        justified: true
      }
    ]
  }
}
```

## Fluxo de Persistência

```
Usuário Interage (Popup/Block Page)
        │
        ▼
Componente React atualiza
        │
        ▼
Zustand Store atualiza
        │
        ▼
Envia mensagem para Service Worker
        │
        ▼
Service Worker atualiza estado em memória
        │
        ▼
Persiste em chrome.storage.local
        │
        ▼
Próximo carregamento lê do storage
```

---

**Diagrama criado em dezembro de 2025**
