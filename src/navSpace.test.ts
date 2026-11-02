import test from 'node:test';
import assert from 'node:assert/strict';
import { canFitNavbar } from './navSpace';

test('canFitNavbar returns false when dimensions are uninitialized or zero', () => {
  assert.equal(canFitNavbar(0, 800), false);
  assert.equal(canFitNavbar(1200, 0), false);
  assert.equal(canFitNavbar(-10, 800), false);
});

test('canFitNavbar returns false when container width is smaller than required + buffer', () => {
  const requiredWidth = 980; // Logo + 8 links
  const buffer = 24;

  // Larguras típicas mobile/tablet
  assert.equal(canFitNavbar(360, requiredWidth, { buffer }), false);
  assert.equal(canFitNavbar(390, requiredWidth, { buffer }), false);
  assert.equal(canFitNavbar(768, requiredWidth, { buffer }), false);
  assert.equal(canFitNavbar(820, requiredWidth, { buffer }), false);
  assert.equal(canFitNavbar(980, requiredWidth, { buffer }), false);
  assert.equal(canFitNavbar(1000, requiredWidth, { buffer }), false);
});

test('canFitNavbar returns true when container width accommodates elements comfortably', () => {
  const requiredWidth = 980;
  const buffer = 24;

  // A partir de 1004px (980 + 24)
  assert.equal(canFitNavbar(1004, requiredWidth, { buffer }), true);
  assert.equal(canFitNavbar(1100, requiredWidth, { buffer }), true);
  assert.equal(canFitNavbar(1280, requiredWidth, { buffer }), true);
  assert.equal(canFitNavbar(1440, requiredWidth, { buffer }), true);
});

test('canFitNavbar respects custom buffer', () => {
  assert.equal(canFitNavbar(1000, 980, { buffer: 10 }), true);
  assert.equal(canFitNavbar(1000, 980, { buffer: 30 }), false);
});
