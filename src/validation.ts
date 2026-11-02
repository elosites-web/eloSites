/**
 * ēloSites — Módulo de validação em tempo real e formatação de formulários
 */

export interface ValidationResult {
  status: 'idle' | 'success' | 'error';
  message: string;
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validação de e-mail em tempo real
 */
export function validateEmail(val: string, isTouched: boolean = true): ValidationResult {
  if (!isTouched) return { status: 'idle', message: '' };
  const trimmed = val.trim();
  if (!trimmed) {
    return { status: 'error', message: 'Por favor, informe seu e-mail.' };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      status: 'error',
      message: 'Formato de e-mail inválido. Digite um e-mail válido (ex: seu@email.com).',
    };
  }
  return { status: 'success', message: 'E-mail válido.' };
}

/**
 * Validação de nome em tempo real
 */
export function validateName(val: string, isTouched: boolean = true): ValidationResult {
  if (!isTouched) return { status: 'idle', message: '' };
  const trimmed = val.trim();
  if (!trimmed) {
    return { status: 'error', message: 'Por favor, informe seu nome.' };
  }
  if (trimmed.length < 2) {
    return { status: 'error', message: 'O nome deve ter pelo menos 2 caracteres.' };
  }
  return { status: 'success', message: 'Nome preenchido corretamente.' };
}

/**
 * Validação de nome de empresa/negócio em tempo real
 */
export function validateBusinessName(val: string, isTouched: boolean = true): ValidationResult {
  if (!isTouched) return { status: 'idle', message: '' };
  const trimmed = val.trim();
  if (!trimmed) {
    return { status: 'error', message: 'Por favor, informe o nome do seu negócio ou empresa.' };
  }
  if (trimmed.length < 2) {
    return { status: 'error', message: 'O nome da empresa deve ter pelo menos 2 caracteres.' };
  }
  return { status: 'success', message: 'Nome da empresa registrado.' };
}

/**
 * Validação de telefone / WhatsApp com DDD
 */
export function validatePhone(val: string, isTouched: boolean = true): ValidationResult {
  if (!isTouched) return { status: 'idle', message: '' };
  const trimmed = val.trim();
  if (!trimmed) {
    return { status: 'error', message: 'Por favor, informe seu WhatsApp com DDD.' };
  }
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length < 10 || digitsOnly.length > 11) {
    return {
      status: 'error',
      message: 'WhatsApp incompleto. Digite DDD + 8 ou 9 dígitos.',
    };
  }
  return { status: 'success', message: 'WhatsApp válido para retorno.' };
}

/**
 * Validação de consentimento LGPD
 */
export function validateLgpd(agreed: boolean, isTouched: boolean = true): ValidationResult {
  if (!isTouched) return { status: 'idle', message: '' };
  if (!agreed) {
    return {
      status: 'error',
      message: 'É obrigatório concordar com a política de privacidade para liberar o envio.',
    };
  }
  return { status: 'success', message: 'Consentimento confirmado.' };
}

/**
 * Formatação de máscara brasileira para telefone (XX) XXXXX-XXXX
 */
export function formatPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}
