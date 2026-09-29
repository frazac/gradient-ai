/* Gradiente IA — sito: disegna i timbri con dist/gradient-ai.js e applica le scelte del pannello. */
(function () {
  'use strict';

  var G = window.GradientAI;
  var BASE = 'https://frazac.github.io/gradient-ai/';
  var CDN = 'https://cdn.jsdelivr.net/gh/frazac/gradient-ai@v' + G.version + '/dist/gradient-ai.js';
  var NOMI = { stamp: 'timbro', icon: 'icona', label: 'etichetta' };
  var PNG = { stamp: 512, icon: 256, label: 192 };
  var PAGINA = BASE + (document.body.getAttribute('data-percorso') || '');   // pagina del profilo corrente
  var stato = { variant: 'stamp', schema: 'gradiente', from: '#c8473d', to: '#1f2a44', weight: 2, filled: false };

  try { Object.assign(stato, JSON.parse(localStorage.getItem('gradiente-ia') || '{}')); } catch (e) { /* storage non disponibile */ }
  delete stato.contesto;   // opzione della 0.1.0, sostituita dalle pagine per profilo

  function opzioni() {
    var o = { variant: stato.variant, weight: stato.weight, filled: stato.filled };
    if (stato.schema === 'estremi') { o.from = stato.from; o.to = stato.to; }
    if (stato.schema === 'unico') o.color = stato.from;
    if (stato.schema === 'nero') o.color = '#111111';
    return o;
  }

  function colori() {
    var o = opzioni();
    return [1, 2, 3, 4, 5].map(function (n) {
      return o.color || (o.from ? G.palette(o.from, o.to)[n - 1] : G.defaultPalette[n - 1]);
    });
  }

  function disegna() {
    var o = opzioni(), c = colori();
    document.body.setAttribute('data-variant', stato.variant);
    // anteprima = file scaricato: stessa stringa SVG mostrata come <img>, quindi anche stesso font (di sistema)
    document.querySelectorAll('[data-slot]').forEach(function (el) {
      var n = Number(el.getAttribute('data-slot')), l = G.levels[n - 1];
      el.innerHTML = '<img alt="Livello ' + n + ' · ' + l.name + '" src="data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(svgDi(n)) + '">';
    });
    document.querySelectorAll('.livello').forEach(function (el) {
      el.style.setProperty('--c', c[Number(el.getAttribute('data-livello')) - 1]);
    });
    document.querySelector('.colori').hidden = !(stato.schema === 'estremi' || stato.schema === 'unico');
    document.querySelector('[data-opt="to"]').hidden = stato.schema !== 'estremi';
    document.querySelector('[data-out="weight"]').textContent = stato.weight;
    codici(o);
    try { localStorage.setItem('gradiente-ia', JSON.stringify(stato)); } catch (e) { /* ignora */ }
  }

  // badge solo testo: una riga che dichiara il livello e porta alla sua scheda
  function url(n) { return PAGINA + '#livello-' + n; }
  function etichetta(n) { return 'Gradiente IA · Livello ' + n + ' · ' + G.levels[n - 1].name; }
  function testo(n) { return etichetta(n) + ' — ' + url(n); }
  function testoHtml(n) { return '<a href="' + url(n) + '">' + etichetta(n) + '</a>'; }

  function codici(o) {
    var nome = NOMI[o.variant] + '-3' + (o.filled ? '-pieno' : '');
    var alt = etichetta(3);
    var attr = ['data-gradient="3"'];
    if (o.variant !== 'stamp') attr.push('data-variant="' + o.variant + '"');
    var cfg = [];
    if (o.color) cfg.push("color: '" + o.color + "'");
    if (o.from) cfg.push("from: '" + o.from + "', to: '" + o.to + "'");
    if (Number(o.weight) !== 2) cfg.push('weight: ' + o.weight);
    if (o.filled) cfg.push('filled: true');
    if (PAGINA !== BASE) cfg.push("link: '" + PAGINA + "'");
    set('testo', testo(3));
    set('testo-html', testoHtml(3));
    set('png', '<a href="' + url(3) + '">\n  <img src="' + BASE + 'dist/png/' + nome + '-' + PNG[o.variant] + '.png"\n       alt="' + alt + '" width="128">\n</a>');
    set('svg', '<a href="' + url(3) + '">\n  <img src="' + BASE + 'dist/svg/' + nome + '.svg"\n       alt="' + alt + '" width="128">\n</a>');
    set('js', '<script src="' + CDN + '"></script>\n\n<i ' + attr.join(' ') + '></i>\n\n<script>\n  GradientAI.createBadges(' + (cfg.length ? '{ ' + cfg.join(', ') + ' }' : '') + ');\n</script>');
  }
  function set(k, t) { var el = document.querySelector('[data-codice="' + k + '"]'); if (el) el.textContent = t; }

  // ---- copia e scarica ----

  function conferma(btn, testo) {
    var prima = btn.textContent;
    btn.textContent = testo; btn.classList.add('fatto');
    setTimeout(function () { btn.textContent = prima; btn.classList.remove('fatto'); }, 1600);
  }
  function copia(testo, btn) {
    navigator.clipboard.writeText(testo).then(function () { conferma(btn, 'Copiato'); }, function () { conferma(btn, 'Copia non riuscita'); });
  }
  function nomeFile(n, ext) {
    var o = opzioni();
    return 'gradiente-ia-' + NOMI[o.variant] + '-' + n + (o.filled ? '-pieno' : '') + '.' + ext;
  }
  function scarica(url, nome) {
    var a = document.createElement('a');
    a.href = url; a.download = nome;
    document.body.appendChild(a); a.click(); a.remove();
  }
  function svgDi(n) { return G.toSvg(n, opzioni()).replace(/gai\d+/g, 'gai-' + n); }

  document.addEventListener('click', function (evt) {
    var b = evt.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-copia-testo')) {
      // testo semplice + HTML: nei programmi che lo accettano (Word, Docs, email) il link resta cliccabile
      var t = Number(b.getAttribute('data-copia-testo'));
      if (window.ClipboardItem) {
        navigator.clipboard.write([new ClipboardItem({
          'text/plain': new Blob([testo(t)], { type: 'text/plain' }),
          'text/html': new Blob([testoHtml(t)], { type: 'text/html' })
        })]).then(function () { conferma(b, 'Copiato'); }, function () { copia(testo(t), b); });
      } else copia(testo(t), b);
    } else if (b.hasAttribute('data-copia')) {
      copia(document.querySelector(b.getAttribute('data-copia')).textContent.trim(), b);
    } else if (b.hasAttribute('data-copia-svg')) {
      copia(svgDi(b.getAttribute('data-copia-svg')), b);
    } else if (b.getAttribute('data-scarica') === 'svg') {
      var n = b.getAttribute('data-n');
      scarica(URL.createObjectURL(new Blob([svgDi(n)], { type: 'image/svg+xml' })), nomeFile(n, 'svg'));
    } else if (b.getAttribute('data-scarica') === 'png') {
      var m = b.getAttribute('data-n'), s = svgDi(m);
      var vb = s.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
      var h = PNG[opzioni().variant], w = Math.round(h * vb[2] / vb[3]);
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        scarica(c.toDataURL('image/png'), nomeFile(m, 'png'));
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
    }
  });

  // ---- pannello ----

  document.querySelectorAll('[data-opt]').forEach(function (el) {
    var k = el.getAttribute('data-opt');
    if (el.type === 'checkbox') el.checked = !!stato[k]; else el.value = stato[k];
    el.addEventListener('input', function () {
      stato[k] = el.type === 'checkbox' ? el.checked : el.type === 'range' ? Number(el.value) : el.value;
      disegna();
    });
  });

  G.createBadges({ link: false });   // marchio nella testata (è già dentro un link)
  disegna();
}());
