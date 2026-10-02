import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FaqItem, SITE_CONFIG, whatsappUrl } from '../types';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'Preciso ter todo o conteúdo pronto?',
      answer:
        'Não. Na conversa inicial e na reunião de materiais, organizamos juntos o que já existe — fotos, textos, serviços e identidade. Se faltar alguma coisa, alinhamos o que é essencial para o site ir ao ar com qualidade.',
    },
    {
      id: 'faq-2',
      question: 'Quanto tempo leva para o site ficar pronto?',
      answer:
        'Depende do formato (landing page ou site institucional) e de quanto tempo leva para reunir conteúdos e fotos. O processo é pensado para ser rápido, em dias em vez de meses — sem um prazo absoluto, porque cada projeto tem o próprio ritmo de revisão.',
    },
    {
      id: 'faq-3',
      question: 'Quanto custa e como é o pagamento?',
      answer:
        'Cada projeto é diferente, então o valor é definido em um orçamento específico depois de entendermos seu negócio e o que você precisa no site. O pagamento é dividido em duas etapas: 50% para iniciar o projeto e 50% na entrega final. Fale com a gente pelo WhatsApp para receber sua proposta.',
    },
    {
      id: 'faq-4',
      question: 'A publicação e a hospedagem estão inclusas?',
      answer:
        'A publicação do site no endereço combinado faz parte do projeto. Hospedagem e domínio são serviços de terceiros, contratados e pagos por você diretamente no provedor de sua escolha (por exemplo, Netlify, Cloudflare ou uma empresa de hospedagem), e a ēloSites não revende esses serviços. Configurar a publicação e conectar o domínio, quando previstos no escopo aprovado, fazem parte do projeto; migrações fora desse escopo podem ser orçadas à parte.',
    },
    {
      id: 'faq-5',
      question: 'O domínio personalizado está incluso?',
      answer:
        'Não. O registro do domínio (.com.br, .com etc.) é pago por você ao provedor de sua escolha e fica sempre na sua conta; a ēloSites não fica dona do domínio. Recomendamos fortemente contratar um domínio próprio: ele passa mais credibilidade, é mais fácil de lembrar e divulgar, e continua seu mesmo que o site mude de hospedagem. Se quiser, indicamos opções de provedores.',
    },
    {
      id: 'faq-6',
      question: 'Depois do projeto eu continuo tendo controle do site?',
      answer:
        'Sim. O site é seu: após a confirmação do pagamento final, o conteúdo, o layout e o código desenvolvidos para o seu projeto passam a ser seus. Quando você quiser, pode pedir a transferência do repositório e das informações de publicação para a sua conta. O domínio e a hospedagem ficam sempre no seu nome.',
    },
    {
      id: 'faq-7',
      question: 'Existe manutenção mensal?',
      answer:
        'Sim, e é opcional — o valor é definido junto com o orçamento do seu projeto, conforme o plano de manutenção combinado. Cobre até 4 solicitações simples por mês (textos, imagens, contatos, links, pequenos ajustes), sem acúmulo entre meses. Novas páginas, funcionalidades, integrações, redesigns e alterações estruturais são orçados à parte. Não inclui domínio nem hospedagem em outro provedor.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-24 sm:py-32 bg-[#0B0F19] relative border-t border-white/[0.05] overflow-x-clip"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent pointer-events-none" />
      <div className="page-shell page-x">
        <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-5 mb-16">
          <div className="section-kicker inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.07] text-indigo-300 text-xs font-semibold uppercase">
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Perguntas frequentes</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance">
            Tire as dúvidas antes de começar
          </h2>
          <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed max-w-2xl mx-auto">
            Respostas diretas sobre pagamento, publicação, domínio, manutenção e controle do site.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-content-${index}`;
            const buttonId = `faq-btn-${index}`;
            return (
              <div
                key={faq.id}
                className={`rounded-xl overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? 'border border-indigo-400/35 bg-slate-900/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    : 'border border-white/[0.07] bg-slate-900/55 hover:border-indigo-400/25'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full p-3.5 min-[360px]:p-5 sm:p-6 text-left flex items-center justify-between gap-3 min-[360px]:gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset min-h-12 transition-colors duration-200"
                  >
                    <span className="font-display text-base sm:text-lg font-semibold text-white min-w-0 text-pretty">
                      {faq.question}
                    </span>
                    <span
                      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen
                          ? 'rotate-180 bg-indigo-950 text-indigo-300'
                          : 'bg-slate-800/90 text-slate-300'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base text-slate-300/95 leading-relaxed border-t border-white/[0.06] pt-4"
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-slate-400">
          Outra dúvida sobre o seu negócio?{' '}
          <a
            href={whatsappUrl(SITE_CONFIG.defaultWhatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 font-medium"
          >
            Fale no WhatsApp
          </a>
         </p>
         </div>
       </div>
     </section>
  );
};
