/* Gradiente IA — indirizzo email ricomposto nel browser, per ostacolare i bot che raccolgono indirizzi.
 * Nel codice HTML l'indirizzo non compare mai intero: <a class="js-email" data-u="ofni" data-d="ti.tneidargteg">
 * (utente e dominio scritti al contrario), con un eventuale data-s per l'oggetto. Senza JS resta il testo leggibile. */
(function () {
  'use strict';
  function giro(s) { return s.split('').reverse().join(''); }
  var link = document.querySelectorAll('a.js-email');
  for (var i = 0; i < link.length; i++) {
    var a = link[i];
    var e = giro(a.getAttribute('data-u') || '') + '@' + giro(a.getAttribute('data-d') || '');
    var s = a.getAttribute('data-s');
    a.href = 'mailto:' + e + (s ? '?subject=' + encodeURIComponent(s) : '');
    a.textContent = e;
  }
})();
