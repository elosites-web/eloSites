import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { FaqItem, TRAFFIC_PRICE_NOTICE, SITE_CONFIG, whatsappUrl } from '../types';
import { shouldReduceMedia } from '../mediaPrefs';
import { SplitLines } from './SplitLines';
import { BiReveal } from './BiReveal';

const faqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Preciso ter todo o conteúdo pronto?',
    answer: 'Não. Na primeira conversa e na reunião de materiais, separamos as fotos, os textos, a marca e a lista de serviços que você já tem. Combinamos o que falta para colocar o site no ar.',
  },
  {
    id: 'faq-2',
    question: 'Quanto tempo leva para o site ficar pronto?',
    answer: 'Uma página pode ficar pronta em dias. Um site com várias páginas ou mais rodadas de revisão pode levar mais tempo. Combinamos o prazo com você depois de ver o conteúdo e as fotos.',
  },
  {
    id: 'faq-3',
    question: 'Quanto custa o site e como posso pagar?',
    answer: 'O preço depende das páginas e do conteúdo. Peça um orçamento pelo WhatsApp. No Pix, você pode pagar metade no início e metade na entrega aprovada, ou pagar tudo à vista com 20% de desconto. No cartão, são até 5 vezes sem juros (entrada e mais 4 parcelas). De 6 a 12 vezes, os juros da operadora ficam com o cliente.',
  },
  {
    id: 'faq-4',
    question: 'A publicação e a hospedagem estão incluídas?',
    answer: 'Colocamos o site no ar e fazemos as configurações combinadas. A hospedagem é onde o site fica guardado. Antes de contratar, você vê no orçamento quanto custa manter a hospedagem e usar recursos extras, se forem necessários.',
  },
  {
    id: 'faq-5',
    question: 'Quem paga pelo endereço do site?',
    answer: 'O domínio é o endereço, como suaempresa.com.br. Se o registro fizer parte do orçamento, fazemos a compra em seu CPF ou CNPJ, com sua autorização, e ligamos o endereço ao site (DNS). O preço depende do período escolhido. Você recebe os valores e as orientações para renovar.',
  },
  {
    id: 'faq-6',
    question: 'Quando o site ficar pronto, ele fica comigo?',
    answer: 'Sim. Você recebe os arquivos, a pasta com o histórico do código (repositório), os acessos e as instruções para publicar e cuidar do site. Quando contratamos o domínio para você, o registro fica no seu CPF ou CNPJ.',
  },
  {
    id: 'faq-7',
    question: 'Preciso pagar manutenção todo mês?',
    answer: 'A manutenção é opcional. O plano mensal custa 20% do valor orçado para o projeto e cobre até 4 pedidos simples por mês, como trocar fotos, textos, telefone ou links e fazer pequenos ajustes visuais. Os pedidos não acumulam. Novas páginas, recursos sob medida e mudanças maiores têm orçamento separado. A renovação do domínio e outros servidores também ficam à parte.',
  },
  {
    id: 'faq-8',
    question: 'Vocês fazem sites só para Jundiaí?',
    answer: 'A ēloSites fica em Jundiaí, São Paulo, e atende todo o Brasil pela internet. Você pode enviar fotos, aprovar as páginas e falar com Everton pelo WhatsApp.',
  },
  {
    id: 'faq-9',
    question: 'O que posso vender com uma página? O cliente paga pelo site?',
    answer: 'Você pode mostrar um produto ou serviço, informar tamanhos e preços e receber pedidos pelo WhatsApp. A ēloSites cria a parte que a pessoa vê e usa (front-end). O pagamento, o estoque e os pedidos combinados na conversa ficam com o seu negócio.',
  },
  {
    id: 'faq-10',
    question: 'O site já vem com anúncios pagos?',
    answer: 'O site e os anúncios são serviços separados. Para quem contrata um site com a ēloSites, a TrueThomaz.BM oferece gestão por R$ 500/mês* nos três primeiros meses, em uma plataforma à escolha: Meta Ads, Google Ads ou TikTok Ads. A verba para exibir os anúncios é paga à parte. Após esse período, para mais plataformas ou somente anúncios, peça um orçamento à TrueThomaz.BM.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: faqs.map(({ question, answer, id }) => ({
          '@type': 'Question', name: question,
          acceptedAnswer: { '@type': 'Answer', text: id === 'faq-10' ? answer + ' ' + TRAFFIC_PRICE_NOTICE : answer },
        })),
      })}</script>
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
                Veja o que vem com o site, como pagar e quem cuida dele depois da entrega.
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
                            {faq.id === 'faq-10' && (
                              <span className="price-notice">
                                <b>*</b> {TRAFFIC_PRICE_NOTICE} <a href="#parceria-trafego">Ver a parceria</a>
                              </span>
                            )}
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
