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
  | 'portfolio'
  | 'servicos'
  | 'processo'
  | 'orcamento'
  | 'faq'
  | 'parceria-trafego';

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
    description: 'Apresentação institucional e engenharia ēloSites.',
    iconName: 'Sparkles',
  },
  {
    id: 'inicio',
    number: '02',
    title: 'Início',
    shortTitle: 'Início',
    badge: 'Início',
    description: 'Proposta de valor, demonstração interativa e o padrão de engenharia da ēloSites.',
    iconName: 'Sparkles',
  },
  {
    id: 'portfolio',
    number: '03',
    title: 'Portfólio de Projetos Reais',
    shortTitle: 'Portfólio',
    badge: 'Projetos no Ar',
    description: 'Cases publicados com mockups compostos e alternador interativo Desktop e Mobile.',
    iconName: 'LayoutGrid',
  },
  {
    id: 'servicos',
    number: '04',
    title: 'Serviços & Condições Comerciais',
    shortTitle: 'Serviços',
    badge: 'Formatos & Pagamento',
    description: '3 formatos de sites, orçamento sob medida, 20% à vista e parcelamento em até 12x.',
    iconName: 'Briefcase',
  },
  {
    id: 'processo',
    number: '05',
    title: 'Como Funciona o Processo & Diferenciais',
    shortTitle: 'Como funciona',
    badge: 'Processo & Diferenciais',
    description: 'Da ideia ao site no ar em 4 etapas ágeis e os diferenciais estratégicos da ēloSites.',
    iconName: 'Workflow',
  },
  {
    id: 'orcamento',
    number: '06',
    title: 'Briefing & Agendamento',
    shortTitle: 'Orçamento',
    badge: 'Simulação Rápida',
    description: 'Monte o briefing do seu projeto ou agende uma reunião executiva no Google Meet.',
    iconName: 'CalendarCheck',
  },
  {
    id: 'faq',
    number: '07',
    title: 'Perguntas Frequentes (FAQ) & Contato',
    shortTitle: 'FAQ & Contato',
    badge: 'Dúvidas & Contato',
    description: 'Respostas diretas sobre prazos, domínio, hospedagem, pagamentos e canais de atendimento.',
    iconName: 'HelpCircle',
  },
  {
    id: 'parceria-trafego',
    number: '08',
    title: 'Parceria Estratégica | Tráfego Pago & Gestão de Leads',
    shortTitle: 'Parceria | Tráfego Pago',
    badge: 'Tráfego Pago',
    description: 'Parceria recomendada com Thomaz (TrueThomaz.BM) para Meta Ads, geração de leads e consultoria comercial.',
    iconName: 'TrendingUp',
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
  tagline: 'Criação de sites profissionais com SEO técnico, foco em conversão e arquitetura de alta performance.',
  subtagline: 'Desenvolvemos a presença digital completa e estratégica para pequenos negócios e profissionais liberais.',
  email: 'contato@elosites.ia.br',
  // Número oficial da ēloSites
  whatsappNumber: '5511995722584',
  whatsappDisplay: '+55 (11) 99572-2584',

  // 1) Cabeçalho Fixo
  headerWhatsappMessage:
    'Olá! 👋 Acessei o site da *ēloSites* através do cabeçalho.\n\nGostaria de conversar diretamente com o desenvolvedor sobre a criação de um *site profissional* para o meu negócio.',

  // 2) Hero / Início (Tela 01)
  heroWhatsappMessage:
    'Olá! 🚀 Conheci a *ēloSites* pela página inicial.\n\nQuero solicitar um *orçamento sob medida* para desenvolver um site profissional com foco em *conversão no WhatsApp* e *SEO técnico* para minha marca.',

  // 3) Portfólio (Tela 02)
  portfolioWhatsappMessage:
    'Olá! 💻 Estive analisando o *portfólio de projetos reais* no site da *ēloSites*.\n\nGostei muito do padrão de acabamento, velocidade e responsividade. Gostaria de solicitar uma proposta comercial para um projeto com esse nível de qualidade!',

  // 4) Serviços - Landing Page (Tela 03)
  landingPageWhatsappMessage:
    'Olá! 🎯 Tenho interesse no formato *Landing Page de Alta Conversão* da *ēloSites*.\n\nPreciso de uma página única estratégica, veloz e otimizada para campanhas e captação de clientes no WhatsApp. Como podemos iniciar?',

  // 5) Serviços - Site Institucional (Tela 03)
  siteInstitucionalWhatsappMessage:
    'Olá! 🏢 Tenho interesse no formato *Site Institucional Completo* da *ēloSites*.\n\nQuero fortalecer a autoridade da minha empresa no Google com *SEO técnico*, apresentação completa de serviços e credibilidade corporativa. Poderia me enviar uma proposta?',

  // 6) Serviços - Projeto Personalizado (Tela 03)
  personalizadoWhatsappMessage:
    'Olá! ⚡ Gostaria de conversar sobre um *Projeto Sob Medida / Personalizado* com a *ēloSites*.\n\nTenho requisitos específicos para o meu negócio e busco uma solução web exclusiva de alta performance.',

  // 7) Processo / Como Funciona (Tela 04)
  processoWhatsappMessage:
    'Olá! 📋 Conheci o *processo ágil em 4 etapas* da *ēloSites*.\n\nGostei da transparência e do contato direto com quem desenvolve. Gostaria de entender os prazos para iniciar o meu site!',

  // 8) Diferenciais (Tela 05)
  diferenciaisWhatsappMessage:
    'Olá! ✨ Li os *diferenciais estratégicos* da *ēloSites* (código autoral limpo, sem intermediários e foco total em conversão no WhatsApp).\n\nQuero entender como podemos aplicar esses diferenciais no site do meu negócio!',

  // 9) FAQ (Tela 07)
  faqWhatsappMessage:
    'Olá! 💡 Estive lendo a seção de *Perguntas Frequentes (FAQ)* no site da *ēloSites*.\n\nAinda fiquei com algumas dúvidas sobre domínio, hospedagem ou prazos e gostaria de falar diretamente com o desenvolvedor.',

  // 10) Contato Principal (Tela 08)
  finalCtaWhatsappMessage:
    'Olá! 💬 Gostaria de dar o próximo passo e iniciar o projeto do meu *site profissional* com a *ēloSites*.\n\nPodemos conversar sobre o escopo, formato e orçamento?',

  // 11) Balão Flutuante e Botão WhatsApp Fixo
  floatingWhatsappMessage:
    'Olá! 🚀 Preciso de um site profissional para o meu negócio.\n\nGostaria de tirar algumas dúvidas rápidas diretamente com a equipe da *ēloSites*!',

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
  { label: 'Início', href: '#inicio', id: 'nav-inicio' },
  { label: 'Portfólio', href: '#portfolio', id: 'nav-portfolio' },
  { label: 'Serviços', href: '#servicos', id: 'nav-servicos' },
  { label: 'Como funciona', href: '#processo', id: 'nav-processo' },
  { label: 'Orçamento', href: '#orcamento', id: 'nav-orcamento' },
  { label: 'FAQ & Contato', href: '#faq', id: 'nav-faq' },
  { label: 'Parceria | Tráfego Pago', href: '#parceria-trafego', id: 'nav-parceria-trafego' },
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
