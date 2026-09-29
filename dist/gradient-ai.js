/*!
 * Gradient AI v0.4.0 — Gradiente IA: livelli di integrazione dell'IA tratti da AIAS
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

  var VERSION = '0.4.0';
  var LEVELS = {"it": [{"n": 1, "id": "autonomia", "name": "Autonomia", "subtitle": "Senza IA", "icon": "ban"}, {"n": 2, "id": "ideazione", "name": "Ideazione", "subtitle": "IA solo in fase preparatoria", "icon": "calendar-days"}, {"n": 3, "id": "co-creazione", "name": "Co-creazione", "subtitle": "IA al fianco, con vaglio critico", "icon": "blender"}, {"n": 4, "id": "regia", "name": "Regia", "subtitle": "IA sotto direzione umana", "icon": "bot"}, {"n": 5, "id": "sperimentazione", "name": "Sperimentazione", "subtitle": "IA come terreno di ricerca", "icon": "lighthouse"}], "fr": [{"n": 1, "id": "autonomia", "name": "Autonomie", "subtitle": "Sans IA", "icon": "ban"}, {"n": 2, "id": "ideazione", "name": "Idéation", "subtitle": "IA seulement en amont", "icon": "calendar-days"}, {"n": 3, "id": "co-creazione", "name": "Co-création", "subtitle": "IA à vos côtés, avec regard critique", "icon": "blender"}, {"n": 4, "id": "regia", "name": "Régie", "subtitle": "IA sous direction humaine", "icon": "bot"}, {"n": 5, "id": "sperimentazione", "name": "Expérimentation", "subtitle": "IA comme terrain de recherche", "icon": "lighthouse"}], "en": [{"n": 1, "id": "autonomia", "name": "On your own", "subtitle": "No AI", "icon": "ban"}, {"n": 2, "id": "ideazione", "name": "Ideas", "subtitle": "AI only before you start", "icon": "calendar-days"}, {"n": 3, "id": "co-creazione", "name": "Working together", "subtitle": "AI helps, you check everything", "icon": "blender"}, {"n": 4, "id": "regia", "name": "Directing", "subtitle": "People lead the AI", "icon": "bot"}, {"n": 5, "id": "sperimentazione", "name": "Exploring", "subtitle": "AI as a place to try new things", "icon": "lighthouse"}]};   // { it: [...], en: [...] }
  var TEXT = {
    it: { brand: 'Gradiente IA', level: 'Livello', bottom: 'GRADIENTE IA', mark: 'Gradient IA' },
    fr: { brand: 'Gradient IA', level: 'Niveau', bottom: 'GRADIENT IA', mark: 'Gradient IA' },
    en: { brand: 'Gradient AI', level: 'Level', bottom: 'GRADIENT AI', mark: 'Gradient AI' }
  };
  // licenza e indirizzo sull'arco esterno sotto timbro e pittogramma (credit: false per toglierli, creditSize per la grandezza)
  var CREDIT = 'CC BY-NC-SA 4.0 getgradient.it';
  var ICONS = {"ban": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M4.929 4.929 19.07 19.071\"/>", "calendar-days": "<path d=\"M8 2v3\"/><path d=\"M16 2v3\"/><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"M8 13h.01\"/><path d=\"M12 13h.01\"/><path d=\"M16 13h.01\"/><path d=\"M8 17h.01\"/><path d=\"M12 17h.01\"/><path d=\"M16 17h.01\"/>", "blender": "<path d=\"M8 14a2 2 0 0 0-1.963 1.615l-1.018 5.193A1 1 0 0 0 6 22h12a1 1 0 0 0 .981-1.192l-1.018-5.193A2 2 0 0 0 16 14z\"/><path d=\"m17 2-1 12\"/><path d=\"M8.006 14 7 2\"/><path d=\"M7.565 8.787A5 5 0 0 0 12 8a5 5 0 0 1 4.56-.75\"/><path d=\"M19 2H5a2 2 0 0 0-2 2v5a2 2 0 0 0 .688 1.5\"/><path d=\"M12 18h.01\"/>", "bot": "<path d=\"M12 8V4H8\"/><rect width=\"16\" height=\"12\" x=\"4\" y=\"8\" rx=\"2\"/><path d=\"M2 14h2\"/><path d=\"M20 14h2\"/><path d=\"M15 13v2\"/><path d=\"M9 13v2\"/>", "lighthouse": "<path d=\"M12 3V2\"/><path d=\"M16.066 16.865 7 22l2-11V6a3 3 0 016 0v5l2 11\"/><path d=\"m19.792 4.5.866-.5\"/><path d=\"m19.797 13.5.866.5\"/><path d=\"M21 9h1\"/><path d=\"M3 9H2\"/><path d=\"m4.203 13.5-.866.5\"/><path d=\"M4.208 4.5 3.342 4\"/><path d=\"M5.5 22h13\"/><path d=\"m7.932 16.875 7.377-4.178\"/><path d=\"M8 11h8\"/><path d=\"M8 7h8\"/>"};

  // Palette predefinita: dal rosso del divieto (senza IA) al blu dell'esplorazione (sperimentazione).
  var PALETTE = ['#c8473d', '#b8741c', '#2a8c82', '#2f5d8a', '#52589a'];
  var FONT = "'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  var uid = 0;
  var SITE = 'https://frazac.github.io/gradient-ai/';

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

  function lang(x) { return TEXT[x] ? x : 'it'; }

  function level(n, lg) {
    var l = LEVELS[lang(lg)].filter(function (x) { return x.n === Number(n) || x.id === n; })[0];
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

  // m: margine attorno al disegno (spazio per il testo della licenza sull'arco esterno)
  function open(w, h, o, l, m) {
    var t = TEXT[o.lang];
    m = m || 0;
    var W = w + 2 * m, H = h + 2 * m;
    var px = o.size ? ' width="' + (o.size * W / H) + '" height="' + o.size + '"' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-m) + ' ' + (-m) + ' ' + W + ' ' + H + '"' + px +
      ' role="img" aria-label="' + esc(t.level + ' ' + l.n + ' · ' + l.name + ' — ' + l.subtitle) + '"' +
      (o['class'] ? ' class="' + esc(o['class']) + '"' : '') + '>' +
      '<title>' + esc(t.brand + ' · ' + t.level + ' ' + l.n + ' · ' + l.name) + '</title>';
  }

  function fontWeight(w) { return w < 1.5 ? 500 : w < 2.5 ? 700 : 800; }

  // testo su arco sotto un cerchio di centro (cx, cy): baseline a raggio r, lettere verso il centro;
  // l'arco sale di `gradi` sopra l'orizzontale ai due lati, così c'è posto anche per i testi lunghi
  // stima della lunghezza di un testo misto (maiuscole e minuscole) in Space Grotesk
  function mixedWidth(txt, fs, ls) { return txt.length * (0.56 * fs + ls); }

  // licenza sull'arco esterno di un disco di centro (c, c) e raggio R: corpo = base × creditSize;
  // restituisce il margine da aggiungere al disegno e il codice del testo
  function credit(id, txt, c, R, base, o, ink) {
    var k = Math.min(2, Math.max(0.5, Number(o.creditSize) || 1));
    var fs = +(base * k).toFixed(2), ls = +(fs * 0.06).toFixed(2);
    var r = +(R + fs * 0.25 + fs * 0.72).toFixed(2);
    // arco abbastanza lungo per il testo: oltre il semicerchio sale ai lati (al massimo 80° sopra l'orizzontale)
    var serve = mixedWidth(txt, fs, ls) * 1.08 / r;
    var gradi = Math.min(80, Math.max(0, (serve - Math.PI) / 2 * 180 / Math.PI));
    return { m: Math.ceil(r + fs * 0.3 - c), svg: arcText(id, txt, c, c, r, fs, ink, gradi) };
  }

  function arcText(id, txt, cx, cy, r, fs, ink, gradi) {
    var a = (gradi || 0) * Math.PI / 180, dx = r * Math.cos(a), dy = r * Math.sin(a);
    var f = function (v) { return +v.toFixed(2); };
    return '<defs><path id="' + id + '" d="M ' + f(cx - dx) + ' ' + f(cy - dy) + ' A ' + r + ' ' + r + ' 0 ' + (gradi > 0 ? 1 : 0) + ' 0 ' +
      f(cx + dx) + ' ' + f(cy - dy) + '"/></defs>' +
      '<text fill="' + ink + '" font-family="' + esc(FONT) + '" font-weight="500" font-size="' + fs + '" letter-spacing="' + f(fs * 0.06) +
      '" text-anchor="middle"><textPath href="#' + id + '" startOffset="50%">' + esc(txt) + '</textPath></text>';
  }

  // larghezza stimata di un testo maiuscolo in Space Grotesk (em per carattere), per le etichette a larghezza variabile
  function textWidth(txt, fs, ls) {
    var w = 0;
    for (var i = 0; i < txt.length; i++) {
      var ch = txt[i];
      w += /[IJ1 ]/.test(ch) ? 0.34 : /[MW]/.test(ch) ? 0.86 : 0.62;
    }
    return w * fs + ls * txt.length;
  }

  // ---- varianti ----

  // Timbro tondo: nome del livello sull'arco in alto, "GRADIENTE IA" in basso, icona e numero al centro.
  function stamp(l, o) {
    var c = colorFor(l, o), w = o.weight, filled = o.filled;
    var ink = filled ? (o.ink || '#ffffff') : c;
    var id = 'gai' + (++uid);
    var fw = fontWeight(w);
    var bottom = o.bottomText != null ? o.bottomText : TEXT[o.lang].bottom;
    var cr = o.credit !== false && o.credit !== 'false' ? credit(id + 'c', CREDIT, 100, 97, 10, o, c) : null;
    var s = open(200, 200, o, l, cr ? cr.m : 0);
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
    // pallini ai lati: grandi come quelli del sito (circa 9 px quando il timbro è a 170 px)
    s += '<circle cx="20" cy="100" r="' + (3.5 + w * 0.9) + '"/><circle cx="180" cy="100" r="' + (3.5 + w * 0.9) + '"/>';
    s += '<text x="100" y="151" font-size="30" font-weight="' + Math.max(fw, 700) + '">' + l.n + '/5</text>';
    s += '</g>';
    s += icon(l.icon, 74, 52, 52, ink, w);
    if (cr) s += cr.svg;
    return s + '</svg>';
  }

  // Icona: disco (pieno o contornato) con l'icona Lucide al centro.
  function badgeIcon(l, o) {
    var c = colorFor(l, o), w = o.weight, filled = o.filled;
    var ink = filled ? (o.ink || '#ffffff') : c;
    var cr = o.credit !== false && o.credit !== 'false' ? credit('gai' + (++uid) + 'c', TEXT[o.lang].mark + ' ' + l.n + '/5 — ' + CREDIT, 24, 23, 3.4, o, c) : null;
    var s = open(48, 48, o, l, cr ? cr.m : 0);
    s += filled ? '<circle cx="24" cy="24" r="23" fill="' + c + '"/>'
      : '<circle cx="24" cy="24" r="' + (23 - w / 2) + '" fill="' + (o.background || 'none') + '" stroke="' + c + '" stroke-width="' + w + '"/>';
    s += icon(l.icon, 11, 11, 26, ink, w);
    if (cr) s += cr.svg;
    return s + '</svg>';
  }

  // Etichetta orizzontale: grado (n/5), icona, nome; la larghezza segue la lunghezza del nome.
  function label(l, o) {
    var c = colorFor(l, o), w = o.weight, filled = o.filled;
    var ink = filled ? (o.ink || '#ffffff') : c;
    var name = l.name.toUpperCase();
    // l'altezza è la stessa per tutti i livelli (pillola 48 + riga della licenza); cambia solo la larghezza
    var P = Math.round(100 + textWidth(name, 15, 1.2) + 22);
    var withCredit = o.credit !== false && o.credit !== 'false';
    var k = Math.min(2, Math.max(0.5, Number(o.creditSize) || 1)), cfs = +(7 * k).toFixed(2);
    var ctxt = TEXT[o.lang].mark + ' — ' + CREDIT;
    var W = withCredit ? Math.max(P, Math.ceil(18 + mixedWidth(ctxt, cfs, cfs * 0.06))) : P;
    var H = withCredit ? Math.ceil(48 + 7 + cfs * 1.05) : 48;
    var s = open(W, H, o, l);
    s += filled ? '<rect x="0" y="0" width="' + P + '" height="48" rx="24" fill="' + c + '"/>'
      : '<rect x="' + w / 2 + '" y="' + w / 2 + '" width="' + (P - w) + '" height="' + (48 - w) + '" rx="' + (24 - w / 2) + '" fill="' + (o.background || 'none') + '" stroke="' + c + '" stroke-width="' + w + '"/>';
    s += '<g fill="' + ink + '" font-family="' + esc(FONT) + '" font-weight="' + fontWeight(w) + '">';
    // grado n/5 tutto nello stesso corpo
    s += '<text x="36" y="30.5" font-size="17" text-anchor="middle">' + l.n + '/5</text>';
    s += '<text x="100" y="29.5" font-size="15" letter-spacing="1.2">' + esc(name) + '</text></g>';
    s += '<line x1="60" y1="12" x2="60" y2="36" stroke="' + ink + '" stroke-width="' + (w * 0.6) + '" stroke-linecap="round"/>';
    s += icon(l.icon, 67, 13, 22, ink, w);
    if (withCredit) s += '<text x="18" y="' + (48 + 6 + cfs * 0.8).toFixed(2) + '" fill="' + c + '" font-family="' + esc(FONT) +
      '" font-weight="500" font-size="' + cfs + '" letter-spacing="' + (cfs * 0.06).toFixed(2) + '">' + esc(ctxt) + '</text>';
    return s + '</svg>';
  }

  var VARIANTS = { stamp: stamp, icon: badgeIcon, label: label };

  var DEFAULTS = { variant: 'stamp', weight: 2, filled: false };

  /**
   * SVG di un livello come stringa.
   * @param {number|string} n  1–5 oppure l'id ("autonomia", "ideazione", …)
   * @param {object} [options] variant: stamp|icon|label · lang: it|fr|en · color · from/to · palette · weight (1–3)
   *                           · filled · ink · background · size (px) · class · bottomText
   *                           · credit (false: niente licenza sotto il badge: sull'arco esterno di timbro e pittogramma, in riga sotto l'etichetta)
   *                           · creditSize (0.5–2, predefinito 1: grandezza del testo della licenza)
   */
  function toSvg(n, options) {
    var o = {};
    for (var k in DEFAULTS) o[k] = DEFAULTS[k];
    for (k in options || {}) if (options[k] != null && options[k] !== '') o[k] = options[k];
    o.weight = Math.min(4, Math.max(0.5, Number(o.weight) || 2));
    o.filled = o.filled === true || o.filled === 'true' || o.filled === '';
    o.lang = lang(o.lang);
    var fn = VARIANTS[o.variant];
    if (!fn) throw new Error('GradientAI: variante sconosciuta "' + o.variant + '" (stamp, icon, label)');
    return fn(level(n, o.lang), o);
  }

  /**
   * Sostituisce ogni elemento [data-gradient] con l'SVG del livello, come lucide.createIcons().
   * Attributi: data-gradient="3" data-lang (it|fr|en) data-variant data-color data-from data-to data-weight data-filled data-size data-link data-credit data-credit-size.
   * link: di default il timbro porta alla scheda del livello su frazac.github.io/gradient-ai;
   *       false (o data-link="false") lo toglie, una stringa è l'indirizzo della pagina da usare (es. il profilo /stem/).
   * Le opzioni passate valgono per tutti; gli attributi del singolo elemento hanno la precedenza.
   */
  function createBadges(options, rootEl) {
    var els = (rootEl || document).querySelectorAll('[data-gradient]');
    Array.prototype.forEach.call(els, function (el) {
      var o = {};
      for (var k in options || {}) o[k] = options[k];
      ['variant', 'color', 'from', 'to', 'weight', 'filled', 'size', 'ink', 'background', 'link', 'lang', 'credit', 'creditSize'].forEach(function (a) {
        // data-filled senza valore vale true (altrimenti la stringa vuota verrebbe scartata)
        var at = 'data-' + a.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase(); });   // creditSize → data-credit-size
        if (el.hasAttribute(at)) o[a] = el.getAttribute(at) || (a === 'filled' ? true : '');
      });
      if (el.className) o['class'] = el.className;
      // lingua: opzione, data-lang, oppure il lang della pagina (en → inglese, altrimenti italiano)
      if (!o.lang) { var lg = el.closest('[lang]'); o.lang = lg ? lg.getAttribute('lang').slice(0, 2).toLowerCase() : 'it'; }
      o.lang = lang(o.lang);
      var tpl = document.createElement('template');
      tpl.innerHTML = toSvg(el.getAttribute('data-gradient'), o);
      var svg = tpl.content.firstChild;
      svg.setAttribute('data-gradient', el.getAttribute('data-gradient'));
      var node = svg, link = o.link === undefined || o.link === true || o.link === 'true' ? SITE + (o.lang === 'it' ? '' : o.lang + '/') : o.link;
      if (link && link !== 'false') {
        var lv = level(el.getAttribute('data-gradient'), o.lang), n = lv.n, t = TEXT[o.lang];
        node = document.createElement('a');
        node.href = link.replace(/#.*$/, '') + '#livello-' + n;
        node.title = t.brand + ' · ' + t.level + ' ' + n + ' · ' + lv.name;
        node.style.display = 'inline-block';
        node.appendChild(svg);
      }
      el.parentNode.replaceChild(node, el);
    });
  }

  return {
    version: VERSION,
    levels: LEVELS.it,
    i18n: LEVELS,
    icons: ICONS,
    defaultPalette: PALETTE.slice(),
    site: SITE,
    palette: palette,
    toSvg: toSvg,
    createBadges: createBadges
  };
}));
