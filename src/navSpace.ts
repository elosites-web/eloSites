/**
 * Lógica pura de cálculo do espaço disponível na navbar institucional.
 * Evita quebras de linha, sobreposições e cortes entre logotipo e links de navegação.
 */

export interface NavFitOptions {
  /** Espaço de respiro/segurança para navegação confortável (padrão: 24px) */
  buffer?: number;
}

/**
 * Determina se os links da navbar horizontal cabem com conforto no container.
 * Retorna false se o container ainda não tiver dimensões válidas ou se o espaço for insuficiente.
 */
export function canFitNavbar(
  containerWidth: number,
  requiredWidth: number,
  options: NavFitOptions = {}
): boolean {
  const { buffer = 24 } = options;

  if (containerWidth <= 0 || requiredWidth <= 0) {
    return false;
  }

  return containerWidth >= requiredWidth + buffer;
}
