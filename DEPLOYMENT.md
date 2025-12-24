# 🚀 Guia de Deploy - Chrome Web Store

## Pré-requisitos para Publicar

### 1. Conta de Desenvolvedor Chrome

-   Ir para [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole)
-   Fazer login com Google
-   Pagar taxa de desenvolvedor (~$5 USD)

### 2. Preparar Arquivos

#### Ícones (Obrigatório)

```
Criar 3 versões do ícone:
- icon-16.png   (16x16 px)  - Barra de ferramentas
- icon-48.png   (48x48 px)  - Página de detalhes
- icon-128.png  (128x128 px) - Chrome Web Store

Colocar em:
dist/images/
├── icon-16.png
├── icon-48.png
└── icon-128.png
```

#### Descrição do Projeto

**Nome:** X-Chrome Site Blocker

```
Uma extensão moderna e poderosa para bloquear sites
de forma inteligente com controle de tempo e fluxo
de justificativa.
```

**Descrição Longa:**

```
X-Chrome Site Blocker é uma extensão do Chrome de
próxima geração construída com Manifest V3, React e
TypeScript.

✨ Principais Funcionalidades:
- Bloquear/desbloquear domínios facilmente
- Timer global de bloqueio ajustável
- Fluxo de justificativa em múltiplas etapas
- Interface limpa e profissional
- Armazenamento seguro de dados

🔒 Privacidade:
Todos os dados são armazenados localmente. Nenhuma
informação é enviada para servidores externos.

🎯 Perfeito para:
- Estudantes querendo gerenciar distrações
- Profissionais focados em produtividade
- Qualquer pessoa controlando o tempo online
```

---

## Processo de Upload (8 passos)

### Step 1: Preparar Arquivo ZIP

```bash
# No diretório raiz do projeto
cd dist/

# Criar ZIP com todo o conteúdo
# Estrutura esperada dentro do ZIP:
# manifest.json
# popup.html
# popup.js
# block-page.html
# block-page.js
# background.js
# content-script.js
# globals.js
# globals.css
# images/
#   ├── icon-16.png
#   ├── icon-48.png
#   └── icon-128.png
```

### Step 2: Acessar Developer Console

1. Ir para: https://chrome.google.com/webstore/devconsole
2. Fazer login (Google Account)
3. Clicar em "Novo Item"

### Step 3: Configurações Básicas

**Informações Gerais:**

-   Idioma: Português (Brasil)
-   Tipo: Extensão
-   Categoria: Produtividade

**Detalhes:**
| Campo | Valor |
|-------|-------|
| Nome | X-Chrome Site Blocker |
| Descrição | Extensão para bloquear sites com timer... |
| Idiomas | Português (Brasil), Inglês |
| Desenvolvedor | Seu Nome |
| Email | seu@email.com |

### Step 4: Upload do Arquivo

1. Seção "Pacote"
2. Clique "Fazer upload do arquivo"
3. Selecione o `.zip` criado
4. Aguarde validação (~2 minutos)

### Step 5: Ícones

**Ícone Pequeno** (128x128)

-   Usado no Chrome Web Store
-   Não pode ter transparência em cantos
-   PNG obrigatório

**Screenshot** (1280x800 mínimo)

-   Print da interface do popup
-   Mostrando funcionalidades

**Imagem de Destaque** (1400x560)

-   Imagem promocional
-   Pode ser banner ou screenshot grande

### Step 6: Conteúdo do Tipo

**Descrição Breve:**

```
Bloqueie sites com um timer inteligente
```

**Descrição Completa:**

```
Veja PROJECT_SUMMARY.md para conteúdo completo
```

**URL da Página Inicial:**

```
https://github.com/seu-usuario/X-CHROME-EXTENSION
```

**URL da Política de Privacidade:**

```
Indique onde está hospedada, ou:
"Todos os dados são armazenados localmente"
```

### Step 7: Permissões & Segurança

**Permissões da Extensão:**

```
✓ Armazenamento (chrome.storage)
✓ Abas (chrome.tabs)
✓ Bloqueio de rede (declarativeNetRequest)
✓ Todos os sites (host permissions)
```

**Confirmação:**

```
☑ Esta extensão não coleta dados pessoais
☑ Esta extensão respeita a privacidade do usuário
☑ Manifest V3 (segurança moderna)
```

### Step 8: Revisar & Publicar

1. **Revisar:**

    - Todos os campos preenchidos ✓
    - Ícones carregados ✓
    - Descrições corretas ✓
    - Screenshots únicos ✓

2. **Análise Google:**

    - Aguarde 3-7 dias úteis
    - Google revisa código, permissões, privacidade
    - Pode pedir ajustes

