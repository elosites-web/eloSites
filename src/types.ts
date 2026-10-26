/**
 * ēloSites — Configurações, tipos e dados globais do site
 */

export interface NavItem {
  label: string;
  href: string;
  id: string;
}

export type ScreenId =
  | 'home'
  | 'inicio'
  | 'servicos'
  | 'solucoes-web'
  | 'solucoes'
  | 'portfolio'
  | 'avaliacoes'
  | 'processo'
  | 'orcamento'
  | 'parceria-trafego'
  | 'trafego-pago'
  | 'faq';

export interface ScreenMeta {
  id: ScreenId;
  number: string;
  title: string;
  shortTitle: string;
  badge: string;
  description: string;
  iconName: string;
}

export const SCREENS: ScreenMeta[] = [
  {
    id: 'home',
    number: '01',
    title: 'Home',
    shortTitle: 'Home',
    badge: 'Home',
    description: 'Presença profissional estruturada para o Google, não só no Instagram.',
    iconName: 'Sparkles',
  },
  {
    id: 'inicio',
    number: '02',
    title: 'Sobre a ēloSites',
    shortTitle: 'Sobre',
    badge: 'Sobre',
    description: 'Tecnologia, criatividade e propósito em cada projeto.',
    iconName: 'Sparkles',
  },
  {
    id: 'servicos',
    number: '03',
    title: 'Serviços & Especialidades Web',
    shortTitle: 'Serviços',
    badge: 'Formatos & Especialidades',
    description: 'Formatos sob medida, especialidades técnicas e pagamento flexível.',
    iconName: 'Briefcase',
  },
  {
    id: 'portfolio',
    number: '04',
    title: 'Portfólio de Projetos Reais',
    shortTitle: 'Portfólio',
    badge: 'Sites no Ar',
    description: 'Sites reais no ar para apresentar seu trabalho e facilitar o contato pelo WhatsApp.',
    iconName: 'LayoutGrid',
  },
  {
    id: 'avaliacoes',
    number: '05',
    title: 'Avaliações de Clientes Reais',
    shortTitle: 'Avaliações',
    badge: 'Avaliações',
    description: 'O que dizem os clientes que colocaram o site no ar.',
    iconName: 'Star',
  },
  {
    id: 'processo',
    number: '06',
    title: 'Como Funciona o Processo & Diferenciais',
    shortTitle: 'Como Funciona',
    badge: 'Como Funciona',
    description: 'Quatro etapas. Cada detalhe com revisão humana.',
    iconName: 'Workflow',
  },
  {
    id: 'orcamento',
    number: '07',
    title: 'Planejamento Estratégico & Agendamento',
    shortTitle: 'Orçamento',
    badge: 'Orçamento',
    description: 'Dê o próximo passo para o seu site.',
    iconName: 'CalendarCheck',
  },
  {
    id: 'parceria-trafego',
    number: '08',
    title: 'Tráfego Pago (Anúncios na Internet) & Contatos',
    shortTitle: 'Tráfego Pago',
    badge: 'Tráfego Pago',
    description: 'Anúncios para atrair mais pessoas para o seu site e WhatsApp.',
    iconName: 'TrendingUp',
  },
  {
    id: 'faq',
    number: '09',
    title: 'Perguntas Frequentes (FAQ) & Contato',
    shortTitle: 'FAQ & Contato',
    badge: 'FAQ & Contato',
    description: 'Tire as dúvidas antes de começar.',
    iconName: 'HelpCircle',
  },
];

export const PAYMENT_CONDITIONS = {
  customBudgetNotice:
    'Cada serviço obtém orçamento personalizado, considerando escopo, seções, conteúdo e prazo acordado.',
  pixSplitRule:
    '50% no momento da contratação para início do projeto e 50% na entrega final (via PIX).',
  cashDiscountPercent: 20,
  cashDiscountText:
    '20% de desconto sobre o valor do projeto orçado para pagamento à vista.',
  creditCardNoInterestMax: 5,
  creditCardNoInterestText:
    'Cartão de crédito em até 5x sem juros (1 entrada + 4 parcelas).',
  creditCardInterestRangeText:
    'De 6x até 12x no cartão de crédito com os juros/taxas da operadora para o cliente.',
};

export interface PortfolioProject {
  id: string;
  title: string;
  client: string;
  role: string;
  description: string;
  objectives: string[];
  servicesHighlighted: string[];
  versions: {
    id: string;
    name: string;
    badge: string;
    url: string;
    tagline: string;
    accentColor: string;
    features: string[];
    bgImage: string;
    logoImage?: string;
  }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  idealFor: string[];
  deliverables: string[];
  priceNote: string;
  badge?: string;
}

