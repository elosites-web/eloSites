import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';

interface PortfolioCase {
  badge: string;
  status: string;
  title: string;
  challenge: string;
  solution: string;
  tags: string[];
  urlLabel: string;
  href: string;
  variant: 'landing' | 'institutional';
  placeholderLabel: string;
}

const PORTFOLIO_CASES: PortfolioCase[] = [
  {
    badge: 'Landing page',
    status: 'Projeto publicado',
    title: 'JV Salvaia Personal Trainer',
    challenge:
      'Personal trainer com treino presencial, consultoria online e avaliação física. Precisava de uma landing page enxuta para converter tráfego pago do Instagram e do Facebook em conversas no WhatsApp.',
    solution:
      'Botão de WhatsApp para cada serviço, com mensagem pré-preenchida diferente em cada um; e galeria de exercícios.',
    tags: ['Treino presencial', 'Consultoria online', 'Avaliação física'],
    urlLabel: 'jvsalvaiapersonal.netlify.app',
    href: 'https://jvsalvaiapersonal.netlify.app',
    variant: 'landing',
    placeholderLabel: 'Representação estrutural da landing page de JV Salvaia Personal Trainer',
  },
  {
    badge: 'Site institucional',
    status: 'Projeto publicado',
    title: 'Toledo Segurança',
    challenge:
      'Empresa de segurança para eventos, portaria e rondas preventivas em Jundiaí/SP. Precisava de um site institucional que transmitisse credibilidade e gerasse contatos qualificados pelo WhatsApp.',
    solution:
      'Site institucional com identidade visual preto e dourado, seção de serviços, formulário de solicitação de orçamento e formulário de trabalhe conosco, ambos integrados ao WhatsApp.',
    tags: ['Segurança para eventos', 'Portaria e controle de acesso', 'Rondas preventivas'],
    urlLabel: 'toledoseguranca.netlify.app',
    href: 'https://toledoseguranca.netlify.app/',
    variant: 'institutional',
    placeholderLabel: 'Representação estrutural do site institucional da Toledo Segurança',
  },
  {
    badge: 'Landing page',
    status: 'Projeto publicado',
    title: 'Duelo de Fim de Ano — Amigos do Badem vs Amigos do Becala',
    challenge:
      'Grupo de amigos queria um site divertido para o racha de futebol amador de fim de ano, com escalações, histórico do clássico e resenha entre os times.',
    solution:
      "Campo tático interativo, votação da galera 'Bola Cheia vs Bola Murcha', galeria de fotos e mural da comunidade — tudo funcionando sem backend.",
    tags: ['Evento social', 'Comunidade', 'Interatividade'],
    urlLabel: 'jogodefimdeano.netlify.app',
    href: 'https://jogodefimdeano.netlify.app',
    variant: 'landing',
    placeholderLabel: 'Representação estrutural da landing page do Duelo de Fim de Ano',
  },
];

