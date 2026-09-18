import React from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';

function BrowserMockup({
  urlLabel,
  children,
}: {
  urlLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full rounded-xl border border-white/[0.07] bg-[#070A11] overflow-hidden shadow-[0_16px_40px_-24px_rgba(0,0,0,0.8)]">
      <div className="px-3 sm:px-4 py-2.5 bg-slate-900/90 border-b border-white/[0.06] flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
        </div>
        <div className="flex-1 min-w-0 bg-slate-950/90 rounded-md px-2.5 py-1 text-[11px] text-slate-400 font-mono border border-white/[0.07] truncate">
          {urlLabel}
        </div>
      </div>
      {children}
    </div>
  );
}

function StructuralPlaceholder({
  variant,
  label,
}: {
  variant: 'landing' | 'institutional';
  label: string;
}) {
  return (
    <div
      className="relative h-56 sm:h-64 bg-[#0B101D] p-4 sm:p-5"
      role="img"
      aria-label={label}
    >
      {variant === 'landing' ? (
        <div className="h-full rounded-lg border border-white/[0.06] bg-slate-950/60 p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-2 w-24 rounded bg-indigo-500/40" />
            <div className="h-3 w-3/4 rounded bg-slate-700/80" />
            <div className="h-2 w-full rounded bg-slate-800" />
            <div className="h-2 w-5/6 rounded bg-slate-800" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 rounded bg-slate-800/90" />
            <div className="h-10 rounded bg-slate-800/90" />
            <div className="h-10 rounded bg-slate-800/90" />
          </div>
          <div className="h-8 w-32 rounded-md bg-emerald-500/25 border border-emerald-500/20" />
        </div>
      ) : (
        <div className="h-full rounded-lg border border-white/[0.06] bg-slate-950/60 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-28 rounded bg-indigo-500/35" />
            <div className="h-2 w-16 rounded bg-amber-400/30" />
          </div>
          <div className="grid grid-cols-4 gap-2 flex-1">
            <div className="col-span-2 rounded bg-slate-800/80" />
            <div className="rounded bg-slate-800/60" />
            <div className="rounded bg-slate-800/60" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-8 rounded bg-slate-800/70" />
            <div className="h-8 rounded bg-slate-800/70" />
            <div className="h-8 rounded bg-slate-800/70" />
          </div>
        </div>
      )}
      <p className="absolute bottom-3 right-4 text-[10px] uppercase tracking-wider text-slate-500 font-medium">
        Representação estrutural
      </p>
    </div>
  );
}

export const PortfolioSection: React.FC = () => {
  const whatsappInquiryUrl = whatsappUrl(SITE_CONFIG.portfolioWhatsappMessage);

  return (
    <section id="portfolio" className="py-24 sm:py-32 bg-[#0B0F19] relative border-t border-white/[0.05] overflow-x-clip">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[min(18rem,70%)] sm:w-96 h-72 sm:h-96 max-w-full bg-indigo-500/[0.07] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[min(18rem,70%)] sm:w-96 h-72 sm:h-96 max-w-full bg-violet-600/[0.06] blur-[120px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative">
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-16 sm:mb-20">
          <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.07] text-indigo-300 text-xs sm:text-sm font-semibold uppercase">
            <span>Portfólio</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance">
            Um projeto real, no ar
          </h2>
          <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
            Trabalho concluído para um cliente real. O caso abaixo é o resultado final
            do projeto — sem versões alternativas nem prévia ao vivo embutida.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <article className="surface-card flex flex-col rounded-2xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-white/[0.06] bg-slate-950/50 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase bg-indigo-950/80 text-indigo-200 border border-indigo-400/25 px-2.5 py-1 rounded font-semibold">
                  Landing page
                </span>
                <span className="text-xs text-emerald-400 font-medium">Projeto publicado</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                JV Salvaia Personal Trainer
              </h3>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>
                  <span className="text-white font-semibold">Desafio. </span>
                  Personal trainer com treino presencial, consultoria online e avaliação física.
                  Precisava de uma landing page enxuta para converter tráfego pago do
                  Instagram e do Facebook em conversas no WhatsApp.
                </p>
                <p>
                  <span className="text-white font-semibold">Solução. </span>
                  Botão de WhatsApp para cada serviço, com mensagem pré-preenchida diferente
                  em cada um; e galeria de exercícios.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Treino presencial', 'Consultoria online', 'Avaliação física'].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950 border border-white/[0.07] text-xs font-medium text-slate-200"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-[#070A11]/90">
              <BrowserMockup urlLabel="jvpersonal.netlify.app">
                <StructuralPlaceholder
                  variant="landing"
                  label="Representação estrutural da landing page de JV Salvaia Personal Trainer"
                />
              </BrowserMockup>
              <p className="mt-3 text-xs text-slate-500">
                Representação estrutural. O site real abre em outra aba.
              </p>
              <a
                href="https://jvpersonal.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200 transition-colors min-h-11"
              >
                <span>Abrir site ao vivo</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>

        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-indigo-950/25 border border-indigo-400/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-white font-display">
              Quer um site assim para o seu negócio?
            </h3>
            <p className="text-sm text-slate-300">
              Um site que apresenta o serviço com clareza, transmite credibilidade e leva o visitante ao contato.
            </p>
          </div>
          <a
            id="portfolio-cta-whatsapp"
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-white shrink-0 min-h-12"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
