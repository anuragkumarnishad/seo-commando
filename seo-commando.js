/* SEO Commando v1.0 — sarkariupdates / pdfpixel ke liye browser-console SEO tool
   Use: apni site pe kholo → F12 → Console → ye pura code paste → Enter
   Features: sitemap audit (title/meta/h1/canonical/noindex/og) + IndexNow submit + CSV report */
(function () {
  'use strict';
  if (window.__seoCleanup) {
    try { window.__seoCleanup(); } catch (e) {}
  }
  if (window.self !== window.top) return;

  const state = {
    urls: [],
    results: [],
    busy: false,
    key: localStorage.getItem('seo-key') || ''
  };

  /* ---------- styles ---------- */
  const style = document.createElement('style');
  style.textContent = [
    '#seo-panel{position:fixed;top:14px;right:14px;z-index:2147483647;width:320px;',
    'background:rgba(10,15,30,.94);backdrop-filter:blur(12px);',
    'border:1px solid rgba(16,185,129,.4);border-radius:16px;',
    'box-shadow:0 12px 40px rgba(0,0,0,.55);color:#e2e8f0;',
    'font:12px/1.5 "Segoe UI",system-ui,sans-serif;overflow:hidden;}',
    '#seo-head{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:move;',
    'background:linear-gradient(90deg,rgba(16,185,129,.28),rgba(59,130,246,.18));}',
    '#seo-head .sp{flex:1;}',
    '.seo-ibtn{background:rgba(30,41,59,.9);color:#e2e8f0;border:1px solid rgba(16,185,129,.3);',
    'border-radius:7px;width:24px;height:24px;cursor:pointer;font-size:12px;}',
    '#seo-body{padding:10px 12px 12px;display:flex;flex-direction:column;gap:8px;}',
    '.seo-row{display:flex;gap:6px;align-items:center;}',
    '.seo-input{flex:1;background:rgba(30,41,59,.9);border:1px solid rgba(16,185,129,.35);',
    'color:#fff;border-radius:8px;padding:5px 7px;font:inherit;}',
    '.seo-btn{flex:1;border:none;border-radius:9px;padding:8px;font-weight:700;cursor:pointer;',
    'color:#052e16;background:linear-gradient(90deg,#10b981,#3b82f6);transition:filter .2s;}',
    '.seo-btn:hover{filter:brightness(1.12);}',
    '.seo-btn.orange{color:#fff;background:linear-gradient(90deg,#f97316,#ef4444);}',
    '.seo-btn.gray{color:#e2e8f0;background:rgba(148,163,184,.25);}',
    '#seo-prog{height:6px;border-radius:99px;background:rgba(148,163,184,.2);overflow:hidden;}',
    '#seo-prog i{display:block;height:100%;width:0%;background:linear-gradient(90deg,#10b981,#3b82f6);transition:width .3s;}',
    '#seo-status{padding:6px 9px;border-radius:9px;background:rgba(148,163,184,.12);',
    'border-left:3px solid #10b981;min-height:28px;}',
    '#seo-log{max-height:120px;overflow:auto;font-size:11px;opacity:.85;',
    'background:rgba(0,0,0,.3);border-radius:8px;padding:6px 8px;}'
  ].join('\n');
  document.head.appendChild(style);

  /* ---------- panel ---------- */
  const panel = document.createElement('div');
  panel.id = 'seo-panel';
  panel.innerHTML = [
    '<div id="seo-head"><b>🚀 SEO Commando</b><span class="sp"></span>',
    '<button class="seo-ibtn" id="seo-min" title="Minimize">–</button></div>',
    '<div id="seo-body">',
    '<div class="seo-row"><input class="seo-input" id="seo-key" placeholder="IndexNow key (32 hex) — optional">',
    '<button class="seo-ibtn" id="seo-savekey" title="Key save karo">💾</button></div>',
    '<div class="seo-row"><button class="seo-btn" id="seo-audit">🔍 Sitemap Audit</button>',
    '<button class="seo-btn orange" id="seo-index">🚀 IndexNow</button></div>',
    '<div class="seo-row"><button class="seo-btn gray" id="seo-csv">💾 CSV</button>',
    '<button class="seo-btn gray" id="seo-copy">📋 Report</button></div>',
    '<div id="seo-prog"><i></i></div>',
    '<div id="seo-status">Ready — apni site pe chalao 🚀</div>',
    '<div id="seo-log"></div>',
    '</div>'
  ].join('\n');
  document.body.appendChild(panel);

  const $ = function (id) { return panel.querySelector('#' + id); };

  function setStatus(msg) { $('seo-status').textContent = msg; }
  function logLine(msg) {
    const el = $('seo-log');
    el.innerHTML += '<div>• ' + msg + '</div>';
    el.scrollTop = el.scrollHeight;
  }
  function prog(p) { $('seo-prog').firstElementChild.style.width = Math.round(p * 100) + '%'; }

  $('seo-min').addEventListener('click', function () {
    const b = $('seo-body');
    const hidden = b.style.display === 'none';
    b.style.display = hidden ? 'flex' : 'none';
    this.textContent = hidden ? '–' : '+';
  });

  $('seo-key').value = state.key;
  $('seo-savekey').addEventListener('click', function () {
    state.key = $('seo-key').value.trim();
    localStorage.setItem('seo-key', state.key);
    setStatus(' Key save ho gayi');
  });

  // Draggable
  $('seo-head').addEventListener('mousedown', function (e) {
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

  /* ---------- sitemap ---------- */
  async function loadSitemap() {
    setStatus('Sitemap padh raha hoon…');
    let urls = [];
    try {
      const res = await fetch('/sitemap.xml', { cache: 'no-store' });
      if (res.ok) {
        const txt = await res.text();
        const doc = new DOMParser().parseFromString(txt, 'text/xml');
        urls = Array.from(doc.querySelectorAll('loc')).map(function (n) { return n.textContent.trim(); });
        // sitemap-index ho toh pehla child sitemap lo
        if (urls.length && /sitemap.*\.xml$/i.test(urls[0]) && urls.length <= 20 && !/\.html?$/i.test(urls[0])) {
          const r2 = await fetch(urls[0], { cache: 'no-store' });
          if (r2.ok) {
            const d2 = new DOMParser().parseFromString(await r2.text(), 'text/xml');
            urls = Array.from(d2.querySelectorAll('loc')).map(function (n) { return n.textContent.trim(); });
          }
        }
      }
    } catch (e) {}
    if (!urls.length) {
      // robots.txt se sitemap dhoondo
      try {
        const rt = await (await fetch('/robots.txt', { cache: 'no-store' })).text();
        const m = rt.match(/Sitemap:\s*(\S+)/i);
        if (m) {
          const r3 = await fetch(m[1], { cache: 'no-store' });
          const d3 = new DOMParser().parseFromString(await r3.text(), 'text/xml');
          urls = Array.from(d3.querySelectorAll('loc')).map(function (n) { return n.textContent.trim(); });
        }
      } catch (e) {}
    }
    state.urls = urls.filter(function (u, i) { return urls.indexOf(u) === i; });
    return state.urls;
  }

  /* ---------- audit ---------- */
  function auditPage(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const issues = [];
    let score = 0;
    const title = (doc.title || '').trim();
    if (title.length >= 15 && title.length <= 70) score++; else issues.push('title:' + title.length);
    const desc = doc.querySelector('meta[name="description"]');
    const dl = desc ? (desc.getAttribute('content') || '').trim().length : 0;
    if (dl >= 50 && dl <= 170) score++; else issues.push('desc:' + dl);
    const h1s = doc.querySelectorAll('h1').length;
    if (h1s === 1) score++; else issues.push('h1:' + h1s);
    if (doc.querySelector('link[rel="canonical"]')) score++; else issues.push('no-canonical');
    const robotsMeta = (doc.querySelector('meta[name="robots"]') || {}).content || '';
    if (!/noindex/i.test(robotsMeta)) score++; else issues.push('NOINDEX!');
    if (doc.querySelector('meta[property="og:title"]')) score++; else issues.push('no-og');
    return { score: score, issues: issues, title: title };
  }

  async function pool(items, worker, size, onDone) {
    let i = 0;
    let done = 0;
    async function next() {
      const idx = i++;
      if (idx >= items.length) return;
      await worker(items[idx], idx);
      done++;
      prog(done / items.length);
      onDone(done, items.length);
      await next();
    }
    const n = Math.min(size, items.length);
    await Promise.all(Array.from({ length: n }, next));
  }

  $('seo-audit').addEventListener('click', async function () {
    if (state.busy) return;
    state.busy = true;
    $('seo-log').innerHTML = '';
    const urls = state.urls.length ? state.urls : await loadSitemap();
    if (!urls.length) {
      setStatus('Sitemap nahi mila! /sitemap.xml check karo');
      state.busy = false;
      return;
    }
    setStatus('Audit chal raha hai: 0/' + urls.length);
    state.results = [];
    await pool(urls, async function (u) {
      try {
        const res = await fetch(u, { cache: 'no-store' });
        const html = await res.text();
        const a = auditPage(html);
        state.results.push(Object.assign({ url: u, status: res.status }, a));
      } catch (e) {
        state.results.push({ url: u, status: 'ERR', score: 0, issues: ['fetch-fail'], title: '' });
      }
    }, 3, function (d, t) {
      setStatus('🔍 Audit: ' + d + '/' + t);
    });
    const bad = state.results.filter(function (r) { return r.score <= 3; });
    const good = state.results.length - bad.length;
    setStatus('✅ Audit complete: ' + good + ' acche / ' + bad + ' weak pages');
    logLine('Audit khatam — 💾 CSV se report lo');
    state.busy = false;
  });

  /* ---------- indexnow ---------- */
  $('seo-index').addEventListener('click', async function () {
    if (state.busy) return;
    if (!state.key) {
      setStatus('🔑 Pehle IndexNow key daalo! (site AI se public/<key>.txt banwao)');
      return;
    }
    state.busy = true;
    const urls = state.urls.length ? state.urls : await loadSitemap();
    if (!urls.length) { setStatus('Sitemap nahi mila'); state.busy = false; return; }
    setStatus('🚀 IndexNow: 0/' + urls.length);
    let sent = 0;
    await pool(urls, async function (u) {
      try {
        await fetch('https://api.indexnow.org/indexnow?url=' + encodeURIComponent(u) + '&key=' + encodeURIComponent(state.key), { mode: 'no-cors' });
        sent++;
      } catch (e) {}
    }, 4, function (d, t) {
      setStatus('🚀 IndexNow bheja: ' + d + '/' + t);
    });
    setStatus('🚀 ' + sent + ' URLs IndexNow ko bhej diye! (Bing/Yandex ab crawl karenge)');
    logLine('IndexNow submit complete: ' + sent + ' URLs');
    state.busy = false;
  });

  /* ---------- reports ---------- */
  function csvEscape(v) {
    v = String(v == null ? '' : v);
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }

  $('seo-csv').addEventListener('click', function () {
    if (!state.results.length) { setStatus('Pehle 🔍 Audit chalao!'); return; }
    const rows = [['URL', 'Status', 'Score/6', 'Title', 'Issues'].join(',')];
    state.results.forEach(function (r) {
      rows.push([csvEscape(r.url), r.status, r.score, csvEscape(r.title), csvEscape(r.issues.join(' | '))].join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'seo-audit-' + location.hostname + '.csv';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    setStatus('💾 CSV download ho gayi!');
  });

  $('seo-copy').addEventListener('click', function () {
    if (!state.results.length) { setStatus('Pehle 🔍 Audit chalao!'); return; }
    const byIssue = {};
    state.results.forEach(function (r) {
      r.issues.forEach(function (i) {
        const k = i.split(':')[0];
        byIssue[k] = (byIssue[k] || 0) + 1;
      });
    });
    let rep = '🚀 SEO Commando Report — ' + location.hostname + '\n';
    rep += 'Total URLs: ' + state.results.length + '\n';
    rep += 'Score 5-6: ' + state.results.filter(function (r) { return r.score >= 5; }).length + '\n';
    rep += 'Score 3-4: ' + state.results.filter(function (r) { return r.score >= 3 && r.score < 5; }).length + '\n';
    rep += 'Score 0-2: ' + state.results.filter(function (r) { return r.score < 3; }).length + '\n\n';
    rep += 'Issue summary:\n' + Object.keys(byIssue).map(function (k) {
      return '  ' + k + ': ' + byIssue[k] + ' pages';
    }).join('\n') + '\n\nWorst 20:\n';
    rep += state.results.slice().sort(function (a, b) { return a.score - b.score; }).slice(0, 20)
      .map(function (r) { return r.score + '/6  ' + r.url + '  [' + r.issues.join(', ') + ']'; }).join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(rep).then(function () { setStatus('📋 Report copy ho gayi!'); },
        function () { setStatus(rep); });
    } else setStatus(rep);
  });

  window.__seoCleanup = function () {
    const p = document.getElementById('seo-panel');
    if (p) p.remove();
  };

  setStatus('Ready! Site: ' + location.hostname + ' 🚀');
})();
