/* BM25 JavaScript tests — same cases as test_bm25.py (Python).
 * Run: node --test bm25.test.js   (Node built-in test runner, no dependencies)
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { tokenize, buildBm25, idf, bm25Scores } = require('./bm25.js');

const TEXTS = [
  'Helios Energy builds solar farms.',
  'Aurora Labs builds sensors. Aurora sensors measure soil.',
  'The cooperative grows grapes and olives in the valley.',
];

function approx(actual, expected, eps) {
  assert.ok(Math.abs(actual - expected) < (eps || 1e-9),
    'expected ' + actual + ' to be close to ' + expected);
}

describe('BM25 (port of test_bm25.py)', () => {
  it('tokenize', () => {
    assert.deepEqual(tokenize("Helios Energy's S1!"), ['helios', 'energy', 's', 's1']);
  });

  it('build_bm25 postings and lengths', () => {
    const bm25 = buildBm25(TEXTS);
    assert.deepEqual(bm25.postings.aurora.ids, [1]);
    assert.deepEqual(bm25.postings.aurora.counts, [2]);
    assert.deepEqual(bm25.postings.builds.ids, [0, 1]);
    assert.deepEqual(bm25.postings.builds.counts, [1, 1]);
    assert.deepEqual(bm25.lengths, [5, 8, 9]);
    approx(bm25.averageLength, 22 / 3);
  });

  it('idf: rare words count more and never negative', () => {
    assert.ok(idf(1, 3) > idf(2, 3));
    assert.ok(idf(2, 3) > idf(3, 3));
    assert.ok(idf(3, 3) > 0);
    approx(idf(1, 3), Math.log(1 + 2.5 / 1.5));
  });

  it('scores match the formula', () => {
    const bm25 = buildBm25(TEXTS);
    const k1 = 1.5, b = 0.75;
    const expected = idf(1, 3) * 2 * (k1 + 1) / (2 + k1 * (1 - b + (b * 8) / (22 / 3)));
    approx(bm25Scores(bm25, 'aurora')[1], expected);
  });

  it('scores rank matching chunks', () => {
    let scores = bm25Scores(buildBm25(TEXTS), 'solar farms');
    assert.ok(scores[0] > 0 && scores[1] === 0 && scores[2] === 0);
    scores = bm25Scores(buildBm25(TEXTS), 'builds sensors');
    assert.ok(scores[1] > scores[0] && scores[0] > 0); // 'sensors' is rare, 'builds' is shared
  });

  it('unknown words and empty index', () => {
    assert.ok(bm25Scores(buildBm25(TEXTS), 'quantum').every((s) => s === 0));
    assert.equal(bm25Scores(buildBm25([]), 'anything').length, 0);
  });
});
