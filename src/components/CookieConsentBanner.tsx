import React, { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'elosites_cookie_consent';

interface ConsentPreference {
  essential: true;
  optional: boolean;
}

export const CookieConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [optional, setOptional] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const savePreference = (preference: ConsentPreference) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
    } catch {
      /* storage unavailable — just dismiss */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Preferências de cookies"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 sm:px-4"
    >
      <div className="page-shell">
        <div className="surface-card rounded-2xl p-4 sm:p-5 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.85)]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-indigo-950/70 border border-indigo-400/20 flex items-center justify-center text-indigo-300">
              <Cookie className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1 space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                Usamos apenas cookies essenciais para o funcionamento do site. Hoje não usamos cookies
                de rastreamento, publicidade ou analytics — mas você já pode configurar sua preferência
                para o futuro.
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => savePreference({ essential: true, optional: true })}
                  className="cta-primary inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white min-h-11"
                >
                  Aceitar todos
                </button>
                <button
                  type="button"
                  onClick={() => savePreference({ essential: true, optional: false })}
                  className="cta-secondary inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-700/70 text-white min-h-11"
                >
                  Somente essenciais
                </button>
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  aria-expanded={expanded}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white border border-white/[0.07] bg-slate-950/60 transition-colors min-h-11"
                >
                  Personalizar
                </button>
              </div>

              {expanded && (
                <div className="rounded-xl border border-white/[0.07] bg-slate-950/60 p-4 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">Cookies essenciais</p>
                      <p className="text-xs text-slate-400 mt-1">
                        sempre ativos, necessários para o site funcionar
                      </p>
                    </div>
                    <span
                      role="switch"
                      aria-checked="true"
                      aria-disabled="true"
                      aria-label="Cookies essenciais sempre ativos"
                      className="relative inline-flex w-11 h-6 shrink-0 items-center rounded-full bg-indigo-600 cursor-not-allowed"
                    >
                      <span className="absolute left-0.5 w-5 h-5 rounded-full bg-white transition-transform translate-x-5" />
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        Cookies opcionais (análise/marketing)
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={optional}
                      aria-label="Cookies opcionais (análise/marketing)"
                      onClick={() => setOptional((value) => !value)}
                      className={`relative inline-flex w-11 h-6 shrink-0 items-center rounded-full transition-colors ${
                        optional ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`absolute left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                          optional ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => savePreference({ essential: true, optional })}
                    className="cta-primary inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white min-h-11"
                  >
                    Salvar preferências
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
