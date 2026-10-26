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
}

export const PORTFOLIO_PROJECTS: PortfolioProjectData[] = [
  {
    id: 'garagem-mailasque',
    badge: 'Site de uma página',
    status: 'Publicado & Ativo',
    title: 'Garagem Mailasque — Funilaria & Pintura',
    category: 'landing',
    challenge:
      'Oficina especializada em funilaria, pintura automotiva e polimento em São Roque/SP (Mailasqui). Precisava de presença no Google para ser encontrada por motoristas da região e agilizar orçamentos de reparos e sinistros pelo WhatsApp.',
    solution:
      'Site de uma página ágil e direto, com catálogo dos serviços de funilaria, pintura e restauração, localização com mapa e canal no WhatsApp preparado para o cliente enviar fotos do veículo danificado.',
    tags: ['Funilaria & Pintura', 'São Roque e Região', 'Envio de Fotos', 'Orçamento no WhatsApp'],
    urlLabel: 'garagemmailasque.com.br',
    href: 'https://garagemmailasque.com.br/',
    desktopImage: '/garagem-mailasque-desktop.webp',
    mobileImage: '/garagem-mailasque-mobile.jpg',
    features: [
      'Botão de WhatsApp com mensagem pronta para envio de fotos do veículo',
      'Catálogo claro dos serviços de reparo, pintura e polimento automotivo',
      'Endereço e mapa para localização rápida de motoristas de São Roque e região',
    ],
    resultsNote: 'Presença no Google consolidada, com atendimento direto pelo WhatsApp para envio de fotos e orçamentos.',
  },
  {
    id: 'toledo-seguranca',
    badge: 'Site completo',
    status: 'Publicado & Ativo',
    title: 'Toledo Segurança',
    category: 'institutional',
    challenge:
      'Empresa especializada em segurança para eventos, portaria terceirizada e rondas preventivas em Jundiaí/SP. Precisava de um site profissional para passar confiança a empresas e condomínios e receber pedidos de orçamento.',
    solution:
      'Site completo com apresentação detalhada dos serviços, fotos da equipe e estrutura, formulário de contato e botão para orçamento comercial no WhatsApp.',
    tags: ['Segurança para Eventos', 'Portaria & Acesso', 'Rondas Preventivas', 'Condomínios & Empresas'],
    urlLabel: 'toledoseg.com.br',
    href: 'https://toledoseg.com.br',
    desktopImage: '/portifolio-toledoseguranca-desktop.webp',
    mobileImage: '/portifolio-toledoseguranca-mobile.webp',
    features: [
      'Apresentação profissional pensada para passar credibilidade',
      'Seções organizadas para serviços de eventos, condomínios e empresas',
      'Canais de atendimento no WhatsApp para cotações e vagas de trabalho',
    ],
    resultsNote: 'Presença profissional consolidada para atender condomínios, eventos e empresas.',
  },
  {
    id: 'jv-salvaia',
    badge: 'Site de uma página',
    status: 'Publicado & Ativo',
    title: 'JV Salvaia Personal Trainer',
    category: 'landing',
    challenge:
      'Personal trainer atuante em treino presencial, consultoria online e avaliação física. Precisava de uma página rápida para apresentar suas modalidades e levar os interessados direto para o seu WhatsApp.',
    solution:
      'Site de uma página com carregamento rápido no celular, botões de WhatsApp personalizados para cada modalidade, fotos de resultados e depoimentos reais em destaque.',
    tags: ['Treino Presencial', 'Consultoria Online', 'Avaliação Física', 'Direto no WhatsApp'],
    urlLabel: 'jvsalvaiapersonal.netlify.app',
    href: 'https://jvsalvaiapersonal.netlify.app',
    desktopImage: '/portifolio-jvsalvaia-desktop.webp',
    mobileImage: '/portifolio-jvsalvaia-mobile.webp',
    features: [
      'Botão direto para o WhatsApp com mensagem pronta para cada plano',
      'Funciona perfeito no celular, tablet e computador',
      'Fotos leves que abrem rápido e preparado para o Google',
    ],
    resultsNote: 'Contatos organizados com mensagem específica do serviço de interesse.',
  },
  {
    id: 'duelo-fim-de-ano',
    badge: 'Página interativa',
    status: 'Publicado & Ativo',
    title: 'Duelo de Fim de Ano — Badem vs Becala',
    category: 'landing',
    challenge:
      'Organização de um clássico esportivo comunitário e beneficente de fim de ano que precisava de engajamento da torcida, votação dos melhores da partida e mural de fotos sem custos nem complicação técnica.',
    solution:
      'Página interativa com campinho de futebol para ver as escalações, votação direto no celular e galeria com fotos reais dos jogos.',
    tags: ['Interatividade', 'Engajamento', 'Futebol Amador', 'Fácil de Usar'],
    urlLabel: 'jogodefimdeano.netlify.app',
    href: 'https://jogodefimdeano.netlify.app',
    desktopImage: '/portifolio-jogodefimdeano-desktop.webp',
    mobileImage: '/portifolio-jogodefimdeano-mobile.webp',
    features: [
      'Escalações em campo de futebol interativo',
      'Votação no celular para escolher os melhores em campo',
      'Galeria de fotos leves dos jogos',
    ],
    resultsNote: 'Engajamento da comunidade com página leve, dinâmica e fácil de usar no celular.',
  },
];

export function getProjectById(id: string): PortfolioProjectData | undefined {
  return PORTFOLIO_PROJECTS.find((p) => p.id === id);
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
  for (const project of PORTFOLIO_PROJECTS) {
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
