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
    badge: 'PÁGINA ÚNICA (LANDING PAGE)',
    status: 'Publicado & Ativo',
    title: 'JV Salvaia Personal Trainer',
    category: 'landing',
    challenge:
      'O treinador precisava apresentar seus treinos presenciais, consultoria online e avaliação física de forma profissional, facilitando para quem tem interesse entrar em contato direto pelo WhatsApp.',
    solution:
      'Criamos uma página rápida e focada em atrair novos alunos (conversão direta), com botões de WhatsApp específicos para cada tipo de treino, galeria de fotos de resultados, apresentação dos benefícios e depoimentos de alunos.',
    tags: ['Treino Presencial', 'Consultoria Online', 'Avaliação Física', 'Contato no WhatsApp'],
    urlLabel: 'jvsalvaiapersonal.netlify.app',
    href: 'https://jvsalvaiapersonal.netlify.app',
    desktopImage: '/portifolio-jvsalvaia-desktop.webp',
    mobileImage: '/portifolio-jvsalvaia-mobile.webp',
    features: [
      'Botões de WhatsApp com mensagem pronta para cada plano de treino',
      'Site com layout responsivo para celular e computador',
      'Carregamento rápido das imagens e boas práticas de SEO técnico',
    ],
    resultsNote: 'Contatos organizados pelo WhatsApp, com mensagens que já identificam o serviço desejado pelo aluno.',
    highlightNote: 'Desenvolvido para abrir rápido no celular e facilitar o primeiro contato pelo WhatsApp.',
  },
  {
    id: 'toledo-seguranca',
    badge: 'SITE INSTITUCIONAL CORPORATIVO',
    status: 'Publicado & Ativo',
    title: 'Toledo Segurança',
    category: 'institutional',
    challenge:
      'Empresa de segurança para eventos, portaria e rondas preventivas em Jundiaí e região. Precisava de um site profissional para transmitir confiança a condomínios e empresas e receber pedidos de cotação.',
    solution:
      'Desenvolvemos um site institucional completo com visual sério e corporativo, detalhes de cada serviço prestado, formulário direto para solicitar orçamento e canal no WhatsApp também para recebimento de currículos.',
    tags: ['Segurança para Eventos', 'Portaria & Acesso', 'Rondas Preventivas', 'Empresas & Condomínios'],
    urlLabel: 'www.toledoseg.com.br',
    href: 'https://www.toledoseg.com.br',
    desktopImage: '/portifolio-toledoseguranca-desktop.webp',
    mobileImage: '/portifolio-toledoseguranca-mobile.webp',
    features: [
      'Apresentação completa da empresa e dos serviços para transmitir seriedade e confiança',
      'Seções organizadas para condomínios, eventos particulares e empresas',
      'Dois caminhos de atendimento no WhatsApp: orçamentos comerciais e envio de currículos',
    ],
    resultsNote: 'Presença profissional na internet para apresentar a empresa a clientes corporativos e agilizar cotações.',
    highlightNote: 'Estruturado para transmitir autoridade e receber solicitações comerciais com rapidez.',
  },
  {
    id: 'garagem-mailasque',
    badge: 'PÁGINA ÚNICA & OFICINA',
    status: 'Publicado & Ativo',
    title: 'Garagem Mailasque',
    category: 'landing',
    challenge:
      'Oficina especializada em funilaria, pintura automotiva e polimento em São Roque e região. Precisava de estrutura adequada para indexação local e agilizar orçamentos de reparos pelo WhatsApp, inclusive com envio de fotos dos veículos.',
    solution:
      'Criamos uma página direta e fácil de navegar no celular, apresentando os serviços de funilaria, pintura e restauração, mapa de localização e botão de WhatsApp preparado para o cliente enviar fotos do veículo batido ou arranhado.',
    tags: ['Funilaria & Pintura', 'São Roque e Região', 'Envio de Fotos do Carro', 'Orçamento no WhatsApp'],
    urlLabel: 'www.garagemmailasque.com.br',
    href: 'https://www.garagemmailasque.com.br',
    desktopImage: '/garagem-mailasque-desktop.webp',
    mobileImage: '/garagem-mailasque-mobile.jpg',
    features: [
      'Mensagem pronta no WhatsApp para agilizar o orçamento e envio de fotos do veículo',
      'Apresentação clara dos serviços automotivos de funilaria, pintura e polimento',
      'Endereço e mapa para ajudar motoristas de São Roque e região a encontrar a oficina',
    ],
    resultsNote: 'Estrutura preparada para indexação local e canal direto de WhatsApp para pedidos de orçamento com envio de fotos.',
    highlightNote: 'Estruturado para apresentar serviços com clareza e levar o cliente direto para o WhatsApp.',
  },
  {
    id: 'duelo-fim-de-ano',
    badge: 'LANDING PAGE PARA EVENTO',
    status: 'Publicado & Ativo',
    title: 'Duelo de Fim de Ano — Badem vs Becala',
    category: 'landing',
    challenge:
      'Evento esportivo tradicional e beneficente de fim de ano que precisava envolver torcedores, permitir votação dos melhores jogadores e exibir fotos dos jogos de forma leve e prática no celular.',
    solution:
      'Criamos uma página interativa com campinho de futebol visual para ver a escalação dos times, sistema de votação de "Bola Cheia e Bola Murcha" que funciona direto no navegador e galeria de fotos das edições anteriores.',
    tags: ['Interatividade no Navegador', 'Engajamento de Torcedores', 'Futebol Amador', 'Navegação Fácil no Celular'],
    urlLabel: 'jogodefimdeano.netlify.app',
    href: 'https://jogodefimdeano.netlify.app',
    desktopImage: '/portifolio-jogodefimdeano-desktop.webp',
    mobileImage: '/portifolio-jogodefimdeano-mobile.webp',
    features: [
      'Campo tático visual com a escalação completa dos dois times',
      'Votação dos melhores jogadores funcionando direto no navegador, sem precisar de cadastro',
      'Mural de fotos com carregamento leve para não pesar na internet do celular',
    ],
    resultsNote: 'Engajamento dos torcedores e participantes com uma experiência dinâmica, moderna e sem necessidade de login.',
    highlightNote: 'Estruturado para envolver a comunidade esportiva com carregamento ágil no celular.',
  },
];

export const GARAGEM_MAILASQUE_PROJECT: PortfolioProjectData = PORTFOLIO_PROJECTS[2];

export const ALL_CASES: PortfolioProjectData[] = PORTFOLIO_PROJECTS;

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
