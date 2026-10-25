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
      title: 'Abre rápido até no celular 4G',
      description:
        'Seu site carrega sem demora, sem travar e sem páginas pesadas. Quem clica para conhecer o seu trabalho não desiste antes de abrir.',
      icon: Zap,
    },
    {
      title: 'Você conversa direto com quem faz',
      description:
        'Você fala diretamente com quem planeja e coloca o seu site no ar. Sem intermediários, sem equipe inventada e com atenção ao seu negócio.',
      icon: User,
    },
    {
      title: 'Site no ar com endereço estável',
      description:
        'Seu site fica publicado em endereço seguro e moderno na internet. Se você quiser um domínio próprio (.com.br), o registro fica no seu nome e o valor anual é à parte.',
      icon: Server,
    },
    {
      title: 'Feito para o cliente chamar',
      description:
        'Cada parte da página foi pensada para mostrar os seus serviços com clareza e facilitar o contato de quem quer contratar.',
      icon: TrendingUp,
    },
    {
      title: 'Tudo o que o cliente precisa saber',
      description:
        'Seus serviços, fotos reais do seu trabalho, horários e endereço organizados em um só lugar. O cliente tira dúvidas e clica para falar com você.',
      icon: Flame,
    },
    {
      title: 'Botão para o WhatsApp sempre à mão',
      description:
        'O site encaminha o interessado direto para o seu WhatsApp com mensagem pronta, facilitando o primeiro contato e o agendamento.',
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
              <span>Vantagens para o seu negócio</span>
            </div>
            <SplitLines
              as="h2"
              text="O que você ganha com um site feito sob medida"
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance leading-tight"
            />
            <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
              Menos dependência de redes sociais. Mais presença profissional para quem procura os seus serviços no Google.
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
                    className="glass-card-interactive surface-card differential-card scroll-perf-card scroll-snap-card card-snap-item relative rounded-2xl bg-[#090E23] border border-blue-500/20 hover:border-blue-400/50 h-full w-full p-5 sm:p-6 md:p-8 flex flex-col justify-between group shadow-2xl shadow-black/80 bracket-panel transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2.5 mb-5">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            item.isWhatsApp
                              ? 'bg-[#25D366] text-white shadow-md shadow-emerald-950/40'
                              : 'bg-blue-950/80 border border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                          }`}
                        >
                          {item.isWhatsApp ? (
                            <WhatsAppIcon className="w-5 h-5 text-white" />
                          ) : (
                            <Icon className="w-5 h-5" aria-hidden="true" />
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold text-blue-400/80 group-hover:text-blue-300 transition-colors">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-bold tracking-tight text-white mb-2.5 group-hover:text-blue-100 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-3.5 border-t border-white/[0.08] flex items-center gap-1.5 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
                      <span className="font-medium text-slate-300">Padrão ēloSites</span>
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
            <p className="inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm text-blue-200/90 leading-relaxed bg-blue-950/40 border border-blue-500/25 rounded-xl px-4 sm:px-5 py-3 shadow-md">
              <CheckCircle2
                className="w-4 h-4 text-blue-400 shrink-0"
                aria-hidden="true"
              />
              <span>
                O site apoia sua divulgação. Você continua responsável por atrair pessoas, atender os contatos e conduzir as vendas.
              </span>
            </p>
          </div>
        </BiReveal>
      </div>
    </section>
  );
};
