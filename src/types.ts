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

export const PRICING = {
  landingPageFrom: 500,
  professionalWebsiteFrom: 850,
  maintenanceLanding: 100,
  maintenanceProfessional: 150,
} as const;

export function formatBRL(value: number): string {
  return `R$\u00A0${value.toLocaleString('pt-BR')}`;
}

export const SITE_CONFIG = {
  name: 'ēloSites',
  tagline: 'O elo entre pequenos negócios e a presença digital profissional.',
  email: 'elosites.br@gmail.com',
  whatsappNumber: '5511995722584',
  whatsappDisplay: '+55 (11) 99572-2584',
  heroWhatsappMessage:
    'Olá! Conheci a ēloSites e gostaria de conversar sobre a criação de um site para o meu negócio.',
  headerWhatsappMessage:
    'Olá! Gostaria de saber mais sobre os serviços de criação de sites da ēloSites.',
  portfolioWhatsappMessage:
    'Olá! Vi o portfólio da ēloSites e gostaria de criar um site para o meu negócio.',
  landingPageWhatsappMessage:
    'Olá! Tenho interesse em criar uma Landing Page para divulgar meu negócio e gerar mais contatos.',
  siteInstitucionalWhatsappMessage:
    'Olá! Tenho interesse em criar um site institucional para o meu negócio.',
  finalCtaWhatsappMessage:
    'Olá! Vi o portfólio da ēloSites e gostaria de criar um site para o meu negócio.',
  floatingWhatsappMessage:
    'Olá! Gostaria de saber mais sobre a criação de sites da ēloSites.',
  mobileMenuWhatsappMessage:
    'Olá! Gostaria de conversar sobre a criação de um site para o meu negócio.',
  defaultWhatsappMessage:
    'Olá! Gostaria de saber mais sobre a criação de sites da ēloSites.',
};

export const NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Portfólio', href: '#portfolio', id: 'nav-portfolio' },
  { label: 'Como funciona', href: '#como-funciona', id: 'nav-processo' },
  { label: 'Serviços', href: '#servicos', id: 'nav-servicos' },
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
