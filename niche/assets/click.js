(function () {
  var src = "/svg/assets/click.wav";
  var ctx = null, buf = null;
  function ensureCtx() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  try {
    fetch(src, { cache: "force-cache" })
      .then(function (r) { return r.arrayBuffer(); })
      .then(function (ab) {
        var c = ensureCtx();
        if (!c) return;
        c.decodeAudioData(ab, function (b) { buf = b; }, function () {});
      })
      .catch(function () {});
  } catch (e) {}
  document.addEventListener("pointerdown", function () { ensureCtx(); }, { capture: true, passive: true });
  function play() {
    var c = ensureCtx();
    if (!c || !buf) return;
    var s = c.createBufferSource();
    s.buffer = buf;
    var g = c.createGain();
    g.gain.value = 0.5;
    s.connect(g);
    g.connect(c.destination);
    s.start(0);
  }
  document.addEventListener("pointerdown", function (e) {
    try { if (e.target && e.target.closest && e.target.closest("button")) play(); } catch (err) {}
  }, true);
  window.nicheClick = play;
})();
