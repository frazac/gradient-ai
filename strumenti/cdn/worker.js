// cdn.getgradient.it — Worker Cloudflare che serve i file di una versione fissata del progetto.
// /v0.7.1/dist/gradient-ai.js → jsDelivr (gh/frazac/gradient-ai@v0.7.1/dist/gradient-ai.js).
// Solo i file sotto dist/ di un tag vX.Y.Z: il contenuto di un tag non cambia, quindi la cache è lunga.
// Pubblicazione: python3 strumenti/cdn/pubblica.py

const ORIGINE = 'https://cdn.jsdelivr.net/gh/frazac/gradient-ai@';
const SITO = 'https://getgradient.it/';
const PERCORSO = /^\/(v\d+\.\d+\.\d+)\/(dist\/[A-Za-z0-9._\/-]+)$/;

export default {
  async fetch(richiesta) {
    const url = new URL(richiesta.url);
    if (url.pathname === '/' || url.pathname === '') return Response.redirect(SITO, 302);
    if (richiesta.method !== 'GET' && richiesta.method !== 'HEAD') return new Response('Metodo non ammesso', { status: 405 });
    const m = url.pathname.match(PERCORSO);
    if (!m || m[2].includes('..')) return new Response('Non trovato. Gradient AI: ' + SITO, { status: 404 });

    // in cache a lungo solo le risposte riuscite: un 404 (per esempio un tag appena pubblicato che jsDelivr non ha ancora letto)
    // non deve restare bloccato. «?c=2» cambia la chiave di cache, per scartare i 404 salvati dalla prima versione del Worker.
    const origine = await fetch(ORIGINE + m[1] + '/' + m[2] + '?c=2', {
      cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': 31536000, '404': 0, '500-599': 0 } }
    });
    const intestazioni = new Headers();
    for (const h of ['content-type', 'etag', 'last-modified']) {
      const v = origine.headers.get(h);
      if (v) intestazioni.set(h, v);
    }
    intestazioni.set('access-control-allow-origin', '*');
    intestazioni.set('x-content-type-options', 'nosniff');
    intestazioni.set('cache-control', origine.ok ? 'public, max-age=31536000, immutable' : 'no-store');
    return new Response(richiesta.method === 'HEAD' ? null : origine.body, { status: origine.status, headers: intestazioni });
  }
};
