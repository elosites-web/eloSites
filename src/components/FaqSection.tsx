import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { FaqItem, SITE_CONFIG, whatsappUrl } from '../types';
import { shouldReduceMedia } from '../mediaPrefs';
import { SplitLines } from './SplitLines';
import { BiReveal } from './BiReveal';

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
        'Cada projeto tem seu escopo específico, então o valor é definido em um orçamento sob medida após entendermos seu modelo de negócio e necessidades. Para o pagamento, oferecemos 4 modalidades flexíveis: 1) 50% de entrada no início e 50% na entrega e aprovação final (via PIX); 2) 20% de desconto para pagamento integral à vista no fechamento; 3) Até 5x sem juros no cartão de crédito (1 entrada + 4 parcelas fixas); ou 4) Parcelamento estendido de 6x até 12x no cartão de crédito (com repasse das taxas de juros da operadora). Fale com a gente pelo WhatsApp para receber sua proposta detalhada.',
    },
    {
      id: 'faq-4',
      question: 'A publicação e a hospedagem estão inclusas?',
      answer:
        'A ēloSites cuida da publicação inicial e de todas as configurações técnicas previstas no escopo contratado. Eventuais custos recorrentes de hospedagem e recursos adicionais são informados com total transparência no orçamento antes do início, sem promessa de gratuidade ou inclusão permanente de serviços pagos.',
    },
    {
      id: 'faq-5',
      question: 'O domínio personalizado está incluso?',
      answer:
        'Quando incluído no orçamento do projeto, a ēloSites realiza a contratação e o registro do domínio utilizando os dados de CPF ou CNPJ do próprio cliente, mediante autorização, além de configurar os servidores DNS. O custo do registro varia conforme o período escolhido e é repassado e discriminado no orçamento. A renovação do domínio é periódica, e as condições ficam detalhadas no orçamento e na documentação de entrega.',
    },
    {
      id: 'faq-6',
      question: 'Depois do projeto eu continuo tendo controle do site?',
      answer:
        'Sim. Na conclusão do projeto, você recebe os arquivos, o repositório, as informações de publicação, os acessos e as orientações necessárias para administrar a infraestrutura entregue, com o domínio registrado em seu CPF ou CNPJ.',
    },
    {
      id: 'faq-7',
      question: 'Existe manutenção mensal?',
      answer:
        'Sim, e é opcional — o valor é definido em 20% sobre o valor do orçamento do seu projeto, conforme o plano de manutenção combinado. Cobre até 4 solicitações simples por mês (troca de textos, fotos, telefones, links e pequenos ajustes visuais), sem acúmulo entre meses. Novas páginas, recursos exclusivos e mudanças estruturais são orçados à parte. Não inclui anuidade de domínio nem outros servidores.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const systemPrefersReduced = useReducedMotion();
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  return (
    <section
      id="faq"
      className="section-auto-contain pt-24 pb-10 sm:pt-28 sm:pb-12 lg:pt-32 lg:pb-14 bg-[#050814] relative border-t border-blue-500/15 overflow-x-clip"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent pointer-events-none" />
      <div className="page-shell page-x max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <BiReveal direction="up">
            <div className="text-center space-y-4 mb-16">
              <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold uppercase shadow-[0_0_15px_rgba(59,130,246,0.25)]">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
                <span>PERGUNTAS FREQUENTES</span>
              </div>
              <SplitLines
                as="h2"
                text="Tire as dúvidas antes de começar"
                className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance"
              />
              <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed max-w-2xl mx-auto">
                Respostas diretas sobre pagamento, publicação, domínio, manutenção e controle do site.
              </p>
            </div>
          </BiReveal>

          <div className="space-y-4 faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const panelId = `faq-content-${index}`;
              const buttonId = `faq-btn-${index}`;
              return (
                <BiReveal
                  key={faq.id}
                  direction={index % 2 === 0 ? 'left' : 'right'}
                  index={index}
                  className="h-full"
                >
                  <div
                    className={`rounded-2xl overflow-hidden transition-all duration-300 border bracket-panel relative bg-[#090E23] ${
                      isOpen
                        ? 'border-blue-400/60 shadow-[0_0_24px_rgba(59,130,246,0.25)]'
                        : 'border-blue-500/15 hover:border-blue-400/40'
                    }`}
                  >
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="w-full p-4 sm:p-6 lg:p-7 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset min-h-12 transition-colors cursor-pointer"
                      >
                        <span className="font-display text-base sm:text-lg font-semibold tracking-[0.01em] text-white min-w-0 text-pretty text-left">
                          {faq.question}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: isReduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                              : 'bg-slate-800/80 text-blue-300'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" aria-hidden="true" />
                        </motion.span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={isReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                          animate={
                            isReduced
                              ? { opacity: 1 }
                              : {
                                  opacity: 1,
                                  height: 'auto',
                                  transition: {
                                    height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                                    opacity: { duration: 0.25, delay: 0.05, ease: 'easeOut' },
                                  },
                                }
                          }
                          exit={
                            isReduced
                              ? { opacity: 0 }
                              : {
                                  opacity: 0,
                                  height: 0,
                                  transition: {
                                    height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                                    opacity: { duration: 0.15, ease: [0.32, 0.72, 0, 1] },
                                  },
                                }
                          }
                          className="overflow-hidden"
                        >
                          <motion.div
                            initial={isReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={isReduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                            transition={{ duration: isReduced ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className="px-5 pb-5 sm:px-6 sm:pb-6 lg:px-7 lg:pb-7 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-white/[0.06] pt-4"
                          >
                            {faq.answer}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </BiReveal>
              );
            })}
          </div>

          <BiReveal direction="up" delay={200}>
            <p className="mt-10 text-center text-sm text-slate-400">
              Outra dúvida sobre o seu negócio?
              <br className="md:hidden" />{' '}
              <a
                href={whatsappUrl(SITE_CONFIG.faqWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-4 font-semibold"
              >
                Fale diretamente no WhatsApp
              </a>
            </p>
          </BiReveal>
        </div>
      </div>
    </section>
  );
};
