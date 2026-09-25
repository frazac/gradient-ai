#!/usr/bin/env python3
"""
Build di Gradient AI — nessuna dipendenza oltre a Python 3 e Google Chrome.

  python3 strumenti/build.py          → dist/gradient-ai.js + dist/svg/*.svg + dist/png/*.png
  python3 strumenti/build.py --js     → solo dist/gradient-ai.js (+ index.html)

1. dist/gradient-ai.js: src/gradient-ai.core.js con dentro versione (VERSION), livelli
   (dati/livelli.it.json) e icone Lucide (src/icone/*.svg).
2. dist/svg: Chrome headless esegue la libreria (strumenti/esporta.html) e restituisce gli SVG,
   così file statici e JS escono dallo stesso codice.
0. index.html: le schede dei livelli e le note d'uso vengono scritte fra i segnaposto
   <!-- LIVELLI:INIZIO/FINE --> e <!-- NOTE:INIZIO/FINE --> dai dati; la versione in [data-versione].
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
VARIANTS = {"stamp": "timbro", "icon": "icona", "label": "etichetta"}


def build_js():
    version = (ROOT / "VERSION").read_text().strip()
    data = json.loads((ROOT / "dati" / "livelli.it.json").read_text(encoding="utf-8"))
    levels = [{"n": l["n"], "id": l["id"], "name": l["nome"], "subtitle": l["sottotitolo"], "icon": l["icona"]}
              for l in data["livelli"]]
    icons = {}
    for l in levels:
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


def render_site():
    version = (ROOT / "VERSION").read_text().strip()
    data = json.loads((ROOT / "dati" / "livelli.it.json").read_text(encoding="utf-8"))
    ctx = data["contesti"]
    parts = []
    for l in data["livelli"]:
        n = l["n"]
        esempi = "".join(
            f'\n        <div class="esempio" data-contesto="{c["id"]}"><h4 title="{e(c["esteso"])}">{e(c["nome"])}</h4>'
            f'<p>{e(l["esempi"][c["id"]])}</p></div>' for c in ctx)
        parts.append(f"""
  <article id="livello-{n}" class="livello" data-livello="{n}">
    <div class="livello-timbro"><span data-slot="{n}" data-grande></span></div>
    <div class="livello-testo">
      <p class="occhiello">Livello {n} · {e(l["sottotitolo"])}</p>
      <h2>{e(l["nome"])}</h2>
      <h3>Per chi insegna</h3>
      <p>{e(l["docente"])}</p>
      <h3>Consegna per chi studia</h3>
      <blockquote id="consegna-{n}">{e(l["studente"])}</blockquote>
      <h3>Esempi di prove</h3>
      <div class="esempi">{esempi}
      </div>
      <p class="azioni">
        <button type="button" class="bottone" data-copia="#consegna-{n}">Copia la consegna</button>
        <button type="button" class="bottone" data-scarica="svg" data-n="{n}">Scarica SVG</button>
        <button type="button" class="bottone" data-scarica="png" data-n="{n}">Scarica PNG</button>
        <button type="button" class="bottone" data-copia-svg="{n}">Copia SVG</button>
      </p>
    </div>
  </article>""")
    note = "\n  <ul>" + "".join(f"\n    <li>{e(x)}</li>" for x in data["note"]) + "\n  </ul>\n  "
    page = (ROOT / "index.html").read_text(encoding="utf-8")
    page = re.sub(r"(<!-- LIVELLI:INIZIO[^>]*-->).*?(\s*<!-- LIVELLI:FINE -->)",
                  lambda m: m.group(1) + "".join(parts) + m.group(2), page, flags=re.S)
    page = re.sub(r"(<!-- NOTE:INIZIO -->).*?(<!-- NOTE:FINE -->)",
                  lambda m: m.group(1) + note + m.group(2), page, flags=re.S)
    page = re.sub(r"(<span data-versione>)[^<]*(</span>)", rf"\g<1>{version}\g<2>", page)
    (ROOT / "index.html").write_text(page, encoding="utf-8")
    print("index.html")


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

    def name(key):                                     # stamp-3-filled → timbro-3-pieno
        variant, n, tone = key.split("-")[:3]
        return f"{VARIANTS[variant]}-{n}" + ("-pieno" if tone == "filled" else "")

    for key, svg in out["svg"].items():
        (ROOT / "dist" / "svg" / f"{name(key)}.svg").write_text(svg + "\n", encoding="utf-8")
    for key, data in out["png"].items():
        h = key.split("-")[3]
        (ROOT / "dist" / "png" / f"{name(key)}-{h}.png").write_bytes(base64.b64decode(data.split(",", 1)[1]))
    print(f"dist/svg: {len(out['svg'])} file · dist/png: {len(out['png'])} file")


if __name__ == "__main__":
    build_js()
    render_site()
    if "--js" not in sys.argv:
        export()
