#!/usr/bin/env python3
"""
Build di Gradient AI — nessuna dipendenza oltre a Python 3 e Google Chrome.

  python3 strumenti/build.py          → dist/gradient-ai.js + dist/svg/*.svg + dist/png/*.png
  python3 strumenti/build.py --js     → solo dist/gradient-ai.js (+ index.html)

1. dist/gradient-ai.js: src/gradient-ai.core.js con dentro versione (VERSION), livelli
   (dati/livelli.it.json) e icone Lucide (src/icone/*.svg).
2. dist/svg: Chrome headless esegue la libreria (strumenti/esporta.html) e restituisce gli SVG,
   così file statici e JS escono dallo stesso codice.
0. Sito: una pagina per profilo (index.html = generale, stem/, umanistiche/, afam/) generata da
   src/pagina.html + dati/livelli.it.json; la versione in [data-versione].
4. assets/favicon.svg: icona del livello 3 in currentColor (bianca in tema scuro).
3. dist/png: nella stessa pagina, ogni SVG passa da un canvas (sfondo trasparente).
   Le misure dei PNG stanno in strumenti/esporta.html (SIZES).
"""
import base64
import html
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
LINGUE = ["it", "fr", "en"]
VARIANTS = {"it": {"stamp": "timbro", "icon": "icona", "label": "etichetta"},
            "fr": {"stamp": "tampon", "icon": "icone", "label": "etiquette"},
            "en": {"stamp": "stamp", "icon": "icon", "label": "label"}}
PIENO = {"it": "-pieno", "fr": "-plein", "en": "-filled"}


def build_js():
    version = (ROOT / "VERSION").read_text().strip()
    levels = {}
    for lg in LINGUE:
        data = json.loads((ROOT / "dati" / f"livelli.{lg}.json").read_text(encoding="utf-8"))
        levels[lg] = [{"n": l["n"], "id": l["id"], "name": l["nome"], "subtitle": l["sottotitolo"], "icon": l["icona"]}
                      for l in data["livelli"]]
    icons = {}
    for l in levels["it"]:
        svg = (ROOT / "src" / "icone" / f"{l['icon']}.svg").read_text()
        inner = re.search(r"<svg[^>]*>(.*)</svg>", svg, re.S).group(1)
        icons[l["icon"]] = re.sub(r"\s*\n\s*", "", inner).replace(" />", "/>")
    # Mix Gradient IA: due toni per livello e direzione del gradiente (esportato dallo strumento in fonti-riservate/)
    m = json.loads((ROOT / "dati" / "mix-gradient.json").read_text(encoding="utf-8"))
    mix = {"angolo": m["angolo"], "livelli": [{"da": t["da"], "a": t["a"]} for t in m["livelli"]]}
    core = (ROOT / "src" / "gradient-ai.core.js").read_text(encoding="utf-8")
    out = (core.replace("__VERSION__", version)
           .replace("__LEVELS__", json.dumps(levels, ensure_ascii=False))
           .replace("__ICONS__", json.dumps(icons, ensure_ascii=False))
           .replace("__MIX__", json.dumps(mix, ensure_ascii=False)))
    (ROOT / "dist").mkdir(exist_ok=True)
    (ROOT / "dist" / "gradient-ai.js").write_text(out, encoding="utf-8")
    print(f"dist/gradient-ai.js  v{version}")


def e(t):
    return html.escape(t, quote=False).replace('"', "&quot;")   # apostrofi lasciati leggibili


# etichetta del selettore di lingua (il codice tecnico e l'URL restano it / en)
ETICHETTE = {"it": "Italiano", "fr": "Français", "en": "Simple English"}
LINGUA_UI = {"it": ("Cambia lingua",), "fr": ("Changer de langue",), "en": ("Change language",)}
ICONA_GLOBO = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
               '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>')

SITO = "https://frazac.github.io/gradient-ai/"
ICONA_COPY = ('<svg class="i-copia" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
              '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>')
ICONA_CHECK = ('<svg class="i-fatto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
               '<path d="M20 6 9 17l-5-5"/></svg>')


def titolo_extra(l):
    """Solo il primo grado porta il sottotitolo nel titolo della scheda: «Autonomia (senza IA)»."""
    if l["n"] != 1:
        return ""
    st = l["sottotitolo"]
    return " (" + e(st[:1].lower() + st[1:]) + ")"


def box_copia(id_, html_testo, lg):
    """Box arrotondato con il testo e, dentro, il pulsante «Copia» (stesso stile degli altri)."""
    c = BOTTONI[lg]["copia"]
    return (f'<div class="box-copia"><p id="{id_}">{html_testo}</p>'
            f'<p class="azioni"><button type="button" class="bottone" data-copia="#{id_}">{c}</button></p></div>')


