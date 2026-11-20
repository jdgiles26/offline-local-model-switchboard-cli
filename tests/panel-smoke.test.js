/* Panel smoke tests — run the inline script from switchboard-control-panel.html
 * in Node with a minimal stub DOM and exercise the logic the page describes:
 * request validation, endpoint registration, profile routing, usage totals,
 * the command-line simulator, BM25 search, and the model-load failure path.
 *
 * No browser is needed and no model is downloaded: the page's auto-load runs
 * against the stubbed environment, its CDN imports fail there, and the test
 * asserts the page reports that failure instead of inventing a reply.
 *
 * Run: node --test tests/panel-smoke.test.js
 */
'use strict';

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');

const HTML_PATH = path.join(__dirname, '..', 'switchboard-control-panel.html');
const html = fs.readFileSync(HTML_PATH, 'utf8');
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.indexOf('</script>', scriptStart);
assert.ok(scriptStart >= 0 && scriptEnd > scriptStart, 'inline <script> block found');
const panelScript = html.slice(scriptStart + '<script>'.length, scriptEnd);

const PRESET_VALUES = {
  modelSel: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
  engineSel: 'transformers',
  daysSel: '1',
  searchScope: 'both',
  listen: '127.0.0.1:8080',
  epTimeout: '30',
  reqBody: '{"model":"x","messages":[{"role":"user","content":"hi"}]}',
};

function makeElement(id, elements) {
  const el = {
    id,
    value: PRESET_VALUES[id] || '',
    textContent: '',
    innerHTML: '',
    className: '',
    disabled: false,
    files: [],
    style: {},
    children: [],
    onclick: null,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    click() { if (typeof this.onclick === 'function') this.onclick(); },
    appendChild(child) { this.children.push(child); return child; },
  };
  elements.set(id, el);
  return el;
}

let ctx;
let elements;

function el(id) { return elements.get(id); }

function run(code) { return vm.runInContext(code, ctx); }

before(async () => {
  elements = new Map();
  const documentStub = {
    getElementById(id) {
      if (!elements.has(id)) makeElement(id, elements);
      return elements.get(id);
    },
    createElement(tag) { return makeElement('created-' + tag + '-' + elements.size, elements); },
  };
  const sandbox = {
    console,
    document: documentStub,
    navigator: {},
    setTimeout, clearTimeout, setInterval, clearInterval,
    performance,
    Blob,
    URL,
    TextDecoder,
    confirm: () => true,
    fetch: () => Promise.reject(new Error('no network in test')),
    addEventListener() {},
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  ctx = vm.createContext(sandbox);
  run(panelScript);
  // Wait for the page's auto-load attempt to settle. Its CDN imports fail in
  // this stubbed environment; the page must report that and stop loading.
  const deadline = Date.now() + 15000;
  while (run('modelLoading') && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 200));
  }
  assert.equal(run('modelLoading'), false, 'auto-load settles (fails cleanly in test env)');
});

describe('panel: initial state', () => {
  it('starts with two built-in endpoints, drafting profile, gateway stopped', () => {
    const st = run('state');
    assert.equal(st.endpoints.length, 2);
    assert.equal(st.endpoints[0].name, 'local-webllm');
    assert.equal(st.endpoints[1].name, 'local-webllm-review');
    assert.equal(st.active, 'drafting');
    assert.equal(st.gateway, false);
  });

  it('reports the model-load failure instead of inventing a model', () => {
    assert.match(el('modelState').textContent, /LOAD FAILED/);
    assert.match(el('loadMsg').textContent, /Model failed to load after trying every engine/);
    assert.equal(run('loadedModel'), null);
  });
});

describe('panel: request validation', () => {
  it('accepts a well-formed request', () => {
    const v = run('validateReq(JSON.stringify({model:"m",messages:[{role:"user",content:"hi"}],temperature:0.7}))');
    assert.equal(v.status, 200);
  });
  it('rejects malformed JSON with 400', () => {
    assert.equal(run('validateReq("{not json")').status, 400);
  });
  it('rejects a missing model field with 400', () => {
    assert.equal(run('validateReq(JSON.stringify({messages:[{role:"user",content:"hi"}]}))').status, 400);
  });
  it('rejects an empty messages array with 400', () => {
    assert.equal(run('validateReq(JSON.stringify({model:"m",messages:[]}))').status, 400);
  });
  it('rejects an out-of-range temperature with 400', () => {
    assert.equal(run('validateReq(JSON.stringify({model:"m",messages:[{role:"user",content:"hi"}],temperature:9}))').status, 400);
  });
  it('rejects a body over 10 MB with 413', () => {
    const v = run('validateReq("x".repeat(10*1024*1024+1))');
    assert.equal(v.status, 413);
  });
});

