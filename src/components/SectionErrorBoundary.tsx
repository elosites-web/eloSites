import React from 'react';

interface SectionErrorBoundaryProps {
  children?: React.ReactNode;
}

interface SectionErrorBoundaryState {
  failed: boolean;
}

/**
 * Protege as seções carregadas por React.lazy: se um chunk antigo falhar
 * após um novo deploy, mostra um aviso em vez de deixar a tela em branco.
 */
export class SectionErrorBoundary extends React.Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  declare props: SectionErrorBoundaryProps;
  declare state: SectionErrorBoundaryState;

  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('Falha ao carregar uma seção:', error);
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="py-24 sm:py-32 bg-[#0B0F19]/80 border-t border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="max-w-xl mx-auto text-center space-y-5">
              <p className="text-base sm:text-lg text-slate-300">
                Não foi possível carregar esta seção.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="cta-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              >
                Recarregar
              </button>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
