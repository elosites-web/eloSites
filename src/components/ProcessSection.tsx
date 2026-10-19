import React from 'react';
import { MessageSquare, Layers, Code2, Globe2, ShieldCheck, Sparkles } from 'lucide-react';
import { SplitLines } from './SplitLines';
import { Interactive3DCard } from './Interactive3DCard';
import { BiReveal } from './BiReveal';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Conversa inicial',
      description:
        'Conversa inicial sobre o negócio: o que você oferece, para quem e o que o site precisa gerar.',
      icon: MessageSquare,
    },
    {
      number: '02',
      title: 'Conteúdos e identidade',
      description:
        'Reunião de conteúdos, fotos e identidade. Organizamos o material para o site falar a língua do seu cliente.',
      icon: Layers,
    },
    {
      number: '03',
      title: 'Desenvolvimento e revisão',
      description:
        'Desenvolvimento rápido com auxílio de IA e revisão humana em cada detalhe. Nada vai ao ar sem olhar atento.',
      icon: Code2,
    },
    {
      number: '04',
      title: 'Site publicado',
      description:
        'Site publicado na URL do Netlify — essa é a entrega padrão. Domínio personalizado não está incluso. Hospedagem ou migração para outro provedor é orçada à parte.',
      icon: Globe2,
    },
  ];

  return (
    <section
      id="como-funciona"
      className="section-auto-contain pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-20 bg-[#050814] relative border-t border-blue-500/15 overflow-x-clip"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent pointer-events-none" />
      
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/[0.08] blur-[150px] rounded-full pointer-events-none" />

      <div className="page-shell page-x max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <BiReveal direction="up">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 sm:mb-20">
            <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase shadow-[0_0_15px_rgba(59,130,246,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Como funciona</span>
            </div>
            <SplitLines
              as="h2"
              text="Quatro etapas. Cada detalhe com revisão humana."
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance"
            />
            <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
              O processo é direto e acompanhado de perto. Usamos tecnologia de ponta para ganhar velocidade — mas o site nunca é entregue de forma totalmente automática.
            </p>
          </div>
        </BiReveal>

        {/* Grade 4 Etapas com BiReveal alternado */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative min-w-0 process-list scroll-perf-list scroll-snap-y-container card-list-container"
          style={{
            scrollSnapType: 'y mandatory',
            scrollPaddingTop: 'clamp(4.5rem, 12vh, 6.5rem)',
          }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <BiReveal
                key={step.number}
                direction={index % 2 === 0 ? 'left' : 'right'}
                index={index}
                className="h-full scroll-snap-card card-snap-item"
                style={{
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'normal',
                  scrollMarginTop: 'clamp(4.5rem, 12vh, 6.5rem)',
                }}
              >
                <Interactive3DCard maxTilt={5} className="h-full">
                  <article
                    className="relative rounded-2xl bg-[#090E23] border border-blue-500/20 hover:border-blue-400/50 h-full w-full p-5 sm:p-6 md:p-8 flex flex-col justify-between group shadow-2xl shadow-black/80 bracket-panel transition-all process-card scroll-perf-card scroll-snap-card card-snap-item"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2.5 mb-6">
                        <span className="font-mono text-xs font-bold text-blue-300 bg-blue-950/80 border border-blue-500/30 px-3 py-1 rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                          {step.number}
                        </span>
                        <div className="w-11 h-11 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.25)]">
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                      </div>
                      <h3 className="font-display text-xl font-bold tracking-tight text-white mb-3 group-hover:text-blue-100 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed font-normal">
                        {step.description}
                      </p>
                    </div>
                  </article>
                </Interactive3DCard>
              </BiReveal>
            );
          })}
        </div>

        {/* Rodapé da seção de processo com aviso de domínio e hospedagem */}
        <BiReveal direction="up" delay={200}>
          <div className="mt-12 sm:mt-16 max-w-3xl mx-auto rounded-2xl border border-blue-500/20 bg-blue-950/30 p-5 sm:p-6 space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed text-center shadow-lg">
            <p>
              <ShieldCheck className="w-4 h-4 text-blue-400 inline-block mr-1.5" />
              A publicação oficial na URL do Netlify faz parte do projeto. O domínio (.com.br) fica sempre na sua conta para sua segurança patrimonial digital.
            </p>
          </div>
        </BiReveal>
      </div>
    </section>
  );
};
