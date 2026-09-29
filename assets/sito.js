/* Gradiente IA — sito: disegna i timbri con dist/gradient-ai.js e applica le scelte del pannello. */
(function () {
  'use strict';

  var G = window.GradientAI;
  var BASE = 'https://frazac.github.io/gradient-ai/';
  var CDN = 'https://cdn.jsdelivr.net/gh/frazac/gradient-ai@v' + G.version + '/dist/gradient-ai.js';
  var LG = (document.documentElement.lang || 'it').slice(0, 2);
  var T = {
    it: { brand: 'Gradiente IA', level: 'Livello', filled: '-pieno', dir: '', file: 'gradiente-ia-', ok: 'Copiato', ko: 'Copia non riuscita',
          nomi: { stamp: 'timbro', icon: 'icona', label: 'etichetta' } },
    fr: { brand: 'Gradient IA', level: 'Niveau', filled: '-plein', dir: 'fr/', file: 'gradient-ia-', ok: 'Copié', ko: 'Échec de la copie',
          nomi: { stamp: 'tampon', icon: 'icone', label: 'etiquette' } },
    en: { brand: 'Gradient AI', level: 'Level', filled: '-filled', dir: 'en/', file: 'gradient-ai-', ok: 'Copied', ko: 'Copy failed',
          nomi: { stamp: 'stamp', icon: 'icon', label: 'label' } }
  }[LG];
  var NOMI = T.nomi;
  var LEVELS = G.i18n[LG];
  var PNG = { stamp: 512, icon: 256, label: 192 };
  var PAGINA = BASE + (document.body.getAttribute('data-percorso') || '');   // pagina del profilo corrente
  var stato = { variant: 'stamp', schema: 'gradiente', from: '#c8473d', to: '#1f2a44', weight: 2, filled: false };

  try { Object.assign(stato, JSON.parse(localStorage.getItem('gradiente-ia') || '{}')); } catch (e) { /* storage non disponibile */ }
  delete stato.contesto;   // opzione della 0.1.0, sostituita dalle pagine per profilo

  function opzioni() {
    var o = { variant: stato.variant, weight: stato.weight, filled: stato.filled, lang: LG };
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
      var n = Number(el.getAttribute('data-slot')), l = LEVELS[n - 1];
      el.innerHTML = '<img alt="' + T.level + ' ' + n + ' · ' + l.name + '" src="data:image/svg+xml;charset=utf-8,' +
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
  function etichetta(n) { return T.brand + ' · ' + T.level + ' ' + n + ' · ' + LEVELS[n - 1].name; }
  function testo(n) { return etichetta(n) + ' — ' + url(n); }
  function testoHtml(n) { return '<a href="' + url(n) + '">' + etichetta(n) + '</a>'; }

  function codici(o) {
    var nome = T.dir + NOMI[o.variant] + '-3' + (o.filled ? T.filled : '');
    var alt = etichetta(3);
    var attr = ['data-gradient="3"'];
    if (LG !== 'it') attr.push('data-lang="' + LG + '"');
    if (o.variant !== 'stamp') attr.push('data-variant="' + o.variant + '"');
    var cfg = [];
    if (o.color) cfg.push("color: '" + o.color + "'");
    if (o.from) cfg.push("from: '" + o.from + "', to: '" + o.to + "'");
    if (Number(o.weight) !== 2) cfg.push('weight: ' + o.weight);
    if (o.filled) cfg.push('filled: true');
    if (PAGINA !== BASE + T.dir) cfg.push("link: '" + PAGINA + "'");
    set('testo', testo(3));
    set('testo-html', testoHtml(3));
    set('png', '<a href="' + url(3) + '">\n  <img src="' + BASE + 'dist/png/' + nome + '-' + PNG[o.variant] + '.png"\n       alt="' + alt + '" width="128">\n</a>');
    set('svg', '<a href="' + url(3) + '">\n  <img src="' + BASE + 'dist/svg/' + nome + '.svg"\n       alt="' + alt + '" width="128">\n</a>');
    set('js', '<script src="' + CDN + '"></script>\n\n<i ' + attr.join(' ') + '></i>\n\n<script>\n  GradientAI.createBadges(' + (cfg.length ? '{ ' + cfg.join(', ') + ' }' : '') + ');\n</script>');
  }
  function set(k, t) { var el = document.querySelector('[data-codice="' + k + '"]'); if (el) el.textContent = t; }

  // ---- copia e scarica ----

  // ogni pulsante riuscito mostra per un attimo la spunta (Lucide check); se fallisce, un breve messaggio
  var CHECK = '<svg class="i-fatto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  document.querySelectorAll('.bottone').forEach(function (b) { b.insertAdjacentHTML('afterbegin', CHECK); });
  function conferma(btn, testo) {
    if (testo === T.ok) {
      btn.classList.add('fatto');
      clearTimeout(btn._t);
      btn._t = setTimeout(function () { btn.classList.remove('fatto'); }, 1600);
    } else {
      btn.setAttribute('title', testo);
    }
  }
  function copia(testo, btn) {
    navigator.clipboard.writeText(testo).then(function () { conferma(btn, T.ok); }, function () { conferma(btn, T.ko); });
  }
  function nomeFile(n, ext) {
    var o = opzioni();
    return T.file + NOMI[o.variant] + '-' + n + (o.filled ? T.filled : '') + '.' + ext;
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
        })]).then(function () { conferma(b, T.ok); }, function () { copia(testo(t), b); });
      } else copia(testo(t), b);
    } else if (b.hasAttribute('data-copia')) {
      copia(document.querySelector(b.getAttribute('data-copia')).textContent.trim(), b);
    } else if (b.hasAttribute('data-copia-svg')) {
      copia(svgDi(b.getAttribute('data-copia-svg')), b);
    } else if (b.getAttribute('data-scarica') === 'svg') {
      var n = b.getAttribute('data-n');
      scarica(URL.createObjectURL(new Blob([svgDi(n)], { type: 'image/svg+xml' })), nomeFile(n, 'svg'));
      conferma(b, T.ok);
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
        conferma(b, T.ok);
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

  // selettore lingua (come orco.it): apre/chiude il pannello, chiude con ×, Esc o clic fuori
  var lingua = document.querySelector('.header-lang');
  if (lingua) {
    var tog = lingua.querySelector('.lang-toggle');
    var apri = function (si) { lingua.classList.toggle('is-open', si); tog.setAttribute('aria-expanded', si ? 'true' : 'false'); };
    tog.addEventListener('click', function () { apri(!lingua.classList.contains('is-open')); });
    lingua.querySelector('.lang-close').addEventListener('click', function () { apri(false); tog.focus(); });
    document.addEventListener('click', function (e) { if (!lingua.contains(e.target)) apri(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') apri(false); });
  }

  // altezza reale della testata (su schermi stretti va su due righe): il menu dei livelli si aggancia sotto
  var testata = document.querySelector('.testata');
  function altezza() { if (testata) document.documentElement.style.setProperty('--h-testata', testata.offsetHeight + 'px'); }
  window.addEventListener('resize', altezza);
  altezza();

  // testata: logo e nome compaiono quando il titolo esce dallo schermo
  var titolo = document.querySelector('.intro h1');
  if (titolo && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (v) { document.body.classList.toggle('scorsa', !v[0].isIntersecting); },
      { rootMargin: '-56px 0px 0px 0px' }).observe(titolo);
  } else document.body.classList.add('scorsa');

  // menu dei livelli: livello attivo e traccia di avanzamento lungo le cinque schede
  var voci = Array.prototype.slice.call(document.querySelectorAll('.nav-livelli a'));
  var schede = Array.prototype.slice.call(document.querySelectorAll('.livello'));
  var barra = document.querySelector('.traccia-barra');
  function spia() {
    if (!schede.length) return;
    var nav = document.querySelector('.nav-livelli'), y = nav.getBoundingClientRect().bottom + 8;
    var inizio = schede[0].getBoundingClientRect().top, fine = schede[schede.length - 1].getBoundingClientRect().bottom;
    var p = Math.min(1, Math.max(0, (y - inizio) / (fine - inizio - window.innerHeight + y)));
    if (barra) barra.style.width = (p * 100).toFixed(1) + '%';
    var attivo = 0;
    schede.forEach(function (sc, i) { if (sc.getBoundingClientRect().top <= y + 40) attivo = i + 1; });
    voci.forEach(function (v, i) { v.classList.toggle('attivo', i + 1 === attivo); });
  }
  window.addEventListener('scroll', spia, { passive: true });
  window.addEventListener('resize', spia);
  spia();

  G.createBadges({ link: false });   // marchio nella testata (è già dentro un link)
  disegna();
}());
