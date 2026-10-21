import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  RotateCw,
  Pause,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SplitLines } from './SplitLines';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { shouldReduceMedia } from '../mediaPrefs';
import { getDynamicCardVariants } from '../motionVariants';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  companyOrProject: string;
  category: string;
  projectUrl: string;
  quote: string;
  rating: number;
}

export type TestimonialCategoryTag = 'all' | 'landing' | 'institutional' | 'app';

export const TESTIMONIAL_TAGS: { id: TestimonialCategoryTag; label: string }[] = [
  { id: 'all', label: 'Todos os formatos' },
  { id: 'landing', label: 'Landing Page' },
  { id: 'institutional', label: 'Site Institucional' },
  { id: 'app', label: 'Aplicação Web' },
];

// Avaliações autênticas dos clientes reais da ēloSites (dados estritamente preservados)
export const CLIENT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'jv-salvaia',
    name: 'João Victor Salvaia',
    role: 'Personal Trainer & Consultor Online',
    companyOrProject: 'JV Salvaia Personal Trainer',
    category: 'Landing Page de Alta Conversão',
    projectUrl: 'https://jvsalvaiapersonal.netlify.app',
    quote:
      'Gostei muito do resultado do site! Ficou profissional, moderno e com a identidade do meu trabalho como personal trainer. Agora consigo apresentar melhor meus serviços e transmitir mais confiança para quem está buscando um profissional para acompanhar seus treinos. O resultado ficou muito bom!',
    rating: 5,
  },
  {
    id: 'toledo-seguranca',
    name: 'Jonathan Toledo',
    role: 'Proprietário & Diretor Operacional',
    companyOrProject: 'Toledo Segurança',
    category: 'Site Institucional Corporativo',
    projectUrl: 'https://toledoseguranca.netlify.app/',
    quote:
      'O desenvolvimento do site da Toledo Segurança ficou excelente! O projeto transmitiu a seriedade e o profissionalismo que eu queria passar para os nossos clientes. Ter um site próprio faz diferença na apresentação da empresa e fortalece nossa presença na internet. Fiquei muito satisfeito com o resultado e com o trabalho realizado.',
    rating: 5,
  },
  {
    id: 'duelo-fim-de-ano',
    name: 'Renato Becala',
    role: 'Comissão Organizadora',
    companyOrProject: 'Duelo de Fim de Ano — Badem vs Becala',
    category: 'Aplicação Web & Plataforma de Evento',
    projectUrl: 'https://jogodefimdeano.netlify.app',
    quote:
      'A landing page para o nosso evento de fim de ano ficou muito bacana! A proposta era ter uma página que reunisse as principais informações do evento de forma organizada e atrativa, e o resultado atendeu muito bem à ideia. Ficou uma apresentação moderna, prática e com a cara do nosso encontro. Com certeza fez o evento ter uma presença digital ainda mais especial!',
    rating: 5,
  },
];

const getInitials = (fullName: string) => {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
};

interface TestimonialsSectionProps {
  onNavigateToServices?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onNavigateToServices,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TestimonialCategoryTag>('all');
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  // Detecção de preferências de acessibilidade e redução de movimento
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  const cardVariants = getDynamicCardVariants(prefersReduced);

  const testimonials = CLIENT_TESTIMONIALS.filter((item) => {
    if (selectedTag === 'all') return true;
    if (selectedTag === 'landing') return item.category.toLowerCase().includes('landing');
    if (selectedTag === 'institutional') return item.category.toLowerCase().includes('institucional');
    if (selectedTag === 'app') return item.category.toLowerCase().includes('aplica');
    return true;
  });
  const total = testimonials.length;

