import React from 'react';
import { Target, Building2, Check, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl, PRICING, formatBRL } from '../types';

export const ServicesSection: React.FC = () => {
  const landingPageWhatsappUrl = whatsappUrl(SITE_CONFIG.landingPageWhatsappMessage);
  const siteInstitucionalWhatsappUrl = whatsappUrl(SITE_CONFIG.siteInstitucionalWhatsappMessage);

  return (
    <section
      id="servicos"
      className="py-24 sm:py-32 bg-[#0B0F19] relative border-t border-white/[0.05] overflow-x-clip"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent pointer-events-none" />
      <div className="page-shell page-x">
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-16 sm:mb-20">
          <div className="section-kicker inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.07] text-indigo-300 text-xs font-semibold uppercase">
            <span>Serviços</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance">
            Dois formatos. {'Um\u00A0objetivo:'} gerar contato.
          </h2>
          <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
            Escolhemos juntos o formato certo para o momento do seu negócio.
            Valores iniciais claros, pagamento em duas etapas e publicação na URL do Netlify.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 min-w-0">
          <article className="surface-card relative rounded-2xl p-5 sm:p-7 lg:p-9 flex flex-col justify-between min-w-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-950/70 border border-indigo-400/20 flex items-center justify-center text-indigo-300">
                  <Target className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-white/[0.07]">
                  Conversão
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  Landing page
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Página enxuta, focada em conversão no WhatsApp. Ideal para quem já
                  investe em tráfego pago e precisa de uma página que transforme clique em conversa.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ideal para:
                </span>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Campanhas no Instagram e no Facebook</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Link da bio e divulgação de um serviço específico</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Negócios que já geram tráfego e querem converter melhor</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  No projeto:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300">
                  {[
                    'Layout sob medida',
                    'Foco em WhatsApp',
                    'Apresentação dos serviços',
                    'Publicação do site',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-3">
              <div className="space-y-1">
                <p className="font-display text-2xl font-bold tracking-tight text-white">
                  A partir de {formatBRL(PRICING.landingPageFrom)}
                </p>
                <p className="text-sm text-indigo-300 font-medium">
                  50% para iniciar · 50% na entrega
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manutenção opcional: {formatBRL(PRICING.maintenanceLanding)}/mês. Domínio personalizado não incluso.
                </p>
              </div>
              <a
                id="service-cta-landing-page"
                href={landingPageWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary w-full inline-flex items-center justify-center flex-wrap gap-2.5 py-3.5 px-4 sm:px-5 rounded-xl text-sm font-semibold border border-slate-700/70 text-white group min-h-12 text-center"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Pedir proposta de landing page</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </article>

          <article className="surface-featured relative rounded-2xl p-5 sm:p-7 lg:p-9 flex flex-col justify-between overflow-hidden min-w-0">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-md">
              Mais completo
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-950/70 border border-indigo-400/25 flex items-center justify-center text-indigo-300">
                  <Building2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="text-xs font-mono text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/80 mr-20 sm:mr-16">
                  Institucional
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  Site institucional
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Site completo, com várias seções: apresentação, galeria, depoimentos e localização.
                  Para quem precisa de credibilidade e uma presença digital mais ampla.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ideal para:
                </span>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Negócios com espaço físico, equipe ou vários serviços</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Salões, barbearias, arenas e profissionais estabelecidos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Quem quer apresentar estrutura, prova social e localização</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-white/[0.07]">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  No projeto:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300">
                  {[
                    'Várias seções',
                    'Galeria',
                    'Depoimentos',
                    'Localização',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.07] space-y-3">
              <div className="space-y-1">
                <p className="font-display text-2xl font-bold tracking-tight text-white">
                  A partir de {formatBRL(PRICING.professionalWebsiteFrom)}
                </p>
                <p className="text-sm text-indigo-300 font-medium">
                  50% para iniciar · 50% na entrega
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manutenção opcional: {formatBRL(PRICING.maintenanceProfessional)}/mês. Domínio personalizado não incluso.
                </p>
              </div>
              <a
                id="service-cta-institucional"
                href={siteInstitucionalWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary w-full inline-flex items-center justify-center flex-wrap gap-2.5 py-3.5 px-4 sm:px-5 rounded-xl text-sm font-semibold text-white group min-h-12 text-center"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Pedir proposta de site institucional</span>
                <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>

        <div className="mt-10 sm:mt-12 max-w-3xl mx-auto rounded-2xl border border-white/[0.07] bg-slate-950/40 p-5 sm:p-6 space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            A entrega padrão é o site publicado na URL do Netlify. Domínio personalizado
            (.com.br, .com etc.) não está incluso: o registro e o pagamento ficam na conta
            do cliente.
          </p>
          <p>
            Manutenção mensal é opcional. Configurar ou migrar para outro provedor de
            hospedagem não está incluso e pode ser orçado à parte.
          </p>
        </div>
      </div>
    </section>
  );
};
