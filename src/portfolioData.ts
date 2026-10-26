export interface PortfolioProjectData {
  id: string;
  badge: string;
  status: string;
  title: string;
  category: 'landing' | 'institutional';
  challenge: string;
  solution: string;
  tags: string[];
  urlLabel: string;
  href: string;
  desktopImage: string;
  mobileImage: string;
  features: string[];
  resultsNote: string;
  highlightNote?: string;
}

export const PORTFOLIO_PROJECTS: PortfolioProjectData[] = [
  {
    id: 'jv-salvaia',
    badge: 'LANDING PAGE RESPONSIVA',
    status: 'Publicado & Ativo',
    title: 'JV Salvaia Personal Trainer',
    category: 'landing',
    challenge:
      'Personal trainer atuante em treino presencial, consultoria online e avaliação física. Necessitava de uma landing page ágil para apresentar suas modalidades e conduzir interessados ao contato direto no WhatsApp.',
    solution:
      'Desenvolvimento de landing page responsiva, com chamadas de WhatsApp parametrizadas por modalidade de treino, galeria de resultados, apresentação de benefícios e prova social em destaque.',
    tags: ['Treino Presencial', 'Consultoria Online', 'Avaliação Física', 'Foco em Conversão'],
    urlLabel: 'jvsalvaiapersonal.netlify.app',
    href: 'https://jvsalvaiapersonal.netlify.app',
    desktopImage: '/portifolio-jvsalvaia-desktop.webp',
    mobileImage: '/portifolio-jvsalvaia-mobile.webp',
    features: [
      'Gatilho direto para WhatsApp com mensagem personalizada para cada plano',
      'Interface responsiva adaptada para smartphone, tablet e desktop',
      'Otimização de carregamento de imagens e fundamentos de SEO técnico',
    ],
    resultsNote: 'Leads direcionados com mensagem específica do serviço de interesse.',
    highlightNote: 'Estruturado com foco em conversão e carregamento ágil.',
  },
  {
    id: 'toledo-seguranca',
    badge: 'SITE INSTITUCIONAL CORPORATIVO',
    status: 'Publicado & Ativo',
    title: 'Toledo Segurança',
    category: 'institutional',
    challenge:
      'Empresa especializada em segurança para eventos, portaria terceirizada e rondas preventivas em Jundiaí/SP. Precisava de presença institucional clara para transmitir autoridade e receber solicitações de cotação.',
    solution:
      'Site institucional com paleta corporativa dark & gold, estruturação detalhada dos serviços prestados, formulário direto de cotação empresarial e canal de recrutamento integrado ao WhatsApp.',
    tags: ['Segurança para Eventos', 'Portaria & Acesso', 'Rondas Preventivas', 'B2B & Condomínios'],
    urlLabel: 'toledoseguranca.netlify.app',
    href: 'https://toledoseguranca.netlify.app',
    desktopImage: '/portifolio-toledoseguranca-desktop.webp',
    mobileImage: '/portifolio-toledoseguranca-mobile.webp',
    features: [
      'Apresentação institucional estruturada com foco em credibilidade',
      'Seções organizadas para serviços de eventos, condomínios e empresas',
      'Fluxo duplo de atendimento no WhatsApp (Orçamento comercial e Banco de talentos)',
    ],
    resultsNote: 'Presença institucional consolidada para apresentação corporativa e atendimento ágil de cotações.',
    highlightNote: 'Estruturado com foco em conversão e carregamento ágil',
  },
  {
    id: 'duelo-fim-de-ano',
    badge: 'PLATAFORMA INTERATIVA & EVENTO',
    status: 'Publicado & Ativo',
    title: 'Duelo de Fim de Ano — Badem vs Becala',
    category: 'landing',
    challenge:
      'Organização de clássico esportivo comunitário e beneficente de fim de ano que necessitava de engajamento dos torcedores, votação dos melhores da partida e mural de fotos dinâmico sem complexidade de infraestrutura.',
    solution:
      'Aplicação web com campo tático interativo, votação no navegador ("Bola Cheia vs Bola Murcha") com persistência local, cronologia de edições e integração com a comunidade esportiva.',
    tags: ['Interatividade', 'Engajamento Comunitário', 'Futebol Amador', 'UX Interativa'],
    urlLabel: 'jogodefimdeano.netlify.app',
    href: 'https://jogodefimdeano.netlify.app',
    desktopImage: '/portifolio-jogodefimdeano-desktop.webp',
    mobileImage: '/portifolio-jogodefimdeano-mobile.webp',
    features: [
      'Escalações em campo tático interativo de futebol',
      'Votação no navegador com persistência no armazenamento local (localStorage)',
      'Galeria de fotos com carregamento sob demanda',
    ],
    resultsNote: 'Engajamento comunitário interativo com interface leve, dinâmica e sem necessidade de login.',
    highlightNote: 'Estruturado com foco em conversão e carregamento ági',
  },
];