describe('panel: endpoints and profiles', () => {
  it('refuses bad endpoint input and accepts a good one', () => {
    assert.equal(run('addEndpoint("","","m","small",30)').ok, false);
    assert.equal(run('addEndpoint("dup","http://127.0.0.1:9","m","small",30)').ok, true);
    assert.equal(run('addEndpoint("dup","http://127.0.0.1:9","m","small",30)').ok, false);
    assert.equal(run('addEndpoint("bad","ftp://x","m","small",30)').ok, false);
    assert.equal(run('addEndpoint("bad2","http://127.0.0.1:9","m","small",999)').ok, false);
    assert.ok(run('state').endpoints.some((e) => e.name === 'dup'));
  });

  it('routes drafting to the small endpoint and review to the large one', () => {
    assert.equal(run('routeFor("drafting")').name, 'local-webllm');
    assert.equal(run('routeFor("review")').name, 'local-webllm-review');
    el('useReview').click();
    assert.equal(run('state').active, 'review');
    assert.equal(el('activeProfile').textContent, 'review');
    el('useDraft').click();
    assert.equal(run('state').active, 'drafting');
  });
});

describe('panel: usage totals', () => {
  it('sums tokens per day window and per model', () => {
    const now = new Date().toISOString();
    const threeDaysAgo = new Date(Date.now() - 3 * 864e5).toISOString();
    run(`state.log = [
      {time: ${JSON.stringify(now)}, profile: 'drafting', endpoint: 'local-webllm', model: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC', prompt: 10, completion: 5, ms: 100, outcome: '200 OK'},
      {time: ${JSON.stringify(threeDaysAgo)}, profile: 'review', endpoint: 'local-webllm-review', model: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC', prompt: 20, completion: 10, ms: 200, outcome: '200 OK'}
    ]; render();`);
    assert.equal(run('totals(1)').total, 15);
    assert.equal(run('totals(7)').total, 45);
    assert.equal(run('totals(7, "Qwen2.5-1.5B-Instruct-q4f16_1-MLC")').total, 30);
    assert.equal(run('totals(1, "Qwen2.5-1.5B-Instruct-q4f16_1-MLC")').total, 0);
  });
});

describe('panel: command-line simulator', () => {
  function runCli(line) {
    el('cliInput').value = line;
    el('cliRun').click();
    return el('cliOut').textContent;
  }
  it('--help exits 0 and lists the commands', () => {
    const out = runCli('switchboard --help');
    assert.ok(out.startsWith('exit 0'));
    assert.match(out, /serve/);
    assert.match(out, /endpoint add\|list\|remove/);
    assert.match(out, /profile list\|use\|show/);
  });
  it('endpoint --help exits 0 (group help, not "unknown subcommand")', () => {
    const out = runCli('switchboard endpoint --help');
    assert.ok(out.startsWith('exit 0'));
    assert.match(out, /endpoint add/);
  });
  it('endpoint list shows the built-in endpoints', () => {
    const out = runCli('switchboard endpoint list');
    assert.ok(out.startsWith('exit 0'));
    assert.match(out, /local-webllm/);
  });
  it('profile use switches and an unknown profile exits 4', () => {
    assert.match(runCli('switchboard profile use review'), /exit 0/);
    assert.equal(run('state').active, 'review');
    assert.match(runCli('switchboard profile use nope'), /exit 4/);
    assert.match(runCli('switchboard profile show'), /review/);
    runCli('switchboard profile use drafting');
  });
  it('usage --days out of range exits 1; unknown subcommand exits 2', () => {
    assert.match(runCli('switchboard usage --days 99'), /exit 1/);
    assert.match(runCli('switchboard bogus'), /exit 2/);
  });
  it('status names the active profile and the endpoints', () => {
    const out = runCli('switchboard status');
    assert.match(out, /Active profile: drafting/);
    assert.match(out, /local-webllm-review/);
    assert.match(out, /Last 24h tokens: 15/);
  });
});

describe('panel: BM25 search', () => {
  it('the in-page BM25 self-tests all pass', () => {
    const out = run('bm25SelfTests()');
    assert.ok(out.length > 0);
    assert.ok(out.every((line) => line.indexOf('PASS') === 0), out.join('\n'));
  });
  it('ranks the drafting endpoint for "drafting" and nothing for a nonsense word', () => {
    const hits = run('searchDocuments("drafting", "endpoints")');
    assert.ok(hits.length >= 1);
    assert.ok(hits.every((h) => h.score > 0));
    // Both built-ins carry "drafting" (small) or "review" (large) in their
    // indexed text; the short "dup" endpoint added by an earlier test may
    // outrank them on length norm, so assert presence, not first place.
    assert.ok(hits.some((h) => /local-webllm/.test(h.doc.primaryContent)));
    // Note: length check, not deepEqual — the array comes from the vm realm
    // and deepStrictEqual rejects cross-realm arrays.
    assert.equal(run('searchDocuments("zzzzqqq", "both")').length, 0);
  });
});

describe('panel: no self-congratulatory labels', () => {
  it('contains no "real" / "REAL" self-label anywhere in the file', () => {
    assert.doesNotMatch(html, /\breal\b/i);
    assert.doesNotMatch(html, /actually real/i);
  });
});
