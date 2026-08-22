// Matrix-style digital rain, orange on black.
(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var canvas = document.getElementById("rain");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  // Half-width katakana (the classic look) plus digits and punctuation.
  // Built from char codes so the source file stays plain ASCII.
  var GLYPHS = (function () {
    var s = "0123456789:.=*+-<>|";
    for (var c = 0xff66; c <= 0xff9d; c++) s += String.fromCharCode(c);
    return s;
  })();

  var FONT_SIZE = 16;
  var columns = 0;
  var drops = [];

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = window.innerWidth;
    var h = window.innerHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.ceil(w / FONT_SIZE);
    drops = new Array(columns);
    for (var i = 0; i < columns; i++) {
      // Negative start staggers the streams so they don't fall in lockstep.
      drops[i] = Math.floor(Math.random() * -60);
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
  }

  function draw() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    // Translucent black over the previous frame leaves the fading tails.
    ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
    ctx.fillRect(0, 0, w, h);

    ctx.font = FONT_SIZE + "px ui-monospace, Consolas, 'Courier New', monospace";
    ctx.textBaseline = "top";

    for (var i = 0; i < columns; i++) {
      var glyph = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
      var y = drops[i] * FONT_SIZE;

      // Occasional pale glyph makes the stream heads flicker.
      ctx.fillStyle = Math.random() > 0.975 ? "#ffe6cc" : "#ff7a18";
      ctx.fillText(glyph, i * FONT_SIZE, y);

      // Once past the bottom, restart at a random moment so columns desync.
      if (y > h && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  var timer = null;
  function start() { if (!timer) timer = setInterval(draw, 50); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  var reduce = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  window.addEventListener("resize", resize);

  // Don't burn cycles animating a tab nobody is looking at.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else if (!reduce || !reduce.matches) start();
  });

  resize();

  if (reduce && reduce.matches) {
    draw(); // One static frame instead of motion.
  } else {
    start();
  }

  if (reduce && reduce.addEventListener) {
    reduce.addEventListener("change", function (e) {
      if (e.matches) stop(); else start();
    });
  }
})();
