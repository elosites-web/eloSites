import React from 'react';
import { useReducedMotion } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SplitLines } from './SplitLines';
import { whatsappUrl } from '../types';
import { shouldReduceMedia } from '../mediaPrefs';
import {
  MessageSquareQuote,
  Target,
  TrendingUp,
  Users,
  ShieldCheck,
  CheckCircle2,
  Info,
  ArrowRight,
  Sparkles,
  Flame,
} from 'lucide-react';

import { BiReveal } from './BiReveal';

interface PaidTrafficPartnershipSectionProps {
  id?: string;
}

export const PaidTrafficPartnershipSection: React.FC<PaidTrafficPartnershipSectionProps> = ({
  id = 'parceria-trafego',
}) => {
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  const PARTNERSHIP_PREFILLED_MESSAGE =
    'Olá! Vim pelo site da ēloSites e gostaria de conhecer a condição especial da parceria de tráfego pago com o Thomaz (TrueThomaz.BM).';
  const partnershipWhatsappUrl = whatsappUrl(PARTNERSHIP_PREFILLED_MESSAGE);

  const benefits = [
    {
      id: 'anuncios',
      icon: MessageSquareQuote,
      tag: 'Google & Meta Ads',
      title: 'Anúncios no Google e nas redes sociais',
      description:
        'Campanhas no Google e na Meta (Instagram e Facebook) que levam a pessoa certa direto para o seu WhatsApp no momento em que ela procura seu serviço.',
      accent: 'from-blue-600/30 to-indigo-600/20',
      iconColor: 'text-blue-400',
    },
    {
      id: 'testes',
      icon: Target,
      tag: 'Fotos reais & Região',
      title: 'Teste de anúncios com fotos reais',
      description:
        'Teste prático de anúncios com fotos reais do seu trabalho para descobrir o que mais chama a atenção e gera contatos na sua cidade ou bairro.',
      accent: 'from-blue-600/30 to-sky-600/20',
      iconColor: 'text-sky-400',
    },
    {
      id: 'consultoria',
      icon: TrendingUp,
      tag: 'Processo Comercial',
      title: 'Consultoria comercial e roteiros',
      description:
        'Organização do atendimento, roteiros simples de resposta para o WhatsApp e acompanhamento de quem chamou para não perder nenhuma oportunidade.',
      accent: 'from-indigo-600/30 to-blue-600/20',
      iconColor: 'text-indigo-400',
    },
  ];

  return (
    <section
      id={id}
      tabIndex={-1}
      className="section-auto-contain pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28 bg-[#050814] relative border-t border-blue-500/15 overflow-x-clip scroll-mt-20 sm:scroll-mt-24 focus:outline-none"
    >
      {/* Elementos visuais sutis de fundo */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,100%)] h-[400px] bg-blue-600/[0.08] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-indigo-600/[0.08] blur-[140px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
          {/* Cabeçalho da Seção com BiReveal */}
          <BiReveal direction="up">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/35 text-blue-300 text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.25)]">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                <span>PARCERIA ESTRATÉGICA</span>
              </div>

              <SplitLines
                as="h2"
                text="Site é a vitrine. Agora, como o cliente chega até ela?"
                className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.16] text-balance"
              />

              <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed font-normal max-w-2xl mx-auto">
                Indicamos o Thomaz (TrueThomaz.BM) para você anunciar no Google e na Meta (Instagram e Facebook), com o cliente caindo direto no seu WhatsApp.
              </p>
            </div>
          </BiReveal>

          {/* Destaque da Parceria ēloSites + TrueThomaz.BM com BiReveal */}
          <BiReveal direction="up" delay={100}>
            <div className="glass-panel bracket-panel rounded-2xl p-6 sm:p-8 lg:p-10 border border-blue-500/25 bg-[#090E23] relative shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
                <div className="space-y-3.5 max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Condição especial para clientes ēloSites</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Anúncios no Google e Meta combinados com acompanhamento comercial
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    Clientes que desenvolvem seu site com a <strong className="text-white font-semibold">ēloSites</strong> têm acesso a uma condição especial nos serviços do nosso parceiro recomendado, <strong className="text-white font-semibold">Thomaz</strong>, da <strong className="text-white font-semibold">TrueThomaz.BM</strong>.
                  </p>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                    A proposta vai além de criar anúncios: prepara seu atendimento no WhatsApp para aproveitar cada contato e transformar conversas em fechamentos.
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-start lg:items-end justify-center pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/[0.08] lg:pl-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600/30 via-indigo-600/25 to-blue-500/30 border border-blue-500/40 flex items-center justify-center font-display font-bold text-lg text-blue-300 shadow-inner">
                      TT
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-semibold text-white">Thomaz</span>
                      <span className="block text-xs text-slate-400">TrueThomaz.BM</span>
                    </div>
                  </div>
                  <span className="mt-3 text-[11px] font-mono text-blue-300/90 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-500/30">
                    Parceiro Homologado
                  </span>
                </div>
              </div>
            </div>
          </BiReveal>

          {/* Card OURO Destacado: Treinamento do time para fechar vendas no WhatsApp */}
          <BiReveal direction="up" delay={120}>
            <div className="glass-panel bracket-panel rounded-2xl p-6 sm:p-8 border-2 border-amber-400/50 bg-gradient-to-br from-[#1c1305]/80 via-[#0d1226]/90 to-[#090e23] relative shadow-[0_0_35px_rgba(245,158,11,0.2)]">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/30 to-yellow-600/20 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <Flame className="w-7 h-7 text-amber-400" />
                </div>
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400/40 text-amber-300 text-xs font-mono font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>DIFERENCIAL DE OURO</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Treinamento do seu time para fechar vendas no WhatsApp
                  </h3>
                  <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
                    Não adianta atrair cliente se a mensagem no WhatsApp fica sem resposta ou se a equipe não sabe conduzir a conversa até o fechamento. O Thomaz treina quem atende para responder rápido, tirar dúvidas com segurança e transformar conversas em clientes pagantes.
                  </p>
                </div>
              </div>
            </div>
          </BiReveal>

          {/* Grid dos 3 Benefícios e Entregas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                O que entra no acompanhamento com o Thomaz:
              </span>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 benefits-list scroll-perf-list scroll-snap-y-container card-list-container"
              style={{
                scrollSnapType: 'y mandatory',
                scrollPaddingTop: 'clamp(4.5rem, 12vh, 6.5rem)',
              }}
            >
              {benefits.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <BiReveal
                    key={item.id}
                    direction={index % 2 === 0 ? 'left' : 'right'}
                    index={index}
                    className="h-full scroll-snap-card card-snap-item"
                    style={{
                      scrollSnapAlign: 'start',
                      scrollSnapStop: 'normal',
                      scrollMarginTop: 'clamp(4.5rem, 12vh, 6.5rem)',
                    }}
                  >
                    <div className="glass-panel glass-card-interactive benefit-card scroll-perf-card scroll-snap-card card-snap-item bracket-panel rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-[#090E23] border border-blue-500/20 hover:border-blue-400/50 shadow-2xl shadow-black/80 transition-all duration-300 group h-full">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent} border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}
                          >
                            <IconComponent className={`w-6 h-6 ${item.iconColor}`} />
                          </div>
                          <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                            {item.tag}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-blue-200 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-sm text-slate-300 leading-relaxed font-normal">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </BiReveal>
                );
              })}
            </div>
          </div>

          {/* Apoio Complementar e Boas Práticas com BiReveal */}
          <BiReveal direction="up" delay={150}>
            <div className="glass-panel bracket-panel rounded-2xl p-4 sm:p-5 bg-[#090E23] border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </div>
                <p className="leading-relaxed">
                  <strong className="text-white font-medium">Apoio complementar:</strong> orientação prática para fortalecer o perfil no Google Meu Negócio e recomendações de segurança digital para proteger suas contas de anúncios e redes sociais.
                </p>
              </div>
              <span className="shrink-0 text-[11px] font-mono text-blue-300 self-end sm:self-center">
                Alinhado conforme o escopo
              </span>
            </div>
          </BiReveal>

          {/* Cartão de Preço / Condição Especial de Entrada com BiReveal */}
          <BiReveal direction="up" delay={200}>
            <div className="relative rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-b from-[#0B1228] via-[#090E23] to-[#050814] border border-blue-500/35 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] overflow-hidden">
              {/* Brilho decorativo de fundo */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 blur-[90px] pointer-events-none rounded-full" />

              <div className="relative z-10 space-y-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div>
                    <span className="section-kicker block text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1.5">
                      Proposta sob medida para indicados
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      Condição especial de entrada
                    </h3>
                  </div>

                  <div className="inline-flex flex-col items-start sm:items-end">
                    <div className="inline-flex items-baseline gap-1.5">
                      <span className="font-display text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-sky-300">
                        R$ 500
                      </span>
                      <span className="text-sm font-semibold text-slate-300">/mês</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-emerald-400 tracking-wide mt-0.5">
                      Primeiros 3 meses
                    </span>
                  </div>
                </div>

                {/* Detalhes da Condição */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong className="text-white font-medium">R$ 500 por mês nos 3 primeiros meses</strong> como condição de entrada negociada para clientes ēloSites.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Após os 3 meses, a continuidade e os valores são alinhados diretamente com o Thomaz conforme a evolução do trabalho.
                    </p>
                  </div>
                </div>

                {/* Aviso do Investimento em Anúncios separado da gestão */}
                <div className="rounded-xl p-4 bg-slate-950/80 border border-amber-400/25 text-xs text-slate-300 space-y-1 lg:space-y-0 lg:flex lg:items-center lg:gap-2.5">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold uppercase tracking-wider text-[11px] font-mono shrink-0">
                    <Info className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Investimento em mídia<span className="hidden lg:inline">:</span></span>
                  </div>
                  <p className="leading-relaxed pl-6 lg:pl-0">
                    O valor pago aos canais de anúncio (Google/Meta) é definido por você e pago diretamente às plataformas. Não está incluso na mensalidade do serviço.
                  </p>
                </div>

                {/* Chamada para Ação Principal (CTA WhatsApp com a ēloSites) */}
                <div className="pt-3 flex flex-col items-center justify-center border-t border-white/[0.08]">
                  <a
                    id="cta-parceria-trafego-whatsapp"
                    href={partnershipWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center text-center gap-3 px-6 sm:px-8 py-4 sm:py-4.5 rounded-2xl text-base sm:text-lg font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] border border-emerald-400/40 shadow-xl shadow-emerald-950/50 hover:shadow-[0_0_26px_rgba(37,211,102,0.65)] pressable min-h-12 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] cursor-pointer group select-none"
                    aria-label="Quero conhecer a condição especial — Falar com a ēloSites pelo WhatsApp"
                  >
                    <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform shrink-0" />
                    <span>Quero conhecer a condição especial</span>
                    <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform shrink-0" />
                  </a>
                </div>

                {/* Nota de Confiança e Transparência */}
                <div className="pt-2 text-center text-xs text-slate-400/90 leading-relaxed max-w-2xl mx-auto border-t border-white/[0.04]">
                  A contratação e os pagamentos são feitos diretamente com o Thomaz (TrueThomaz.BM). A ēloSites apenas indica o parceiro por confiar no trabalho dele.
                </div>
              </div>
            </div>
          </BiReveal>
        </div>
      </div>
    </section>
  );
};