export interface DifferentialItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProjectBriefData {
  contactName: string;
  businessName: string;
  segment: string;
  projectType: string;
  investmentRange?: string;
  description: string;
  whatsappContact: string;
  agreedToLgpd: boolean;
}

export interface MeetingBookingData {
  name: string;
  businessName: string;
  whatsappOrEmail: string;
  preferredDate: string;
  preferredTimeSlot: string;
  platform: string;
  meetingTopic: string;
  agreedToLgpd: boolean;
  notes?: string;
}

export const SITE_CONFIG = {
  name: 'ēloSites',
  domain: 'elosites.ia.br',
  canonicalUrl: 'https://elosites.ia.br',
  tagline: 'ēloSites | Sites profissionais estruturados para facilitar a localização no Google e receber contatos no WhatsApp.',
  subtagline: 'Seu negócio merece mais do que um perfil nas redes sociais. Tenha um site profissional para apresentar seu trabalho, fortalecer sua presença no Google e facilitar o contato de novos clientes pelo WhatsApp.',
  email: 'contato@elosites.ia.br',
  // Número oficial da ēloSites
  whatsappNumber: '5511995722584',
  whatsappDisplay: '+55 (11) 99572-2584',

  // 1) Cabeçalho Fixo
  headerWhatsappMessage:
    'Olá! 👋 Acessei o site da *ēloSites* através do cabeçalho.\n\nGostaria de conversar diretamente com o desenvolvedor sobre a criação de um *site profissional* para o meu negócio.',

  // 2) Hero / Início (Tela 01)
  heroWhatsappMessage:
    'Olá! 🚀 Conheci a *ēloSites* pela página inicial.\n\nQuero solicitar um *orçamento sob medida* para desenvolver um site profissional para o meu negócio, estruturado para o Google e com contato direto pelo WhatsApp.',

  // 3) Portfólio (Tela 02)
  portfolioWhatsappMessage:
    'Olá! 💻 Estive analisando o *portfólio de projetos reais* no site da *ēloSites*.\n\nGostei muito do padrão de acabamento, velocidade e facilidade de navegação no celular. Gostaria de solicitar uma proposta comercial para um projeto para o meu negócio!',

  // 4) Serviços - Site de uma página (Tela 03)
  landingPageWhatsappMessage:
    'Olá! 🎯 Tenho interesse no formato *Site de uma página* da *ēloSites*.\n\nPreciso de uma página direta, ágil e focada em apresentar meus serviços e levar os clientes para o WhatsApp. Como podemos iniciar?',

  // 5) Serviços - Site completo (Tela 03)
  siteInstitucionalWhatsappMessage:
    'Olá! 🏢 Tenho interesse no formato *Site completo* da *ēloSites*.\n\nQuero fortalecer a presença da minha empresa no Google, com apresentação detalhada dos serviços, fotos reais e localização. Poderia me enviar uma proposta?',

  // 6) Serviços - Projeto Personalizado (Tela 03)
  personalizadoWhatsappMessage:
    'Olá! ⚡ Gostaria de conversar sobre um *Projeto sob medida* com a *ēloSites*.\n\nTenho necessidades específicas para o meu negócio e busco uma solução web desenvolvida sob encomenda.',

  // 7) Processo / Como Funciona (Tela 04)
  processoWhatsappMessage:
    'Olá! 📋 Conheci o *processo em 4 etapas* da *ēloSites*.\n\nGostei da clareza e do contato direto com quem desenvolve. Gostaria de entender os prazos para iniciar o meu site!',

  // 8) Diferenciais (Tela 05)
  diferenciaisWhatsappMessage:
    'Olá! ✨ Li as *vantagens* de criar um site com a *ēloSites* (atendimento direto com o desenvolvedor, carregamento rápido e foco em WhatsApp).\n\nQuero entender como podemos aplicar esses benefícios no site do meu negócio!',

  // 9) FAQ (Tela 07)
  faqWhatsappMessage:
    'Olá! 💡 Estive lendo a seção de *Perguntas Frequentes (FAQ)* no site da *ēloSites*.\n\nAinda fiquei com algumas dúvidas sobre domínio, publicação ou pagamentos e gostaria de falar diretamente com o desenvolvedor.',

  // 10) Contato Principal (Tela 08)
  finalCtaWhatsappMessage:
    'Olá! 💬 Gostaria de dar o próximo passo e iniciar o projeto do meu *site profissional* com a *ēloSites*.\n\nPodemos conversar sobre o formato ideal e o orçamento?',

  // 11) Balão Flutuante e Botão WhatsApp Fixo
  floatingWhatsappMessage:
    'Olá! 🚀 Preciso de um site profissional para o meu negócio.\n\nGostaria de tirar algumas dúvidas rápidas diretamente com o desenvolvedor da *ēloSites*!',

  // 12) Modal de Navegação
  mobileMenuWhatsappMessage:
    'Olá! 📱 Estive navegando pelo menu da *ēloSites* e gostaria de receber mais informações sobre o desenvolvimento de sites profissionais.',

  // 13) Rodapé
  footerWhatsappMessage:
    'Olá! 👋 Conheci o trabalho da *ēloSites* pelo rodapé do site.\n\nGostaria de solicitar uma análise e um orçamento personalizado para o meu projeto!',

  // 14) Parceria | Tráfego Pago
  partnershipWhatsappMessage:
    'Olá! Vim pelo site da ēloSites e gostaria de conhecer a condição especial da parceria de tráfego pago. Gostaria de receber mais informações.',

  // Padrão Geral
  defaultWhatsappMessage:
    'Olá! 👋 Gostaria de saber mais sobre a criação de sites profissionais da *ēloSites*.',
};