export const GARAGEM_MAILASQUE_PROJECT: PortfolioProjectData = {
  id: 'garagem-mailasque',
  badge: 'SITE DE UMA PÁGINA & OFICINA',
  status: 'Publicado & Ativo',
  title: 'Garagem Mailasque',
  category: 'landing',
  challenge:
    'Oficina especializada em funilaria, pintura automotiva e polimento em São Roque/SP (Mailasqui). Precisava de presença no Google para ser encontrada por motoristas da região e agilizar orçamentos de reparos e sinistros pelo WhatsApp.',
  solution:
    'Site de uma página ágil e direto, com catálogo dos serviços de funilaria, pintura e restauração, localização com mapa e canal no WhatsApp preparado para o cliente enviar fotos do veículo danificado.',
  tags: ['Funilaria & Pintura', 'São Roque e Região', 'Envio de Fotos', 'Orçamento no WhatsApp'],
  urlLabel: 'garagemailasque.com.br',
  href: 'https://garagemailasque.com.br',
  desktopImage: '/garagem-mailasque-desktop.webp',
  mobileImage: '/garagem-mailasque-mobile.jpg',
  features: [
    'Botão de WhatsApp com mensagem pronta para envio de fotos do veículo',
    'Catálogo claro dos serviços de reparo, pintura e polimento automotivo',
    'Endereço e mapa para localização rápida de motoristas de São Roque e região',
  ],
  resultsNote: 'Presença no Google consolidada, com atendimento direto pelo WhatsApp para envio de fotos e orçamentos.',
  highlightNote: 'Estruturado para apresentar serviços com autoridade e levar clientes qualificados direto para o WhatsAp',
};

export const ALL_CASES: PortfolioProjectData[] = [
  ...PORTFOLIO_PROJECTS,
  GARAGEM_MAILASQUE_PROJECT,
];

export function getProjectById(id: string): PortfolioProjectData | undefined {
  return ALL_CASES.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// PRÉ-CARREGAMENTO (PRELOAD) ESTRATÉGICO DE IMAGENS WEBP
// ---------------------------------------------------------------------------

// Cache em memória de URLs já requisitadas para evitar requisições duplicadas
const preloadedWebpCache = new Set<string>();

/**
 * Verifica se o dispositivo do usuário está com economia de dados (Save-Data)
 * ativada ou em conexão muito lenta (2G / slow-2g), evitando consumo indevido.
 */
function isNetworkRestricted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    if (nav.connection?.saveData) return true;
    const type = nav.connection?.effectiveType;
    if (type === 'slow-2g' || type === '2g') return true;
  } catch {
    // Ambiente sem suporte a Network Information API
  }
  return false;
}

/**
 * Retorna as URLs das capturas em formato WebP pertencentes a um projeto específico.
 */
export function getProjectWebpImages(projectOrId: PortfolioProjectData | string): string[] {
  const project = typeof projectOrId === 'string' ? getProjectById(projectOrId) : projectOrId;
  if (!project) return [];

  const candidates = [project.desktopImage, project.mobileImage];
  return candidates.filter(
    (src): src is string => typeof src === 'string' && src.toLowerCase().endsWith('.webp')
  );
}

/**
 * Retorna uma lista sem repetições de todas as imagens em formato WebP de todos os projetos do portfólio.
 */
export function getAllPortfolioWebpImages(): string[] {
  const urls = new Set<string>();
  for (const project of ALL_CASES) {
    for (const url of getProjectWebpImages(project)) {
      urls.add(url);
    }
  }
  return Array.from(urls);
}

/**
 * Pré-carrega uma imagem individual em memória com controle de prioridade e decodificação assíncrona.
 * O uso de img.decode() assegura que a decodificação ocorra fora da thread principal de renderização.
 */
export function preloadWebpImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
  if (typeof window === 'undefined' || !src || preloadedWebpCache.has(src)) {
    return Promise.resolve();
  }

  // Marca no cache antes do término para evitar requisições concorrentes
  preloadedWebpCache.add(src);

  return new Promise<void>((resolve) => {
    const img = new Image();

    // Dica de prioridade para o navegador (fetchpriority)
    if ('fetchPriority' in img) {
      try {
        (img as HTMLImageElement & { fetchPriority: string }).fetchPriority = priority;
      } catch {
        // Fallback gracioso
      }
    }

    img.src = src;

    if ('decode' in img && typeof img.decode === 'function') {
      img
        .decode()
        .then(() => resolve())
        .catch(() => resolve());
    } else {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    }
  });
}

/**
 * Pré-carregamento imediato/por intenção (hover, foco ou clique prévio) das imagens WebP de um projeto.
 * Reduz expressivamente a latência visual no instante exato em que o usuário abre o case ou a captura em tela cheia.
 */
export function preloadProjectWebpImages(
  projectOrId: PortfolioProjectData | string,
  priority: 'high' | 'low' = 'high'
): Promise<void[]> {
  const urls = getProjectWebpImages(projectOrId);
  return Promise.all(urls.map((url) => preloadWebpImage(url, priority)));
}

/**
 * Pré-carregamento em segundo plano (idle) de todas as imagens WebP de todos os projetos.
 * Executado preferencialmente via requestIdleCallback com intervalo distribuído para não
 * competir com o First Contentful Paint (FCP) ou Largest Contentful Paint (LCP) da página.
 */
export function preloadAllPortfolioWebpImages(options: { idle?: boolean; force?: boolean } = {}): void {
  if (typeof window === 'undefined') return;

  const { idle = true, force = false } = options;

  if (!force && isNetworkRestricted()) {
    return;
  }

  const runPreload = () => {
    const urls = getAllPortfolioWebpImages();
    // Carrega em fila escalonada para distribuir requisições e não congestionar a rede
    urls.forEach((url, index) => {
      window.setTimeout(() => {
        preloadWebpImage(url, 'low');
      }, index * 120);
    });
  };

  if (idle && typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(runPreload, { timeout: 3500 });
  } else if (idle) {
    window.setTimeout(runPreload, 1500);
  } else {
    runPreload();
  }
}
