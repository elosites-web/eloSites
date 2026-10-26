import React, { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { shouldReduceMedia } from '../mediaPrefs';
import {
  Target,
  Building2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Info,
  CreditCard,
  Percent,
  Split,
  Calendar,
  Calculator,
  ArrowRight,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SplitLines } from './SplitLines';
import { SITE_CONFIG, PAYMENT_CONDITIONS, whatsappUrl } from '../types';
import { Interactive3DCard } from './Interactive3DCard';
import { MagneticButton } from './MagneticButton';
import { BiReveal } from './BiReveal';

interface FadeInBlockProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  yOffset?: number;
}

// Transição de desvanecimento suave (fade-in) nos blocos de texto conforme o usuário faz a rolagem vertical
const FadeInBlock: React.FC<FadeInBlockProps> = ({
  children,
  delay = 0,
  className = '',
  yOffset = 12,
}) => {
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px 50px 0px' }}
      transition={{
        duration: 0.48,
        delay: delay * 0.001,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ServiceCategory {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: LucideIcon;
  includes: string[];
  scopeNote: string;
  excluded?: string[];
  ctaLabel: string;
  ctaId: string;
  ctaMessage: string;
}

const SERVICES: ServiceCategory[] = [
  {
    id: 'landing-page',
    badge: 'Foco em Conversão',
    title: 'Landing Page',
    description:
      'Página única, estratégica e direta. Apresenta o seu serviço de forma clara e conduz o visitante até o contato no WhatsApp.',
    icon: Target,
    includes: [
      'Estrutura estratégica de página única',
      'Seção hero com chamada principal',
      'Apresentação do negócio',
      'Serviços ou produtos, benefícios e diferenciais',
      'Depoimentos e prova social quando fornecidos',
      'Imagens e galeria quando aplicável',
      'Perguntas frequentes (FAQ) e chamadas para ação (CTA)',
      'Integração com WhatsApp e informações de contato',
      'Formulários quando incluídos no escopo',
      'Links para redes sociais',
      'Layout responsivo para celular, tablet e desktop',
      'SEO técnico básico, metadados e favicon',
      'Publicação e revisão final de funcionamento',
    ],
    scopeNote: 'O escopo exato é definido na proposta e no contrato.',
    excluded: [
      'Domínio próprio',
      'Hospedagem em outro provedor',
      'Criação de identidade visual (logo)',
      'Novas páginas fora do escopo combinado',
    ],
    ctaLabel: 'Pedir proposta de Landing Page',
    ctaId: 'service-cta-landing-page',
    ctaMessage: SITE_CONFIG.landingPageWhatsappMessage,
  },
  {
    id: 'site-institucional',
    badge: 'Autoridade & Estrutura',
    title: 'Site Institucional',
    description:
      'Presença digital mais completa, com navegação e várias seções. Ideal para transmitir credibilidade e mostrar estrutura, serviços e prova social.',
    icon: Building2,
    includes: [
      'Página inicial (Home)',
      'Sobre',
      'Serviços com descrição detalhada',
      'Diferenciais',
      'Portfólio e projetos',
      'Depoimentos e prova social',
      'Perguntas frequentes (FAQ)',
      'Contato e localização/endereço quando fornecidos',
      'WhatsApp e redes sociais',
      'Formulários quando incluídos no escopo',
      'Navegação entre seções e páginas',
      'Layout responsivo para celular, tablet e desktop',
      'SEO técnico básico, metadados e favicon',
      'Publicação e testes de funcionamento',
    ],
    scopeNote:
      'O número de páginas, seções, integrações e funcionalidades depende do escopo aprovado.',
    excluded: [
      'Domínio próprio',
      'Hospedagem em outro provedor',
      'Identidade visual do zero',
      'Integrações com sistemas de terceiros',
    ],
    ctaLabel: 'Pedir proposta de Site Institucional',
    ctaId: 'service-cta-institucional',
    ctaMessage: SITE_CONFIG.siteInstitucionalWhatsappMessage,
  },
  {
    id: 'projeto-personalizado',
    badge: 'Solução Sob Medida',
    title: 'Projeto Personalizado',
    description:
      'Desenvolvimento frontend sob medida para requisitos específicos. Estruturação exclusiva de páginas, componentes interativos, formulários personalizados e integrações aprovadas em escopo.',
    icon: Sparkles,
    includes: [
      'Estruturas de páginas e seções personalizadas para o seu modelo de negócio',
      'Interfaces responsivas e fluxos de navegação fluidos (abas, telas ou página única)',
      'Componentes interativos e recursos dinâmicos executados no navegador',
      'Formulários customizados, galerias, modais e calculadoras quando previstos no escopo',
      'Integrações com WhatsApp e ferramentas de mensuração previstas no escopo',
      'Depoimentos, prova social e apresentação institucional sob medida',
      'SEO técnico básico, metadados semânticos e otimização de imagens',
      'Layout responsivo adaptado com precisão para celular, tablet e desktop',
      'Publicação e revisão técnica final de funcionamento',
    ],
    scopeNote:
      'Preço, escopo e prazo são definidos conforme a complexidade e os requisitos de frontend aprovados na proposta.',
    excluded: [
      'Domínio próprio',
      'Hospedagem em outro provedor',
      'Criação de identidade visual (logo) do zero',
      'Funcionalidades fora do escopo aprovado no orçamento',
    ],
    ctaLabel: 'Solicitar proposta personalizada',
    ctaId: 'service-cta-personalizado',
    ctaMessage: SITE_CONFIG.personalizadoWhatsappMessage,
  },
];

interface ServicesSectionProps {
  onNavigateToOrcamento?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigateToOrcamento }) => {
  // Simulador interativo de pagamento (iniciando em R$ 650 conforme solicitado)
  const [simulatedValue, setSimulatedValue] = useState<number>(650);

  // Detecção de preferências de acessibilidade e redução de movimento
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  const discountValue = Math.round(simulatedValue * (1 - PAYMENT_CONDITIONS.cashDiscountPercent / 100));
  const pixSplitFirst = Math.round(simulatedValue * 0.5);
  const installment5x = (simulatedValue / 5).toFixed(2);

  // Variantes dinâmicas de entrada com Framer Motion para fluidez máxima ao rolar (service-card)
  const serviceCardVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: prefersReduced ? 1 : 0.93,
      y: prefersReduced ? 0 : 42,
      filter: prefersReduced ? 'none' : 'blur(8px)',
    },
    visible: (i: number = 0) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        y: prefersReduced
          ? { duration: 0 }
          : { type: 'spring', damping: 22, stiffness: 105, mass: 0.85, delay: i * 0.12 },
        scale: prefersReduced
          ? { duration: 0 }
          : { type: 'spring', damping: 22, stiffness: 105, mass: 0.85, delay: i * 0.12 },
        opacity: prefersReduced
          ? { duration: 0 }
          : { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
        filter: prefersReduced
          ? { duration: 0 }
          : { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
      },
    }),
  };

  // Variantes para os cartões de regras comerciais (service-card)
  const commercialCardVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: prefersReduced ? 1 : 0.95,
      y: prefersReduced ? 0 : 32,
      filter: prefersReduced ? 'none' : 'blur(6px)',
    },
    visible: (i: number = 0) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        y: prefersReduced
          ? { duration: 0 }
          : { type: 'spring', damping: 24, stiffness: 110, mass: 0.8, delay: i * 0.09 },
        scale: prefersReduced
          ? { duration: 0 }
          : { type: 'spring', damping: 24, stiffness: 110, mass: 0.8, delay: i * 0.09 },
        opacity: prefersReduced
          ? { duration: 0 }
          : { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: i * 0.09 },
        filter: prefersReduced
          ? { duration: 0 }
          : { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: i * 0.09 },
      },
    }),
  };

  // Variantes para o card do simulador interativo (service-card)
  const simulatorCardVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: prefersReduced ? 1 : 0.96,
      y: prefersReduced ? 0 : 36,
      filter: prefersReduced ? 'none' : 'blur(6px)',
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        y: prefersReduced ? { duration: 0 } : { type: 'spring', damping: 24, stiffness: 100, mass: 0.85 },
        scale: prefersReduced ? { duration: 0 } : { type: 'spring', damping: 24, stiffness: 100, mass: 0.85 },
        opacity: prefersReduced ? { duration: 0 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
        filter: prefersReduced ? { duration: 0 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
      },
    },
  };

  return (
    <section
      id="servicos"
      className="section-auto-contain pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-20 bg-[#090D16]/30 backdrop-blur-[0.5px] relative"
    >
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-indigo-500/[0.07] blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/[0.07] blur-[130px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative w-full">
        {/* Cabeçalho da Seção */}
        <div>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/[0.08] text-indigo-300 text-xs sm:text-sm font-semibold uppercase">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>SERVIÇOS & CONDIÇÕES COMERCIAIS</span>
            </div>
            <SplitLines
              as="h2"
              text="Formatos sob medida com pagamento flexível"
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance leading-tight"
            />
            <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
              Cada projeto recebe um orçamento personalizado considerando escopo, seções e conteúdo necessário. Sem mensalidades surpresa e com opções de parcelamento no cartão ou desconto à vista no PIX.
            </p>
          </div>

          {/* Grid dos 3 Serviços */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 min-w-0 items-stretch lg:grid-rows-[repeat(5,auto)] service-list p-0.5 overflow-visible"
          >
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              const ctaUrl = whatsappUrl(service.ctaMessage);

              return (
                <BiReveal
                  key={service.id}
                  direction={index === 0 ? 'left' : index === 1 ? 'right' : 'up'}
                  index={index}
                  className="h-full w-full min-w-0 max-w-full lg:row-span-5 lg:grid lg:grid-rows-subgrid scroll-snap-card card-snap-item"
                >
                  <Interactive3DCard maxTilt={1.2} allowDrag={true} animatedBorder={index === 0} className="h-full w-full min-w-0 max-w-full lg:row-span-5 lg:grid lg:grid-rows-subgrid">
                    <article
                      className="glass-card-interactive surface-card service-card scroll-perf-card scroll-snap-card card-snap-item relative rounded-2xl bg-[#090E23] border border-blue-500/20 hover:border-blue-400/50 p-5 sm:p-6 md:p-8 flex flex-col space-y-5 lg:space-y-0 lg:row-span-5 lg:grid lg:grid-rows-subgrid shadow-2xl shadow-black/80 bracket-panel transition-all h-full w-full min-w-0 max-w-full box-border"
                    >
                      {/* Linha 1: Topo do card + Título + Descrição com Fade-In suave */}
                      <div className="space-y-4 lg:pb-4">
                        <div className="flex items-center justify-between gap-2.5 min-w-0">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.25)]">
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                          </div>
                          <span className="text-[10px] min-[380px]:text-xs font-mono text-blue-300 bg-blue-950/90 px-2.5 min-[380px]:px-3 py-1 rounded-full border border-blue-500/40 font-medium whitespace-nowrap shrink-0">
                            {service.badge}
                          </span>
                        </div>

                        <FadeInBlock delay={40}>
                          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
                            {service.title}
                          </h3>
                          <p className="text-sm text-slate-300 leading-relaxed font-normal">
                            {service.description}
                          </p>
                        </FadeInBlock>
                      </div>

                      {/* Linha 2: Bloco INCLUI com Fade-In suave */}
                      <FadeInBlock delay={80} className="space-y-2.5 pt-4 border-t border-white/[0.06] lg:pb-4">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                          INCLUI:
                        </span>
                        <div className="grid grid-cols-1 gap-2 text-sm text-slate-300 service-list scroll-perf-list">
                          {service.includes.map((item) => (
                            <div key={item} className="flex items-start gap-2">
                              <CheckCircle2
                                className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span className="text-xs sm:text-sm leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>
                      </FadeInBlock>

                      {/* Linha 3: Caixa de Nota Sutil com Fade-In suave */}
                      <FadeInBlock delay={110} className="lg:py-3">
                        <div className="rounded-xl border border-white/[0.06] bg-slate-950/70 p-3">
                          <div className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{service.scopeNote}</span>
                          </div>
                        </div>
                      </FadeInBlock>

                      {/* Linha 4: Bloco NÃO INCLUSO com Fade-In suave */}
                      <FadeInBlock delay={130} className="space-y-2 pt-4 border-t border-white/[0.06] lg:pb-4">
                        {service.excluded && (
                          <>
                            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                              NÃO INCLUSO:
                            </span>
                            <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-400 service-list scroll-perf-list">
                              {service.excluded.map((item) => (
                                <div key={item} className="flex items-start gap-2">
                                  <XCircle
                                    className="w-4 h-4 text-slate-500 shrink-0 mt-0.5"
                                    aria-hidden="true"
                                  />
                                  <span className="leading-snug">{item}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </FadeInBlock>

                      {/* Linha 5: Orçamento Personalizado & CTA (inicia na mesma posição vertical) */}
                      <div className="pt-4 border-t border-white/[0.08] space-y-4 flex flex-col justify-end">
                        <FadeInBlock delay={150} className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">
                              Proposta Comercial
                            </span>
                            <span className="text-[11px] text-emerald-400 font-mono font-medium">
                              Orçamento Específico
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Definido por escopo, páginas e urgência. Pagamento facilitado em até 5x sem juros ou desconto no PIX.
                          </p>
                        </FadeInBlock>

                        <MagneticButton
                          href={ctaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          strength={3}
                          glowColor="rgba(99, 102, 241, 0.4)"
                          className="cta-primary w-full inline-flex items-center justify-center text-center gap-1.5 sm:gap-2 py-3.5 px-3 sm:px-4 rounded-xl text-xs sm:text-[13px] md:text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-600/25 min-h-12"
                          ariaLabel={service.ctaLabel}
                        >
                          <WhatsAppIcon className="w-4 h-4 text-emerald-300 shrink-0" />
                          <span className="text-center">{service.ctaLabel}</span>
                        </MagneticButton>
                      </div>
                    </article>
                  </Interactive3DCard>
                </BiReveal>
              );
            })}
          </div>

          {/* Navegação para a Seção Sobre / Soluções Web */}
          <div className="mt-8 sm:mt-10 text-center">
            <button
              type="button"
              onClick={() => {
                if (window.location.hash === '#solucoes-web') {
                  const el = document.getElementById('solucoes-web');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.hash = 'solucoes-web';
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_18px_rgba(34,211,238,0.35)] hover:scale-102 active:scale-98 uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>CONHECER NOSSAS ESPECIALIDADES NA SEÇÃO &apos;SOBRE&apos;</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SEÇÃO DESTACADA: CONDIÇÕES DE PAGAMENTO ATUALIZADAS */}
          <div className="mt-14 sm:mt-20">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <div className="mb-4">
                <span className="inline-block text-xs font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-semibold">
                  Formas de Pagamento Transparentes
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Como funciona o pagamento na ēloSites
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-300">
                Você escolhe a melhor modalidade financeira para o momento da sua empresa, com total segurança e clareza contratual.
              </p>
            </div>

            {/* 4 Blocos de Regras Comerciais com transição de entrada dinâmica ao rolar */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 service-list scroll-perf-list scroll-snap-y-container card-list-container"
            >
              {/* Regra 1: 50% Entrada + 50% Final */}
              <BiReveal
                direction="left"
                index={0}
                className="h-full scroll-snap-card card-snap-item"
              >
                <Interactive3DCard maxTilt={1.0} className="h-full">
                  <div className="glass-card-interactive surface-card service-card scroll-perf-card scroll-snap-card card-snap-item relative rounded-2xl bg-[#090E23] border border-blue-500/20 hover:border-blue-400/50 p-5 sm:p-6 flex flex-col justify-between h-full shadow-2xl shadow-black/80 bracket-panel transition-all">
                    <FadeInBlock delay={40} className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                        <Split className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white">50% Início + 50% Entrega</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        50% no momento da contratação para iniciar imediatamente o desenvolvimento e 50% restante após a entrega e aprovação final (via PIX).
                      </p>
                    </FadeInBlock>
                    <div className="mt-auto pt-4">
                      <div className="text-[11px] font-mono text-blue-300 bg-blue-950/40 px-2.5 py-1 rounded border border-blue-500/20 text-center">
                        Ideal para fluxo de caixa
                      </div>
                    </div>
                  </div>
                </Interactive3DCard>
              </BiReveal>

              {/* Regra 2: 20% de Desconto à Vista */}
              <BiReveal
                direction="right"
                index={1}
                className="h-full scroll-snap-card card-snap-item"
              >
                <Interactive3DCard maxTilt={1.0} className="h-full">
                  <div className="glass-card-interactive surface-card service-card scroll-perf-card scroll-snap-card card-snap-item relative rounded-2xl bg-[#090E23] border border-emerald-500/40 hover:border-emerald-400/70 p-5 sm:p-6 flex flex-col justify-between h-full shadow-2xl shadow-black/80 bracket-panel transition-all bg-gradient-to-b from-emerald-950/20 to-[#090E23]">
                    <FadeInBlock delay={60} className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/90 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <Percent className="w-5 h-5" />
                      </div>
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <h4 className="text-base font-bold text-white">20% de Desconto à Vista</h4>
                        <span className="text-[10px] font-bold uppercase bg-emerald-500 text-black px-2 py-0.5 rounded whitespace-nowrap">
                          Maior economia
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Pagamento integral à vista no momento do fechamento garante 20% de desconto direto sobre o valor total do projeto orçado.
                      </p>
                    </FadeInBlock>
                    <div className="mt-auto pt-4">
                      <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/20 text-center">
                        Economize 1/5 do investimento
                      </div>
                    </div>
                  </div>
                </Interactive3DCard>
              </BiReveal>

              {/* Regra 3: Cartão até 5x sem juros */}
              <BiReveal
                direction="left"
                index={2}
                className="h-full scroll-snap-card card-snap-item"
              >
                <Interactive3DCard maxTilt={1.0} className="h-full">
                  <div className="glass-card-interactive surface-card service-card scroll-perf-card scroll-snap-card card-snap-item relative rounded-2xl bg-[#090E23] border border-blue-500/20 hover:border-blue-400/50 p-5 sm:p-6 flex flex-col justify-between h-full shadow-2xl shadow-black/80 bracket-panel transition-all">
                    <FadeInBlock delay={80} className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white">Até 5x Sem Juros no Cartão</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Aceitamos cartão de crédito em até 5 vezes sem nenhum juro para você (sendo 1 entrada + 4 parcelas mensais fixas).
                      </p>
                    </FadeInBlock>
                    <div className="mt-auto pt-4">
                      <div className="text-[11px] font-mono text-blue-300 bg-blue-950/40 px-2.5 py-1 rounded border border-blue-500/20 text-center">
                        1 Entrada + 4 Parcelas Fixas
                      </div>
                    </div>
                  </div>
                </Interactive3DCard>
              </BiReveal>

              {/* Regra 4: Cartão de 6x a 12x */}
              <BiReveal
                direction="right"
                index={3}
                className="h-full scroll-snap-card card-snap-item"
              >
                <Interactive3DCard maxTilt={1.0} className="h-full">
                  <div className="glass-card-interactive surface-card service-card scroll-perf-card scroll-snap-card card-snap-item relative rounded-2xl bg-[#090E23] border border-blue-500/20 hover:border-blue-400/50 p-5 sm:p-6 flex flex-col justify-between h-full shadow-2xl shadow-black/80 bracket-panel transition-all">
                    <FadeInBlock delay={100} className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white">De 6x até 12x no Cartão</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Para parcelamentos mais longos, viabilizamos de 6x até 12x no cartão de crédito, com repasse das taxas de juros da operadora para o cliente.
                      </p>
                    </FadeInBlock>
                    <div className="mt-auto pt-4">
                      <div className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-white/[0.05] text-center">
                        Parcelas mínimas mensais
                      </div>
                    </div>
                  </div>
                </Interactive3DCard>
              </BiReveal>
            </div>

            {/* SIMULADOR INTERATIVO DE CONDIÇÕES */}
            <BiReveal direction="up" delay={150} className="mt-8 w-full">
              <Interactive3DCard maxTilt={0} className="w-full">
                <div className="glass-card-interactive surface-card service-card scroll-perf-card relative rounded-2xl bg-[#090E23] border border-blue-500/25 hover:border-blue-400/50 p-6 sm:p-8 shadow-2xl shadow-black/80 bracket-panel transition-all">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                  <FadeInBlock delay={30} className="space-y-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase">
                      <Calculator className="w-4 h-4" />
                      <span>Simulador de Condições de Pagamento</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold text-white">
                      Simule as formas de pagamento com base no orçamento
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Arraste o controle ou escolha um valor de referência para visualizar a economia à vista e as parcelas.
                    </p>
                  </FadeInBlock>

                  <div className="flex flex-wrap items-center gap-2 justify-center">
                    {[
                      { label: 'R$ 650', value: 650 },
                      { label: 'R$ 1.000', value: 1000 },
                      { label: 'R$ 1.500', value: 1500 },
                      { label: 'R$ 2.200', value: 2200 },
                    ].map((preset) => {
                      const isActive = simulatedValue === preset.value;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setSimulatedValue(preset.value)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] cursor-pointer ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)] border border-blue-400/40'
                              : 'bg-slate-900 text-slate-300 hover:text-white border border-white/[0.08]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slider de Valor */}
                <div className="py-6 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">Valor orçado simulado:</span>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-indigo-300">
                      R$ {simulatedValue.toLocaleString('pt-BR')},00
                    </span>
                  </div>
                  <input
                    type="range"
                    min="600"
                    max="3500"
                    step="50"
                    value={simulatedValue}
                    onChange={(e) => setSimulatedValue(Number(e.target.value))}
                    aria-label="Simular valor do orçamento"
                    className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>R$ 600</span>
                    <span>R$ 2.000</span>
                    <span>R$ 3.500</span>
                  </div>
                </div>

                {/* Grid de Resultados da Simulação */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {/* Resultado À Vista */}
                  <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/30 space-y-1">
                    <span className="text-xs font-semibold text-emerald-400 uppercase">
                      ⚡ À Vista (20% OFF)
                    </span>
                    <p className="text-2xl font-bold font-mono text-emerald-300">
                      R$ {discountValue.toLocaleString('pt-BR')},00
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Economia imediata de <strong className="text-white">R$ {(simulatedValue - discountValue).toLocaleString('pt-BR')}</strong> via PIX
                    </p>
                  </div>

                  {/* Resultado 50% / 50% */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-white/[0.08] space-y-1">
                    <span className="text-xs font-semibold text-indigo-400 uppercase">
                      💎 50% Início + 50% Entrega
                    </span>
                    <p className="text-2xl font-bold font-mono text-white">
                      2x R$ {pixSplitFirst.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      1ª parcela na contratação e 2ª na entrega final (PIX)
                    </p>
                  </div>

                  {/* Resultado Cartão 5x */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-white/[0.08] space-y-1">
                    <span className="text-xs font-semibold text-indigo-400 uppercase">
                      💳 Cartão até 5x Sem Juros
                    </span>
                    <p className="text-2xl font-bold font-mono text-white">
                      5x R$ {installment5x}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      1 entrada + 4 parcelas no cartão sem nenhum acréscimo
                    </p>
                  </div>
                </div>

                {/* Ação direta da simulação */}
                <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-slate-400 text-center sm:text-left">
                    * Valores calculados para fins de demonstração. Cada proposta oficial detalha prazos e entregáveis específicos.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    {onNavigateToOrcamento && (
                      <button
                        type="button"
                        onClick={onNavigateToOrcamento}
                        className="w-full sm:w-auto min-h-12 sm:min-h-0 inline-flex items-center justify-center text-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/40 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 cursor-pointer"
                      >
                        <span className="text-center">Montar Briefing</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <a
                      href={whatsappUrl(
                        `Olá! 💰 Simulei uma condição de pagamento no site da *ēloSites* (valor base estimado em *R$ ${simulatedValue.toLocaleString('pt-BR')},00*).\n\nGostaria de receber um orçamento oficial com o escopo detalhado para o meu projeto!`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto min-h-12 sm:min-h-0 inline-flex items-center justify-center text-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] border border-emerald-400/30 transition-all duration-200 hover:scale-105 shadow-md shadow-emerald-950/40"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-white" />
                      <span className="text-center">Pedir Proposta com Esta Condição</span>
                    </a>
                  </div>
                </div>
              </div>
            </Interactive3DCard>
          </BiReveal>
        </div>
        </div>

        {/* Rodapé institucional com aviso de hospedagem e domínio */}
        <div className="mt-12 sm:mt-16 max-w-3xl mx-auto rounded-2xl border border-white/[0.07] bg-slate-950/50 p-5 sm:p-6 space-y-2 text-xs sm:text-sm text-slate-400 leading-relaxed text-center">
          <p>
            <ShieldCheck className="w-4 h-4 text-indigo-400 inline-block mr-1.5" />
            A entrega padrão é o site publicado e testado na infraestrutura Netlify. O registro de domínio personalizado (.com.br, .com) é realizado diretamente em nome e conta do cliente para garantir 100% de titularidade.
          </p>
        </div>
      </div>
    </section>
  );
};
