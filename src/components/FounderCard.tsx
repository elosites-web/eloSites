import React from 'react';
import { Sparkles } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { whatsappUrl } from '../types';
import { BiReveal } from './BiReveal';

interface FounderCardProps {
  className?: string;
}

/**
 * Card Oficial do Fundador (Everton Lopes)
 * Fiel à referência visual (eu_1d137d4a.JPG): moldura obsidian profunda, cantoneiras técnicas,
 * foto circular com halo luminoso, badge de fundador, headline de impacto, bio e botão de WhatsApp direto.
 */
export const FounderCard: React.FC<FounderCardProps> = ({ className = '' }) => {
  const whatsappHref = whatsappUrl('Olá Everton, vi seu perfil na ēloSites e quero tirar dúvidas.');

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

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 lg:gap-10">
          {/* COLUNA ESQUERDA: Retrato Circular do Fundador com Halo e Badge */}
          <div className="flex flex-col items-center shrink-0">
            {/* Foto circular com halo gradiente e brilho índigo/púrpura */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-full p-1 bg-gradient-to-tr from-indigo-600/50 via-purple-500/35 to-blue-500/30 shadow-[0_0_35px_rgba(99,102,241,0.28)] flex items-center justify-center">
              <img
                src="/eu.png"
                alt="Everton Lopes — Fundador da ēloSites"
                width={192}
                height={192}
                loading="lazy"
                decoding="async"
                className="w-full h-full rounded-full object-cover"
              />

              {/* Selo 'Fundador' posicionado 75% mais abaixo da sobreposição anterior e centralizado horizontalmente */}
              <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050814]/90 border border-slate-700/60 text-slate-300 font-mono text-xs shadow-md shadow-black/40 whitespace-nowrap z-10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </span>
                <span>Fundador</span>
              </div>
            </div>
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
              <strong className="font-bold text-white">ēloSites</strong>. Desenvolvo landing pages, sites institucionais e
              experiências web interativas, combinando tecnologia, design de interfaces e SEO técnico para ajudar negócios a
              fortalecer sua presença digital.
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
            </div>
          </div>
        </div>
      </div>
    </BiReveal>
  );
};
