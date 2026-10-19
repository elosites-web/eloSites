# ēloSites

Site institucional da **ēloSites**, estúdio de landing pages e sites institucionais para pequenos negócios e profissionais autônomos.

Produção: https://elosites.ia.br (hospedado na Netlify; o endereço com `www` redireciona para o principal).

## Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4 (plugin `@tailwindcss/vite`)
- `motion` (animações) e `embla-carousel` (carrossel)
- `lucide-react` (ícones)
- Service Worker próprio (`public/sw.js`) para cache offline, ativo só em produção

## Requisitos

- Node.js 18 ou superior (build verificado com Node 22)
- npm (o projeto usa **apenas npm**; o lockfile é `package-lock.json`)

## Como rodar

```bash
npm ci          # instala as dependências a partir do lockfile
npm run dev     # servidor de desenvolvimento em http://localhost:3000
```

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (porta 3000) |
| `npm run lint` | Checagem de tipos (`tsc --noEmit`) |
| `npm run build` | Build de produção na pasta `dist/` |
| `npm run preview` | Serve o build local para teste |
| `npm run clean` | Remove `dist/` |

Antes de qualquer commit na `main`, rode `npm run lint` e `npm run build`. Os dois precisam passar.

## Estrutura

```
index.html            Meta tags, SEO, JSON-LD e preloads
public/               Imagens, favicons, manifest, robots, sitemap, sw.js e _headers
src/
  main.tsx            Entrada; define o nível de movimento (data-motion-tier) e registra o SW
  App.tsx             Roteador por telas, atalhos de teclado e carregamento sob demanda
  types.ts            Telas (SCREENS), SITE_CONFIG, condições de pagamento e tipos
  whatsappMessages.ts Mensagens e URLs do WhatsApp (número e textos)
  mediaPrefs.ts       Nível de movimento: reduced-motion, economia de dados, aparelho fraco, navegador embutido
  preloadScreens.ts   Pré-carga das telas em ociosidade ou por intenção do usuário
  index.css           Estilos globais, tokens de animação e utilitários
  components/         Telas e componentes (Hero, Portfólio, Serviços, FAQ, etc.)
```

## Como o site funciona

- **Telas em vez de rotas.** A navegação troca de tela por hash (`#home`, `#inicio`, `#portfolio`, `#servicos`, `#processo`, `#orcamento`, `#faq`, `#parceria-trafego`), definido em `SCREENS` (`src/types.ts`). Telas secundárias e modais são carregados sob demanda.
- **Níveis de movimento.** `getMotionTier()` classifica o dispositivo em `full`, `lite` ou `none`. Efeitos pesados (inclinação 3D dos cards, parallax, marquee) só rodam no `full`; `prefers-reduced-motion`, economia de dados, aparelhos fracos e navegadores embutidos (Instagram, Facebook, TikTok, Line) recebem versões mais leves.
- **Botão do WhatsApp.** O botão flutuante e o balão ficam em `src/components/FloatingWhatsApp.tsx`. O horário de resposta (segunda a sexta, 09h às 18h) só muda a cor e a mensagem do balão.

## Onde editar o conteúdo

| O que | Onde |
|---|---|
| Domínio, e-mail, número e mensagens do WhatsApp do cabeçalho e demais pontos | `SITE_CONFIG` em `src/types.ts` |
| Condições de pagamento | `PAYMENT_CONDITIONS` em `src/types.ts` |
| Itens do menu e telas | `NAVIGATION_ITEMS` e `SCREENS` em `src/types.ts` |
| Mensagens e links do WhatsApp (briefing, reunião) | `src/whatsappMessages.ts` |
| Projetos do portfólio e imagens | `src/components/PortfolioSection.tsx` e `public/portifolio-*.webp` |
| Serviços | `src/components/ServicesSection.tsx` |
| FAQ visível | `src/components/FaqSection.tsx` |
| SEO, meta tags, JSON-LD | `index.html` |

**Atenção:** o número do WhatsApp aparece em dois lugares (`whatsappNumber` em `SITE_CONFIG` e `WHATSAPP_PHONE_NUMBER` em `src/whatsappMessages.ts`). Se o número mudar, altere os dois, além do JSON-LD no `index.html`.

**Atenção:** o FAQ do JSON-LD no `index.html` precisa ter exatamente as mesmas perguntas e respostas do FAQ visível em `FaqSection.tsx`. Se mudar um, mude o outro.

## Deploy (Netlify)

O site é publicado a partir da branch `main`. Configuração esperada:

- Comando de build: `npm run build`
- Pasta de publicação: `dist`
- Cache: regras em `public/_headers` (assets com hash em cache longo; `index.html` e `sw.js` sempre revalidados)

Depois de publicar, confira no celular a Home, o menu, o Portfólio, os Serviços, o FAQ e o botão do WhatsApp.

**Service Worker:** ao trocar ou renomear arquivos listados no pré-cache de `public/sw.js`, aumente o número em `CACHE_NAME` (hoje `elosites-cache-v3`) para os visitantes receberem a versão nova.

## Fluxo de trabalho com Git

- Trabalhe em uma branch e só leve para `main` depois de `npm run lint` e `npm run build` passarem.
- Commits pequenos, com mensagem clara em inglês (por exemplo, `perf: lazy load secondary screens`).
- Nunca reescreva o histórico da `main` nem use force-push.
- Não versione `node_modules`, `dist` nem arquivos `.env` (só o `.env.example`).

## Segurança e privacidade

- O site é só frontend: não há backend, banco de dados nem chaves de API no código. Nunca coloque segredos, tokens ou senhas no código, no HTML ou em arquivos públicos.
- O briefing e o agendamento montam uma mensagem para o WhatsApp do atendimento (via `api.whatsapp.com`); o site não envia nem guarda dados pessoais dos visitantes em servidor. No navegador, guarda apenas a preferência de alto contraste (`localStorage`) e um marcador de sessão da animação do Hero (`sessionStorage`).
- Os textos legais (Política de Privacidade e Termos, em `LegalModals.tsx`) devem ser revisados por um advogado antes de uso definitivo.

## Variáveis de ambiente

O `.env.example` contém apenas `DISABLE_HMR`, usada pelo Google AI Studio durante a edição. Não é necessária em produção.
