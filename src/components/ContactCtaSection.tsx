import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { Mail } from 'lucide-react';

export const ContactCtaSection: React.FC = () => {
  const mainWhatsappUrl = whatsappUrl(SITE_CONFIG.finalCtaWhatsappMessage);

  return (
    <section
      id="contato"
      className="py-24 sm:py-32 bg-[#090D16] relative border-t border-white/[0.05] overflow-x-clip"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/25 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,100%)] h-[360px] bg-indigo-600/[0.12] blur-[140px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10">
        <div className="section-kicker inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.07] text-indigo-300 text-xs sm:text-sm font-semibold uppercase">
          <span>Próximo passo</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-[-0.035em] text-white leading-[1.12] text-balance">
          Vamos criar o site do seu negócio?
        </h2>

        <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed max-w-2xl mx-auto">
          Conte sobre o seu trabalho pelo WhatsApp. Conversamos sobre o formato, o conteúdo e te enviamos um orçamento específico para o seu projeto, com pagamento em duas etapas: 50% para iniciar e 50% na entrega.
        </p>

        <div>
          <a
            id="main-contact-cta-whatsapp"
            href={mainWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-5 rounded-2xl text-base sm:text-lg font-bold text-white group min-h-12"
          >
            <WhatsAppIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span>Falar no WhatsApp</span>
          </a>
          <p className="text-xs text-slate-400 mt-3 font-medium">
            Atendimento direto com o fundador · sem compromisso
          </p>
          <p className="text-xs text-slate-300 mt-2 font-medium select-all" data-copy-allowed>
            {SITE_CONFIG.whatsappDisplay}
          </p>
        </div>

        <div className="pt-8 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300 max-w-xl mx-auto">
          <a
            href={mainWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-slate-900/55 p-3.5 rounded-xl border border-white/[0.07] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <WhatsAppIcon className="w-4 h-4 text-indigo-300 shrink-0" />
            <div>
              <span className="block text-[11px] text-slate-400">Canal principal</span>
              <span className="font-medium text-white">WhatsApp</span>
            </div>
          </a>

          <div className="flex items-center gap-3 bg-slate-900/55 p-3.5 rounded-xl border border-white/[0.07] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <Mail className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
            <div>
              <span className="block text-[11px] text-slate-400">E-mail</span>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="inline-flex items-center min-h-11 font-medium text-white hover:text-indigo-300 transition-colors break-all"
                data-copy-allowed
              >
                {SITE_CONFIG.email}
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