3. **Publicação:**
    - Se aprovado, clique "Publicar"
    - Extensão fica disponível em horas

---

## Template de Descrição Chrome Web Store

```
TÍTULO
X-Chrome Site Blocker - Timer Inteligente de Bloqueio

BREVE DESCRIÇÃO
Bloqueie sites com um timer inteligente e controle completo.
Construído com Manifest V3 para máxima segurança.

DESCRIÇÃO COMPLETA
X-Chrome Site Blocker é uma extensão moderna e poderosa
que ajuda você a gerenciar sua produtividade bloqueando
sites de forma inteligente.

✨ PRINCIPAIS FUNCIONALIDADES:

🔒 Bloqueio Inteligente
- Adicione/remova domínios facilmente
- Bloqueio imediato e automático
- Gerenciamento visual de todos os sites

⏱️ Timer Global
- Ative um timer de bloqueio para um período específico
- Tempo ajustável (1-1440 minutos)
- Contador regressivo em tempo real

📝 Fluxo de Justificativa
- Aviso inicial informativo
- Formulário de justificativa (10-500 caracteres)
- Confirmação de dados antes de enviar
- Redirecionamento automático

🔐 Segurança & Privacidade
- Manifest V3 (padrão de segurança moderno)
- Todos os dados armazenados localmente
- Sem coleta de dados pessoais
- Sem conexões externas

💻 Interface Profissional
- Design minimalista e limpo
- Construído com React e TypeScript
- Totalmente responsivo
- Transições suaves

🎯 CASOS DE USO:
- Estudantes controlando distrações de redes sociais
- Profissionais melhorando foco em tarefas
- Famílias gerenciando tempo de tela
- Qualquer pessoa que quer mais controle

⚠️ IMPORTANTE:
Esta extensão é uma ferramenta de bloqueio
responsável. Use-a com respeito e ética.
Abusos podem resultar em desinstalação
ou revisão das políticas.

🚀 FICOU FÁCIL:
1. Instale a extensão
2. Clique no ícone para abrir
3. Adicione domínios para bloquear
4. Configure seu timer
5. Deixe a extensão fazer o trabalho

PRIVACIDADE:
Todos os seus dados (domínios, histórico de
justificativas) são mantidos 100% localmente.
Nada é enviado para nossos servidores.

SUPORTE:
Encontrou um bug? Tem uma sugestão?
Abra uma issue no repositório GitHub:
https://github.com/seu-usuario/X-CHROME-EXTENSION

Versão: 1.0.0
Desenvolvedor: Seu Nome
Atualizado: Dezembro 2025
```

---

## Versões e Atualizações Futuras

### v1.1.0 (Plano)

-   [ ] Backup/Restore de configurações
-   [ ] Atalhos de teclado
-   [ ] Modo escuro/claro automático
-   [ ] Estatísticas de uso

### v2.0.0 (Futuro)

-   [ ] Sincronização na nuvem (opcional)
-   [ ] Temporizador por domínio individual
-   [ ] Relatórios de uso
-   [ ] Integração com calendários

---

## Troubleshooting de Upload

| Problema                          | Solução                                        |
| --------------------------------- | ---------------------------------------------- |
| "Arquivo inválido"                | Verificar estrutura do ZIP, nomes de arquivo   |
| "Ícone rejeitado"                 | 128x128 mínimo, PNG, sem transparência total   |
| "Descrição muito curta"           | Mínimo 16 caracteres obrigatório               |
| "Permissões suspeitas"            | Explicar cada permissão na descrição           |
| "Código potencialmente malicioso" | Abrir issue no GitHub sobre análise automática |

---

## Links Úteis

-   [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
-   [Guia Oficial de Publicação](https://developer.chrome.com/docs/webstore/publish/)
-   [Políticas de Extensões](https://developer.chrome.com/docs/extensions/mv3/intro/)
-   [Requickments de Ícones](https://developer.chrome.com/docs/webstore/images/)

---

## Checklist Final

Antes de publicar:

-   [ ] `dist/` contém todos os arquivos
-   [ ] `manifest.json` válido
-   [ ] Ícones 16, 48, 128 existem
-   [ ] Código testado em múltiplos sites
-   [ ] Nenhum erro no DevTools
-   [ ] TypeScript type-check passa
-   [ ] Documentação atualizada
-   [ ] GitHub repositório criado
-   [ ] License (MIT) adicionada
-   [ ] README.md completo

---

**Parabéns! Sua extensão está pronta para publicação! 🎉**

---

**Última atualização:** Dezembro 2025