BOTTONI = {
    "it": {"gradiente": "Gradiente", "livelli": "Livelli", "livello": "Livello", "copia": "Copia", "md": "Copia in formato MD", "testo": "Copia testo con link",
           "svg": "Scarica SVG", "png": "Scarica PNG", "copiasvg": "Copia SVG", "profilo": "Profilo", "modifica": "modifica"},
    "fr": {"gradiente": "Gradient", "livelli": "Niveaux", "livello": "Niveau", "copia": "Copier", "md": "Copier au format MD", "testo": "Copier le texte avec lien",
           "svg": "Télécharger le SVG", "png": "Télécharger le PNG", "copiasvg": "Copier le SVG", "profilo": "Profil", "modifica": "modifier"},
    "en": {"gradiente": "Gradient", "livelli": "Levels", "livello": "Level", "copia": "Copy", "md": "Copy as Markdown (MD)", "testo": "Copy text with link",
           "svg": "Download SVG", "png": "Download PNG", "copiasvg": "Copy SVG", "profilo": "Profile", "modifica": "change"},
}


def render_site():
    """Una pagina per profilo (generale → index.html, gli altri → <percorso>/index.html) da src/pagina.html."""
    version = (ROOT / "VERSION").read_text().strip()
    dati = {lg: json.loads((ROOT / "dati" / f"livelli.{lg}.json").read_text(encoding="utf-8")) for lg in LINGUE}
    for lg in LINGUE:
        render_lang(lg, dati, version)


def render_lang(lg, dati, version):
    data = dati[lg]
    template = (ROOT / "src" / f"pagina.{lg}.html").read_text(encoding="utf-8")
    profili = data["profili"]
    B = BOTTONI[lg]
    for pr in profili:
        pid, r = pr["id"], "../" * pr["percorso"].count("/")
        parts = []
        for l in data["livelli"]:
            n, t = l["n"], l["profili"][pid]
            esempi = "".join(f"\n        <li>{e(x)}</li>" for x in t["esempi"])
            url = f"{SITO}{pr['percorso']}#livello-{n}"
            nome_badge = f"{data['titolo']} · {B['livello']} {n} · {l['nome']}"
            md = f"[{nome_badge}]({url})"
            parts.append(f"""
  <article id="livello-{n}" class="livello" data-livello="{n}">
    <p class="occhiello">{B["gradiente"]} {n}<span class="pallino" aria-hidden="true"></span><span class="occhiello-nome">{e(l["nome"])}</span></p>
    <h2>{e(l["nome"])}{titolo_extra(l)}</h2>
    <p>{e(t["chiede"])}</p>
    <h3 class="etichetta">{e(pr["esempi"])}</h3>
    <ul class="esempi">{esempi}
    </ul>
    <div class="uscite">
      <span class="uscite-timbro" data-slot="{n}" data-grande></span>
      <p class="azioni">
        <button type="button" class="bottone" data-scarica="svg" data-n="{n}">{B["svg"]}</button>
        <button type="button" class="bottone" data-scarica="png" data-n="{n}">{B["png"]}</button>
        <button type="button" class="bottone" data-copia-svg="{n}">{B["copiasvg"]}</button>
      </p>
      <p class="badge-nome"><a href="{url}">{e(nome_badge)}</a></p>
      <p class="azioni"><button type="button" class="bottone" data-copia-testo="{n}">{B["testo"]}</button></p>
      <code class="badge-md" id="md-{n}">{e(md)}</code>
      <p class="azioni"><button type="button" class="bottone" data-copia="#md-{n}">{B["md"]}</button></p>
      <h3 class="etichetta">{e(pr["esegue"])} <span class="etichetta-profilo">({B["profilo"]}: {e(pr["nome"])}, <a href="#profili">{B["modifica"]}</a>)</span></h3>
      {box_copia(f"consegna-{n}", e(t["esegue"]), lg)}
    </div>
  </article>""")
        nav_livelli = ('<nav class="nav-livelli" aria-label="' + B["livelli"] + '"><ol>' + "".join(
            f'<li><a href="#livello-{l["n"]}" data-nav="{l["n"]}"><span class="nav-num">{l["n"]}</span>'
            f'<span class="nav-nome">{e(l["nome"])}</span></a></li>' for l in data["livelli"])
            + '</ol><div class="traccia" aria-hidden="true"><div class="traccia-barra"></div></div></nav>')
        note_list = data["note_didattica"] if pr["note"] == "didattica" else pr["note"]
        note = "\n  <ul>" + "".join(f"\n    <li>{e(x)}</li>" for x in note_list) + "\n  </ul>\n  "
        nav = "".join(
            f'\n  <a href="{(r + q["percorso"]) or "./"}"' + (' aria-current="page"' if q is pr else "") +
            f' title="{e(q["esteso"])}">{e(q["nome"])}</a>' for q in profili)
        # stesso profilo nelle altre lingue: selettore lingua e link hreflang
        pari = {x: next(q for q in dati[x]["profili"] if q["id"] == pid) for x in LINGUE}
        base_url = SITO
        alternate = "\n".join(f'  <link rel="alternate" hreflang="{x}" href="{base_url}{pari[x]["percorso"]}">' for x in LINGUE)
        # selettore lingua: globo (Lucide "globe") che apre un menu a tendina
        voci = "".join(
            f'<li><a href="{(r + pari[x]["percorso"]) or "./"}" hreflang="{x}" lang="{x}"'
            + (' class="is-active" aria-current="true"' if x == lg else "") + f'>{ETICHETTE[x]}</a></li>' for x in LINGUE)
        L = LINGUA_UI[lg]
        # nel piè di pagina le lingue stanno aperte, in fila
        lingue_piede = ('<ul class="lingue-piede" aria-label="' + L[0] + '">' + "".join(
            f'<li><a href="{(r + pari[x]["percorso"]) or "./"}" hreflang="{x}" lang="{x}"'
            + (' class="is-active" aria-current="true"' if x == lg else "") + f'>{ETICHETTE[x]}</a></li>' for x in LINGUE) + '</ul>')
        lingua = (f'<div class="header-lang">\n'
                  f'      <button class="lang-toggle" type="button" aria-label="{L[0]}" title="{L[0]}" aria-expanded="false" aria-haspopup="true" aria-controls="lang-panel">{ICONA_GLOBO}</button>\n'
                  f'      <div class="lang-panel" id="lang-panel"><div class="lang-panel-inner">\n'
                  f'        <ul>{voci}</ul>\n'
                  f'      </div></div>\n    </div>')
        titolo = f"{data['titolo']} – {data['sottotitolo']}" + ("" if pid == "generale" else f" · {pr['nome']}")
        descr = re.sub(r"<[^>]+>", "", pr["lead"]) + (" Adattamento di AIAS v2, CC BY-NC-SA 4.0." if lg == "it" else {"en": " Based on the AIAS v2, CC BY-NC-SA 4.0.", "fr": " Adaptation de l'AIAS v2, CC BY-NC-SA 4.0."}[lg])
        page = (template.replace('<a href="{{R}}" class="marchio-link">', f'<a href="{r or "./"}" class="marchio-link">')
                .replace("{{R}}", r).replace("{{TITOLO}}", e(titolo)).replace("{{DESCRIZIONE}}", e(descr))
                .replace("{{PROFILO}}", pid).replace("{{PERCORSO}}", pr["percorso"]).replace("{{OCCHIELLO}}", e(pr["occhiello"]))
                .replace("{{LEAD}}", pr["lead"]).replace("{{PROFILI}}", nav)
                .replace("{{LIVELLI}}", nav_livelli + "".join(parts)).replace("{{COPIA_ICONE}}", ICONA_COPY + ICONA_CHECK).replace("{{COPIA}}", B["copia"]).replace("{{ALTERNATE}}", alternate).replace("{{HOME}}", (r + pari[lg]["percorso"].split("/")[0] + "/") if lg != "it" else (r or "./")).replace("{{LINGUA}}", lingua).replace("{{LINGUE_PIEDE}}", lingue_piede).replace("{{NOTE}}", note))
        page = page.split("\n", 1)[1]            # via il commento sul modello
        page = re.sub(r"(<span data-versione>)[^<]*(</span>)", rf"\g<1>{version}\g<2>", page)
        out = ROOT / pr["percorso"] / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(f"<!-- Generato da strumenti/build.py (src/pagina.{lg}.html + dati/livelli.{lg}.json): non modificare a mano. -->\n" + page, encoding="utf-8")
        print(out.relative_to(ROOT))