export const NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home', id: 'nav-home' },
  { label: 'Sobre', href: '#inicio', id: 'nav-inicio' },
  { label: 'Serviços', href: '#servicos', id: 'nav-servicos' },
  { label: 'Portfólio', href: '#portfolio', id: 'nav-portfolio' },
  { label: 'Avaliações', href: '#avaliacoes', id: 'nav-avaliacoes' },
  { label: 'Como Funciona', href: '#processo', id: 'nav-processo' },
  { label: 'Orçamento', href: '#orcamento', id: 'nav-orcamento' },
  { label: 'Tráfego Pago', href: '#parceria-trafego', id: 'nav-parceria-trafego' },
  { label: 'FAQ e Contato', href: '#faq', id: 'nav-faq' },
];

export {
  formatWhatsAppMessage,
  buildWhatsAppUrl,
  buildWhatsAppUrl as whatsappUrl,
  formatBriefingWhatsappMessage,
  formatBookingWhatsappMessage,
} from './whatsappMessages';
export type { WhatsAppContextParams, WhatsAppLocation } from './whatsappMessages';

/**
 * Gera link para adição do evento no Google Calendar
 */
export function createGoogleCalendarUrl(data: MeetingBookingData): string {
  const title = encodeURIComponent(`Reunião ēloSites — Alinhamento de Projeto (${data.name})`);
  const details = encodeURIComponent(
    `Reunião via ${data.platform} para alinhamento estratégico do site da ${data.businessName}.\nPauta: ${data.meetingTopic}\nContato: ${data.whatsappOrEmail}`
  );
  const location = encodeURIComponent(data.platform === 'Google Meet' ? 'Google Meet (link a ser enviado)' : 'WhatsApp Chamada');

  // Ajusta data base
  const dateParts = data.preferredDate.split('-');
  const yyyy = dateParts[0] || '2026';
  const mm = dateParts[1] || '10';
  const dd = dateParts[2] || '15';

  let startHour = '140000';
  let endHour = '144500';

  if (data.preferredTimeSlot.includes('Manhã')) {
    startHour = '100000';
    endHour = '104500';
  } else if (data.preferredTimeSlot.includes('Noite')) {
    startHour = '190000';
    endHour = '194500';
  }

  const dates = `${yyyy}${mm}${dd}T${startHour}Z/${yyyy}${mm}${dd}T${endHour}Z`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}

/**
 * Gera arquivo padrão .ics para importação em qualquer aplicativo de calendário
 */
export function generateIcsContent(data: MeetingBookingData): string {
  const dateFormatted = data.preferredDate.replace(/-/g, '');
  let timeStr = '140000';
  let endTimeStr = '144500';

  if (data.preferredTimeSlot.includes('Manhã')) {
    timeStr = '100000';
    endTimeStr = '104500';
  } else if (data.preferredTimeSlot.includes('Noite')) {
    timeStr = '190000';
    endTimeStr = '194500';
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//eloSites//Agendamento Estrategico//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `SUMMARY:Reunião ēloSites — Alinhamento de Projeto (${data.name})`,
    `DESCRIPTION:Pauta: ${data.meetingTopic}\\nEmpresa: ${data.businessName}\\nContato: ${data.whatsappOrEmail}`,
    `DTSTART:${dateFormatted}T${timeStr}Z`,
    `DTEND:${dateFormatted}T${endTimeStr}Z`,
    `LOCATION:${data.platform}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
