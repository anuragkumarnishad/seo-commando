/* IndexNow Turbo v1.1 — Trusted-Type-safe (Google pages pe bhi chalega)
   URLs paste karo, ek click me IndexNow submit.
   Use: koi bhi page → F12 → Console → ye code paste → Enter */
(function () {
  'use strict';
  if (window.__itCleanup) {
    try { window.__itCleanup(); } catch (e) {}
  }
  if (window.self !== window.top) return;

  const DEFAULT_KEY = '7b6e753eb8e248edac06f071f2466aed';
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

  const state = {
    key: localStorage.getItem('it-key') || DEFAULT_KEY,
    total: Number(localStorage.getItem('it-total') || 0),
    busy: false
  };

  /* ---------- safe DOM helper (koi innerHTML nahi) ---------- */
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

  /* ---------- styles ---------- */
  const style = el('style');
  style.textContent = [
    '#it-panel{position:fixed;top:14px;right:14px;z-index:2147483647;width:340px;',
    'background:rgba(10,15,30,.94);backdrop-filter:blur(12px);',
    'border:1px solid rgba(249,115,22,.45);border-radius:16px;',
    'box-shadow:0 12px 40px rgba(0,0,0,.55);color:#e2e8f0;',
    'font:12px/1.5 "Segoe UI",system-ui,sans-serif;overflow:hidden;}',
    '#it-head{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:move;',
    'background:linear-gradient(90deg,rgba(249,115,22,.3),rgba(234,179,8,.18));}',
    '#it-head .sp{flex:1;}',
    '.it-ibtn{background:rgba(30,41,59,.9);color:#e2e8f0;border:1px solid rgba(249,115,22,.35);',
    'border-radius:7px;width:24px;height:24px;cursor:pointer;font-size:12px;}',
    '#it-body{padding:10px 12px 12px;display:flex;flex-direction:column;gap:8px;}',
    '.it-row{display:flex;gap:6px;align-items:center;}',
    '.it-input{flex:1;background:rgba(30,41,59,.9);border:1px solid rgba(249,115,22,.35);',
    'color:#fff;border-radius:8px;padding:5px 7px;font:inherit;}',
    '#it-urls{width:100%;min-height:110px;resize:vertical;background:rgba(30,41,59,.9);',
    'border:1px solid rgba(249,115,22,.35);color:#fff;border-radius:8px;padding:6px 8px;',
    'font:11px/1.4 monospace;}',
    '.it-btn{flex:1;border:none;border-radius:9px;padding:8px;font-weight:700;cursor:pointer;',
    'color:#fff;background:linear-gradient(90deg,#f97316,#eab308);transition:filter .2s;}',
    '.it-btn:hover{filter:brightness(1.12);}',
    '.it-btn.blue{background:linear-gradient(90deg,#3b82f6,#8b5cf6);}',
    '.it-btn.gray{color:#e2e8f0;background:rgba(148,163,184,.25);}',
    '#it-prog{height:6px;border-radius:99px;background:rgba(148,163,184,.2);overflow:hidden;}',
    '#it-prog i{display:block;height:100%;width:0%;background:linear-gradient(90deg,#f97316,#eab308);transition:width .3s;}',
    '#it-status{padding:6px 9px;border-radius:9px;background:rgba(148,163,184,.12);',
    'border-left:3px solid #f97316;min-height:28px;}',
    '#it-log{max-height:100px;overflow:auto;font-size:11px;opacity:.85;',
    'background:rgba(0,0,0,.3);border-radius:8px;padding:6px 8px;}'
  ].join('\n');
  document.head.appendChild(style);

  /* ---------- panel (pure DOM) ---------- */
  const panel = el('div', { id: 'it-panel' });

  const head = el('div', { id: 'it-head' });
  head.appendChild(el('b', null, '⚡ IndexNow Turbo'));
  head.appendChild(el('span', { cls: 'sp' }));
  const countChip = el('span', { id: 'it-count', cls: 'it-ibtn', title: 'Total submit hue URLs' }, '0');
  countChip.style.cssText = 'width:auto;padding:0 8px;';
  head.appendChild(countChip);
  const minBtn = el('button', { id: 'it-min', cls: 'it-ibtn', title: 'Minimize' }, '–');
  head.appendChild(minBtn);
  panel.appendChild(head);

  const body = el('div', { id: 'it-body' });

  const row1 = el('div', { cls: 'it-row' });
  const keyInput = el('input', { id: 'it-key', cls: 'it-input', placeholder: 'IndexNow key' });
  const saveKeyBtn = el('button', { id: 'it-savekey', cls: 'it-ibtn', title: 'Key save karo' }, '💾');
  row1.appendChild(keyInput);
  row1.appendChild(saveKeyBtn);
  body.appendChild(row1);

  const urlsBox = el('textarea', { id: 'it-urls', spellcheck: 'false' });
  body.appendChild(urlsBox);

  const row2 = el('div', { cls: 'it-row' });
  const goBtn = el('button', { id: 'it-go', cls: 'it-btn' }, '🚀 IndexNow Submit');
  const apiBtn = el('button', { id: 'it-api', cls: 'it-btn blue' }, '🔁 Site API');
  row2.appendChild(goBtn);
  row2.appendChild(apiBtn);
  body.appendChild(row2);

  const row3 = el('div', { cls: 'it-row' });
  const gscBtn = el('button', { id: 'it-gsc', cls: 'it-btn gray' }, '📋 GSC links');
  const clearBtn = el('button', { id: 'it-clear', cls: 'it-btn gray' }, '🧹 Clear');
  row3.appendChild(gscBtn);
  row3.appendChild(clearBtn);
  body.appendChild(row3);

  const progBox = el('div', { id: 'it-prog' });
  const progBar = el('i');
  progBox.appendChild(progBar);
  body.appendChild(progBox);

  const statusBox = el('div', { id: 'it-status' }, 'Ready ⚡');
  body.appendChild(statusBox);

  const logBox = el('div', { id: 'it-log' });
  body.appendChild(logBox);

  panel.appendChild(body);
  document.body.appendChild(panel);

  function setStatus(m) { statusBox.textContent = m; }
  function logLine(m) {
    logBox.appendChild(el('div', null, '• ' + m));
    logBox.scrollTop = logBox.scrollHeight;
  }
  function prog(p) { progBar.style.width = Math.round(p * 100) + '%'; }
  function setCount() { countChip.textContent = state.total; }

  urlsBox.value = DEFAULT_URLS.join('\n');
  keyInput.value = state.key;
  setCount();

  minBtn.addEventListener('click', function () {
    const hidden = body.style.display === 'none';
    body.style.display = hidden ? 'flex' : 'none';
    minBtn.textContent = hidden ? '–' : '+';
  });
  saveKeyBtn.addEventListener('click', function () {
    state.key = keyInput.value.trim();
    localStorage.setItem('it-key', state.key);
    setStatus('🔑 Key save ho gayi');
  });
  clearBtn.addEventListener('click', function () {
    urlsBox.value = '';
    logBox.textContent = '';
    prog(0);
    setStatus('Clear! Naye URLs paste karo');
  });

  head.addEventListener('mousedown', function (e) {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SPAN') return;
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

  function getUrls() {
    return urlsBox.value.split(/[\s,]+/).filter(function (u) {
      return /^https?:\/\//i.test(u);
    }).filter(function (u, i, a) { return a.indexOf(u) === i; });
  }

  /* ---------- IndexNow submit ---------- */
  goBtn.addEventListener('click', async function () {
    if (state.busy) return;
    const urls = getUrls();
    if (!urls.length) { setStatus('Pehle URLs paste karo!'); return; }
    if (!state.key) { setStatus('🔑 Key khali hai!'); return; }
    state.busy = true;
    setStatus('🚀 Bhej raha hoon: 0/' + urls.length);
    let sent = 0;
    let i = 0;
    async function worker() {
      while (i < urls.length) {
        const u = urls[i++];
        try {
          await fetch(
            'https://api.indexnow.org/indexnow?url=' + encodeURIComponent(u) +
            '&key=' + encodeURIComponent(state.key),
            { mode: 'no-cors' }
          );
          sent++;
        } catch (e) {}
        prog(i / urls.length);
        setStatus('🚀 Bhej raha hoon: ' + i + '/' + urls.length);
      }
    }
    await Promise.all([worker(), worker(), worker(), worker()]);
    state.total += sent;
    localStorage.setItem('it-total', String(state.total));
    setCount();
    setStatus('✅ ' + sent + ' URLs IndexNow ko gaye! Bing/Yandex/ChatGPT-search ab crawl karenge ⚡');
    logLine(sent + ' URLs submitted @ ' + new Date().toLocaleTimeString());
    state.busy = false;
  });

  /* ---------- Site ka /api/indexnow ---------- */
  apiBtn.addEventListener('click', async function () {
    if (!/sarkariupdates\.live$/i.test(location.hostname)) {
      setStatus('⚠️ Ye button sarkariupdates.live pe chalta hai — site kholo');
      return;
    }
    setStatus('🔁 Site API bula raha hoon…');
    try {
      const r = await fetch('/api/indexnow', { cache: 'no-store' });
      setStatus('🔁 Site API response: ' + r.status + ' — ' + (r.ok ? 'submit ho gaya!' : 'check karo'));
      logLine('Site /api/indexnow → HTTP ' + r.status);
    } catch (e) {
      setStatus('⚠️ Site API fail: ' + e.message);
    }
  });

  /* ---------- GSC links copy ---------- */
  gscBtn.addEventListener('click', function () {
    const urls = getUrls();
    if (!urls.length) { setStatus('Pehle URLs paste karo!'); return; }
    const lines = urls.map(function (u) {
      const p = new URL(u);
      const id = encodeURIComponent(p.pathname.replace(/^\//, ''));
      return 'https://search.google.com/search-console/inspect?resource_id=sc-domain%3A' +
        encodeURIComponent(p.hostname.replace(/^www\./, '')) + '&id=' + id;
    });
    const txt = lines.join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () {
        setStatus('📋 ' + lines.length + ' GSC inspection links copy ho gaye!');
      }, function () { setStatus(txt); });
    } else setStatus(txt);
  });

  window.__itCleanup = function () {
    const p = document.getElementById('it-panel');
    if (p) p.remove();
  };

  setStatus('Ready ⚡ ' + getUrls().length + ' URLs pre-loaded — 🚀 dabao!');
})();