  // Instanciação do plugin Autoplay do Embla (5 segundos de intervalo, pausa suave em hover/interação)
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  // Configuração do Embla Carousel com loop adaptativo e aceleração suave
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: total > 1,
      align: 'center',
      skipSnaps: false,
      duration: 35,
    },
    prefersReduced ? [] : [autoplayPlugin.current]
  );

  // Ao alternar a tag de filtro, reinicia para o primeiro depoimento
  useEffect(() => {
    setSelectedIndex(0);
    if (emblaApi) {
      requestAnimationFrame(() => {
        emblaApi.reInit();
        emblaApi.scrollTo(0, true);
      });
    }
  }, [selectedTag, emblaApi, total]);

  // Detecção de viewport para calibrar ângulos da perspectiva 3D
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sincronização do slide ativo e do estado de reprodução do Autoplay
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    const autoplay = emblaApi.plugins()?.autoplay;
    if (autoplay) {
      setIsPlaying(autoplay.isPlaying());
      const onPlay = () => setIsPlaying(true);
      const onStop = () => setIsPlaying(false);

      emblaApi.on('autoplay:play' as any, onPlay);
      emblaApi.on('autoplay:stop' as any, onStop);

      return () => {
        emblaApi.off('select', onSelect);
        emblaApi.off('reInit', onSelect);
        emblaApi.off('autoplay:play' as any, onPlay);
        emblaApi.off('autoplay:stop' as any, onStop);
      };
    }

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Controles manuais de navegação
  const scrollPrev = useCallback(() => {
    if (emblaApi && total > 1) emblaApi.scrollPrev();
  }, [emblaApi, total]);

  const scrollNext = useCallback(() => {
    if (emblaApi && total > 1) emblaApi.scrollNext();
  }, [emblaApi, total]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const isFocusPausedRef = useRef(false);
  const isManuallyPausedRef = useRef(false);

  // Alternar play/pause manual do autoplay
  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    if (autoplay.isPlaying()) {
      autoplay.stop();
      isManuallyPausedRef.current = true;
      isFocusPausedRef.current = false;
      setIsPlaying(false);
    } else {
      autoplay.play();
      isManuallyPausedRef.current = false;
      isFocusPausedRef.current = false;
      setIsPlaying(true);
    }
  }, [emblaApi]);

  // Pausa automática da rotação quando o usuário navega com a tecla Tab para dentro do carrossel
  const handleFocusCapture = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay || isManuallyPausedRef.current) return;

    if (autoplay.isPlaying()) {
      autoplay.stop();
      isFocusPausedRef.current = true;
      setIsPlaying(false);
    }
  }, [emblaApi]);

  // Retomada automática da rotação quando o foco sai completamente do carrossel
  const handleBlurCapture = useCallback(
    (e: React.FocusEvent) => {
      const nextTarget = e.relatedTarget as Node | null;
      const isStillInside = carouselContainerRef.current?.contains(nextTarget);

      if (!isStillInside && isFocusPausedRef.current && !isManuallyPausedRef.current) {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (autoplay && !autoplay.isPlaying()) {
          autoplay.play();
          isFocusPausedRef.current = false;
          setIsPlaying(true);
        }
      }
    },
    [emblaApi]
  );

  // Suporte a teclado acessível (setas direcionais esquerda e direita)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || total <= 1) return;

      const activeElement = document.activeElement;
      const isInput =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.tagName === 'SELECT';

      if (isInput) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext, total]
  );

  // Cálculo da distância relativa no carrossel circular (-1, 0, 1)
  const getRelativeOffset = (idx: number) => {
    if (total <= 1) return 0;
    let diff = (idx - selectedIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section
      id="avaliacoes"
      aria-label="Avaliações de Clientes e Prova Social"
      className="section-auto-contain pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 bg-[#050814] relative border-t border-blue-500/15 overflow-hidden"
    >
      {/* Luzes ambiente de fundo azul elétrico e cobalto */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/[0.08] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/[0.08] blur-[150px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção com Reveal Suave */}
        <motion.div
          initial={
            prefersReduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          whileInView={
            prefersReduced
              ? { opacity: 1, y: 0 }
              : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: prefersReduced ? 0 : 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-3xl mx-auto text-center space-y-3 mb-8 sm:mb-10"
        >
          <div className="section-kicker inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase shadow-[0_0_15px_rgba(59,130,246,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
            <span>Social Proof & Clientes Reais</span>
          </div>

          <SplitLines
            as="h2"
            text="O que dizem os clientes que colocaram o site no ar"
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight"
          />

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Depoimentos autênticos de quem confiou na ēloSites para construir sua presença digital com <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#a855f7] font-semibold">código profissional</span>, performance máxima e foco em conversão.
          </p>

          {/* Destaque de métricas de confiabilidade */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/[0.08] shadow-sm">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" aria-hidden="true" />
                ))}
              </div>
              <span className="font-semibold text-white">5.0 / 5.0</span>
              <span className="text-slate-400">• Avaliação máxima</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/[0.08] shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span className="text-slate-300">Projetos reais entregues no Netlify</span>
            </div>
          </div>
        </motion.div>

        {/* Filtro por Formato de Serviço */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 px-2">
          {TESTIMONIAL_TAGS.map((tag) => {
            const isTagActive = selectedTag === tag.id;
            const count =
              tag.id === 'all'
                ? CLIENT_TESTIMONIALS.length
                : CLIENT_TESTIMONIALS.filter((t) => {
                    if (tag.id === 'landing') return t.category.toLowerCase().includes('landing');
                    if (tag.id === 'institutional') return t.category.toLowerCase().includes('institucional');
                    if (tag.id === 'app') return t.category.toLowerCase().includes('aplica');
                    return true;
                  }).length;

            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTag(tag.id)}
                className={`relative px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
                  isTagActive
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-400/50 shadow-[0_0_14px_rgba(59,130,246,0.3)]'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/20'
                }`}
                aria-pressed={isTagActive}
              >
                <span>{tag.label}</span>
                <span className="ml-1.5 text-[10px] opacity-75 font-mono">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            ESTÁGIO EMBLA CAROUSEL COM EFEITO GIRATÓRIO EM FORMA DE CILINDRO 3D
           ========================================================================= */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
          className="w-full"
        >
          <div
            ref={carouselContainerRef}
            data-testimonials-carousel
            role="region"
            aria-roledescription="carousel"
            aria-label="Carrossel Cilíndrico de Depoimentos"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onFocusCapture={handleFocusCapture}
            onBlurCapture={handleBlurCapture}
            className="relative max-w-5xl mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 rounded-2xl"
          >
          {/* Viewport do Embla Carousel com perspectiva cilíndrica */}
          <div
            className="overflow-hidden py-3 cursor-grab active:cursor-grabbing"
            ref={emblaRef}
            style={{
              perspective: prefersReduced ? 'none' : '1400px',
              perspectiveOrigin: 'center center',
            }}
          >
            <div
              className="flex -mx-2 sm:-mx-3"
              style={{
                transformStyle: prefersReduced ? 'flat' : 'preserve-3d',
              }}
            >
              {testimonials.map((item, idx) => {
                const offset = getRelativeOffset(idx);
                const isActive = offset === 0;

                // Efeito giratório em cilindro 3D
                const cylinderAngle = offset * (isMobile ? 26 : 34);
                const translateZ = isActive ? 0 : -(isMobile ? 55 : 80) * Math.min(2, Math.abs(offset));
                const scale = isActive ? 1 : 0.88 - Math.max(0, Math.abs(offset) - 1) * 0.08;
                const opacity = isActive ? 1 : 0.52 - Math.max(0, Math.abs(offset) - 1) * 0.22;
                const zIndex = isActive ? 30 : 20 - Math.abs(offset);

                return (
                  <div
                    key={item.id}
                    className="flex-[0_0_88%] sm:flex-[0_0_72%] md:flex-[0_0_60%] lg:flex-[0_0_50%] max-w-[520px] min-w-0 px-2 sm:px-3"
                    style={{
                      transformStyle: prefersReduced ? 'flat' : 'preserve-3d',
                      zIndex,
                    }}
                    onFocus={() => {
                      if (selectedIndex !== idx) {
                        scrollTo(idx);
                      }
                    }}
                  >
                    {/* Card compacto de depoimento com rotação em cilindro e centralização ao clicar */}
                    <div
                      onClick={() => {
                        scrollTo(idx);
                      }}
                      style={{
                        transform: prefersReduced
                          ? `scale(${isActive ? 1 : 0.92})`
                          : `rotateY(${cylinderAngle}deg) translateZ(${translateZ}px) scale(${scale})`,
                        opacity,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transformStyle: prefersReduced ? 'flat' : 'preserve-3d',
                        transition: prefersReduced
                          ? 'opacity 0.2s ease, transform 0.2s ease'
                          : 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      className={`relative rounded-2xl bracket-panel overflow-hidden [backface-visibility:hidden] select-none flex flex-col justify-between ${
                        isActive
                          ? 'bg-[#090E23] border border-blue-500/60 shadow-[0_12px_36px_-6px_rgba(59,130,246,0.4)] ring-1 ring-blue-400/40 cursor-default'
                          : 'bg-[#060A1A]/90 border border-blue-500/15 hover:border-blue-400/40 shadow-xl cursor-pointer hover:opacity-85'
                      }`}
                      aria-label={`Depoimento de ${item.name}`}
                    >
                      {/* Brilho sutil no topo do card ativo */}
                      {isActive && (
                        <div
                          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-blue-500/[0.14] via-indigo-500/[0.04] to-transparent"
                          aria-hidden="true"
                        />
                      )}

                      {/* Dica de clique para focar no card lateral */}
                      {!isActive && !prefersReduced && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[1px] opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-blue-400/50 text-blue-300 text-xs font-semibold shadow-lg">
                            <RotateCw className="w-3.5 h-3.5 text-blue-400" />
                            Girar e centralizar
                          </span>
                        </div>
                      )}

                      {/* Conteúdo compacto com altura otimizada */}
                      <div className="p-4 sm:p-5 flex flex-col justify-between space-y-3 relative z-10">
                        {/* Top Bar do Card: Categoria, Estrelas e Contador */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/[0.08]">
                          <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-400/30 text-blue-300 text-[10px] sm:text-[11px] font-semibold">
                              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" aria-hidden="true" />
                              <span>{item.category}</span>
                            </div>

                            <div className="hidden min-[420px]:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                              <span>VERIFICADO</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* 5 Estrelas Douradas */}
                            <div
                              className="flex items-center gap-0.5 text-amber-400"
                              title={`Classificação ${item.rating} de 5 estrelas`}
                            >
                              {[...Array(item.rating)].map((_, starIdx) => (
                                <Star
                                  key={starIdx}
                                  className="w-3 h-3 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]"
                                  aria-hidden="true"
                                />
                              ))}
                            </div>

                            {/* Contador de Slides */}
                            <div className="font-mono text-[10px] text-blue-300 px-1.5 py-0.5 rounded bg-slate-900/90 border border-blue-500/20">
                              0{idx + 1} / 0{total}
                            </div>
                          </div>
                        </div>

                        {/* Citação compacta e elegante */}
                        <div className="relative flex-1 flex flex-col justify-center">
                          <Quote className="w-4 h-4 text-blue-400/30 mb-1 shrink-0" aria-hidden="true" />
                          <blockquote className="text-xs sm:text-[13px] md:text-sm text-slate-100 leading-snug italic border-l-2 border-blue-500/40 pl-3">
                            "{item.quote}"
                          </blockquote>
                        </div>

                        {/* Rodapé compacto com Dados do Cliente */}
                        <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative shrink-0">
                              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-blue-600/30 via-indigo-600/30 to-purple-600/30 border border-blue-400/40 flex items-center justify-center text-blue-200 font-bold font-mono text-xs shadow-inner">
                                {getInitials(item.name)}
                              </div>
                              <CheckCircle2
                                className="w-3 h-3 text-emerald-400 absolute -bottom-1 -right-1 bg-slate-950 rounded-full"
                                aria-hidden="true"
                              />
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-display text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                                {item.name}
                              </h3>
                              <p className="text-[11px] text-blue-300 font-medium truncate">
                                {item.role}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {item.companyOrProject}
                              </p>
                            </div>
                          </div>

                          <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/80 border border-white/[0.06] text-[10px] text-slate-400 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Cliente Verificado</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================================================
              CONTROLES DE ROTAÇÃO E NAVEGAÇÃO DO CARROSSEL EMBLA (Minimalista & Identidade ēloSites)
             ========================================================================= */}
          <div className="mt-5 sm:mt-7 flex flex-wrap items-center justify-between sm:justify-center gap-3 sm:gap-6 px-2">
            {/* Botão Anterior */}
            <button
              type="button"
              onClick={scrollPrev}
              disabled={total <= 1}
              aria-label="Ver depoimento anterior"
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border shadow-sm transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                total <= 1
                  ? 'opacity-30 cursor-not-allowed border-slate-800 text-slate-500'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-purple-500/20 hover:border-purple-400/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] cursor-pointer'
              }`}
            >
              <ChevronLeft className={`w-4 h-4 ${total <= 1 ? 'text-slate-600' : 'text-purple-400 group-hover:text-purple-300 group-hover:-translate-x-0.5'} transition-transform`} />
              <span className="hidden xs:inline text-center">Anterior</span>
            </button>

            {/* Indicadores de Paginação e Status de Auto-Rotação */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Botão de pausa/reprodução da rotação automática */}
              {!prefersReduced && total > 1 && (
                <button
                  type="button"
                  onClick={toggleAutoplay}
                  aria-label={isPlaying ? 'Pausar rotação automática' : 'Iniciar rotação automática'}
                  title={isPlaying ? 'Pausar rotação automática' : 'Iniciar rotação automática'}
                  className="p-1.5 rounded-full bg-slate-900/80 border border-purple-500/20 text-slate-400 hover:text-purple-300 hover:border-purple-400/50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 text-purple-400" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              )}

              {/* Indicadores dos slides minimalistas com identidade visual roxo ēloSites */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-purple-500/15 backdrop-blur-sm"
                role="tablist"
                aria-label="Indicadores dos slides de depoimentos"
              >
                {testimonials.map((t, idx) => {
                  const isCurrent = selectedIndex === idx;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      aria-label={`Depoimento ${idx + 1} de ${total}: ${t.name}`}
                      title={`Depoimento ${idx + 1} de ${total}: ${t.name}`}
                      onClick={() => scrollTo(idx)}
                      disabled={total <= 1}
                      className={`h-2 rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,width,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                        total <= 1
                          ? 'w-6 bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_12px_rgba(168,85,247,0.7)] cursor-default'
                          : isCurrent
                          ? 'w-6 bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_12px_rgba(168,85,247,0.7)] cursor-pointer'
                          : 'w-2 bg-slate-700/80 hover:bg-slate-500 hover:border-purple-400/40 cursor-pointer'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Rótulo de auxílio de teclado */}
              {total > 1 && (
                <span className="hidden md:inline text-[11px] font-mono text-slate-400">
                  ← / → navegue pelas setas
                </span>
              )}
            </div>

            {/* Botão Próximo */}
            <button
              type="button"
              onClick={scrollNext}
              disabled={total <= 1}
              aria-label="Ver próximo depoimento"
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border shadow-sm transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                total <= 1
                  ? 'opacity-30 cursor-not-allowed border-slate-800 text-slate-500'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-purple-500/20 hover:border-purple-400/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] cursor-pointer'
              }`}
            >
              <span className="hidden xs:inline text-center">Próximo</span>
              <ChevronRight className={`w-4 h-4 ${total <= 1 ? 'text-slate-600' : 'text-purple-400 group-hover:text-purple-300 group-hover:translate-x-0.5'} transition-transform`} />
            </button>
          </div>
        </div>
      </motion.div>

        {/* Bloco de Ação Rápida no Rodapé dos Testemunhos */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -40px 0px' }}
          className="glass-card-interactive surface-card mt-10 p-6 sm:p-7 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-cyan-950/40 border border-white/[0.08] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 max-w-4xl mx-auto shadow-2xl shadow-black/60 bracket-panel"
        >
          <div className="space-y-2 text-left w-full lg:max-w-xl">
            <h4 className="font-display text-base sm:text-lg font-bold text-white">
              Quer um site com essa mesma qualidade para o seu negócio?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fale diretamente com quem vai desenvolver seu site, com prazos claros e condições transparentes.
            </p>
          </div>

          <div className="card-action-cluster flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
            {onNavigateToServices && (
              <button
                type="button"
                onClick={onNavigateToServices}
                className="inline-flex items-center justify-center text-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] cursor-pointer"
              >
                <span className="text-center">Ver Serviços & Condições</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <a
              href={whatsappUrl(SITE_CONFIG.portfolioWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary inline-flex items-center justify-center text-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] shadow-lg shadow-cyan-600/20 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-300" />
              <span className="text-center">Conversar no WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
