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
LINGUE = ["it", "en"]
VARIANTS = {"it": {"stamp": "timbro", "icon": "icona", "label": "etichetta"},
            "en": {"stamp": "stamp", "icon": "icon", "label": "label"}}
PIENO = {"it": "-pieno", "en": "-filled"}


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
    core = (ROOT / "src" / "gradient-ai.core.js").read_text(encoding="utf-8")
    out = (core.replace("__VERSION__", version)
           .replace("__LEVELS__", json.dumps(levels, ensure_ascii=False))
           .replace("__ICONS__", json.dumps(icons, ensure_ascii=False)))
    (ROOT / "dist").mkdir(exist_ok=True)
    (ROOT / "dist" / "gradient-ai.js").write_text(out, encoding="utf-8")
    print(f"dist/gradient-ai.js  v{version}")


def e(t):
    return html.escape(t, quote=False).replace('"', "&quot;")   # apostrofi lasciati leggibili


BOTTONI = {
    "it": {"livello": "Livello", "copia": "Copia l'indicazione", "testo": "Copia testo con link",
           "svg": "Scarica SVG", "png": "Scarica PNG", "copiasvg": "Copia SVG"},
    "en": {"livello": "Level", "copia": "Copy the text", "testo": "Copy text with link",
           "svg": "Download SVG", "png": "Download PNG", "copiasvg": "Copy SVG"},
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
            parts.append(f"""
  <article id="livello-{n}" class="livello" data-livello="{n}">
    <div class="livello-timbro"><span data-slot="{n}" data-grande></span></div>
    <div class="livello-testo">
      <p class="occhiello">{B["livello"]} {n} · {e(l["sottotitolo"])}</p>
      <h2>{e(l["nome"])}</h2>
      <h3>{e(pr["chiede"])}</h3>
      <p>{e(t["chiede"])}</p>
      <h3>{e(pr["esegue"])}</h3>
      <blockquote id="consegna-{n}">{e(t["esegue"])}</blockquote>
      <h3>{e(pr["esempi"])}</h3>
      <ul class="esempi">{esempi}
      </ul>
      <p class="azioni">
        <button type="button" class="bottone" data-copia="#consegna-{n}">{B["copia"]}</button>
        <button type="button" class="bottone" data-copia-testo="{n}">{B["testo"]}</button>
        <button type="button" class="bottone" data-scarica="svg" data-n="{n}">{B["svg"]}</button>
        <button type="button" class="bottone" data-scarica="png" data-n="{n}">{B["png"]}</button>
        <button type="button" class="bottone" data-copia-svg="{n}">{B["copiasvg"]}</button>
      </p>
    </div>
  </article>""")
        note_list = data["note_didattica"] if pr["note"] == "didattica" else pr["note"]
        note = "\n  <ul>" + "".join(f"\n    <li>{e(x)}</li>" for x in note_list) + "\n  </ul>\n  "
        nav = "".join(
            f'\n  <a href="{(r + q["percorso"]) or "./"}"' + (' aria-current="page"' if q is pr else "") +
            f' title="{e(q["esteso"])}">{e(q["nome"])}</a>' for q in profili)
        # stesso profilo nelle altre lingue: selettore lingua e link hreflang
        pari = {x: next(q for q in dati[x]["profili"] if q["id"] == pid) for x in LINGUE}
        base_url = "https://frazac.github.io/gradient-ai/"
        alternate = "\n".join(f'  <link rel="alternate" hreflang="{x}" href="{base_url}{pari[x]["percorso"]}">' for x in LINGUE)
        lingua = " ".join(
            f'<a href="{(r + pari[x]["percorso"]) or "./"}" hreflang="{x}" lang="{x}" class="lingua"'
            + (' aria-current="true"' if x == lg else "") + f'>{x.upper()}</a>' for x in LINGUE)
        titolo = f"{data['titolo']} – {data['sottotitolo']}" + ("" if pid == "generale" else f" · {pr['nome']}")
        descr = re.sub(r"<[^>]+>", "", pr["lead"]) + (" Adattamento di AIAS v2, CC BY-NC-SA 4.0." if lg == "it" else " Based on the AIAS v2, CC BY-NC-SA 4.0.")
        page = (template.replace('<a href="{{R}}" class="marchio-link">', f'<a href="{r or "./"}" class="marchio-link">')
                .replace("{{R}}", r).replace("{{TITOLO}}", e(titolo)).replace("{{DESCRIZIONE}}", e(descr))
                .replace("{{PROFILO}}", pid).replace("{{PERCORSO}}", pr["percorso"]).replace("{{OCCHIELLO}}", e(pr["occhiello"]))
                .replace("{{LEAD}}", pr["lead"]).replace("{{PROFILI}}", nav)
                .replace("{{LIVELLI}}", "".join(parts)).replace("{{ALTERNATE}}", alternate).replace("{{LINGUA}}", lingua).replace("{{NOTE}}", note))
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
        (ROOT / "dist" / d / "en").mkdir(parents=True, exist_ok=True)
        for f in (ROOT / "dist" / d / "en").glob(f"*.{d}"):
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
