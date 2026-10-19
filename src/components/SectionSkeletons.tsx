import React from 'react';

/**
 * Esqueleto de Carregamento (Skeleton Loading) para a seção de Diferenciais
 */
export const DifferentialsSkeleton: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#090D16]/80 relative border-t border-white/[0.05] overflow-hidden animate-pulse">
      <div className="page-shell page-x">
        {/* Cabeçalho do Skeleton */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 sm:mb-20">
          <div className="inline-block w-28 h-6 rounded-full bg-slate-800/80 mx-auto" />
          <div className="w-3/4 h-10 rounded-xl bg-slate-800/90 mx-auto" />
          <div className="w-1/2 h-5 rounded-lg bg-slate-850 mx-auto" />
        </div>

        {/* Grade de 6 Cards de Diferenciais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-6 sm:p-7 bg-[#0B101D]/90 border border-white/[0.05] flex flex-col justify-between min-h-[260px] space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-indigo-950/60 border border-indigo-800/40" />
                  <div className="w-6 h-4 rounded bg-slate-800" />
                </div>
                <div className="w-3/4 h-5 rounded-lg bg-slate-800 mb-3" />
                <div className="space-y-2">
                  <div className="w-full h-3.5 rounded bg-slate-800/70" />
                  <div className="w-5/6 h-3.5 rounded bg-slate-800/70" />
                  <div className="w-4/6 h-3.5 rounded bg-slate-800/70" />
                </div>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-indigo-900/60" />
                <div className="w-24 h-3 rounded bg-slate-800/70" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

/**
 * Esqueleto de Carregamento (Skeleton Loading) para a seção de Portfólio
 */
export const PortfolioSkeleton: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#090D16] relative min-h-screen-dvh animate-pulse">
      <div className="page-shell page-x relative w-full">
        {/* Cabeçalho */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-block w-40 h-7 rounded-full bg-slate-800/80 mx-auto" />
          <div className="w-4/5 h-11 rounded-xl bg-slate-800/90 mx-auto" />
          <div className="w-3/5 h-5 rounded-lg bg-slate-850 mx-auto" />
          {/* Botões de filtro */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="w-24 h-9 rounded-xl bg-indigo-900/50" />
            <div className="w-28 h-9 rounded-xl bg-slate-900/80" />
            <div className="w-36 h-9 rounded-xl bg-slate-900/80" />
          </div>
        </div>

        {/* Grade de 3 Cards de Projetos — Espaçamento reduzido em 50% */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-5 sm:p-6 bg-[#0B101D]/90 border border-white/[0.08] flex flex-col justify-between min-h-[540px] space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-28 h-5 rounded-full bg-indigo-950/70" />
                  <div className="w-20 h-4 rounded-full bg-emerald-950/60" />
                </div>
                <div className="w-3/4 h-6 rounded-lg bg-slate-800 mb-2" />
                <div className="w-full h-12 rounded bg-slate-850 mb-4" />
                {/* Mockup Frame Placeholder */}
                <div className="w-full aspect-[16/10] rounded-xl bg-slate-900/90 border border-white/[0.05]" />
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <div className="w-28 h-4 rounded bg-slate-800" />
                <div className="w-24 h-7 rounded-lg bg-emerald-900/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Esqueleto para a Seção de Serviços & Simulador
 */
export const ServicesSkeleton: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#090D16]/90 relative border-t border-white/[0.05] animate-pulse">
      <div className="page-shell page-x">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="w-36 h-7 rounded-full bg-slate-800/80 mx-auto" />
          <div className="w-3/4 h-11 rounded-xl bg-slate-800 mx-auto" />
          <div className="w-1/2 h-5 rounded bg-slate-850 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-6 bg-[#0B101D]/90 border border-white/[0.06] min-h-[380px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Esqueleto para a Seção de Briefing & Agendamento
 */
export const BookingSkeleton: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#090D16] relative border-t border-white/[0.05] animate-pulse">
      <div className="page-shell page-x max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="w-40 h-7 rounded-full bg-slate-800/80 mx-auto" />
          <div className="w-2/3 h-10 rounded-xl bg-slate-800 mx-auto" />
        </div>
        <div className="rounded-2xl p-8 bg-[#0B101D]/90 border border-white/[0.08] min-h-[460px]" />
      </div>
    </section>
  );
};


/**
 * Esqueleto genérico e leve para telas curtas que ainda estão sendo carregadas.
 */
export const SimpleSectionSkeleton: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#090D16] relative border-t border-white/[0.05] animate-pulse">
      <div className="page-shell page-x max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="w-32 h-6 rounded-full bg-slate-800/80 mx-auto" />
          <div className="w-3/4 h-10 rounded-xl bg-slate-800 mx-auto" />
          <div className="w-1/2 h-4 rounded bg-slate-850 mx-auto" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-6 bg-[#0B101D]/90 border border-white/[0.06] min-h-[120px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
