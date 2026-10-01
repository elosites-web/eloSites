import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl, scrollToHash } from '../types';
import { ArrowDown, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const heroWhatsapp = whatsappUrl(SITE_CONFIG.heroWhatsappMessage);

  const handleScrollToPortfolio = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToHash('#portfolio');
  };

  const valuePoints = [
    'Presença digital com credibilidade',
    'Serviços explicados com clareza',
    'Contato direto no WhatsApp',
    'Feito para celular, tablet e desktop',
  ];

  return (
    <section
      id="inicio"
      className="relative pt-[max(7rem,calc(5.5rem+env(safe-area-inset-top,0px)))] pb-20 sm:pt-36 sm:pb-28 lg:pt-44 lg:pb-36 overflow-x-clip bg-[#090D16]"
    >
      <div className="absolute inset-0 tech-grid-pattern opacity-70 pointer-events-none" />
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,100%)] h-[360px] max-w-full bg-indigo-600/[0.13] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-8%] right-[-12%] w-[min(28rem,70%)] h-64 bg-violet-700/[0.08] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative page-shell page-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center min-w-0">
          <div className="lg:col-span-7 text-left space-y-7 sm:space-y-8 min-w-0">
            <div className="inline-flex max-w-full min-w-0 items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/50 border border-indigo-400/20 text-indigo-200 text-xs sm:text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shrink-0" />
              <span className="min-w-0 leading-snug">Sites profissionais que trabalham pelo seu negócio</span>
            </div>

            <h1 className="font-display text-[1.75rem] min-[360px]:text-[2.125rem] sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.035em] text-white leading-[1.12] text-balance break-words">
              Um site profissional que apresenta o seu trabalho e faz o cliente chamar no WhatsApp.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-300/95 font-normal leading-relaxed max-w-2xl">
              A ēloSites cria landing pages e sites institucionais para personal trainers, salões,
              barbearias, profissionais independentes e pequenos negócios locais. Você passa a ter
              uma presença digital sólida, com o serviço explicado com clareza e um caminho direto
              até o contato — sem depender apenas das redes sociais.
            </p>

            <div className="pt-1">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block mb-2.5">
                Na prática:
              </span>
              <div className="flex flex-wrap gap-2">
                {valuePoints.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-900/70 border border-white/[0.07] text-xs text-slate-300 font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 min-w-0">
              <a
                id="hero-cta-whatsapp"
                href={heroWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary inline-flex items-center justify-center gap-3 px-5 min-[360px]:px-6 py-4 rounded-xl text-base font-semibold text-white group min-h-12 w-full sm:w-auto"
              >
                <WhatsAppIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span>Falar no WhatsApp</span>
              </a>

              <a
                id="hero-cta-portfolio"
                href="#portfolio"
                onClick={handleScrollToPortfolio}
                className="cta-secondary inline-flex items-center justify-center gap-2 px-5 min-[360px]:px-6 py-4 rounded-xl text-base font-semibold border border-slate-700/70 text-slate-200 hover:text-white min-h-12 w-full sm:w-auto"
              >
                <span>Ver portfólio</span>
                <ArrowDown className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              </a>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                <span>Trabalho direto com o fundador</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                <span>Foco em conversão</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                <span>Revisão humana em cada detalhe</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5 min-w-0">
            <div className="relative rounded-2xl bg-[#0B101D] border border-white/[0.08] p-1 shadow-[0_24px_64px_-28px_rgba(0,0,0,0.85),0_1px_0_rgba(255,255,255,0.05)_inset]">
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-indigo-400/15 to-transparent opacity-70 z-0" />
              <div className="relative z-10 flex items-center justify-between gap-2 px-3 sm:px-4 py-3 border-b border-white/[0.06] bg-slate-950/70 rounded-t-xl min-w-0">
                <div className="flex items-center gap-2" aria-hidden="true">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-xs text-slate-400 font-mono truncate">elosites</span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40 shrink-0">
                  NO AR
                </span>
              </div>

              <div className="relative z-10 p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed space-y-3 text-slate-300">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-indigo-400 font-semibold">$</span>
                  <span>npm run build</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>✓</span>
                  <span className="text-slate-200">Site no ar</span>
                  <span className="terminal-caret text-indigo-300" aria-hidden="true">▌</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-slate-950/70 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <span className="block text-[10px] uppercase tracking-wider text-indigo-300 font-semibold mb-2.5">
                Mensagem já pronta
              </span>
              <div className="rounded-xl rounded-tl-sm bg-emerald-600/15 border border-emerald-500/20 px-3.5 py-3">
                <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed">
                  Olá, ēloSites! 👋
                  <br />
                  <br />
                  Quero criar um{' '}
                  <span className="font-semibold text-white">site profissional</span> para
                  o meu negócio e gerar mais contatos pelo WhatsApp.
                  <br />
                  <br />
                  Pode me explicar como funciona e me enviar um orçamento sem compromisso?
                </p>
                <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-emerald-300/70">
                  <span>pronta para enviar</span>
                  <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                </div>
              </div>
              <p className="mt-2.5 text-xs text-slate-400">
                Ao clicar em "Falar no WhatsApp", essa mensagem já vem preenchida — é só
                apertar enviar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
