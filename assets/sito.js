/* Gradiente IA — sito: disegna i timbri con dist/gradient-ai.js e applica le scelte del pannello. */
(function () {
  'use strict';

  var G = window.GradientAI;
  var BASE = 'https://getgradient.it/';
  // codici da copiare legati alla versione (jsDelivr, tag vX.Y.Z): chi li usa non vede cambiare i timbri quando il progetto si aggiorna
  var FISSO = 'https://cdn.jsdelivr.net/gh/frazac/gradient-ai@v' + G.version + '/';
  var CDN = FISSO + 'dist/gradient-ai.js';
  var LG = (document.documentElement.lang || 'it').slice(0, 2);
  var T = {
    it: { brand: 'Gradiente IA', level: 'Livello', filled: '-pieno', dir: '', file: 'gradiente-ia-', ok: 'Copiato', ko: 'Copia non riuscita',
          nomi: { stamp: 'timbro', icon: 'icona', label: 'etichetta' } },
    fr: { brand: 'Gradient IA', level: 'Niveau', filled: '-plein', dir: 'fr/', file: 'gradient-ia-', ok: 'Copié', ko: 'Échec de la copie',
          nomi: { stamp: 'tampon', icon: 'icone', label: 'etiquette' } },
    en: { brand: 'Gradient AI', level: 'Level', filled: '-filled', dir: 'en/', file: 'gradient-ai-', ok: 'Copied', ko: 'Copy failed',
          nomi: { stamp: 'stamp', icon: 'icon', label: 'label' } },
    zh: { brand: 'AI 梯度', level: '第', filled: '-filled', dir: 'zh/', file: 'gradient-ai-', ok: '已复制', ko: '复制失败',
          nomi: { stamp: 'stamp', icon: 'icon', label: 'label' } }
  }[LG];
  // «Livello 3» · in cinese «第 3 级»
  function grado(n) { return LG === 'zh' ? '第 ' + n + ' 级' : T.level + ' ' + n; }
  var NOMI = T.nomi;
  var LEVELS = G.i18n[LG];
  var PNG = { stamp: 512, icon: 256, label: 192 };
  var PAGINA = BASE + (document.body.getAttribute('data-percorso') || '');   // pagina del profilo corrente
  var stato = { variant: 'stamp', schema: 'gradiente', from: '#c8473d', to: '#52589a', weight: 2, filled: false, sfondo: 'transparent', creditSize: 1, unico: '#2f5d8a' };

  var stato0 = JSON.parse(JSON.stringify(stato));   // configurazione di partenza (pulsante Reset)
  try { Object.assign(stato, JSON.parse(localStorage.getItem('gradiente-ia') || '{}')); } catch (e) { /* storage non disponibile */ }
  // una configurazione condivisa (?forma=…&colore=…) ha la precedenza su quella salvata nel browser
  (function () {
    var P = { forma: 'variant', colore: 'schema', da: 'from', a: 'to', peso: 'weight', pieno: 'filled', sfondo: 'sfondo', licenza: 'creditSize', unico: 'unico' };
    location.search.slice(1).split('&').forEach(function (kv) {
      var p = kv.split('='), k = P[p[0]];
      if (!k || p[1] == null) return;
      var v = decodeURIComponent(p[1]);
      stato[k] = k === 'weight' ? Number(v) || 2 : k === 'creditSize' ? Number(v) || 1 : k === 'filled' ? v === '1' || v === 'true' : v;
    });
  }());
  delete stato.contesto;   // opzione della 0.1.0, sostituita dalle pagine per profilo

  function opzioni() {
    var o = { variant: stato.variant, weight: stato.weight, filled: stato.filled, lang: LG };
    if (Number(stato.creditSize) !== 1) o.creditSize = Number(stato.creditSize);
    if (stato.schema === 'estremi') { o.from = stato.from; o.to = stato.to; }
    if (stato.schema === 'unico') o.color = stato.unico;
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
      el.innerHTML = '<img alt="' + grado(n) + ' · ' + l.name + '" src="data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(svgDi(n)) + '">';
    });
    document.querySelectorAll('.livello').forEach(function (el) {
      el.style.setProperty('--c', c[Number(el.getAttribute('data-livello')) - 1]);
    });
    document.querySelector('[data-out="weight"]').textContent = stato.weight;
    document.querySelector('[data-out="creditSize"]').textContent = Number(stato.creditSize).toFixed(1);

    codici(o);
    try { localStorage.setItem('gradiente-ia', JSON.stringify(stato)); } catch (e) { /* ignora */ }
  }

  // badge solo testo: una riga che dichiara il livello e porta alla sua scheda
  function url(n) { return PAGINA + '#livello-' + n; }
  // nome come sui badge: il primo grado porta «(senza IA)»
  function etichetta(n) { return T.brand + ' · ' + grado(n) + ' · ' + (LEVELS[n - 1].badge || LEVELS[n - 1].name); }
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
    if (o.creditSize) cfg.push('creditSize: ' + o.creditSize);
    if (o.filled) cfg.push('filled: true');
    if (PAGINA !== BASE + T.dir) cfg.push("link: '" + PAGINA + "'");
    set('testo', testo(3));
    set('testo-html', testoHtml(3));
    set('png', '<a href="' + url(3) + '">\n  <img src="' + FISSO + 'dist/png/' + nome + '-' + PNG[o.variant] + '.png"\n       alt="' + alt + '" width="128">\n</a>');
    set('svg', '<a href="' + url(3) + '">\n  <img src="' + FISSO + 'dist/svg/' + nome + '.svg"\n       alt="' + alt + '" width="128">\n</a>');
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

  // forma e colore: gruppi di pulsanti a scelta singola (i selettori di colore stanno dentro «Da… a…» e «Unico»)
  function allineaGruppi() {
    document.querySelectorAll('[data-gruppo]').forEach(function (g) {
      var k = g.getAttribute('data-gruppo');
      g.querySelectorAll('.scelta').forEach(function (b) {
        var si = b.getAttribute('data-valore') === String(stato[k]);
        b.setAttribute('aria-checked', si ? 'true' : 'false');
        b.tabIndex = si ? 0 : -1;
      });
    });
  }
  document.querySelectorAll('[data-gruppo]').forEach(function (g) {
    var k = g.getAttribute('data-gruppo'), scelte = Array.prototype.slice.call(g.querySelectorAll('.scelta'));
    function scegli(b) { stato[k] = b.getAttribute('data-valore'); allineaGruppi(); disegna(); }
    scelte.forEach(function (b, i) {
      // un clic sul pulsante o sul suo selettore di colore sceglie l'opzione
      b.addEventListener('click', function () { if (b.getAttribute('aria-checked') !== 'true') scegli(b); });
      b.addEventListener('keydown', function (e) {
        if (e.target !== b) return;
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); scegli(b); }
        var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (d) { e.preventDefault(); var n = scelte[(i + d + scelte.length) % scelte.length]; scegli(n); n.focus(); }
      });
    });
  });
  allineaGruppi();

  document.querySelectorAll('[data-opt]').forEach(function (el) {
    var k = el.getAttribute('data-opt');
    if (el.type === 'checkbox') el.checked = !!stato[k]; else el.value = stato[k];
    el.addEventListener('input', function () {
      stato[k] = el.type === 'checkbox' ? el.checked : el.type === 'range' ? Number(el.value) : el.value;
      disegna();
    });
  });

  // selettore lingua: menu a tendina sotto il globo; si chiude con Esc o con un clic fuori
  var lingua = document.querySelector('.header-lang');
  if (lingua) {
    var tog = lingua.querySelector('.lang-toggle');
    var pannello = lingua.querySelector('.lang-panel');
    var apri = function (si) {
      // se il globo è andato a capo sulla sinistra (schermi stretti), il menu si apre verso destra
      if (si) pannello.classList.toggle('a-destra', lingua.getBoundingClientRect().right - pannello.offsetWidth < 8);
      lingua.classList.toggle('is-open', si); tog.setAttribute('aria-expanded', si ? 'true' : 'false');
    };
    tog.addEventListener('click', function () { apri(!lingua.classList.contains('is-open')); });
    document.addEventListener('click', function (e) { if (!lingua.contains(e.target)) apri(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lingua.classList.contains('is-open')) { apri(false); tog.focus(); } });
  }

  // altezza reale della testata (su schermi stretti va su due righe): il menu dei livelli si aggancia sotto
  var testata = document.querySelector('.testata');
  var menuSez = document.querySelector('.menu-sezioni');
  function altezza() {
    if (testata) document.documentElement.style.setProperty('--h-testata', testata.offsetHeight + 'px');
    // su telefono il menu scorre in orizzontale: la dissolvenza serve solo se non ci sta tutto
    if (menuSez) menuSez.classList.toggle('scorre', menuSez.scrollWidth > menuSez.clientWidth + 1);
  }
  window.addEventListener('resize', altezza);
  altezza();

  // briciola a tendina (come l'indice di madeprogram): dopo il titolo, «Titolo — sezione corrente ▾»
  var capitoli = Array.prototype.slice.call(document.querySelectorAll('main h2'));
  var briciole = document.querySelector('.briciole');
  if (briciole && capitoli.length) {
    var bBtn = briciole.querySelector('.briciole-btn'), tendina = briciole.querySelector('.indice-tendina');
    var corrente = briciole.querySelector('.capitolo-corrente'), attivoCap = -1;
    capitoli.forEach(function (h, i) {
      var sez = h.closest('[id]');
      var li = document.createElement('li');
      if (sez && sez.classList.contains('livello')) li.className = 'livello-voce';
      li.innerHTML = '<a href="#' + (sez ? sez.id : '') + '"></a>';
      li.firstChild.textContent = (sez && sez.classList.contains('livello') ? sez.getAttribute('data-livello') + ' · ' : '') + h.textContent.trim();
      tendina.appendChild(li);
    });
    var chiudiIndice = function () { tendina.hidden = true; bBtn.setAttribute('aria-expanded', 'false'); };
    bBtn.addEventListener('click', function () { var ap = tendina.hidden; tendina.hidden = !ap; bBtn.setAttribute('aria-expanded', ap ? 'true' : 'false'); });
    tendina.addEventListener('click', function (e) { if (e.target.closest('a')) chiudiIndice(); });
    document.addEventListener('click', function (e) { if (!briciole.contains(e.target)) chiudiIndice(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !tendina.hidden) { chiudiIndice(); bBtn.focus(); } });
    var aggiornaBriciole = function () {
      // soglia: sotto la testata e, finché è a video, sotto il menu dei livelli (poi esce con la sua sezione)
      var nl = document.querySelector('.nav-livelli');
      // almeno quanto lo scroll-padding-top del CSS (7.5rem): chi salta a una sezione la vede subito nella briciola
      // il menu dei livelli conta solo quando è agganciato sotto la testata (prima sta più in basso nella pagina
      // e spingerebbe la soglia fino ai livelli: all'inizio dello scorrimento la briciola diceva già «1 · …»)
      var nr = nl ? nl.getBoundingClientRect() : null;
      var sotto = nr && nr.top <= testata.offsetHeight + 2 ? nr.bottom : 0;
      var soglia = Math.max(testata.offsetHeight, sotto, parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + 12;
      var i = 0;
      // riferimento: l'inizio della sezione (scheda o blocco con id), dove atterrano i link dell'indice
      capitoli.forEach(function (h, k) { var sez = h.closest('[id]') || h; if (sez.getBoundingClientRect().top - soglia <= 0) i = k; });
      if (i === attivoCap) return;
      attivoCap = i;
      corrente.textContent = tendina.children[i].firstChild.textContent;
      Array.prototype.forEach.call(tendina.children, function (li, k) { li.classList.toggle('corrente', k === i); });
    };
    window.addEventListener('scroll', aggiornaBriciole, { passive: true });
    aggiornaBriciole();
  }

  // testata: dopo il titolo la briciola sostituisce il menu delle sezioni
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

  // sfondo di prova: cambia solo lo sfondo dell'anteprima (variabile CSS), non i file copiati o scaricati
  var campioni = document.querySelectorAll('.campione'), libero = document.querySelector('[data-sfondo-libero]');
  function sfondo(v, daLibero) {
    stato.sfondo = v;
    document.documentElement.style.setProperty('--sfondo-prova', v);
    var trovato = false;
    campioni.forEach(function (c) { var si = !daLibero && c.getAttribute('data-sfondo') === v; trovato = trovato || si; c.setAttribute('aria-pressed', si ? 'true' : 'false'); });
    if (libero) { libero.classList.toggle('scelto', !trovato); if (!trovato && /^#/.test(v)) libero.value = v; }
    try { localStorage.setItem('gradiente-ia', JSON.stringify(stato)); } catch (e) { /* ignora */ }
  }
  campioni.forEach(function (c) { c.addEventListener('click', function () { sfondo(c.getAttribute('data-sfondo')); }); });
  if (libero) libero.addEventListener('input', function () { sfondo(libero.value, true); });
  sfondo(stato.sfondo || 'transparent');

  // condividere la configurazione: le scelte vanno nell'indirizzo (?forma=…), chi lo apre vede gli stessi badge
  var CHIAVI = { variant: 'forma', schema: 'colore', from: 'da', to: 'a', weight: 'peso', filled: 'pieno', sfondo: 'sfondo', creditSize: 'licenza', unico: 'unico' };
  var PARTENZA = stato0;
  function indirizzo() {
    var q = [];
    Object.keys(CHIAVI).forEach(function (k) {
      if (String(stato[k]) !== String(PARTENZA[k])) q.push(CHIAVI[k] + '=' + encodeURIComponent(k === 'filled' ? (stato[k] ? 1 : 0) : stato[k]));
    });
    return location.origin + location.pathname + (q.length ? '?' + q.join('&') : '') + '#personalizza';
  }
  var bCond = document.querySelector('[data-condividi]'), bReset = document.querySelector('[data-reset]');
  if (bCond) bCond.addEventListener('click', function () {
    var u = indirizzo();
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) navigator.share({ title: document.title, url: u }).catch(function () {});
    else copia(u, bCond);
  });
  function allinea() {
    document.querySelectorAll('[data-opt]').forEach(function (el) {
      var k = el.getAttribute('data-opt');
      if (el.type === 'checkbox') el.checked = !!stato[k]; else el.value = stato[k];
    });
  }
  if (bReset) bReset.addEventListener('click', function () {
    Object.keys(PARTENZA).forEach(function (k) { stato[k] = PARTENZA[k]; });
    allinea(); allineaGruppi(); sfondo(stato.sfondo); disegna();
    try { localStorage.setItem('gradiente-ia', JSON.stringify(stato)); } catch (e) { /* ignora */ }
    // il reset riporta anche al profilo generale (il primo della fascia dei profili)
    var gen = document.querySelector('.profili a');
    if (gen && gen.getAttribute('aria-current') !== 'page') { location.href = gen.href.replace(/#.*$/, ''); return; }
    if (location.search || location.hash) history.replaceState(null, '', location.pathname);
    tondini.forEach(function (b) { fascia(b, false); });   // il reset richiude tutte le fasce
    conferma(bReset, T.ok);
  });

  // fasce richiudibili: all'inizio chiuse, ognuna si apre e si chiude per conto suo (le altre restano come sono)
  var tondini = Array.prototype.slice.call(document.querySelectorAll('.apri-chiudi'));
  function fascia(b, aperta) {
    b.setAttribute('aria-expanded', aperta ? 'true' : 'false');
    document.getElementById(b.getAttribute('aria-controls')).hidden = !aperta;
  }
  tondini.forEach(function (b) {
    b.addEventListener('click', function () { fascia(b, b.getAttribute('aria-expanded') !== 'true'); });
    // anche il titolo della fascia apre e chiude (il tondino resta il comando per tastiera e lettori di schermo)
    var tit = b.parentNode.querySelector('.titolo-fascia');
    if (tit) tit.addEventListener('click', function () { b.click(); });
  });
  // un link a una fascia (#profili, #personalizza) la apre: «modifica» nelle schede, indirizzi condivisi
  function apriDaIndirizzo() {
    var sez = location.hash && document.getElementById(location.hash.slice(1));
    var b = sez && sez.querySelector('.apri-chiudi');
    if (b) fascia(b, true);
  }
  window.addEventListener('hashchange', apriDaIndirizzo);
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (a && a.getAttribute('href') === location.hash) apriDaIndirizzo();   // stesso hash: hashchange non scatta
  });
  apriDaIndirizzo();

  G.createBadges({ link: false });   // badge della sezione sull'uso dell'IA (hanno il proprio data-link)
  disegna();
}());
