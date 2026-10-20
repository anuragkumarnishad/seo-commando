/* Bing Webmaster Turbo v1.0 — Bing Webmasters ke "Submit URLs" page pe
   100 URLs ek saath auto-fill + Submit.
   Use: https://www.bing.com/webmasters/... (URL Submission page, logged in) →
   F12 → Console → code paste → Enter → ▶ Submit */
(function () {
  'use strict';
  if (window.__biCleanup) {
    try { window.__biCleanup(); } catch (e) {}
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

  const style = el('style');
  style.textContent = [
    '#bi-panel{position:fixed;top:14px;right:14px;z-index:2147483647;width:330px;',
    'background:rgba(10,15,30,.95);backdrop-filter:blur(12px);',
    'border:1px solid rgba(0,180,216,.5);border-radius:16px;',
    'box-shadow:0 12px 40px rgba(0,0,0,.55);color:#e2e8f0;',
    'font:12px/1.5 "Segoe UI",system-ui,sans-serif;overflow:hidden;}',
    '#bi-head{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:move;',
    'background:linear-gradient(90deg,rgba(0,180,216,.3),rgba(1,119,190,.25));}',
    '#bi-head .sp{flex:1;}',
    '.bi-ibtn{background:rgba(30,41,59,.9);color:#e2e8f0;border:1px solid rgba(0,180,216,.4);',
    'border-radius:7px;width:24px;height:24px;cursor:pointer;font-size:12px;}',
    '#bi-body{padding:10px 12px 12px;display:flex;flex-direction:column;gap:8px;}',
    '#bi-urls{width:100%;min-height:110px;resize:vertical;background:rgba(30,41,59,.9);',
    'border:1px solid rgba(0,180,216,.4);color:#fff;border-radius:8px;padding:6px 8px;',
    'font:11px/1.4 monospace;}',
    '.bi-btn{border:none;border-radius:9px;padding:9px;font-weight:700;cursor:pointer;',
    'color:#032b33;background:linear-gradient(90deg,#00b4d8,#0177be);transition:filter .2s;}',
    '.bi-btn:hover{filter:brightness(1.12);}',
    '#bi-status{padding:6px 9px;border-radius:9px;background:rgba(148,163,184,.12);',
    'border-left:3px solid #00b4d8;min-height:28px;}',
    '#bi-log{max-height:90px;overflow:auto;font-size:11px;opacity:.9;',
    'background:rgba(0,0,0,.3);border-radius:8px;padding:6px 8px;}'
  ].join('\n');
  document.head.appendChild(style);

  const panel = el('div', { id: 'bi-panel' });
  const head = el('div', { id: 'bi-head' });
  head.appendChild(el('b', null, '🅱️ Bing Webmaster Turbo'));
  head.appendChild(el('span', { cls: 'sp' }));
  const minBtn = el('button', { id: 'bi-min', cls: 'bi-ibtn', title: 'Minimize' }, '–');
  head.appendChild(minBtn);
  panel.appendChild(head);

  const body = el('div', { id: 'bi-body' });
  const urlsBox = el('textarea', { id: 'bi-urls', spellcheck: 'false' });
  body.appendChild(urlsBox);
  const goBtn = el('button', { id: 'bi-go', cls: 'bi-btn' }, '🚀 Bing me Submit karo');
  body.appendChild(goBtn);
  const statusBox = el('div', { id: 'bi-status' }, 'Ready — Bing Webmasters ke URL submission page pe ho?');
  body.appendChild(statusBox);
  const logBox = el('div', { id: 'bi-log' });
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

  function getUrls() {
    return urlsBox.value.split(/[\s,]+/).filter(function (u) {
      return /^https?:\/\//i.test(u);
    }).filter(function (u, i, a) { return a.indexOf(u) === i; });
  }

  function findPageTextarea() {
    const tas = document.querySelectorAll('textarea');
    let best = null, bestArea = 0;
    for (const t of tas) {
      const r = t.getBoundingClientRect();
      if (r.width < 100 || r.height < 40) continue;
      const ph = (t.getAttribute('placeholder') || '').toLowerCase();
      const area = r.width * r.height + (/url|line/i.test(ph) ? 1e7 : 0);
      if (area > bestArea) { best = t; bestArea = area; }
    }
    return best;
  }

  function findSubmitBtn() {
    const btns = document.querySelectorAll('button, [role="button"], input[type="submit"]');
    let fallback = null;
    for (const b of btns) {
      const t = ((b.textContent || b.value || '') + ' ' + (b.getAttribute('aria-label') || '')).toLowerCase();
      const r = b.getBoundingClientRect();
      if (r.width < 5 || r.height < 5 || b.disabled) continue;
      if (/submit urls?/.test(t)) return b;
      if (/^submit$|submit$/.test(t.trim()) && !fallback) fallback = b;
    }
    return fallback;
  }

  goBtn.addEventListener('click', function () {
    let urls = getUrls();
    if (!urls.length) { setStatus('Pehle URLs paste karo!'); return; }
    if (urls.length > 100) {
      urls = urls.slice(0, 100);
      logLine('⚠️ 100 se zyada the — pehle 100 bheje');
    }
    const ta = findPageTextarea();
    if (!ta) {
      setStatus('⚠️ Bing ka URL box nahi mila — URL Submission page pe ho?');
      return;
    }
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    setter.call(ta, urls.join('\n'));
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));
    setStatus('📝 Box mein ' + urls.length + ' URLs bhare — Submit dabata hoon…');
    setTimeout(function () {
      const btn = findSubmitBtn();
      if (!btn) {
        setStatus('⚠️ Submit button nahi mila — page dekho');
        return;
      }
      btn.click();
      setStatus('✅ ' + urls.length + ' URLs Bing Webmasters me submit ho gaye! 🅱️');
      logLine(urls.length + ' URLs submitted @ ' + new Date().toLocaleTimeString());
    }, 700);
  });

  window.__biCleanup = function () {
    const p = document.getElementById('bi-panel');
    if (p) p.remove();
  };
})();
