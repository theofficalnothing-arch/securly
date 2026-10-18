(() => {
  const ON_SITE = /(^|\.)t9os\.space$/i.test(location.host);
  // Host-agnostic: every file the proxy needs is served as a sibling of this
  // document, so resolve runtime paths against the document's own directory.
  // Works on t9os.space (/svg/) and on any static host (e.g. GitHub Pages).
  const BASE = location.pathname.replace(/[^/]*$/, "") || "/";
  const P = BASE;
  // A static host has no backend, so the proxy tunnels through t9os.space's
  // wisp servers over a cross-origin websocket (they accept any Origin).
  const WISP_POOL = [
    "wss://t9os.space/wisp-vps/",
    "wss://t9os.space/wisp-boston/",
    "wss://t9os.space/wisp-milan/",
    "wss://t9os.space/wisp-paloalto/",
  ];
  function wispCandidates() {
    try {
      if (Array.isArray(window.__NICHE_WISP_POOL__) && window.__NICHE_WISP_POOL__.length) {
        return window.__NICHE_WISP_POOL__.filter(Boolean);
      }
      if (typeof window.__NICHE_WISP__ === "string" && window.__NICHE_WISP__) {
        return [window.__NICHE_WISP__].concat(WISP_POOL);
      }
    } catch (e) {}
    return WISP_POOL;
  }
  async function setTransportWith(conn) {
    const list = wispCandidates();
    for (let i = 0; i < list.length; i++) {
      try {
        await conn.setTransport(P + "epoxy/index.mjs", [{ wisp: list[i] }]);
        return true;
      } catch (e) {}
    }
    return false;
  }
  let __sj = null, __sjReady = false;
  const framesWrap = document.getElementById('frames-wrap');
  const LOCK_CLOSED = '<svg xmlns="http://www.w3.org/2000/svg" width="3.5" height="3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  const LOCK_OPEN = '<svg xmlns="http://www.w3.org/2000/svg" width="3.5" height="3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';
  function setLock(secure) {
    const el = document.getElementById('lock-icon');
    if (!el) return;
    el.innerHTML = secure ? LOCK_CLOSED : LOCK_OPEN;
    el.style.color = secure ? '#15803d' : '#dc2626';
  }
  function lockFor(url) {
    let proxied = false;
    try { proxied = typeof url === 'string' && url !== HOME && /^https?:\/\//i.test(url); } catch (e) {}
    setLock(proxied);
  }
  var NICHE_HOME_URL = 'niche://browser';
  function displayUrl(u) {
    if (!u || u === HOME) return NICHE_HOME_URL;
    try {
      var uu = new URL(u, location.href);
      if (uu.origin === location.origin && uu.pathname.replace(/\/+$/, '').endsWith('/n1chtesting1.html')) {
        return NICHE_HOME_URL;
      }
    } catch (e) {}
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(u)) return u;
    return 'https://' + u;
  }
  let __bareConn = null;
  async function applyTransport() {
    if (!__bareConn) return false;
    return await setTransportWith(__bareConn);
  }
  function setTransportTo(wisp, conn) {
    return (conn || __bareConn).setTransport(P + "epoxy/index.mjs", [{ wisp: wisp }])
      .then(function () { return true; }, function () { return false; });
  }
  // Movies need the mullvad exit (datacenter wisp IPs get Cloudflare-walled on
  // vidfast.vc); switching the shared transport is fine and restores after.
  try {
    window.nicheSetWisp = function (wisp) {
      if (!__bareConn) return Promise.resolve(false);
      if (wisp) return setTransportTo(wisp);
      return setTransportWith(__bareConn);
    };
  } catch (e) {}
  const input = document.getElementById('browser-input');
  const tabStrip = document.getElementById('tab-strip');
  const HOME = 'n1chtesting1.html';
  const SANDBOX = 'allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-modals';
  function loadFrame(f, url) {
    var target = url || HOME;
    try {
      var hasSrcdoc = typeof window.__NICHE_HOME_SRCDOC__ === "string" && window.__NICHE_HOME_SRCDOC__;
      if (target === HOME && hasSrcdoc && !ON_SITE) {
        try { f.removeAttribute('src'); } catch (e0) {}
        f.srcdoc = window.__NICHE_HOME_SRCDOC__;
        return target;
      }
      if (target === HOME && hasSrcdoc) {
        try { f.removeAttribute('srcdoc'); } catch (e0b) {}
        f.src = target;
        return target;
      }
      try { f.removeAttribute('srcdoc'); } catch (e1) {}
      f.src = target;
    } catch (e2) { try { f.src = target; } catch (e3) {} }
    return target;
  }

  async function initScramjet() {
    const epoxyWarm = import(P + "epoxy/index.mjs").catch(() => null);
    try {
      const { ScramjetController } = $scramjetLoadController();
      const client = new ScramjetController({
        prefix: P + "scramjet/",
        files: {
          wasm: P + "scram/scramjet.wasm.wasm",
          all: P + "scram/scramjet.all.js",
          sync: P + "scram/scramjet.sync.js",
        },
      });
      await client.init();
      try {
        const swReg = await navigator.serviceWorker.register(P + "sw.js", { scope: P, updateViaCache: "none" });
        try { await swReg.update(); } catch (e) {}
        if (swReg.waiting) { try { swReg.waiting.postMessage({ type: "SKIP_WAITING" }); } catch (e) {} }
        if (navigator.serviceWorker.controller && !sessionStorage.getItem("niche-sw-reloaded")) {
          swReg.addEventListener("updatefound", () => {
            const nw = swReg.installing;
            if (!nw) return;
            nw.addEventListener("statechange", () => {
              if (nw.state === "activated" && navigator.serviceWorker.controller) {
                try { sessionStorage.setItem("niche-sw-reloaded", "1"); } catch (e) {}
                try { location.reload(); } catch (e) {}
              }
            });
          });
        }
      } catch (e) {}
      const conn = new BareMux.BareMuxConnection(P + "baremux/worker.js");
      __bareConn = conn;
      await epoxyWarm.catch(() => null);
      await setTransportWith(conn);
      __sj = client;
      __sjReady = true;
      try {
        window.nicheProxyUrl = function (u) {
          try {
            if (!__sj || !__sjReady || typeof __sj.encodeUrl !== 'function') return null;
            return __sj.encodeUrl(u);
          } catch (e) { return null; }
        };
      } catch (e) {}
      if (pendingNav) {
        const next = pendingNav;
        pendingNav = null;
        navigate(next);
      }
    } catch (e) {}
  }

  function buildUrl(raw) {
    raw = raw.trim();
    if (/^https?:\/\//i.test(raw)) return raw;
    if (/\.\w{2,}/.test(raw) && !raw.includes(" ")) return "https://" + raw;
    return "https://duckduckgo.com/?q=" + encodeURIComponent(raw);
  }

  let tabs = [];
  let activeId = null;
  const uid = () => 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  function activeTab() {
    return tabs.find(t => t.id === activeId) || null;
  }

  function tabLabel(tab) {
    try {
      const u = new URL(tab.lastUrl || HOME, location.href);
      if (u.pathname.endsWith('n1chtesting1.html') || tab.lastUrl === HOME) return 'Home';
      return u.hostname.replace(/^www\./, '') || 'New tab';
    } catch { return 'New tab'; }
  }

  function renderTabs() {
    tabStrip.innerHTML = '';
    tabs.forEach(tab => {
      const b = document.createElement('button');
      const on = tab.id === activeId;
      b.className = 'font-sans max-w-[160px] shrink-0 h-8 px-2 mb-1 rounded-xl text-xs truncate flex items-center gap-1.5 cursor-pointer transition whitespace-nowrap ' +
        (on ? '' : 'bg-blue-400 text-blue-50 hover:bg-blue-500');
      const label = document.createElement('span');
      label.className = 'truncate';
      label.textContent = tabLabel(tab);
      b.appendChild(label);
      if (tab.favicon) {
        const im = document.createElement('img');
        im.className = 'shrink-0 rounded';
        im.style.cssText = 'width:16px;height:16px;';
        im.src = tab.favicon;
        im.onerror = () => { tab.favicon = null; renderTabs(); };
        b.insertBefore(im, label);
      } else {
        const lt = document.createElement('span');
        lt.className = 'shrink-0 rounded flex items-center justify-center font-bold';
        lt.style.cssText = 'width:16px;height:16px;font-size:10px;background:rgba(10,79,152,.25);';
        lt.textContent = (tabLabel(tab)[0] || '•').toUpperCase();
        b.insertBefore(lt, label);
      }
      const x = document.createElement('span');
      x.className = 'shrink-0 opacity-70 hover:opacity-100 font-bold';
      x.textContent = '×';
      x.addEventListener('click', (e) => { e.stopPropagation(); closeTab(tab.id); });
      b.appendChild(x);
      if (on) {
        b.setAttribute('aria-selected', 'true');
        try {
          const hi = NTAB_HI[ntabTheme()] || NTAB_HI.dark;
          b.style.background = hi.bg;
          b.style.color = hi.fg;
          b.style.fontWeight = '700';
        } catch (e) {}
      } else {
        b.setAttribute('aria-selected', 'false');
      }
      b.addEventListener('click', () => activate(tab.id));
      tabStrip.appendChild(b);
    });
  }

  function newTab(url) {
    const id = uid();
    const f = document.createElement('iframe');
    f.className = 'absolute inset-0 w-full h-full border-0';
    f.setAttribute('sandbox', SANDBOX);
    const startUrl = loadFrame(f, url);
    f.style.display = 'none';
    framesWrap.appendChild(f);
    const tab = { id, frame: f, lastUrl: startUrl };
    tabs.push(tab);
    f.addEventListener('load', () => onFrameLoad(tab));
    activate(id);
    try {
      const btns = tabStrip.children;
      const nb = btns[btns.length - 1];
      if (nb && nb.animate) {
        nb.animate(
          [{ opacity: 0, transform: 'translateY(10px) scale(.94)' }, { opacity: 1, transform: 'none' }],
          { duration: 250, easing: 'cubic-bezier(.22,.61,.36,1)' }
        );
      }
    } catch (e) {}
    return tab;
  }

  function activate(id) {
    const prev = activeTab();
    const prevId = prev ? prev.id : null;
    activeId = id;
    tabs.forEach(t => {
      const f = t.frame;
      if (t.id === id) {
        try { clearTimeout(f._leaveT); } catch (e) {}
        f.classList.remove('tab-leave');
        f.style.display = 'block';
        f.classList.remove('tab-enter');
        void f.offsetWidth;
        f.classList.add('tab-enter');
      } else if (t.id === prevId) {
        f.classList.remove('tab-enter');
        f.classList.add('tab-leave');
        try { clearTimeout(f._leaveT); } catch (e2) {}
        f._leaveT = setTimeout(() => { if (t.id !== activeId) f.style.display = 'none'; }, 170);
      } else {
        f.style.display = 'none';
      }
    });
    renderTabs();
    syncAddress();
  }

  async function closeTab(id) {
    let i = tabs.findIndex(t => t.id === id);
    if (i < 0) return;
    let oldLeft = [];
    try {
      oldLeft = [...tabStrip.children].map(b => b.getBoundingClientRect().left);
    } catch (e9) {}
    try {
      const fr = tabs[i].frame;
      fr.classList.remove('tab-enter');
      fr.classList.remove('tab-leave');
      void fr.offsetWidth;
      fr.classList.add('tab-close');
    } catch (e0) {}
    try {
      const btn = tabStrip.children[i];
      if (btn && btn.animate) {
        const a = btn.animate(
          [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(6px) scale(.92)' }],
          { duration: 160, easing: 'ease-in', fill: 'forwards' }
        );
        const done = (a.finished && a.finished.catch) ? a.finished.catch(() => {}) : Promise.resolve();
        await Promise.race([done, new Promise(r => setTimeout(r, 220))]);
      }
    } catch (e) {}
    i = tabs.findIndex(t => t.id === id);
    if (i < 0) return;
    const [gone] = tabs.splice(i, 1);
    try { clearTimeout(gone.frame._leaveT); } catch (e8) {}
    try { gone.frame.remove(); } catch {}
    if (!tabs.length) { newTab(HOME); return; }
    if (id === activeId) activate(tabs[Math.min(i, tabs.length - 1)].id);
    else renderTabs();
    try {
      const news = [...tabStrip.children];
      news.forEach((nb, j) => {
        const oldJ = j >= i ? j + 1 : j;
        const dx = (oldLeft[oldJ] || 0) - nb.getBoundingClientRect().left;
        if (dx && nb.animate) {
          nb.animate(
            [{ transform: 'translateX(' + dx + 'px)' }, { transform: 'translateX(0)' }],
            { duration: 240, easing: 'cubic-bezier(.22,.61,.36,1)' }
          );
        }
      });
    } catch (e1) {}
  }

  let pendingNav = null;

  function navigate(raw) {
    const tab = activeTab();
    if (!tab || !raw || !raw.trim()) return;
    if (!__sjReady) {
      pendingNav = raw;
      try {
        tab.lastUrl = buildUrl(raw);
        renderTabs();
        syncAddress();
      } catch {}
      return;
    }
    try {
      if (/^niche:\/\//i.test(raw.trim())) {
        lockFor(HOME);
        loadFrame(tab.frame, HOME);
        tab.lastUrl = HOME;
        return;
      }
      const url = buildUrl(raw);
      lockFor(url);
      tab.lastUrl = url;
      try { recordHistory(tabLabel(tab), url); } catch (e2) {}
      renderTabs();
      syncAddress();
      try { tab.frame.removeAttribute('srcdoc'); } catch (e0) {}
      tab.frame.src = __sj.encodeUrl(url);
    } catch (e) {}
  }
  window.nicheBrowserNavigate = function (raw) { navigate(raw); };

  function syncAddress() {
    const tab = activeTab();
    if (!tab || document.activeElement === input) return;
    try {
      const u = tab.lastUrl || '';
      input.value = displayUrl(u);
      lockFor(u || HOME);
    } catch {}
  }

  function onFrameLoad(tab) {
    try {
      if (!__sj || !__sjReady || typeof __sj.decodeUrl !== "function") return;
      let href = "";
      try { href = tab.frame.contentWindow.location.href; } catch {}
      if (!href || href === "about:blank") href = tab.frame.getAttribute("src") || tab.frame.src;
      if (!href || href === "about:blank") return;
      let decoded = null;
      try { decoded = __sj.decodeUrl(href); } catch (e) { decoded = null; }
      if (!decoded || !/^https?:\/\//i.test(decoded)) {
        try {
          const abs = new URL(href, location.href).href;
          if (/^https?:\/\//i.test(abs)) decoded = abs;
          else return;
        } catch (e2) { return; }
      }
      tab.lastUrl = decoded;
      lockFor(decoded);
      try {
        const doc = tab.frame.contentWindow.document;
        const link = doc && doc.querySelector('link[rel*="icon"]');
        const iconHref = link && (link.href || link.getAttribute('href'));
        tab.favicon = iconHref || null;
      } catch { tab.favicon = null; }
      if (tab.id === activeId) syncAddress();
      renderTabs();
    } catch {}
  }

  function frameOp(fn) {
    const tab = activeTab();
    if (!tab) return;
    try {
      const w = tab.frame.contentWindow;
      if (w) fn(w);
    } catch (e) {}
  }

  document.getElementById('nav-back').addEventListener('click', () => frameOp(w => { try { w.history.back(); } catch {} }));
  document.getElementById('nav-fwd').addEventListener('click', () => frameOp(w => { try { w.history.forward(); } catch {} }));
  document.getElementById('nav-reload').addEventListener('click', () => {
    const tab = activeTab();
    if (!tab) return;
    try {
      tab.frame.contentWindow.location.reload();
    } catch {
      try { tab.frame.src = tab.frame.src; } catch {}
    }
  });
  document.getElementById('nav-home').addEventListener('click', () => {
    const tab = activeTab();
    if (tab) { loadFrame(tab.frame, HOME); tab.lastUrl = HOME; syncAddress(); }
  });
  const NTAB_HI = {
    dark:      { bg: '#4a4a4a', fg: '#ffffff' },
    halloween: { bg: '#7a3a0e', fg: '#ffe0c2' },
    red:       { bg: '#6e1414', fg: '#ffd7d7' },
    green:     { bg: '#0f3d22', fg: '#d3f9e0' },
    light:     { bg: '#0a4f98', fg: '#ffffff' },
    ocean:     { bg: '#174a6b', fg: '#e8f4fa' }
  };
  function ntabTheme() {
    try {
      if (typeof window.nicheGetTheme === 'function') {
        const g = window.nicheGetTheme();
        if (NTAB_HI[g]) return g;
      }
      const s = localStorage.getItem('niche-theme');
      if (NTAB_HI[s]) return s;
    } catch (e) {}
    return 'dark';
  }
  if (!window._ntabThemeHook) {
    window._ntabThemeHook = true;
    try {
      window.addEventListener('storage', function (e) {
        if (e && (e.key === 'niche-theme' || e.key === 'niche-dark')) {
          try { renderTabs(); } catch (err) {}
        }
      });
      window.addEventListener('message', function (e) {
        if (e && e.data && (e.data.nicheTheme || e.data.nicheThemeName)) {
          try { renderTabs(); } catch (err4) {}
        }
      });
    } catch (e) {}
  }
  document.getElementById('new-tab').addEventListener('click', () => newTab(HOME));

  const suggestBox = document.getElementById('suggest');
  let suggestItems = [];
  let suggestHi = -1;
  let suggestTimer = null;
  const GLOBE_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/></svg>';
  const FIND_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="16" y1="16" x2="21" y2="21"/></svg>';
  function readHistory() {
    try {
      const h = JSON.parse(localStorage.getItem('niche-history') || '[]');
      return Array.isArray(h) ? h : [];
    } catch (e) { return []; }
  }
  function recordHistory(title, url) {
    try {
      if (!url || !/^https?:\/\//i.test(url)) return;
      let h = readHistory().filter((x) => x && x.u !== url);
      h.unshift({ t: String(title || url).slice(0, 80), u: url });
      localStorage.setItem('niche-history', JSON.stringify(h.slice(0, 50)));
    } catch (e) {}
  }
  function closeSuggest() {
    suggestItems = [];
    suggestHi = -1;
    if (suggestBox) {
      suggestBox.innerHTML = '';
      suggestBox.style.display = 'none';
    }
  }
  function localMatches(q) {
    const out = [];
    const low = q.toLowerCase();
    try {
      tabs.forEach((t) => {
        if (t.id === activeId) return;
        const label = tabLabel(t);
        const url = t.lastUrl || '';
        if ((label + ' ' + url).toLowerCase().includes(low)) {
          out.push({ kind: 'tab', title: label, sub: displayUrl(url), tabId: t.id, fav: t.favicon || null });
        }
      });
    } catch (e) {}
    try {
      readHistory().forEach((h) => {
        if (!h || !h.u) return;
        if ((h.t + ' ' + h.u).toLowerCase().includes(low)) {
          if (!out.some((o) => o.sub === h.u)) out.push({ kind: 'hist', title: h.t, sub: h.u, fav: null });
        }
      });
    } catch (e) {}
    return out.slice(0, 4);
  }
  function renderSuggest() {
    if (!suggestBox) return;
    suggestBox.innerHTML = '';
    if (!suggestItems.length) {
      suggestBox.style.display = 'none';
      return;
    }
    suggestItems.slice(0, 8).forEach((it, i) => {
      const row = document.createElement('div');
      row.className = 'suggest-row' + (i === suggestHi ? ' hi' : '');
      if (it.fav) {
        const im = document.createElement('img');
        im.src = it.fav;
        im.onerror = () => { im.outerHTML = GLOBE_SVG; };
        row.appendChild(im);
      } else {
        const sp = document.createElement('span');
        sp.className = 'suggest-ic';
        sp.innerHTML = it.kind === 'search' ? FIND_SVG : GLOBE_SVG;
        row.appendChild(sp);
      }
      const t = document.createElement('span');
      t.className = 'suggest-t';
      t.textContent = it.title;
      row.appendChild(t);
      if (it.sub && it.sub !== it.title) {
        const u = document.createElement('span');
        u.className = 'suggest-u';
        u.textContent = it.sub;
        row.appendChild(u);
      }
      row.addEventListener('mousedown', (e) => {
        e.preventDefault();
        pickSuggest(it);
      });
      suggestBox.appendChild(row);
    });
    suggestBox.style.display = 'block';
  }
  function pickSuggest(it) {
    if (!it) return;
    if (it.kind === 'tab') {
      closeSuggest();
      activate(it.tabId);
      return;
    }
    input.value = it.kind === 'search' ? it.title : it.sub;
    closeSuggest();
    navigate(input.value);
  }
  input.addEventListener('input', () => {
    try { clearTimeout(suggestTimer); } catch (e) {}
    const q = input.value.trim();
    if (!q) { closeSuggest(); return; }
    suggestItems = localMatches(q);
    suggestHi = -1;
    renderSuggest();
    if (/\.[a-z]{2,}/i.test(q) && !/\s/.test(q)) return;
    suggestTimer = setTimeout(async () => {
      if (input.value.trim() !== q) return;
      try {
        let list = [];
        try {
          const r0 = await fetch('https://t9os.space/suggest?q=' + encodeURIComponent(q));
          const d0 = await r0.json();
          if (Array.isArray(d0.list)) list = d0.list.filter((x) => typeof x === 'string');
        } catch (e0) {}
        if (!list.length && __sjReady && typeof __sj.encodeUrl === 'function') {
          const r = await fetch(__sj.encodeUrl('https://ac.duckduckgo.com/ac/?q=' + encodeURIComponent(q) + '&type=list'));
          const d = await r.json();
          if (Array.isArray(d) && Array.isArray(d[1])) list = d[1].filter((x) => typeof x === 'string');
        }
        if (input.value.trim() !== q) return;
        list.forEach((text) => {
          if (suggestItems.length >= 8) return;
          if (!suggestItems.some((o) => o.title === text)) {
            suggestItems.push({ kind: 'search', title: text, sub: '', fav: null });
          }
        });
        renderSuggest();
      } catch (e) {}
    }, 180);
  });
  input.addEventListener('keydown', (e) => {
    if (suggestBox && suggestBox.style.display === 'block' && suggestItems.length) {
      const n = Math.min(suggestItems.length, 8);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        suggestHi = e.key === 'ArrowDown' ? (suggestHi + 1) % n : (suggestHi - 1 + n) % n;
        renderSuggest();
        return;
      }
      if (e.key === 'Enter' && suggestHi >= 0 && suggestItems[suggestHi]) {
        e.preventDefault();
        pickSuggest(suggestItems[suggestHi]);
        return;
      }
      if (e.key === 'Escape') { closeSuggest(); return; }
    }
    if (e.key === 'Enter' && input.value.trim()) { closeSuggest(); navigate(input.value); }
  });
  input.addEventListener('blur', () => { setTimeout(closeSuggest, 120); });

  newTab(HOME);
  initScramjet();
})();
