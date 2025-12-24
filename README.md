# X-Chrome Site Blocker

Uma extensão moderna do Chrome (Manifest V3) para bloqueio de sites com gerenciamento avançado de domínios, timer global de bloqueio e fluxo de justificativa em múltiplas etapas.

## 🎯 Características

-   ✅ **Manifest V3** - Arquitetura moderna e segura
-   ✅ **Service Worker** - Gerenciamento global de estado e persistência
-   ✅ **Dashboard/Popup** - Interface limpa para gerenciar domínios bloqueados
-   ✅ **Timer Global** - Configure um cronômetro para liberar bloqueios temporariamente
-   ✅ **Block Page** - Página de interceptação com fluxo de justificativa em 3 etapas
-   ✅ **React + TypeScript** - Tipagem estrita e componentes reutilizáveis
-   ✅ **Tailwind CSS** - Design minimalista e responsivo
-   ✅ **Vite** - Build otimizado para extensões Chrome

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

## 🚀 Como Começar

### Pré-requisitos

-   Node.js 16+ e npm/yarn instalados
-   Chrome/Brave/Edge (Manifest V3 compatível)

### Instalação

```bash
# Clone ou entre no diretório do projeto
cd X-CHROME-EXTENSION

# Instale as dependências
npm install

# Compile o projeto para produção
npm run build

# Ou para desenvolvimento com hot reload
npm run dev
```

### Carregar a Extensão no Chrome

1. Abra `chrome://extensions/`
2. Ative o **Modo do desenvolvedor** (canto superior direito)
3. Clique em **Carregar extensão sem empacotamento**
4. Selecione a pasta `dist/` do projeto

## 📋 Uso

### 1. Dashboard/Popup

Clique no ícone da extensão na barra de ferramentas:

-   **Adicionar Domínio**: Digite o domínio e clique "Adicionar"
-   **Gerenciar Domínios**: Visualize e remova domínios bloqueados
-   **Configurar Timer**: Defina uma duração e inicie o timer de bloqueio

### 2. Página de Bloqueio

Ao tentar acessar um domínio bloqueado, o usuário verá:

1. **Aviso Inicial** - Informação de que o domínio está bloqueado
2. **Formulário de Justificativa** - Campo para explicar o acesso (mín. 10 caracteres)
3. **Confirmação** - Revise os dados antes de enviar
4. **Sucesso** - Redirecionamento automático após 2 segundos

## 🏗️ Arquitetura

### Service Worker (Background Script)

Responsável por:

-   Manter estado global de domínios bloqueados
-   Gerenciar o timer de bloqueio
-   Processar mensagens do popup e content script
-   Persistir dados em `chrome.storage.local`

**Mensagens principais:**

-   `UPDATE_DOMAINS` - Adiciona/remove domínios
-   `UPDATE_TIMER` - Ativa/desativa timer
-   `IS_BLOCKED` - Verifica se URL está bloqueada
-   `GET_BLOCKING_STATE` - Obtém estado completo

### Content Script

-   Verifica se cada página carregada está bloqueada
-   Redireciona para a página de bloqueio se necessário
-   Evita redirecionamentos recursivos

### Popup (React)

Componentes:

-   `DomainForm` - Entrada de novos domínios
-   `DomainList` - Exibição de domínios com botões de remoção
-   `TimerControl` - Gerenciamento do timer
-   `ErrorAlert` - Mensagens de erro

### Block Page (React)

Fluxo em 4 etapas:

-   `WarningStep` - Aviso visual do bloqueio
-   `FormStep` - Formulário com validação
-   `ConfirmationStep` - Revisão de dados
-   `SubmittedStep` - Confirmação e redirecionamento

## 🔐 Segurança e Persistência

### Storage

Todos os dados são salvos em `chrome.storage.local`:

```typescript
{
  blockedDomains: BlockedDomain[],
  blockingTimer: BlockingTimer,
  justifications: BlockingJustification[]
}
```

### Validações

-   ✅ Validação de domínios com regex
-   ✅ Mínimo 10 caracteres em justificativas
-   ✅ Máximo 500 caracteres
-   ✅ Tratamento de erros em todas as operações

## 📊 Tipos TypeScript

```typescript
// Domínio bloqueado
interface BlockedDomain {
    id: string;
    domain: string;
    addedAt: number;
    reason?: string;
}

// Configuração de timer
interface BlockingTimer {
    enabled: boolean;
    startTime: number | null;
    duration: number; // em minutos
    justificationRequired: boolean;
}

// Justificativa enviada
interface BlockingJustification {
    timestamp: number;
    reason: string;
    domain: string;
    justified: boolean;
}
```

## 🎨 Design e UX

-   **Cor Primária**: Azul (#3b82f6)
-   **Cor de Perigo**: Vermelho (#ef4444)
-   **Layout Responsivo**: Adaptado para popup (w-96) e páginas
-   **Animações**: Transições suaves e bounce effects
-   **Acessibilidade**: Inputs com labels e ARIA attributes

## 🔧 Configurações

### Vite

Otimizado para extensões Chrome com:

-   Entry points separados (popup, background, block-page)
-   Rollup configurado para não chunkar
-   Alias `@/` para imports simplificados

### TypeScript

-   Strict mode ativado
-   No unused locals/parameters
-   Tipos Chrome inclusos

### Tailwind

-   Content scanning do `src/**/*.{js,jsx,ts,tsx,html}`
-   Temas customizados (primary, danger, animações)

## 📝 Comandos Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Type check
npm run type-check
```

## 🐛 Troubleshooting

### Extensão não carrega

1. Verifique se `npm run build` foi executado
2. Confirme que a pasta `dist/` existe
3. Recarregue a extensão em `chrome://extensions/`

### Domínios não são bloqueados

1. Verifique o console (F12) para erros
2. Confirme que o domínio está na lista (popup)
3. Recarregue as abas abertas

### Build falha

```bash
# Limpe dependências
rm -rf node_modules
npm install

# Rode novamente
npm run build
```

## 📄 Licença

MIT License - Sinta-se livre para usar em projetos pessoais ou comerciais.

## 👨‍💻 Desenvolvimento

Desenvolvido como exemplo de arquitetura moderna para extensões Chrome com React e TypeScript.

**Stack:**

-   React 18
-   TypeScript 5
-   Vite 5
-   Tailwind CSS 3
-   Zustand (State Management)
-   Manifest V3

---

**Versão:** 1.0.0  
**Última Atualização:** Dezembro 2025
