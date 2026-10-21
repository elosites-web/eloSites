import React from 'react';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { BiReveal } from './BiReveal';

/**
 * Cartão digital do fundador, exibido na tela "FAQ & Contato" logo após o bloco de Contato.
 * Reaproveita dados já existentes em SITE_CONFIG; a versão em página inteira
 * (usada pelo QR code do cartão impresso) continua em /cartao/.
 */
export const DigitalCardSection: React.FC = () => {
  const cardWhatsappUrl = whatsappUrl(
    'Olá, Everton! Vi seu cartão da ēloSites e quero um orçamento de site.'
  );
  const phoneHref = `tel:+${SITE_CONFIG.whatsappNumber}`;

  return (
    <section
      id="cartao-digital"
      aria-labelledby="cartao-digital-title"
      className="section-auto-contain pt-4 pb-16 sm:pb-20 bg-[#050814] relative overflow-x-clip"
    >
      <div className="page-shell page-x max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <BiReveal direction="up">
          <div className="max-w-md mx-auto rounded-3xl p-6 sm:p-8 bg-[#070b1a] border border-indigo-500/20 shadow-2xl shadow-black/60 flex flex-col items-center text-center gap-5">
            <div className="rounded-full p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600">
              <img
                src="/cartao/eu.webp"
                alt="Everton Lopes, fundador da ēloSites"
                width={132}
                height={132}
                loading="lazy"
                decoding="async"
                className="block w-[132px] h-[132px] rounded-full object-cover bg-[#111a3e]"
              />
            </div>

            <div>
              <h2
                id="cartao-digital-title"
                className="font-display text-2xl sm:text-3xl font-bold text-white"
              >
                Everton Lopes
              </h2>
              <p className="mt-1.5 text-sm sm:text-base font-semibold text-blue-300">
                Fundador da ēloSites
              </p>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                Presença digital estratégica para pequenos negócios e profissionais liberais.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              <a
                href={cardWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 min-h-[52px] px-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-110 transition"
              >
                <WhatsAppIcon className="w-5 h-5 text-white" />
                Pedir orçamento no WhatsApp
              </a>
              <a
                href={phoneHref}
                className="flex items-center gap-3 min-h-[48px] px-4 rounded-xl text-sm text-slate-100 bg-[#090e23] border border-blue-500/20 hover:bg-blue-500/10 transition-colors"
              >
                <Phone className="w-5 h-5 text-blue-400 shrink-0" aria-hidden="true" />
                <span>{SITE_CONFIG.whatsappDisplay}</span>
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-3 min-h-[48px] px-4 rounded-xl text-sm text-slate-100 bg-[#090e23] border border-blue-500/20 hover:bg-blue-500/10 transition-colors break-all"
              >
                <Mail className="w-5 h-5 text-blue-400 shrink-0" aria-hidden="true" />
                <span>{SITE_CONFIG.email}</span>
              </a>
              <a
                href="/cartao/"
                className="flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl text-sm font-semibold text-blue-300 hover:text-white transition-colors"
              >
                Abrir cartão em tela cheia
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </BiReveal>
      </div>
    </section>
  );
};
