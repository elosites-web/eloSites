import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { whatsappUrl } from '../types';
import { BiReveal } from './BiReveal';

interface FounderCardProps {
  className?: string;
  onNavigateToCartao?: () => void;
}

/**
 * Card Oficial do Fundador (Everton Lopes)
 * Fiel à referência visual (eu_1d137d4a.JPG): moldura obsidian profunda, cantoneiras técnicas,
 * foto circular com halo luminoso, badge de fundador, headline de impacto, bio e botão de WhatsApp direto.
 */
export const FounderCard: React.FC<FounderCardProps> = ({ className = '', onNavigateToCartao }) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const whatsappHref = whatsappUrl('Olá Everton, vi seu perfil na ēloSites e quero tirar dúvidas.');

  const handleNavigateToCartao = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 900);
    if (onNavigateToCartao) {
      onNavigateToCartao();
    } else {
      if (window.location.hash === '#cartao-digital') {
        const el = document.getElementById('cartao-digital') || document.getElementById('cartao-de-visitas');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.location.hash = 'cartao-digital';
      }
    }
  };

  return (
    <BiReveal direction="up" delay={80} className={`w-full ${className}`}>
      <div className="relative w-full rounded-3xl p-6 sm:p-8 lg:p-10 bg-[#070b1a]/95 border border-indigo-500/20 shadow-2xl shadow-black/80 backdrop-blur-xl overflow-hidden group hover:border-indigo-500/35 transition-all duration-300">
        {/* Cantoneiras decorativas técnicas (top-left & bottom-right) */}
        <div
          className="absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 border-indigo-400/40 rounded-tl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-3.5 right-3.5 w-4 h-4 border-b-2 border-r-2 border-indigo-400/40 rounded-br pointer-events-none"
          aria-hidden="true"
        />

        {/* Efeito de luz ambiente azul/índigo sutil no fundo do card */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-600/10 blur-[90px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/10 blur-[90px] rounded-full pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 sm:gap-8 lg:gap-10 my-auto">
          {/* COLUNA ESQUERDA: Retrato Circular do Fundador com Halo e Badge (sempre centralizado) */}
          <div
            onClick={handleNavigateToCartao}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavigateToCartao();
              }
            }}
            role="button"
            tabIndex={0}
            title="Ver cartão de visitas digital de Everton Lopes na página FAQ & Contato"
            aria-label="Ver cartão de visitas digital de Everton Lopes na página FAQ & Contato"
            className="flex flex-col items-center justify-center shrink-0 self-center pb-3 md:pb-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#070b1a] rounded-full group/avatar-col transition-transform duration-200"
          >
            {/* Foto circular com halo gradiente e brilho com zoom/motion/pulse ao passar o mouse ou clicar */}
            <motion.div
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              animate={
                isPulsing
                  ? {
                      scale: [1, 1.12, 1.04, 1.08, 1],
                      rotate: [0, -1.2, 1.2, -0.4, 0],
                      transition: { duration: 0.85, ease: 'easeOut' },
                    }
                  : undefined
              }
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-full p-1 bg-gradient-to-tr from-indigo-600/50 via-purple-500/35 to-blue-500/30 shadow-[0_0_35px_rgba(99,102,241,0.28)] hover:shadow-[0_0_55px_rgba(99,102,241,0.65)] active:shadow-[0_0_65px_rgba(129,140,248,0.8)] flex items-center justify-center transition-shadow duration-300 group/avatar select-none"
            >
              <img
                src="/eu.png"
                alt="Everton Lopes — Fundador da ēloSites"
                width={192}
                height={192}
                loading="lazy"
                decoding="async"
                className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover/avatar:scale-102"
              />

              {/* Selo 'Fundador' posicionado na borda inferior do retrato, flutuando suavemente */}
              <div className="founder-badge absolute -bottom-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050814]/90 border border-slate-700/60 text-slate-300 font-mono text-xs shadow-md shadow-black/40 whitespace-nowrap z-10 transition-transform duration-200 group-hover/avatar:scale-105">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </span>
                <span>Fundador</span>
              </div>
            </motion.div>
          </div>

          {/* COLUNA DIREITA: Kicker, Headline, Bio e Ações */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-3 sm:space-y-4">
            {/* Kicker Pill com estrela */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wider uppercase font-mono">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
              <span>QUEM ESTÁ POR TRÁS DA ēloSites</span>
            </div>

            {/* Headline Oficial */}
            <h3 className="font-display text-2xl sm:text-3xl lg:text-[2rem] font-bold text-white tracking-tight leading-tight">
              Tecnologia, criatividade e propósito em cada projeto.
            </h3>

            {/* Parágrafo de Apresentação e Posicionamento */}
            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-2xl">
              Sou <strong className="font-bold text-white">Everton Lopes</strong>, fundador da{' '}
              <strong className="font-bold text-white">ēloSites</strong>. Desenvolvo sites profissionais do zero, pensados para apresentar o seu trabalho com clareza, estruturados com boas práticas para indexação e facilitando o contato de novos clientes pelo WhatsApp.
            </p>

            {/* Linha de Ações */}
            <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 w-full">
              {/* Botão de WhatsApp Corporativo */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer group/wa"
                aria-label="Conversar diretamente com Everton via WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-400 group-hover/wa:scale-110 transition-transform" />
                <span>Conversar diretamente com Everton</span>
              </a>

              {/* Botão para ancorar para o Cartão de Visitas na página FAQ & Contato */}
              <button
                type="button"
                onClick={handleNavigateToCartao}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/40 hover:border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all cursor-pointer group/card"
                aria-label="Ver cartão de visitas digital de Everton Lopes na página FAQ & Contato"
              >
                <span>Ver cartão de visitas</span>
                <span className="text-indigo-400 group-hover/card:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </BiReveal>
  );
};
