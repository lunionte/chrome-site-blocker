# 🚀 Guia de Início Rápido

## ⚡ Setup em 5 Minutos

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Compilar o Projeto

```bash
npm run build
```

Isso vai:

-   Compilar TypeScript e React
-   Gerar CSS com Tailwind
-   Criar pasta `dist/` pronta para a extensão
-   Otimizar a estrutura de arquivos

### 3️⃣ Carregar no Chrome

1. Abra **`chrome://extensions/`** no navegador
2. Ative **"Modo do desenvolvedor"** (canto superior direito)
3. Clique em **"Carregar extensão sem empacotamento"**
4. Selecione a pasta **`dist/`** do projeto

✅ A extensão deve aparecer na lista!

### 4️⃣ Testar a Extensão

#### Abrir o Popup

-   Clique no ícone da extensão na barra de ferramentas

#### Adicionar um Domínio Bloqueado

1. Digite um domínio (ex: `youtube.com`)
2. Clique em "Adicionar"
3. O domínio aparece na lista

#### Testar o Bloqueio

1. Tente acessar o domínio adicionado
2. Você será redirecionado para a página de bloqueio
3. Complete o fluxo de justificativa

#### Configurar Timer

1. No popup, role até "Timer Global"
2. Defina a duração em minutos
3. Clique "Iniciar Timer"
4. O timer mostra o tempo restante

---

## 📝 Comandos Principais

| Comando              | O que faz                                  |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Inicia modo desenvolvimento com hot reload |
| `npm run build`      | Compila produção e otimiza para Chrome     |
| `npm run type-check` | Verifica erros de TypeScript               |
| `npm run optimize`   | Otimiza a estrutura de dist/ manualmente   |

---

## 🔄 Desenvolvimento com Hot Reload

```bash
npm run dev
```

Durante o desenvolvimento:

1. Edite os arquivos em `src/`
2. O Vite compila automaticamente
3. Recarregue a extensão em `chrome://extensions/`

Arquivos importantes para editar:

-   `src/popup/components/` - Interface do popup
-   `src/block-page/components/` - Página de bloqueio
-   `src/background/background.ts` - Lógica principal
-   `src/types/index.ts` - Tipos compartilhados

---

## 📂 Estrutura Rápida

```
src/
├── types/index.ts                 ← Tipos do TypeScript
├── background/background.ts       ← Service Worker
├── content-script/content-script.ts ← Interceptação
├── popup/                          ← Dashboard
│   ├── components/                 ← Componentes React
│   ├── store.ts                    ← Estado (Zustand)
│   └── popup.html                  ← HTML raiz
└── block-page/                     ← Página de bloqueio
    ├── components/                 ← Componentes React
    ├── store.ts                    ← Estado (Zustand)
    └── block-page.html             ← HTML raiz
```

---

## 🐛 Debug

### Ver Erros do Popup

```
Popup → Clique direito → Inspecionar
```

### Ver Erros do Background Script

```
chrome://extensions/ → Clique em "background.js" em "Detalhes"
```

### Ver Erros do Content Script

```
Qualquer página → F12 → Console
```

---

## ✅ Checklist de Funcionalidades

-   [ ] Popup abre e exibe domínios
-   [ ] Posso adicionar um domínio
-   [ ] Posso remover um domínio
-   [ ] Timer pode ser ativado/desativado
-   [ ] Ao acessar domínio bloqueado, vejo página de bloqueio
-   [ ] Posso preencher justificativa
-   [ ] Após enviar, sou redirecionado

---

## 🚨 Problemas Comuns

### "Extensão não carrega"

```bash
npm run build
# Depois recarregue em chrome://extensions/
```

### "Popup em branco"

1. F12 no popup → Console
2. Procure por erros vermelhos
3. Verifique `src/popup/index.tsx`

### "Sites não estão bloqueados"

1. Adicione o domínio no popup
2. Recarregue a aba que está tentando acessar
3. Verifique `chrome://extensions/` logs

### "Erro de tipagem TypeScript"

```bash
npm run type-check
# Mostra exatamente onde está o erro
```

---

## 📚 Próximos Passos

Após ter tudo funcionando:

1. **Adicionar Ícones** - Crie/salve em `dist/images/`
2. **Publicar Chrome Store** - Leia `README.md`
3. **Adicionar Features** - Veja `DEVELOPMENT.md`

---

**Pronto! Sua extensão Chrome está rodando! 🎉**

Para mais detalhes, consulte:

-   [`README.md`](README.md) - Documentação completa
-   [`DEVELOPMENT.md`](DEVELOPMENT.md) - Guia de desenvolvimento
