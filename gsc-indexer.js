/* GSC Indexer v1.0 — Google Search Console me URLs ko ek-ek karke
   "URL Inspection → Request Indexing" karwata hai, automatically.
   Use: GSC page (search.google.com/search-console/...) pe login ho ke →
   F12 → Console → ye code paste → Enter → ▶ Start
   Trusted-Type-safe (Google pages pe chalega) */
(function () {
  'use strict';
  if (window.__gscCleanup) {
    try { window.__gscCleanup(); } catch (e) {}
  }
  if (window.self !== window.top) return;

  const DEFAULT_URLS = [
    'https://www.sarkariupdates.live/jobs/assistantmanager',
    'https://www.sarkariupdates.live/jobs/multitaskingstaffmts',
    'https://www.sarkariupdates.live/jobs/beml-officer-recruitment-2026',
    'https://www.sarkariupdates.live/jobs/csir-nal-project-staff-recruitment-2026-walk-in-interview-for-89-posts',
    'https://www.sarkariupdates.live/jobs/junioraccountsofficerjaowarden',
    'https://www.sarkariupdates.live/jobs/projectassistantprojectassociate',
    'https://www.sarkariupdates.live/jobs/up-primary-teacher-recruitment-2026-apply-online-for-12405-posts',
    'https://www.sarkariupdates.live/jobs/income-tax-kolkata-ta-mts-recruitment-2026-apply-for-82-sports-quota-posts',
    'https://www.sarkariupdates.live/jobs/yadgir-district-court-recruitment-2026-apply-online-for-23-typist-others-posts',
    'https://www.sarkariupdates.live/jobs/jharkhand-high-court-law-researcher-recruitment-2026-apply-online-for-25-law-researcher-research-associate-posts'
  ];

  const state = { running: false, stop: false };

  /* ---------- safe DOM helper ---------- */
  function el(tag, attrs, text) {
    const n = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === 'css') n.style.cssText = attrs[k];
        else if (k === 'cls') n.className = attrs[k];
        else n.setAttribute(k, attrs[k]);
      }
    }
    if (text != null) n.textContent = text;
    return n;
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* ---------- styles ---------- */
  const style = el('style');
  style.textContent = [
    '#gsc-panel{position:fixed;top:14px;right:14px;z-index:2147483647;width:340px;',
    'background:rgba(10,15,30,.95);backdrop-filter:blur(12px);',
    'border:1px solid rgba(52,211,153,.45);border-radius:16px;',
    'box-shadow:0 12px 40px rgba(0,0,0,.55);color:#e2e8f0;',
    'font:12px/1.5 "Segoe UI",system-ui,sans-serif;overflow:hidden;}',
    '#gsc-head{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:move;',
    'background:linear-gradient(90deg,rgba(52,211,153,.3),rgba(59,130,246,.18));}',
    '#gsc-head .sp{flex:1;}',
    '.gsc-ibtn{background:rgba(30,41,59,.9);color:#e2e8f0;border:1px solid rgba(52,211,153,.35);',
    'border-radius:7px;width:24px;height:24px;cursor:pointer;font-size:12px;}',
    '#gsc-body{padding:10px 12px 12px;display:flex;flex-direction:column;gap:8px;}',
    '#gsc-urls{width:100%;min-height:110px;resize:vertical;background:rgba(30,41,59,.9);',
    'border:1px solid rgba(52,211,153,.35);color:#fff;border-radius:8px;padding:6px 8px;',
    'font:11px/1.4 monospace;}',
    '.gsc-btn{flex:1;border:none;border-radius:9px;padding:8px;font-weight:700;cursor:pointer;',
    'color:#052e16;background:linear-gradient(90deg,#34d399,#3b82f6);transition:filter .2s;}',
    '.gsc-btn:hover{filter:brightness(1.1);}',
    '.gsc-btn.red{color:#fff;background:linear-gradient(90deg,#ef4444,#f97316);}',
    '#gsc-status{padding:6px 9px;border-radius:9px;background:rgba(148,163,184,.12);',
    'border-left:3px solid #34d399;min-height:28px;}',
    '#gsc-log{max-height:130px;overflow:auto;font-size:11px;opacity:.9;',
    'background:rgba(0,0,0,.3);border-radius:8px;padding:6px 8px;}'
  ].join('\n');
  document.head.appendChild(style);

  /* ---------- panel ---------- */
  const panel = el('div', { id: 'gsc-panel' });
  const head = el('div', { id: 'gsc-head' });
  head.appendChild(el('b', null, '🛰️ GSC Indexer'));
  head.appendChild(el('span', { cls: 'sp' }));
  const minBtn = el('button', { id: 'gsc-min', cls: 'gsc-ibtn', title: 'Minimize' }, '–');
  head.appendChild(minBtn);
  panel.appendChild(head);

  const body = el('div', { id: 'gsc-body' });
  const urlsBox = el('textarea', { id: 'gsc-urls', spellcheck: 'false' });
  body.appendChild(urlsBox);
  const row = el('div', { cls: 'it-row', css: 'display:flex;gap:6px;' });
  const startBtn = el('button', { id: 'gsc-start', cls: 'gsc-btn' }, '▶ Start Indexing');
  row.appendChild(startBtn);
  body.appendChild(row);
  const statusBox = el('div', { id: 'gsc-status' }, 'Ready — GSC pe logged in ho? ▶ Start');
  body.appendChild(statusBox);
  const logBox = el('div', { id: 'gsc-log' });
  body.appendChild(logBox);
  panel.appendChild(body);
  document.body.appendChild(panel);

  urlsBox.value = DEFAULT_URLS.join('\n');

  function setStatus(m) { statusBox.textContent = m; }
  function logLine(m) {
    logBox.appendChild(el('div', null, '• ' + m));
    logBox.scrollTop = logBox.scrollHeight;
  }

  minBtn.addEventListener('click', function () {
    const hidden = body.style.display === 'none';
    body.style.display = hidden ? 'flex' : 'none';
    minBtn.textContent = hidden ? '–' : '+';
  });

  head.addEventListener('mousedown', function (e) {
    if (e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY;
    const r = panel.getBoundingClientRect();
    function mv(ev) {
      panel.style.left = r.left + ev.clientX - sx + 'px';
      panel.style.top = r.top + ev.clientY - sy + 'px';
      panel.style.right = 'auto';
    }
    function up() {
      document.removeEventListener('mousemove', mv);
      document.removeEventListener('mouseup', up);
    }
    document.addEventListener('mousemove', mv);
    document.addEventListener('mouseup', up);
  });

  /* ---------- GSC helpers ---------- */
  function findInspectInput() {
    const inputs = document.querySelectorAll('input');
    for (const c of inputs) {
      const ph = c.getAttribute('placeholder') || '';
      if (/inspect/i.test(ph)) return c;
    }
    return document.querySelector('header input, [role="search"] input, input[type="search"]');
  }

  function setVal(input, v) {
    input.focus();
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, v);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function pressEnter(elm) {
    ['keydown', 'keypress', 'keyup'].forEach(function (type) {
      elm.dispatchEvent(new KeyboardEvent(type, {
        key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
        bubbles: true, cancelable: true
      }));
    });
  }

  function findRequestBtn() {
    const btns = document.querySelectorAll('button, [role="button"]');
    for (const b of btns) {
      const t = ((b.textContent || '') + ' ' + (b.getAttribute('aria-label') || '')).toLowerCase();
      if (/request indexing/i.test(t) && !b.disabled) return b;
    }
    return null;
  }

  async function waitFor(fn, ms) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      const r = fn();
      if (r) return r;
      await sleep(800);
    }
    return null;
  }

  function getUrls() {
    return urlsBox.value.split(/[\s,]+/).filter(function (u) {
      return /^https?:\/\//i.test(u);
    }).filter(function (u, i, a) { return a.indexOf(u) === i; });
  }

  /* ---------- main loop ---------- */
  startBtn.addEventListener('click', async function () {
    if (state.running) {
      state.stop = true;
      return;
    }
    const urls = getUrls();
    if (!urls.length) { setStatus('Pehle URLs paste karo!'); return; }
    if (!/search\.google\.com/i.test(location.hostname)) {
      setStatus('⚠️ Ye script Google Search Console page pe chalao!');
      return;
    }
    state.running = true;
    state.stop = false;
    startBtn.textContent = '⏸ Stop';
    startBtn.classList.add('red');
    let done = 0, ok = 0;

    for (let i = 0; i < urls.length; i++) {
      if (state.stop) break;
      const u = urls[i];
      const short = u.replace(/^https?:\/\//, '').slice(0, 40);
      setStatus('🔍 (' + (i + 1) + '/' + urls.length + ') inspect: ' + short);
      const inp = findInspectInput();
      if (!inp) {
        setStatus('⚠️ Inspect box nahi mila — GSC page khula hai na?');
        break;
      }
      setVal(inp, u);
      await sleep(600);
      pressEnter(inp);
      const btn = await waitFor(findRequestBtn, 25000);
      if (!btn) {
        logLine('⚠️ Request button nahi mila: ' + short);
        continue;
      }
      btn.click();
      ok++;
      logLine('✅ Requested: ' + short);
      setStatus('✅ Requested (' + ok + ') — thoda wait…');
      done = i + 1;
      // human-jaisa gap: 10-16 sec
      await sleep(10000 + Math.floor(Math.random() * 6000));
    }

    state.running = false;
    startBtn.textContent = '▶ Start Indexing';
    startBtn.classList.remove('red');
    setStatus('🏁 Ho gaya! ' + ok + '/' + urls.length + ' URLs ko indexing request gayi. Google ab crawl karega.');
    logLine('Session complete: ' + ok + '/' + urls.length);
  });

  window.__gscCleanup = function () {
    state.stop = true;
    const p = document.getElementById('gsc-panel');
    if (p) p.remove();
  };
})();
