import test from 'node:test';
import assert from 'node:assert/strict';
import { createScreenPreloader } from './preloadScreens';

test('createScreenPreloader deduplicates subsequent calls after resolving', async () => {
  let calls = 0;
  const preloader = createScreenPreloader({
    loaders: {
      portfolio: async () => {
        calls += 1;
      },
    },
    isBlocked: () => false,
  });

  await preloader.preload('portfolio');
  assert.equal(calls, 1);
  assert.equal(preloader.hasLoaded('portfolio'), true);

  await preloader.preload('portfolio');
  assert.equal(calls, 1);
});

test('createScreenPreloader coalesces concurrent in-flight preloads', async () => {
  let calls = 0;
  let release!: () => void;
  const barrier = new Promise<void>((resolve) => {
    release = resolve;
  });

  const preloader = createScreenPreloader({
    loaders: {
      servicos: async () => {
        calls += 1;
        await barrier;
      },
    },
    isBlocked: () => false,
  });

  const p1 = preloader.preload('servicos');
  const p2 = preloader.preload('servicos');
  assert.equal(preloader.isInFlight('servicos'), true);
  await Promise.resolve();
  assert.equal(calls, 1);

  release();
  await Promise.all([p1, p2]);
  assert.equal(preloader.isInFlight('servicos'), false);
  assert.equal(preloader.hasLoaded('servicos'), true);
  assert.equal(calls, 1);
});

test('createScreenPreloader allows retry after transient failure', async () => {
  let attempts = 0;
  const preloader = createScreenPreloader({
    loaders: {
      avaliacoes: async () => {
        attempts += 1;
        if (attempts === 1) {
          throw new Error('Transient network failure');
        }
      },
    },
    isBlocked: () => false,
  });

  await preloader.preload('avaliacoes');
  assert.equal(attempts, 1);
  assert.equal(preloader.hasLoaded('avaliacoes'), false);
  assert.equal(preloader.isInFlight('avaliacoes'), false);

  await preloader.preload('avaliacoes');
  assert.equal(attempts, 2);
  assert.equal(preloader.hasLoaded('avaliacoes'), true);
});

test('createScreenPreloader respects Save-Data and slow connection guard', async () => {
  let calls = 0;
  let blocked = true;
  const preloader = createScreenPreloader({
    loaders: {
      orcamento: async () => {
        calls += 1;
      },
    },
    isBlocked: () => blocked,
  });

  await preloader.preload('orcamento');
  assert.equal(calls, 0);
  assert.equal(preloader.hasLoaded('orcamento'), false);

  blocked = false;
  await preloader.preload('orcamento');
  assert.equal(calls, 1);
  assert.equal(preloader.hasLoaded('orcamento'), true);
});

test('createScreenPreloader ignores unknown keys safely', async () => {
  const preloader = createScreenPreloader({
    loaders: {},
    isBlocked: () => false,
  });

  await preloader.preload('nao-existe');
  assert.equal(preloader.hasLoaded('nao-existe'), false);
  assert.equal(preloader.isInFlight('nao-existe'), false);
});
