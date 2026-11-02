import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canRun3DEffect,
  prefersReducedMotion,
  saveDataEnabled,
  shouldReduceMedia,
  getMotionTier,
  webglSupported,
} from './mediaPrefs';

test('mediaPrefs: canRun3DEffect returns false in environment without window', () => {
  // In node:test environment, window/document are undefined by default
  const result = canRun3DEffect();
  assert.equal(result, false, 'Should be false when window is undefined');
});

test('mediaPrefs: shouldReduceMedia evaluates correctly', () => {
  assert.equal(typeof shouldReduceMedia(), 'boolean');
});

test('mediaPrefs: getMotionTier returns valid tier', () => {
  const tier = getMotionTier();
  assert.ok(['full', 'lite', 'none'].includes(tier), `Tier "${tier}" must be one of full, lite, none`);
});

test('mediaPrefs: webglSupported handles headless environment gracefully', () => {
  const supported = webglSupported();
  assert.equal(typeof supported, 'boolean');
});