function BrowserMockup({
  urlLabel,
  href,
  children,
}: {
  urlLabel: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full rounded-xl border border-white/[0.07] bg-[#070A11] overflow-hidden shadow-[0_16px_40px_-24px_rgba(0,0,0,0.8)]">
      <div className="px-3 sm:px-4 py-2.5 bg-slate-900/90 border-b border-white/[0.06] flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
        </div>
        <div className="flex-1 min-w-0 bg-slate-950/90 rounded-md px-2.5 py-1 text-[11px] text-slate-400 font-mono border border-white/[0.07] truncate">
          {urlLabel}
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir site completo: ${urlLabel}`}
          className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/70 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
      {children}
    </div>
  );
}

function StructuralPlaceholder({
  variant,
  label,
}: {
  variant: 'landing' | 'institutional';
  label: string;
}) {
  return (
    <div
      className="relative h-full bg-[#0B101D] p-4 sm:p-5"
      role="img"
      aria-label={label}
    >
      {variant === 'landing' ? (
        <div className="h-full rounded-lg border border-white/[0.06] bg-slate-950/60 p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-2 w-24 rounded bg-indigo-500/40" />
            <div className="h-3 w-3/4 rounded bg-slate-700/80" />
            <div className="h-2 w-full rounded bg-slate-800" />
            <div className="h-2 w-5/6 rounded bg-slate-800" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 rounded bg-slate-800/90" />
            <div className="h-10 rounded bg-slate-800/90" />
            <div className="h-10 rounded bg-slate-800/90" />
          </div>
          <div className="h-8 w-32 rounded-md bg-emerald-500/25 border border-emerald-500/20" />
        </div>
      ) : (
        <div className="h-full rounded-lg border border-white/[0.06] bg-slate-950/60 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-28 rounded bg-indigo-500/35" />
            <div className="h-2 w-16 rounded bg-amber-400/30" />
          </div>
          <div className="grid grid-cols-4 gap-2 flex-1">
            <div className="col-span-2 rounded bg-slate-800/80" />
            <div className="rounded bg-slate-800/60" />
            <div className="rounded bg-slate-800/60" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-8 rounded bg-slate-800/70" />
            <div className="h-8 rounded bg-slate-800/70" />
            <div className="h-8 rounded bg-slate-800/70" />
          </div>
        </div>
      )}
      <p className="absolute bottom-3 right-4 text-[10px] uppercase tracking-wider text-slate-500 font-medium">
        Representação estrutural
      </p>
    </div>
  );
}

function LivePreview({
  url,
  label,
  variant,
}: {
  url: string;
  label: string;
  variant: 'landing' | 'institutional';
}) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'blocked'>('loading');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      setStatus((current) => (current === 'loading' ? 'blocked' : current));
    }, 9000);

    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleLoad = () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    setStatus('ready');
  };

  const handleError = () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    setStatus('blocked');
  };

  return (
    <div className="relative h-60 sm:h-72 bg-[#0B101D]">
      {status !== 'blocked' && (
        <iframe
          src={url}
          title={label}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full border-0 bg-white transition-opacity duration-300 ${
            status === 'ready' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
          <span
            className="w-8 h-8 rounded-full border-2 border-indigo-400/30 border-t-indigo-400 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          <p className="text-xs text-slate-400">Carregando prévia interativa…</p>
        </div>
      )}

      {status === 'blocked' && (
        <div className="absolute inset-0">
          <StructuralPlaceholder variant={variant} label={label} />
          <div className="absolute inset-0 bg-[#070A11]/93 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center p-5">
            <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <p className="text-sm font-semibold text-white">Prévia indisponível aqui</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              O site do cliente pode bloquear a exibição embutida por segurança. O site
              completo continua acessível e abre normalmente em uma nova aba.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white min-h-11"
            >
              <span>Abrir site completo</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export const PortfolioSection: React.FC = () => {
  const whatsappInquiryUrl = whatsappUrl(SITE_CONFIG.portfolioWhatsappMessage);

  return (
    <section id="portfolio" className="py-24 sm:py-32 bg-[#0B0F19] relative border-t border-white/[0.05] overflow-x-clip">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[min(18rem,70%)] sm:w-96 h-72 sm:h-96 max-w-full bg-indigo-500/[0.07] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[min(18rem,70%)] sm:w-96 h-72 sm:h-96 max-w-full bg-violet-600/[0.06] blur-[120px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative">
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-16 sm:mb-20">
          <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.07] text-indigo-300 text-xs sm:text-sm font-semibold uppercase">
            <span>Portfólio</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance">
            Projetos reais, no ar
          </h2>
          <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
            Cada projeto tem um objetivo comercial claro. Navegue pela prévia interativa
            quando o site permitir ou abra o site completo em uma nova aba.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {PORTFOLIO_CASES.map((item) => (
            <article
              key={item.href}
              className="surface-card flex flex-col h-full rounded-2xl overflow-hidden"
            >
              <div className="flex-1 p-6 sm:p-7 border-b border-white/[0.06] bg-slate-950/50 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono uppercase bg-indigo-950/80 text-indigo-200 border border-indigo-400/25 px-2.5 py-1 rounded font-semibold">
                    {item.badge}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">{item.status}</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {item.title}
                </h3>
                <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                  <p>
                    <span className="text-white font-semibold">Desafio. </span>
                    {item.challenge}
                  </p>
                  <p>
                    <span className="text-white font-semibold">Solução. </span>
                    {item.solution}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950 border border-white/[0.07] text-xs font-medium text-slate-200"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-[#070A11]/90">
                <BrowserMockup urlLabel={item.urlLabel} href={item.href}>
                  <LivePreview
                    url={item.href}
                    label={item.placeholderLabel}
                    variant={item.variant}
                  />
                </BrowserMockup>
                <p className="mt-3 text-xs text-slate-500">
                  Prévia interativa quando o site permite exibição embutida. Se não carregar,
                  abra o site completo em outra aba.
                </p>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200 transition-colors min-h-11"
                >
                  <span>Abrir site completo</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-indigo-950/25 border border-indigo-400/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-white font-display">
              Quer um site assim para o seu negócio?
            </h3>
            <p className="text-sm text-slate-300">
              Um site que apresenta o serviço com clareza, transmite credibilidade e leva o visitante ao contato.
            </p>
          </div>
          <a
            id="portfolio-cta-whatsapp"
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-white shrink-0 min-h-12"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
