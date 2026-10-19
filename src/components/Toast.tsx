import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'error';
  title: string;
  description?: string;
  durationMs?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastMessage, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'success', title, description, durationMs = 4000 }: Omit<ToastMessage, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastMessage = { id, type, title, description, durationMs };
      setToasts((prev) => [...prev.slice(-2), newToast]); // Keep max 3 toasts to prevent clutter

      window.setTimeout(() => {
        removeToast(id);
      }, durationMs);
    },
    [removeToast]
  );

  const contextValue = useMemo<ToastContextType>(
    () => ({
      toast: addToast,
      success: (title, description) => addToast({ type: 'success', title, description }),
      error: (title, description) => addToast({ type: 'error', title, description }),
      info: (title, description) => addToast({ type: 'info', title, description }),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[70] flex flex-col gap-2 pointer-events-none w-[min(380px,calc(100vw-2rem))]"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.95, y: 14 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.16, ease: [0.23, 1, 0.32, 1] } }
              }
              transition={{
                type: 'spring',
                duration: 0.36,
                bounce: 0.12,
              }}
              className="pointer-events-auto relative flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-900/95 border border-white/[0.12] text-slate-100 shadow-[0_20px_48px_-12px_rgba(0,0,0,0.85),0_1px_0_rgba(255,255,255,0.08)_inset] backdrop-blur-xl"
            >
              <div className="shrink-0 mt-0.5">
                {item.type === 'success' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                )}
                {item.type === 'error' && (
                  <AlertCircle className="w-5 h-5 text-rose-400" aria-hidden="true" />
                )}
                {item.type === 'info' && (
                  <Info className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-semibold text-white leading-tight">
                  {item.title}
                </p>
                {item.description && (
                  <p className="mt-1 text-xs text-slate-300 leading-snug">
                    {item.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeToast(item.id)}
                className="shrink-0 text-slate-400 hover:text-white p-1 rounded-md transition-colors pressable"
                aria-label="Fechar notificação"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
