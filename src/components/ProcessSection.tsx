import React from 'react';
import { MessageSquare, Layers, Code2, Globe2, UserCheck, ShieldCheck } from 'lucide-react';

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
      className="py-24 sm:py-32 bg-[#090D16] relative border-t border-white/[0.05] overflow-x-clip"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/25 to-transparent pointer-events-none" />
      <div className="page-shell page-x">
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-16 sm:mb-20">
          <div className="section-kicker inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.07] text-indigo-300 text-xs font-semibold uppercase">
            <span>Como funciona</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance">
            Quatro etapas. Cada detalhe com revisão humana.
          </h2>
          <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
            O processo é direto e acompanhado de perto. Usamos inteligência artificial
            para ganhar velocidade — mas o site nunca é entregue de forma totalmente automática.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative min-w-0">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                className="surface-card relative rounded-2xl p-5 sm:p-6 lg:p-7 flex flex-col group min-w-0"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/70 border border-indigo-400/20 px-2.5 py-1 rounded">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-800/70 border border-white/[0.06] flex items-center justify-center text-indigo-300 group-hover:text-indigo-200 group-hover:bg-indigo-950/50 transition-colors duration-200">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-300/95 leading-relaxed">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-14 bg-slate-900/45 border border-white/[0.07] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-400/20 flex items-center justify-center text-indigo-300 shrink-0">
            <UserCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1 text-center md:text-left flex-1">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span>Revisão humana em cada detalhe</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              A IA acelera o desenvolvimento. Quem decide o tom, a estrutura, o texto e
              o acabamento é uma pessoa — do primeiro rascunho até o site no ar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
