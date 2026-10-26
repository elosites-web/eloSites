import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { Mail, Sparkles, ArrowRight } from 'lucide-react';
import { SplitLines } from './SplitLines';
import { BiReveal } from './BiReveal';

interface ContactCtaSectionProps {
  onNavigateToOrcamento?: () => void;
}

export const ContactCtaSection: React.FC<ContactCtaSectionProps> = ({ onNavigateToOrcamento }) => {
  const mainWhatsappUrl = whatsappUrl(SITE_CONFIG.finalCtaWhatsappMessage);

  return (
    <section
      id="contato"
      className="section-auto-contain pt-12 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-20 bg-[#050814] relative border-t border-blue-500/15 overflow-x-clip"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,100%)] h-[360px] bg-blue-600/[0.12] blur-[140px] rounded-full pointer-events-none" />

      <div className="page-shell page-x max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center space-y-7 sm:space-y-9">
          <BiReveal direction="up">
            <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold uppercase shadow-[0_0_15px_rgba(59,130,246,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Próximo passo</span>
            </div>
          </BiReveal>

          <BiReveal direction="up" delay={100}>
            <SplitLines
              as="h2"
              text="Vamos criar o site do seu negócio?"
              className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-[-0.035em] text-white leading-[1.12] text-balance"
            />
          </BiReveal>

          <BiReveal direction="up" delay={150}>
            <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed max-w-2xl mx-auto">
              Conte sobre o seu trabalho pelo WhatsApp. Conversamos sobre o formato, o conteúdo e te enviamos um orçamento específico para o seu projeto.
            </p>
          </BiReveal>

          <BiReveal direction="up" delay={200}>
            <div className="pt-2 sm:pt-4 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <a
                  id="main-contact-cta-whatsapp"
                  href={mainWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center text-center gap-3 px-6 sm:px-8 py-4 rounded-xl text-base sm:text-lg font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] border border-emerald-400/30 shadow-lg shadow-emerald-950/40 group transition-all"
                >
                  <WhatsAppIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-center">Falar no WhatsApp</span>
                </a>

                <button
                  id="main-contact-cta-briefing"
                  type="button"
                  onClick={() => {
                    if (onNavigateToOrcamento) {
                      onNavigateToOrcamento();
                    } else {
                      window.location.hash = 'orcamento';
                    }
                  }}
                  className="cta-primary w-full sm:w-auto inline-flex items-center justify-center text-center gap-2.5 px-6 py-4 rounded-xl text-base font-bold text-white shadow-lg cursor-pointer"
                >
                  <span className="text-center">Preencher Briefing do Projeto</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-medium">
                  Atendimento direto com o fundador &bull; sem compromisso
                </p>
                <p className="text-xs text-blue-300 font-medium select-all" data-copy-allowed>
                  {SITE_CONFIG.whatsappDisplay}
                </p>
              </div>
            </div>
          </BiReveal>

          <BiReveal direction="up" delay={250}>
            <div className="pt-8 border-t border-blue-500/15 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300 max-w-xl mx-auto">
              <a
                href={mainWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 rounded-xl text-left bg-[#090E23] border border-blue-500/20 hover:border-emerald-500/40 transition-colors shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="block font-semibold text-white text-xs sm:text-sm">WhatsApp Oficial</span>
                  <span className="text-xs text-slate-400">{SITE_CONFIG.whatsappDisplay}</span>
                </div>
              </a>

              {SITE_CONFIG.email && (
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center gap-3.5 p-4 rounded-xl text-left bg-[#090E23] border border-blue-500/20 hover:border-blue-400/50 transition-colors shadow-lg"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="block font-semibold text-white text-xs sm:text-sm">E-mail Direto</span>
                    <span className="text-xs text-slate-400">{SITE_CONFIG.email}</span>
                  </div>
                </a>
              )}
            </div>
          </BiReveal>
        </div>
      </div>
    </section>
  );
};
