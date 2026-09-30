import React from 'react';
import { Target, Building2, Sparkles, Check, X, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';

interface ServiceCategory {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ElementType;
  includes: string[];
  scopeNote: string;
  excluded?: string[];
  ctaLabel: string;
  ctaId: string;
  ctaMessage: string;
}

const SERVICES: ServiceCategory[] = [
  {
    id: 'landing-page',
    badge: 'Conversão',
    title: 'Landing Page',
    description:
      'Página única, estratégica e direta. Apresenta o seu serviço de forma clara e conduz o visitante até o contato no WhatsApp.',
    icon: Target,
    includes: [
      'Estrutura estratégica de página única',
      'Seção hero com chamada principal',
      'Apresentação do negócio',
      'Serviços ou produtos, benefícios e diferenciais',
      'Depoimentos e prova social quando fornecidos',
      'Imagens e galeria quando aplicável',
      'Perguntas frequentes (FAQ) e chamadas para ação (CTA)',
      'Integração com WhatsApp e informações de contato',
      'Formulários quando incluídos no escopo',
      'Links para redes sociais',
      'Layout responsivo para celular, tablet e desktop',
      'SEO técnico básico, metadados e favicon',
      'Publicação e revisão final de funcionamento',
    ],
    scopeNote: 'O escopo exato é definido na proposta e no contrato.',
    excluded: [
      'Domínio próprio',
      'Hospedagem em outro provedor',
      'Criação de identidade visual (logo)',
      'Novas páginas fora do escopo combinado',
    ],
    ctaLabel: 'Pedir proposta de landing page',
    ctaId: 'service-cta-landing-page',
    ctaMessage: SITE_CONFIG.landingPageWhatsappMessage,
  },
  {
    id: 'site-institucional',
    badge: 'Institucional',
    title: 'Site Institucional',
    description:
      'Presença digital mais completa, com navegação e várias seções. Ideal para transmitir credibilidade e mostrar estrutura, serviços e prova social.',
    icon: Building2,
    includes: [
      'Página inicial (Home)',
      'Sobre',
      'Serviços com descrição detalhada',
      'Diferenciais',
      'Portfólio e projetos',
      'Depoimentos e prova social',
      'Perguntas frequentes (FAQ)',
      'Contato e localização/endereço quando fornecidos',
      'WhatsApp e redes sociais',
      'Formulários quando incluídos no escopo',
      'Navegação entre seções e páginas',
      'Layout responsivo para celular, tablet e desktop',
      'SEO técnico básico, metadados e favicon',
      'Publicação e testes de funcionamento',
    ],
    scopeNote:
      'O número de páginas, seções, integrações e funcionalidades depende do escopo aprovado.',
    excluded: [
      'Domínio próprio',
      'Hospedagem em outro provedor',
      'Identidade visual do zero',
      'Integrações com sistemas de terceiros',
    ],
    ctaLabel: 'Pedir proposta de site institucional',
    ctaId: 'service-cta-institucional',
    ctaMessage: SITE_CONFIG.siteInstitucionalWhatsappMessage,
  },
  {
    id: 'projeto-personalizado',
    badge: 'Sob medida',
    title: 'Projeto Personalizado',
    description:
      'Para projetos que não se encaixam exatamente nos dois formatos anteriores. Combinamos o que faz sentido para o seu caso, com escopo definido junto com você.',
    icon: Sparkles,
    includes: [
      'Estrutura sob medida, combinando elementos de landing page e site institucional',
      'Navegação por abas, múltiplas telas ou página única — conforme o que fizer mais sentido para o projeto',
      'Funcionalidades específicas combinadas com você durante o orçamento',
      'Seções, integrações e fluxos personalizados para o seu caso',
      'Depoimentos, prova social e galeria quando fornecidos',
      'Formulários quando incluídos no escopo',
      'Integração com WhatsApp e informações de contato',
      'Links para redes sociais',
      'Layout responsivo para celular, tablet e desktop',
      'SEO técnico básico, metadados e favicon',
      'Publicação e revisão final de funcionamento',
    ],
    scopeNote: 'Preço, escopo e prazo são definidos conforme a complexidade e os requisitos do projeto.',
    excluded: [
      'Domínio próprio',
      'Hospedagem em outro provedor',
      'Criação de identidade visual (logo) do zero',
      'Funcionalidades fora do escopo combinado no orçamento',
    ],
    ctaLabel: 'Falar sobre meu projeto',
    ctaId: 'service-cta-personalizado',
    ctaMessage: SITE_CONFIG.personalizadoWhatsappMessage,
  },
];

export const ServicesSection: React.FC = () => {
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
            Três formatos. {'Um\u00A0objetivo:'} gerar contato.
          </h2>
          <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
            Escolhemos juntos o formato certo para o momento do seu negócio.
            Orçamento sob medida, pagamento em duas etapas e publicação na URL do Netlify.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 min-w-0 items-stretch">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            const ctaUrl = whatsappUrl(service.ctaMessage);
            return (
              <article
                key={service.id}
                className="surface-card relative rounded-2xl p-5 sm:p-7 lg:p-8 flex flex-col justify-between min-w-0 h-full"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-indigo-950/70 border border-indigo-400/20 flex items-center justify-center text-indigo-300">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-mono text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/80">
                      {service.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Inclui:
                    </span>
                    <div className="grid grid-cols-1 gap-2 text-sm text-slate-300">
                      {service.includes.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed rounded-lg border border-white/[0.06] bg-slate-950/40 p-3">
                    {service.scopeNote}
                  </p>

                  {service.excluded && (
                    <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Não incluso:
                      </span>
                      <div className="grid grid-cols-1 gap-2 text-sm text-slate-500">
                        {service.excluded.map((item) => (
                          <div key={item} className="flex items-start gap-2">
                            <X className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-3">
                  <div className="space-y-1">
                    <p className="font-display text-xl font-bold tracking-tight text-white">
                      Orçamento personalizado
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Cada projeto recebe um orçamento específico, considerando escopo, seções,
                      conteúdo e prazo. Pagamento dividido em duas etapas: 50% para iniciar e
                      50% na entrega final.
                    </p>
                  </div>
                  <a
                    id={service.ctaId}
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-primary w-full inline-flex items-center justify-center flex-wrap gap-2.5 py-3.5 px-4 sm:px-5 rounded-xl text-sm font-semibold text-white group min-h-12 text-center"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>{service.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
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
