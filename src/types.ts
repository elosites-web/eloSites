export interface NavItem {
  label: string;
  href: string;
  id: string;
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

export const SITE_CONFIG = {
  name: 'ēloSites',
  tagline: 'O elo entre pequenos negócios e a presença digital profissional.',
  email: 'elosites.br@gmail.com',
  whatsappNumber: '5511995722584',
  whatsappDisplay: '+55 (11) 99572-2584',
  heroWhatsappMessage:
    'Olá, ēloSites! 👋\n\nQuero criar um *site profissional* para o meu negócio e gerar mais contatos pelo WhatsApp.\n\nPode me explicar como funciona e me enviar um orçamento sem compromisso?',
  headerWhatsappMessage:
    'Olá, ēloSites! 👋\n\nEstou conhecendo o trabalho de vocês e gostaria de entender melhor os *serviços de criação de sites*.\n\nPode me contar como funciona o processo?',
  portfolioWhatsappMessage:
    'Olá, ēloSites! 👋\n\nVi o *portfólio* de vocês e gostei dos projetos apresentados. 🚀\n\nQuero um site com esse nível de qualidade para o meu negócio. Podemos conversar?',
  landingPageWhatsappMessage:
    'Olá, ēloSites! 👋\n\nTenho interesse em uma *Landing Page* para divulgar meu negócio e converter mais contatos no WhatsApp. 🎯\n\nPode me enviar um orçamento e sugerir a melhor estrutura?',
  siteInstitucionalWhatsappMessage:
    'Olá, ēloSites! 👋\n\nQuero um *site institucional completo* para apresentar minha empresa com credibilidade, com seções como sobre, serviços e contato. 🏢\n\nPode me explicar o que seria ideal para o meu caso?',
  personalizadoWhatsappMessage:
    'Olá, ēloSites! 👋\n\nMeu projeto não se encaixa exatamente em Landing Page ou Site Institucional e gostaria de um *projeto personalizado*. 🛠️\n\nPodemos conversar sobre o que eu preciso e definir escopo, prazo e orçamento?',
  finalCtaWhatsappMessage:
    'Olá, ēloSites! 👋\n\nQuero dar o próximo passo e criar o *site do meu negócio*.\n\nPodemos conversar sobre formato, conteúdo e orçamento agora?',
  floatingWhatsappMessage:
    'Olá, ēloSites! 👋\n\nTenho uma dúvida rápida sobre a criação de sites e gostaria de falar com vocês. 😊',
  mobileMenuWhatsappMessage:
    'Olá, ēloSites! 👋\n\nEstou no site e quero conversar sobre a criação de um *site profissional* para o meu negócio.\n\nPode me ajudar a escolher o melhor formato?',
  defaultWhatsappMessage:
    'Olá, ēloSites! 👋\n\nGostaria de saber mais sobre a criação de sites da ēloSites e receber um orçamento. 🙂',
};

export const NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Serviços', href: '#servicos', id: 'nav-servicos' },
  { label: 'Portfólio', href: '#portfolio', id: 'nav-portfolio' },
  { label: 'Como funciona', href: '#como-funciona', id: 'nav-processo' },
  { label: 'Perguntas frequentes', href: '#faq', id: 'nav-faq' },
  { label: 'Contato', href: '#contato', id: 'nav-contato' },
];

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function motionSafeScrollBehavior(): ScrollBehavior {
  if (typeof window === 'undefined') return 'auto';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth';
}

export function scrollToHash(href: string): void {
  const element = document.querySelector(href);
  if (!(element instanceof HTMLElement)) return;
  element.scrollIntoView({ behavior: motionSafeScrollBehavior() });
}
