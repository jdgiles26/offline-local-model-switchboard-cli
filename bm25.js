/* BM25 keyword scoring — JavaScript port of bm25.py (Robertson and Zaragoza).
 *
 * score(chunk, query) = sum over query words of
 *     idf(word) * count * (k1 + 1) / (count + k1 * (1 - b + b * length / average_length))
 * k1 = 1.5, b = 0.75. Same formula, same test cases as bm25.py / test_bm25.py.
 *
 * One difference from Python: /\w+/ in JavaScript matches ASCII word characters
 * only, while Python re \w also matches Unicode letters. For the ASCII text this
 * app searches (endpoint names, model ids, log rows) the results are identical.
 */
'use strict';

function tokenize(text) {
  // Lowercase words: "Helios Energy's S1!" -> ["helios", "energy", "s", "s1"]
  return (String(text == null ? '' : text).toLowerCase().match(/\w+/g) || []);
}

function buildBm25(texts) {
  // Build the keyword index once: word -> {ids, counts}, plus lengths and average.
  const postings = {};
  const lengths = [];
  texts.forEach((text, chunkId) => {
    const counts = {};
    for (const word of tokenize(text)) counts[word] = (counts[word] || 0) + 1;
    lengths.push(Object.values(counts).reduce((a, c) => a + c, 0));
    for (const [word, count] of Object.entries(counts)) {
      if (!postings[word]) postings[word] = { ids: [], counts: [] };
      postings[word].ids.push(chunkId);
      postings[word].counts.push(count);
    }
  });
  const average = lengths.length ? lengths.reduce((a, l) => a + l, 0) / lengths.length : 0;
  return { postings, lengths, averageLength: average || 1.0 };
}

function idf(docFreq, docCount) {
  // Rare words count more. This form (as in Lucene) is never negative.
  return Math.log(1 + (docCount - docFreq + 0.5) / (docFreq + 0.5));
}

function bm25Scores(bm25, query, k1, b) {
  // BM25 score of every chunk for the query (0 for chunks that share no word).
  if (k1 === undefined) k1 = 1.5;
  if (b === undefined) b = 0.75;
  const lengths = bm25.lengths;
  const scores = new Array(lengths.length).fill(0);
  const lengthNorm = lengths.map((len) => k1 * (1 - b + (b * len) / bm25.averageLength));
  for (const word of new Set(tokenize(query))) {
    const posting = bm25.postings[word];
    if (!posting) continue;
    const weight = idf(posting.ids.length, lengths.length);
    posting.ids.forEach((id, i) => {
      const count = posting.counts[i];
      scores[id] += (weight * count * (k1 + 1)) / (count + lengthNorm[id]);
    });
  }
  return scores;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { tokenize, buildBm25, idf, bm25Scores };
}
if (typeof window !== 'undefined') {
  window.BM25 = { tokenize, buildBm25, idf, bm25Scores };
}
