# X-Chrome Site Blocker 🚫

Uma extensão Chrome moderna (Manifest V3) para bloqueio de sites com gerenciamento de domínios, timer global e fluxo de justificativa inteligente.

## ✨ Características

-   ✅ **Manifest V3** - Padrão moderno e seguro
-   ✅ **Service Worker** - Gerenciamento global de estado
-   ✅ **Dashboard** - Interface para gerenciar bloqueios
-   ✅ **Block Page** - 4 etapas de UX intuitiva
-   ✅ **Sistema de Passes** - Máximo 3 acessos por justificativa
-   ✅ **React + TypeScript** - Tipagem estrita
-   ✅ **Tailwind CSS** - Design moderno
-   ✅ **Vite** - Build otimizado

## 📁 Estrutura do Projeto

```
X-CHROME-EXTENSION/
├── src/
│   ├── types/
│   │   └── index.ts                 # Tipos compartilhados (TypeScript)
│   ├── styles/
│   │   └── globals.css              # Estilos globais com Tailwind
│   ├── background/
│   │   └── background.ts            # Service Worker (Main Logic)
│   ├── content-script/
│   │   └── content-script.ts        # Script de conteúdo (interceptação)
│   ├── popup/
│   │   ├── store.ts                 # Zustand Store
│   │   ├── index.tsx                # Entry point
│   │   ├── popup.html               # HTML do popup
│   │   └── components/
│   │       ├── App.tsx              # Componente principal
│   │       ├── DomainForm.tsx       # Formulário de domínio
│   │       ├── DomainList.tsx       # Lista de domínios
│   │       ├── TimerControl.tsx     # Controle de timer
│   │       └── ErrorAlert.tsx       # Alerta de erro
│   ├── block-page/
│   │   ├── store.ts                 # Zustand Store
│   │   ├── index.tsx                # Entry point
│   │   ├── block-page.html          # HTML da página de bloqueio
│   │   └── components/
│   │       ├── App.tsx              # Componente principal
│   │       ├── WarningStep.tsx      # Etapa 1: Aviso
│   │       ├── FormStep.tsx         # Etapa 2: Formulário
│   │       ├── ConfirmationStep.tsx # Etapa 3: Confirmação
│   │       └── SubmittedStep.tsx    # Etapa 4: Sucesso
│   └── manifest.json                # Manifest V3
├── vite.config.ts                   # Configuração Vite
├── tsconfig.json                    # Configuração TypeScript
├── tailwind.config.js               # Configuração Tailwind
├── postcss.config.js                # Configuração PostCSS
├── package.json                     # Dependências
└── dist/                            # Build output (gerado)
```

## 🚀 Instalação Rápida

### Pré-requisitos

-   Node.js 16+
-   Chrome/Brave/Edge

### Setup

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Ou modo desenvolvimento
npm run dev
```

### Carregar no Chrome

1. Abra `chrome://extensions/`
2. Ative **Modo do desenvolvedor** (canto superior)
3. Clique **Carregar extensão sem empacotamento**
4. Selecione pasta `dist/`

## � Como Usar

### Adicionar Sites Bloqueados

1. Clique no ícone da extensão
2. Digite o domínio (ex: `youtube.com`)
3. Clique "Adicionar"

### Acessar Site Bloqueado

1. Tente acessar o site
2. Veja a página de bloqueio com 4 etapas:
    - ⚠️ **Aviso** - Confirme que quer prosseguir
    - 📝 **Justificativa** - Digite motivo (10-500 caracteres)
    - ✅ **Confirmação** - Revise os dados
    - 🎉 **Sucesso** - Redirecionamento automático

### Sistema de Passes

-   Cada justificativa = **3 acessos permitidos**
-   Após fechar a guia, passes são consumidos
-   Novo acesso = novo bloqueio

## 🏗️ Arquitetura

```
Service Worker
    ↓
   State (Map de domínios + justificações)
    ↓
Content Script ← Chrome Messages ← Popup/Block Page
```

### Componentes Principais

**Service Worker** (`background.ts`)

-   Gerencia estado global
-   Persiste em `chrome.storage.local`
-   Processa mensagens (ADD, REMOVE, CHECK_BLOCKED, etc)
-   Gerencia passes e justificativas

**Content Script** (`content-script.ts`)

-   Verifica cada página carregada
-   Redireciona se bloqueado
-   Consome passes automaticamente

**Popup Dashboard** (`popup/`)

-   React com Zustand
-   Add/remove domínios
-   Gerencia timer
-   Feedback visual

**Block Page** (`block-page/`)

-   4 componentes para fluxo
-   Integração com Service Worker
-   Salva justificativas

## 📁 Estrutura

```
src/
├── types/index.ts           # TypeScript interfaces
├── background/background.ts # Service Worker
├── content-script/          # Interceptação
├── popup/                   # Dashboard React
│   ├── store.ts
│   └── components/
├── block-page/              # Página de bloqueio
│   ├── store.ts
│   └── components/
└── manifest.json
```

## 🔒 Segurança

-   Validação de domínios com regex
-   Min 10 / Max 500 caracteres em justificativas
-   Tratamento de erros em todas operações
-   Sem armazenamento de senhas/dados sensíveis
-   Storage local apenas (não sincroniza)

## 🛠️ Desenvolvimento

### Comandos

```bash
npm run dev         # Desenvolvimento com hot reload
npm run build       # Build produção
npm run type-check  # Validar TypeScript
npm run preview     # Preview da build
```

### Stack

-   **React 18.2** - UI
-   **TypeScript 5.2** - Tipagem
-   **Zustand 4.4** - State
-   **Vite 5.0** - Build
-   **Tailwind 3.3** - CSS
-   **Manifest V3** - Chrome API

## ⚠️ Problemas Conhecidos

Veja [ANALISE_TECNICA.md](ANALISE_TECNICA.md) para:

-   3 problemas críticos identificados
-   5 de alta prioridade
-   Recomendações de correção

**Status:** Não recomendado para Chrome Web Store até correções