def export():
    page = (ROOT / "strumenti" / "esporta.html").as_uri()
    dom = subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--allow-file-access-from-files",
                          "--virtual-time-budget=10000", "--dump-dom", page],
                         capture_output=True, text=True, timeout=120).stdout
    m = re.search(r'<pre id="out">(.+?)</pre>', dom, re.S)
    if not m:
        sys.exit("esporta.html non ha prodotto output: controlla dist/gradient-ai.js")
    out = json.loads(html.unescape(m.group(1)))
    for d in ("svg", "png"):
        (ROOT / "dist" / d).mkdir(parents=True, exist_ok=True)
        for f in (ROOT / "dist" / d).glob(f"*.{d}"):
            f.unlink()

    def name(key):          # it-stamp-3-filled → timbro-3-pieno · en-stamp-3-filled → en/stamp-3-filled
        lg, variant, n, tone = key.split("-")[:4]
        return ("" if lg == "it" else f"{lg}/") + f"{VARIANTS[lg][variant]}-{n}" + (PIENO[lg] if tone == "filled" else "")

    for d in ("svg", "png"):
        for x in LINGUE[1:]:
            (ROOT / "dist" / d / x).mkdir(parents=True, exist_ok=True)
            for f in (ROOT / "dist" / d / x).glob(f"*.{d}"):
                f.unlink()
    for key, svg in out["svg"].items():
        (ROOT / "dist" / "svg" / f"{name(key)}.svg").write_text(svg + "\n", encoding="utf-8")
    for key, data in out["png"].items():
        h = key.split("-")[4]
        (ROOT / "dist" / "png" / f"{name(key)}-{h}.png").write_bytes(base64.b64decode(data.split(",", 1)[1]))
    (ROOT / "assets" / "favicon.svg").write_text(out["favicon"] + "\n", encoding="utf-8")
    print(f"dist/svg: {len(out['svg'])} file · dist/png: {len(out['png'])} file")


if __name__ == "__main__":
    build_js()
    render_site()
    if "--js" not in sys.argv:
        export()
