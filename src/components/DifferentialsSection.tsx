import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { shouldReduceMedia } from '../mediaPrefs';
import {
  Zap,
  User,
  Server,
  TrendingUp,
  CheckCircle2,
  Flame,
  Sparkles,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SplitLines } from './SplitLines';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { Interactive3DCard } from './Interactive3DCard';
import { BiReveal } from './BiReveal';

interface DifferentialsSectionProps {
  onNavigateToPortfolio?: () => void;
}

export const DifferentialsSection: React.FC<DifferentialsSectionProps> = () => {
  const [isInViewport, setIsInViewport] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasPrefetchedRef = useRef(false);

  // Lazy loading dos componentes da seção e prefetch inteligente de mídias de alta resolução
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsInViewport(true);

            // Prefetch inteligente em momento ocioso do navegador para otimizar TTI da próxima navegação
            if (!hasPrefetchedRef.current) {
              hasPrefetchedRef.current = true;
              const prefetchNextMedia = () => {
                const targetImages = [
                  '/portifolio-jvsalvaia-mobile.webp',
                  '/portifolio-toledoseguranca-mobile.webp',
                ];
                targetImages.forEach((src) => {
                  const img = new Image();
                  img.decoding = 'async';
                  img.src = src;
                });
              };

              if (typeof window.requestIdleCallback === 'function') {
                window.requestIdleCallback(prefetchNextMedia, { timeout: 3000 });
              } else {
                window.setTimeout(prefetchNextMedia, 1500);
              }
            }
          }
        }
      },
      {
        rootMargin: '180px 0px 180px 0px',
        threshold: 0.05,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const differentials: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
    isWhatsApp?: boolean;
  }[] = [
    {
      title: 'Código limpo & carregamento ágil',
      description:
        'Desenvolvimento autoral, leve e otimizado para abrir com rapidez no celular e no computador. Sem modelos genéricos ou ferramentas pesadas que deixam a navegação lenta.',
      icon: Zap,
    },
    {
      title: 'Trabalho direto com o fundador',
      description:
        'Você conversa diretamente com quem desenha e programa o site. Sem intermediários, sem ruído na comunicação e com atendimento transparente.',
      icon: User,
    },
    {
      title: 'Tecnologia moderna e publicação estável',
      description:
        'Tecnologia atual e confiável, com entrega padrão do site no ar pela Netlify. O endereço personalizado (como seunegocio.com.br) é registrado em sua própria conta para garantir sua titularidade.',
      icon: Server,
    },
    {
      title: 'Foco em conversão',
      description:
        'Cada seção existe para um motivo comercial: apresentar o serviço com clareza e levar o visitante até o contato.',
      icon: TrendingUp,
    },
    {
      title: 'Mais contexto antes da conversa',
      description:
        'O site apresenta seus serviços, explica seus diferenciais e reúne as informações que o cliente precisa para conhecer melhor seu negócio antes de entrar em contato. Com o WhatsApp integrado, fica mais fácil dar o próximo passo.',
      icon: Flame,
    },
    {
      title: 'WhatsApp em primeiro lugar',
      description:
        'Quando faz sentido para o negócio, o site é pensado para gerar conversa no WhatsApp — com botões no momento certo e mensagens prontas.',
      icon: WhatsAppIcon,
      isWhatsApp: true,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="diferenciais"
      className="section-auto-contain pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-20 bg-[#050814] relative border-t border-blue-500/15 overflow-x-clip"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent pointer-events-none" />

      {/* Luz ambiente de fundo azul elétrico */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-600/[0.08] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-indigo-600/[0.08] blur-[150px] rounded-full pointer-events-none" />

      <div className="page-shell page-x max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção de Diferenciais */}
        <BiReveal direction="up">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 sm:mb-20">
            <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold uppercase shadow-[0_0_15px_rgba(59,130,246,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
              <span>Diferenciais Estratégicos</span>
            </div>
            <SplitLines
              as="h2"
              text="O que muda quando o site é feito para o seu negócio"
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance leading-tight"
            />
            <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
              Menos agência genérica. Mais presença profissional, conversa direta e resultado.
            </p>
          </div>
        </BiReveal>

        {/* Grade 3 Colunas dos Diferenciais com BiReveal alternado */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 relative min-w-0 differentials-list scroll-perf-list scroll-snap-y-container card-list-container"
          style={{
            scrollSnapType: 'y mandatory',
            scrollPaddingTop: 'clamp(4.5rem, 12vh, 6.5rem)',
          }}
        >
          {differentials.map((item, index) => {
            const Icon = item.icon;
            return (
              <BiReveal
                key={item.title}
                direction={index % 2 === 0 ? 'left' : 'right'}
                index={index}
                className="h-full scroll-snap-card card-snap-item"
                style={{
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'normal',
                  scrollMarginTop: 'clamp(4.5rem, 12vh, 6.5rem)',
                }}
              >
                <Interactive3DCard maxTilt={1.2} className="h-full">
                  <article
                    className="differential-card scroll-perf-card scroll-snap-card card-snap-item relative rounded-2xl bg-[#0a0f28] border border-blue-500/30 hover:border-blue-400/60 h-full w-full p-5 sm:p-6 md:p-8 flex flex-col justify-between group shadow-2xl shadow-black/85 bracket-panel transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2.5 mb-5">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            item.isWhatsApp
                              ? 'bg-[#25D366] text-white shadow-lg shadow-emerald-950/50 border border-emerald-300/40'
                              : 'bg-blue-950 border border-blue-400/40 text-blue-300 shadow-[0_0_14px_rgba(59,130,246,0.3)]'
                          }`}
                        >
                          {item.isWhatsApp ? (
                            <WhatsAppIcon className="w-5 h-5 text-white" />
                          ) : (
                            <Icon className="w-5 h-5" aria-hidden="true" />
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold text-blue-300 bg-blue-950 px-2.5 py-0.5 rounded-md border border-blue-500/40">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white mb-2.5 drop-shadow-sm">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-100 font-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-3.5 border-t border-blue-500/25 flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span className="font-semibold text-slate-200">Padrão ēloSites</span>
                    </div>
                  </article>
                </Interactive3DCard>
              </BiReveal>
            );
          })}
        </div>

        {/* Aviso de responsabilidade e alinhamento estratégico */}
        <BiReveal direction="up" delay={150}>
          <div className="mt-10 sm:mt-12 max-w-2xl mx-auto text-center px-4">
            <p className="inline-flex items-center justify-center gap-3 text-sm sm:text-base text-slate-100 font-medium leading-relaxed bg-[#0b122e] border border-blue-400/40 rounded-2xl px-5 sm:px-6 py-4 shadow-xl shadow-black/70">
              <CheckCircle2
                className="w-5 h-5 text-emerald-400 shrink-0 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                aria-hidden="true"
              />
              <span className="text-white font-medium">
                O site apoia sua divulgação. Você continua responsável por atrair pessoas, atender os contatos e conduzir as vendas.
              </span>
            </p>
          </div>
        </BiReveal>
      </div>
    </section>
  );
};
