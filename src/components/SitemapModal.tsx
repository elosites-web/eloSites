import React, { useEffect, useRef, useState, useMemo } from 'react';
import { X, Copy, Check, Download, ExternalLink, Globe, FileCode2, ListTree, HelpCircle } from 'lucide-react';
import { SCREENS, ScreenId } from '../types';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToScreen?: (screenId: ScreenId) => void;
}

export interface SitemapEntry {
  path: string;
  url: string;
  screenId: ScreenId;
  title: string;
  priority: string;
  changefreq: 'weekly' | 'monthly' | 'daily';
  lastmod: string;
}

export const generateSitemapXml = (baseUrl: string): string => {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  const entries: Array<{
    loc: string;
    priority: string;
    changefreq: string;
    comment: string;
  }> = [
    {
      loc: `${cleanBase}/`,
      priority: '1.0',
      changefreq: 'weekly',
      comment: 'Tela 01: Home',
    },
    {
      loc: `${cleanBase}/#inicio`,
      priority: '1.0',
      changefreq: 'weekly',
      comment: 'Tela 02: Sobre a ēloSites (Apresentação, Especialidades & Fundador)',
    },
    {
      loc: `${cleanBase}/#servicos`,
      priority: '0.9',
      changefreq: 'weekly',
      comment: 'Tela 03: Serviços & Condições Comerciais',
    },
    {
      loc: `${cleanBase}/#portfolio`,
      priority: '0.9',
      changefreq: 'weekly',
      comment: 'Tela 04: Portfólio de Projetos Reais',
    },
    {
      loc: `${cleanBase}/#avaliacoes`,
      priority: '0.8',
      changefreq: 'monthly',
      comment: 'Tela 05: Avaliações de Clientes Reais',
    },
    {
      loc: `${cleanBase}/#processo`,
      priority: '0.8',
      changefreq: 'monthly',
      comment: 'Tela 06: Processo Ágil & Diferenciais',
    },
    {
      loc: `${cleanBase}/#orcamento`,
      priority: '0.9',
      changefreq: 'weekly',
      comment: 'Tela 07: Orçamento & Agendamento de Reunião',
    },
    {
      loc: `${cleanBase}/#parceria-trafego`,
      priority: '0.8',
      changefreq: 'monthly',
      comment: 'Tela 08: Parceria Estratégica | Tráfego Pago',
    },
    {
      loc: `${cleanBase}/#faq`,
      priority: '0.8',
      changefreq: 'monthly',
      comment: 'Tela 09: Perguntas Frequentes & Contato',
    },
  ];

  const urlsBlock = entries
    .map(
      (entry) => `  <!-- ${entry.comment} -->
  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlsBlock}
</urlset>`;
};

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  onNavigateToScreen,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'xml' | 'routes' | 'gsc'>('xml');

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const baseUrl = useMemo(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return window.location.origin;
    }
    return 'https://elosites.ia.br';
  }, []);

  const sitemapXml = useMemo(() => generateSitemapXml(baseUrl), [baseUrl]);

  const sitemapEntries: SitemapEntry[] = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const cleanBase = baseUrl.replace(/\/+$/, '');
    return SCREENS.map((s) => {
      const isHome = s.id === 'home';
      return {
        path: isHome ? '/' : `/#${s.id}`,
        url: isHome ? `${cleanBase}/` : `${cleanBase}/#${s.id}`,
        screenId: s.id,
        title: s.title,
        priority: isHome || s.id === 'inicio' ? '1.0' : s.id === 'portfolio' || s.id === 'servicos' || s.id === 'orcamento' ? '0.9' : '0.8',
        changefreq: isHome || s.id === 'inicio' || s.id === 'portfolio' || s.id === 'servicos' || s.id === 'orcamento' ? 'weekly' : 'monthly',
        lastmod: today,
      };
    });
  }, [baseUrl]);

  // Acessibilidade: Trava de foco e ESC
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const dialog = dialogRef.current;
    const getFocusable = () =>
      dialog
        ? Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
            )
          )
        : [];

    const firstFocusable = getFocusable()[0];
    (firstFocusable || dialog)?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = getFocusable();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === firstItem || !dialog?.contains(active)) {
          e.preventDefault();
          lastItem.focus();
        }
      } else if (active === lastItem || !dialog?.contains(active)) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  const handleCopyXml = async () => {
    try {
      await navigator.clipboard.writeText(sitemapXml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback manual para clipboard
      const ta = document.createElement('textarea');
      ta.value = sitemapXml;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownloadXml = () => {
    const blob = new Blob([sitemapXml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sitemap.xml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sitemap-modal-title"
        tabIndex={-1}
        className="glass-panel rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-300 border border-blue-500/30 bg-[#090E23]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Globe className="w-3 h-3" />
                XML Sitemaps 0.9
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Search Console Ready
              </span>
            </div>
            <h3 id="sitemap-modal-title" className="font-display text-lg sm:text-xl font-bold text-white">
              Mapa do Site XML Dinâmico (Sitemap)
            </h3>
            <p className="text-xs text-slate-400">
              Índice oficial para rastreadores e validação de URLs no Google Search Console.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar mapa do site"
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Abas e Ações */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-slate-800/80 bg-slate-900/60 text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('xml')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'xml'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Código XML</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('routes')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'routes'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span>Rotas Indexadas ({sitemapEntries.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gsc')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'gsc'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Como Enviar ao Google</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyXml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer border border-slate-700 shadow-sm"
              title="Copiar código XML para a área de transferência"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copiar XML</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadXml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white font-medium transition-colors cursor-pointer border border-indigo-400/40 shadow-sm"
              title="Baixar arquivo sitemap.xml"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .xml</span>
            </button>
          </div>
        </div>

        {/* Modal Body com overscroll-contain */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain max-h-[60vh] space-y-4">
          {activeTab === 'xml' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Arquivo gerado dinamicamente com base no domínio atual</span>
                <span className="font-mono text-indigo-300">{sitemapEntries.length} nós de URL cadastrados</span>
              </div>
              <div className="relative rounded-xl border border-slate-800 bg-[#070B14] p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-300 shadow-inner">
                <pre className="whitespace-pre">
                  <code>{sitemapXml}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Rotas oficiais rastreáveis da ēloSites configuradas com prioridades e frequências ideais para motores de busca:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {sitemapEntries.map((entry, idx) => (
                  <div
                    key={entry.path}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-400">
                          0{idx + 1}.
                        </span>
                        <h4 className="text-sm font-semibold text-white">
                          {entry.title}
                        </h4>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                          {entry.changefreq}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 break-all">
                        <span>{entry.url}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono text-slate-500 block">Prioridade</span>
                        <span className="text-xs font-bold font-mono text-emerald-400">{entry.priority}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (onNavigateToScreen) {
                            onNavigateToScreen(entry.screenId);
                            onClose();
                          } else {
                            window.location.hash = entry.screenId;
                            onClose();
                          }
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title={`Navegar para ${entry.title}`}
                        aria-label={`Navegar para ${entry.title}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gsc' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  Passo a passo para envio no Google Search Console
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Envie seu sitemap diretamente para que o Google indexe todas as telas e seções da aplicação imediatamente após a publicação.
                </p>
              </div>

              <ol className="space-y-3 list-decimal list-inside text-xs leading-relaxed">
                <li className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <strong className="text-white">Acesse sua propriedade no Google Search Console:</strong> faça login com a conta Google dona do domínio em search.google.com/search-console.
                </li>
                <li className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <strong className="text-white">Acesse o menu lateral:</strong> na barra de ferramentas à esquerda, clique na opção <strong>Sitemaps</strong> (sob a seção "Indexação").
                </li>
                <li className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <strong className="text-white">Envie o arquivo:</strong> no campo "Adicionar um novo sitemap", digite exatamente <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded font-mono">sitemap.xml</code> e clique no botão <strong>Enviar</strong>.
                </li>
                <li className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <strong className="text-white">Status de sucesso:</strong> o Google exibirá o status em verde com as 7 URLs descobertas e programadas para rastreamento.
                </li>
              </ol>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://search.google.com/search-console/sitemaps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  <span>Abrir Google Search Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                >
                  <span>Abrir /sitemap.xml no navegador</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 text-[11px]">
            Arquivo estático correspondente em <code className="font-mono text-indigo-300">/public/sitemap.xml</code>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
