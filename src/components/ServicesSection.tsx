import React from 'react';
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
    badge: 'Página Única (Foco em WhatsApp)',
    title: 'Landing Page',
    description:
      'Uma página única, direta e prática para apresentar o seu trabalho e levar o visitante a chamar você no WhatsApp. É a opção ideal para quem quer começar rápido sem complicações.',
    icon: Target,
    includes: [
      'Estrutura em página única pensada para leitura rápida',
      'Apresentação clara dos seus serviços ou produtos',
      'Destaque para diferenciais e benefícios do seu negócio',
      'Depoimentos e avaliações de clientes reais (quando fornecidos)',
      'Galeria com fotos do seu trabalho',
      'Perguntas frequentes (FAQ) para tirar dúvidas comuns',
      'Botões de WhatsApp chamativos em pontos estratégicos',
      'Formulário simples de contato (conforme o escopo contratado)',
      'Links para suas redes sociais',
      'Design responsivo adaptado para celulares, tablets e computadores',
      'Boas práticas de SEO técnico e cartões para redes sociais',
      'Publicação no ar e testes de funcionamento antes da entrega',
    ],
    scopeNote: 'O que será desenvolvido é detalhado na proposta e no contrato antes de começar.',
    excluded: [
      'Registro do domínio (endereço .com.br)',
      'Hospedagem em outros servidores (o site é publicado na Netlify)',
      'Criação de logotipo do zero',
      'Páginas extras fora do escopo combinado',
    ],
    ctaLabel: 'Pedir proposta de Landing Page',
    ctaId: 'service-cta-landing-page',
    ctaMessage: SITE_CONFIG.landingPageWhatsappMessage,
  },
  {
    id: 'site-institucional',
    badge: 'Empresa Completa (Várias Páginas)',
    title: 'Site Institucional',
    description:
      'Estrutura completa com várias seções e navegação entre páginas. Perfeito para empresas que precisam mostrar equipe, história, detalhes dos serviços e localização.',
    icon: Building2,
    includes: [
      'Página inicial com resumo dos principais destaques',
      'Página Sobre com a história e a credibilidade da sua empresa',
      'Páginas individuais para detalhar cada serviço',
      'Seção de diferenciais e motivos para escolher seu negócio',
      'Portfólio com projetos realizados ou fotos do estabelecimento',
      'Depoimentos e avaliações reais de clientes',
      'Perguntas frequentes (FAQ) bem explicadas',
      'Endereço, mapa de localização e canais de atendimento',
      'Botões de WhatsApp e links para redes sociais',
      'Formulário de contato com envio de mensagens (conforme o escopo contratado)',
      'Design responsivo adaptado para celulares, tablets e computadores',
      'Boas práticas de SEO técnico e cartões de compartilhamento',
      'Publicação no ar e testes completos de funcionamento',
    ],
    scopeNote:
      'A quantidade de páginas, seções e botões é combinada com clareza no orçamento.',
    excluded: [
      'Registro do domínio (endereço .com.br)',
      'Hospedagem em outros servidores (o site é publicado na Netlify)',
      'Criação de logotipo do zero',
      'Integrações com sistemas externos não combinados',
    ],
    ctaLabel: 'Pedir proposta de Site Institucional',
    ctaId: 'service-cta-institucional',
    ctaMessage: SITE_CONFIG.siteInstitucionalWhatsappMessage,
  },
];

interface ServicesSectionProps {
  onNavigateToOrcamento?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigateToOrcamento }) => {
  // Detecção de preferências de acessibilidade e redução de movimento
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

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

          {/* Grid dos 2 Serviços */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 lg:gap-8 max-w-5xl mx-auto min-w-0 items-stretch md:grid-rows-[repeat(5,auto)] service-list p-0.5 overflow-visible"
          >
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              const ctaUrl = whatsappUrl(service.ctaMessage);

              return (
                <BiReveal
                  key={service.id}
                  direction={index === 0 ? 'left' : 'right'}
                  index={index}
                  className="h-full w-full min-w-0 max-w-full md:row-span-5 md:grid md:grid-rows-subgrid scroll-snap-card card-snap-item"
                >
                  <Interactive3DCard maxTilt={1.2} allowDrag={true} animatedBorder={index === 0} className="h-full w-full min-w-0 max-w-full md:row-span-5 md:grid md:grid-rows-subgrid">
                    <article
                      className="glass-card-interactive surface-card service-card scroll-perf-card scroll-snap-card card-snap-item relative rounded-2xl bg-[#090E23] border border-blue-500/20 hover:border-blue-400/50 p-5 sm:p-6 md:p-8 flex flex-col space-y-5 md:space-y-0 md:row-span-5 md:grid md:grid-rows-subgrid shadow-2xl shadow-black/80 bracket-panel transition-all h-full w-full min-w-0 max-w-full box-border"
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

          {/* Navegação para a Seção de Especialidades Web */}
          <div className="mt-8 sm:mt-10 text-center">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('solucoes-web');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.hash = 'solucoes-web';
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_18px_rgba(34,211,238,0.35)] hover:scale-102 active:scale-98 uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ver todas as especialidades e capacidades técnicas</span>
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

            {/* Bloco de Orçamento Personalizado sob Medida */}
            <BiReveal direction="up" delay={150} className="mt-8 w-full">
              <Interactive3DCard maxTilt={0} className="w-full">
                <div className="glass-card-interactive surface-card service-card scroll-perf-card relative rounded-2xl bg-[#090E23] border border-blue-500/25 hover:border-blue-400/50 p-6 sm:p-8 shadow-2xl shadow-black/80 bracket-panel transition-all">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <FadeInBlock delay={30} className="space-y-2 text-center lg:text-left">
                      <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase">
                        <Sparkles className="w-4 h-4" />
                        <span>Orçamento Sob Medida</span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-bold text-white">
                        Cada projeto é orçado conforme suas necessidades reais
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                        Analisamos o objetivo da sua empresa, a quantidade de seções e o escopo de conteúdo para formular uma proposta clara e sem surpresas. Preencha o briefing ou fale diretamente conosco pelo WhatsApp.
                      </p>
                    </FadeInBlock>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
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
                          'Olá! Gostaria de solicitar um orçamento personalizado para o meu projeto com a ēloSites.'
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto min-h-12 sm:min-h-0 inline-flex items-center justify-center text-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] border border-emerald-400/30 transition-all duration-200 hover:scale-105 shadow-md shadow-emerald-950/40"
                      >
                        <WhatsAppIcon className="w-4 h-4 text-white" />
                        <span className="text-center">Conversar no WhatsApp</span>
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
            A entrega inclui o site publicado no ar e testado no servidor seguro da Netlify. O registro do seu endereço na internet (domínio .com.br ou .com) é feito diretamente em sua própria conta e nome para garantir que o site seja sempre 100% seu.
          </p>
        </div>
      </div>
    </section>
  );
};
