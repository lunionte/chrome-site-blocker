# 📱 Como Carregar a Extensão no Chrome

## 🎯 Passo a Passo (3 minutos)

### 1️⃣ Abrir Chrome Extensions

Abra seu navegador Chrome e digite na barra de endereços:

```
chrome://extensions/
```

Ou use o menu:

```
☰ Mais ferramentas → Extensões
```

### 2️⃣ Ativar Modo Desenvolvedor

No canto **superior direito** da página:

```
┌─────────────────────────────┐
│ [Modo do desenvolvedor]  ⚙️  │  ← Clique aqui
└─────────────────────────────┘
```

Você verá surgir novos botões.

### 3️⃣ Carregar Extensão

Procure o novo botão:

```
┌──────────────────────────────────┐
│ 📦 Carregar extensão sem         │
│    empacotamento                 │
└──────────────────────────────────┘
```

Clique nele.

### 4️⃣ Selecionar Pasta

Uma janela de seleção vai abrir.

**Navegue até:**

```
C:\Users\[SEU_USER]\Desktop\Projects\APIs\X-CHROME-EXTENSION\dist\
```

Ou diretamente:

```
X-CHROME-EXTENSION → dist → [SELECIONAR]
```

### 5️⃣ Sucesso! ✅

A extensão vai aparecer na lista com:

```
┌────────────────────────────────┐
│ 🚀 X-Chrome Site Blocker      │
│    v1.0.0                      │
│ ✓ Ativada                      │
└────────────────────────────────┘
```

---

## 🔍 Verificar se está Funcionando

### Procurar o Ícone

No **canto superior direito** do Chrome, você deve ver o ícone da extensão:

```
[🔍] [⭐] [📺] [▼] 🎨 ← Extensões aqui
```

Se não ver, clique no quebra-cabeça (🧩) e fixe a extensão.

### Clicar no Ícone

```
┌──────────────────────────────────┐
│  🎨 X-Chrome Site Blocker        │
├──────────────────────────────────┤
│  Adicionar Domínio               │
│  exemplo.com [Adicionar]         │
│                                  │
│  Domínios Bloqueados (0)         │
│  Nenhum domínio bloqueado        │
│                                  │
│  Timer Global                    │
│  Status: INATIVO                 │
│  Duração: 30 minutos [Iniciar]   │
│                                  │
│  v1.0.0                          │
└──────────────────────────────────┘
```

---

## 🧪 Teste Rápido

### Teste 1: Adicionar Domínio

1. Clique no ícone da extensão
2. Digite: `youtube.com`
3. Clique "Adicionar"
4. ✅ Deve aparecer na lista

### Teste 2: Bloquear Site

1. Abra uma nova aba
2. Tente acessar: `youtube.com`
3. ✅ Será redirecionado para página de bloqueio

### Teste 3: Justificativa

Na página de bloqueio:

```
┌─────────────────────────────────┐
│  ⚠️  Site Bloqueado             │
│  youtube.com                    │
│                                 │
│  [Desejo Prosseguir] [Voltar]   │
└─────────────────────────────────┘
```

Clique "Desejo Prosseguir" → Preencha justificativa → Envie

---

## 🔧 Debug & Troubleshooting

### Popup não abre?

```
1. Chrome extensions → X-Chrome Site Blocker
2. Verifique: popup.html existe?
3. F12 na extensão → Console → Há erros?
```

### Não bloqueia sites?

```
1. Adicione o domínio no popup
2. Recarregue a aba onde quer bloquear
3. F12 na aba → Console → Veja logs
```

### Erro na página de bloqueio?

```
1. chrome://extensions/
2. Clique em "background.js"
3. Veja console → Há erros?
```

---

## 📂 Arquivos Importantes

| Arquivo               | Local |
| --------------------- | ----- |
| **manifest.json**     | dist/ |
| **popup.html**        | dist/ |
| **popup.js**          | dist/ |
| **background.js**     | dist/ |
| **content-script.js** | dist/ |
| **block-page.html**   | dist/ |
| **block-page.js**     | dist/ |

Se algum desses **não existir** em `dist/`, rode:

```bash
npm run build
```

---

## ♻️ Atualizar Extensão

Depois de fazer alterações no código:

```bash
# Compile
npm run build

# Na página de extensões, clique em: 🔄 Recarregar
```

---

## 🚀 Próximos Passos

1. **Teste tudo** conforme guia acima
2. **Leia** `EXAMPLES.md` para mais casos
3. **Customize** conforme necessário
4. **Publique** lendo `DEPLOYMENT.md`

---

## 🎓 Dicas

-   **Atalho para Chrome Extensions:** `Ctrl+Shift+X`
-   **DevTools da Extensão:** Clique direito no popup → Inspecionar
-   **DevTools do Background:** chrome://extensions/ → Clique em "background.js"
-   **Storage Local:** F12 → Application → Storage

---

## ✅ Checklist

-   [ ] Extensão carrega sem erros
-   [ ] Ícone aparece na barra
-   [ ] Popup abre ao clicar
-   [ ] Posso adicionar domínios
-   [ ] Sites são bloqueados
-   [ ] Página de bloqueio funciona
-   [ ] Justificativa é aceita

---

**Sucesso! Sua extensão Chrome está pronta para usar! 🎉**

Para mais detalhes, consulte:

-   `README.md`
-   `QUICKSTART.md`
-   `EXAMPLES.md`

Desenvolvido com Manifest V3 ✨
