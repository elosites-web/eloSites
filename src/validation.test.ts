import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateEmail,
  validateName,
  validateBusinessName,
  validatePhone,
  validateLgpd,
  formatPhoneMask,
} from './validation';

test('validateEmail handles untouched state', () => {
  const result = validateEmail('invalid-email', false);
  assert.equal(result.status, 'idle');
  assert.equal(result.message, '');
});

test('validateEmail detects empty required field', () => {
  const result = validateEmail('', true);
  assert.equal(result.status, 'error');
  assert.match(result.message, /informe seu e-mail/i);
});

test('validateEmail detects invalid email formats', () => {
  const invalidEmails = [
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@example.com',
    'Joe Smith <email@example.com>',
    'email.example.com',
    'email@example@example.com',
    'email@example',
    'email@example.a',
  ];

  for (const email of invalidEmails) {
    const result = validateEmail(email, true);
    assert.equal(result.status, 'error', `Expected ${email} to be invalid`);
    assert.match(result.message, /formato de e-mail inválido/i);
  }
});

test('validateEmail recognizes valid emails', () => {
  const validEmails = [
    'contato@elosites.ia.br',
    'cliente@gmail.com',
    'joao.silva@empresa.com.br',
    'contato+teste@sub.dominio.org',
  ];

  for (const email of validEmails) {
    const result = validateEmail(email, true);
    assert.equal(result.status, 'success', `Expected ${email} to be valid`);
    assert.equal(result.message, 'E-mail válido.');
  }
});

test('validateName validates minimum characters', () => {
  assert.equal(validateName('', true).status, 'error');
  assert.equal(validateName('A', true).status, 'error');
  assert.equal(validateName('Ana', true).status, 'success');
  assert.equal(validateName('Carlos Eduardo', true).status, 'success');
});

test('validateBusinessName validates minimum characters', () => {
  assert.equal(validateBusinessName('', true).status, 'error');
  assert.equal(validateBusinessName('X', true).status, 'error');
  assert.equal(validateBusinessName('Barbearia 10', true).status, 'success');
});

test('validatePhone validates brazilian phone digits', () => {
  assert.equal(validatePhone('', true).status, 'error');
  assert.equal(validatePhone('119999', true).status, 'error');
  assert.equal(validatePhone('(11) 99999-9999', true).status, 'success');
  assert.equal(validatePhone('(11) 3333-4444', true).status, 'success');
});

test('validateLgpd validates consent requirement', () => {
  assert.equal(validateLgpd(false, true).status, 'error');
  assert.equal(validateLgpd(true, true).status, 'success');
});

test('formatPhoneMask formats digits accurately', () => {
  assert.equal(formatPhoneMask('11'), '11');
  assert.equal(formatPhoneMask('11999999999'), '(11) 99999-9999');
  assert.equal(formatPhoneMask('1133334444'), '(11) 3333-4444');
});
