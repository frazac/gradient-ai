/*!
 * Gradient AI v0.1.0 — Gradiente IA: livelli di integrazione dell'IA tratti da AIAS
 * https://github.com/frazac/gradient-ai
 *
 * Contenuti: adattamento di AI Assessment Scale (AIAS) v2 di Mike Perkins, Leon Furze,
 * Jasper Roe e Jason MacVaugh — CC BY-NC-SA 4.0. Questo file: CC BY-NC-SA 4.0.
 * Icone: Lucide (https://lucide.dev), licenza ISC — © Lucide Icons and Contributors.
 *
 * File generato da strumenti/build.py a partire da src/gradient-ai.core.js: non modificarlo a mano.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GradientAI = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '0.1.0';
  var LEVELS = [{"n": 1, "id": "autonomia", "name": "Autonomia", "subtitle": "Senza IA", "icon": "ban"}, {"n": 2, "id": "ideazione", "name": "Ideazione", "subtitle": "IA solo in fase preparatoria", "icon": "calendar-days"}, {"n": 3, "id": "co-creazione", "name": "Co-creazione", "subtitle": "IA al fianco, con vaglio critico", "icon": "blender"}, {"n": 4, "id": "regia", "name": "Regia", "subtitle": "IA diretta dallo studente", "icon": "bot"}, {"n": 5, "id": "sperimentazione", "name": "Sperimentazione", "subtitle": "IA come terreno di ricerca", "icon": "lighthouse"}];
  var ICONS = {"ban": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M4.929 4.929 19.07 19.071\"/>", "calendar-days": "<path d=\"M8 2v3\"/><path d=\"M16 2v3\"/><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"M8 13h.01\"/><path d=\"M12 13h.01\"/><path d=\"M16 13h.01\"/><path d=\"M8 17h.01\"/><path d=\"M12 17h.01\"/><path d=\"M16 17h.01\"/>", "blender": "<path d=\"M8 14a2 2 0 0 0-1.963 1.615l-1.018 5.193A1 1 0 0 0 6 22h12a1 1 0 0 0 .981-1.192l-1.018-5.193A2 2 0 0 0 16 14z\"/><path d=\"m17 2-1 12\"/><path d=\"M8.006 14 7 2\"/><path d=\"M7.565 8.787A5 5 0 0 0 12 8a5 5 0 0 1 4.56-.75\"/><path d=\"M19 2H5a2 2 0 0 0-2 2v5a2 2 0 0 0 .688 1.5\"/><path d=\"M12 18h.01\"/>", "bot": "<path d=\"M12 8V4H8\"/><rect width=\"16\" height=\"12\" x=\"4\" y=\"8\" rx=\"2\"/><path d=\"M2 14h2\"/><path d=\"M20 14h2\"/><path d=\"M15 13v2\"/><path d=\"M9 13v2\"/>", "lighthouse": "<path d=\"M12 3V2\"/><path d=\"M16.066 16.865 7 22l2-11V6a3 3 0 016 0v5l2 11\"/><path d=\"m19.792 4.5.866-.5\"/><path d=\"m19.797 13.5.866.5\"/><path d=\"M21 9h1\"/><path d=\"M3 9H2\"/><path d=\"m4.203 13.5-.866.5\"/><path d=\"M4.208 4.5 3.342 4\"/><path d=\"M5.5 22h13\"/><path d=\"m7.932 16.875 7.377-4.178\"/><path d=\"M8 11h8\"/><path d=\"M8 7h8\"/>"};

  // Palette predefinita: dal rosso del divieto (senza IA) al blu dell'esplorazione (sperimentazione).
  var PALETTE = ['#c8473d', '#b8741c', '#2a8c82', '#2f5d8a', '#1f2a44'];
  var FONT = "'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  var uid = 0;

  // ---- colori: interpolazione in OKLCH fra due estremi (opzioni from/to) ----

  function hexToRgb(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) { return v / 255; });
  }
  function rgbToHex(rgb) {
    return '#' + rgb.map(function (v) {
      var n = Math.round(Math.min(1, Math.max(0, v)) * 255);
      return (n < 16 ? '0' : '') + n.toString(16);
    }).join('');
  }
  function toLinear(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function toGamma(c) { return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; }
  function rgbToOklch(rgb) {
    var r = toLinear(rgb[0]), g = toLinear(rgb[1]), b = toLinear(rgb[2]);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    var L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
    var A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    var B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
    return [L, Math.sqrt(A * A + B * B), Math.atan2(B, A)];
  }
  function oklchToRgb(lch) {
    var A = lch[1] * Math.cos(lch[2]), B = lch[1] * Math.sin(lch[2]);
    var l = Math.pow(lch[0] + 0.3963377774 * A + 0.2158037573 * B, 3);
    var m = Math.pow(lch[0] - 0.1055613458 * A - 0.0638541728 * B, 3);
    var s = Math.pow(lch[0] - 0.0894841775 * A - 1.2914855480 * B, 3);
    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    ].map(toGamma);
  }

  /** Cinque colori da `from` a `to` (interpolazione OKLCH, tonalità per la via più breve). */
  function palette(from, to, steps) {
    steps = steps || 5;
    var a = rgbToOklch(hexToRgb(from)), b = rgbToOklch(hexToRgb(to));
    var dh = b[2] - a[2];
    if (dh > Math.PI) dh -= 2 * Math.PI;
    if (dh < -Math.PI) dh += 2 * Math.PI;
    var out = [];
    for (var i = 0; i < steps; i++) {
      var t = steps === 1 ? 0 : i / (steps - 1);
      out.push(rgbToHex(oklchToRgb([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + dh * t])));
    }
    return out;
  }

  // ---- opzioni ----

  function level(n) {
    var l = LEVELS.filter(function (x) { return x.n === Number(n) || x.id === n; })[0];
    if (!l) throw new Error('GradientAI: livello sconosciuto "' + n + '" (usa 1–5)');
    return l;
  }

  function colorFor(l, o) {
    if (o.color) return o.color;
    var p = o.palette || (o.from && o.to ? palette(o.from, o.to) : PALETTE);
    return p[l.n - 1];
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  // icona Lucide (24×24) posizionata in (x, y) con lato `size`; `weight` è lo stroke-width di Lucide (default 2)
  function icon(name, x, y, size, ink, weight) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + (size / 24) + ')" fill="none" stroke="' + ink +
      '" stroke-width="' + weight + '" stroke-linecap="round" stroke-linejoin="round">' +
      ICONS[name] + '</g>';
  }

  function open(w, h, o, l) {
    var px = o.size ? ' width="' + (o.size * w / h) + '" height="' + o.size + '"' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '"' + px +
      ' role="img" aria-label="' + esc('Livello ' + l.n + ' · ' + l.name + ' — ' + l.subtitle) + '"' +
      (o['class'] ? ' class="' + esc(o['class']) + '"' : '') + '>' +
      '<title>' + esc('Gradiente IA · Livello ' + l.n + ' · ' + l.name) + '</title>';
  }

  function fontWeight(w) { return w < 1.5 ? 500 : w < 2.5 ? 700 : 800; }

  // ---- varianti ----

  // Timbro tondo: nome del livello sull'arco in alto, "GRADIENTE IA" in basso, icona e numero al centro.
  function stamp(l, o) {
    var c = colorFor(l, o), w = o.weight, filled = o.filled;
    var ink = filled ? (o.ink || '#ffffff') : c;
    var id = 'gai' + (++uid);
    var fw = fontWeight(w);
    var bottom = o.bottomText != null ? o.bottomText : 'GRADIENTE IA';
    var s = open(200, 200, o, l);
    s += '<defs><path id="' + id + 't" d="M 25 100 A 75 75 0 0 1 175 100"/>' +
      '<path id="' + id + 'b" d="M 14 100 A 86 86 0 0 0 186 100"/></defs>';
    if (filled) s += '<circle cx="100" cy="100" r="97" fill="' + c + '"/>';
    else if (o.background) s += '<circle cx="100" cy="100" r="97" fill="' + o.background + '"/>';
    s += '<circle cx="100" cy="100" r="' + (96 - w * 0.9) + '" fill="none" stroke="' + ink + '" stroke-width="' + (w * 1.8) + '"/>';
    s += '<circle cx="100" cy="100" r="64" fill="none" stroke="' + ink + '" stroke-width="' + (w * 0.9) + '"/>';
    s += '<g fill="' + ink + '" font-family="' + esc(FONT) + '" font-weight="' + fw + '" text-anchor="middle">';
    // corpo adattivo: i nomi lunghi (SPERIMENTAZIONE) restano dentro l'arco superiore
    var fs = Math.min(17, 185 / (l.name.length * 0.87));
    s += '<text font-size="' + fs.toFixed(1) + '" letter-spacing="' + (fs * 0.15).toFixed(2) + '"><textPath href="#' + id + 't" startOffset="50%">' + esc(l.name.toUpperCase()) + '</textPath></text>';
    s += '<text font-size="12" letter-spacing="3.5"><textPath href="#' + id + 'b" startOffset="50%">' + esc(bottom) + '</textPath></text>';
    s += '<circle cx="20" cy="100" r="' + (1.6 + w * 0.6) + '"/><circle cx="180" cy="100" r="' + (1.6 + w * 0.6) + '"/>';
    s += '<text x="100" y="152" font-size="36" font-weight="' + Math.max(fw, 700) + '">' + l.n + '</text>';
    s += '</g>';
    s += icon(l.icon, 74, 52, 52, ink, w);
    return s + '</svg>';
  }

  // Icona: disco (pieno o contornato) con l'icona Lucide al centro.
  function badgeIcon(l, o) {
    var c = colorFor(l, o), w = o.weight, filled = o.filled;
    var ink = filled ? (o.ink || '#ffffff') : c;
    var s = open(48, 48, o, l);
    s += filled ? '<circle cx="24" cy="24" r="23" fill="' + c + '"/>'
      : '<circle cx="24" cy="24" r="' + (23 - w / 2) + '" fill="' + (o.background || 'none') + '" stroke="' + c + '" stroke-width="' + w + '"/>';
    s += icon(l.icon, 11, 11, 26, ink, w);
    return s + '</svg>';
  }

  // Etichetta orizzontale: numero, icona, nome.
  function label(l, o) {
    var c = colorFor(l, o), w = o.weight, filled = o.filled;
    var ink = filled ? (o.ink || '#ffffff') : c;
    var s = open(260, 48, o, l);
    s += filled ? '<rect x="0" y="0" width="260" height="48" rx="24" fill="' + c + '"/>'
      : '<rect x="' + w / 2 + '" y="' + w / 2 + '" width="' + (260 - w) + '" height="' + (48 - w) + '" rx="' + (24 - w / 2) + '" fill="' + (o.background || 'none') + '" stroke="' + c + '" stroke-width="' + w + '"/>';
    s += '<g fill="' + ink + '" font-family="' + esc(FONT) + '" font-weight="' + fontWeight(w) + '">';
    s += '<text x="24" y="30.5" font-size="18" text-anchor="middle">' + l.n + '</text>';
    s += '<text x="82" y="29.5" font-size="15" letter-spacing="1.2">' + esc(l.name.toUpperCase()) + '</text></g>';
    s += '<line x1="42" y1="12" x2="42" y2="36" stroke="' + ink + '" stroke-width="' + (w * 0.6) + '" stroke-linecap="round"/>';
    s += icon(l.icon, 50, 13, 22, ink, w);
    return s + '</svg>';
  }

  var VARIANTS = { stamp: stamp, icon: badgeIcon, label: label };

  var DEFAULTS = { variant: 'stamp', weight: 2, filled: false };

  /**
   * SVG di un livello come stringa.
   * @param {number|string} n  1–5 oppure l'id ("autonomia", "ideazione", …)
   * @param {object} [options] variant: stamp|icon|label · color · from/to · palette · weight (1–3)
   *                           · filled · ink · background · size (px) · class · bottomText
   */
  function toSvg(n, options) {
    var o = {};
    for (var k in DEFAULTS) o[k] = DEFAULTS[k];
    for (k in options || {}) if (options[k] != null && options[k] !== '') o[k] = options[k];
    o.weight = Math.min(4, Math.max(0.5, Number(o.weight) || 2));
    o.filled = o.filled === true || o.filled === 'true' || o.filled === '';
    var fn = VARIANTS[o.variant];
    if (!fn) throw new Error('GradientAI: variante sconosciuta "' + o.variant + '" (stamp, icon, label)');
    return fn(level(n), o);
  }

  /**
   * Sostituisce ogni elemento [data-gradient] con l'SVG del livello, come lucide.createIcons().
   * Attributi: data-gradient="3" data-variant data-color data-from data-to data-weight data-filled data-size.
   * Le opzioni passate valgono per tutti; gli attributi del singolo elemento hanno la precedenza.
   */
  function createBadges(options, rootEl) {
    var els = (rootEl || document).querySelectorAll('[data-gradient]');
    Array.prototype.forEach.call(els, function (el) {
      var o = {};
      for (var k in options || {}) o[k] = options[k];
      ['variant', 'color', 'from', 'to', 'weight', 'filled', 'size', 'ink', 'background'].forEach(function (a) {
        if (el.hasAttribute('data-' + a)) o[a] = el.getAttribute('data-' + a);
      });
      if (el.className) o['class'] = el.className;
      var tpl = document.createElement('template');
      tpl.innerHTML = toSvg(el.getAttribute('data-gradient'), o);
      var svg = tpl.content.firstChild;
      svg.setAttribute('data-gradient', el.getAttribute('data-gradient'));
      el.parentNode.replaceChild(svg, el);
    });
  }

  return {
    version: VERSION,
    levels: LEVELS,
    icons: ICONS,
    defaultPalette: PALETTE.slice(),
    palette: palette,
    toSvg: toSvg,
    createBadges: createBadges
  };
}));
