# Gradiente IA

**Livelli di integrazione dell'IA tratti da AIAS** — cinque livelli per dire, prima di un lavoro o di una prova, quanto e come l'intelligenza artificiale può entrarci. Un timbro per ogni livello, in PNG, SVG, JavaScript o come semplice riga di testo con link.

→ **https://frazac.github.io/gradient-ai/**

Stessi livelli e stessi timbri, testi diversi per profilo:

- **[Generale](https://frazac.github.io/gradient-ai/)** — contesto professionale (estensione di Gradiente IA, non presente nella AIAS originale)
- **[Didattica STEM](https://frazac.github.io/gradient-ai/stem/)**
- **[Didattica umanistica](https://frazac.github.io/gradient-ai/umanistiche/)**
- **[Didattica AFAM](https://frazac.github.io/gradient-ai/afam/)**

**Français** → https://frazac.github.io/gradient-ai/fr/ — traduction complète (profils général, STEM, lettres et sciences humaines, enseignement artistique).

**English (Simple English)** → https://frazac.github.io/gradient-ai/en/ — a version for people who are still learning English, written following [ISO 24495-1:2023](https://www.iso.org/standard/78907.html) (plain language) and the [Simple English Wikipedia](https://simple.wikipedia.org/wiki/Wikipedia:How_to_write_Simple_English_pages) rules. There is already a better English text: the original [AI Assessment Scale](https://aiassessmentscale.com/).

**简体中文** → https://frazac.github.io/gradient-ai/zh/ — 完整译本（通用、STEM、人文学科、艺术院校四个场景），由意大利语翻译而来，尚待以中文为母语的人士审校。

| | Livello | In breve |
|---|---|---|
| 1 | **Autonomia** | Senza IA |
| 2 | **Ideazione** | IA solo in fase preparatoria |
| 3 | **Co-creazione** | IA al fianco, con vaglio critico |
| 4 | **Regia** | IA sotto direzione umana |
| 5 | **Sperimentazione** | IA come terreno di ricerca |

La versione originale, in inglese: **AIAS** — *AI Assessment Scale*, cioè scala dell'IA nella valutazione → [aiassessmentscale.com](https://aiassessmentscale.com/)

## Usare i timbri

**Solo testo, con link** — una riga che dichiara il livello e porta alla sua scheda (sul sito, pulsante «Copia testo con link»):

```html
<a href="https://frazac.github.io/gradient-ai/#livello-3">Gradiente IA · Livello 3 · Co-creazione</a>
```

**PNG** — `dist/png/timbro-3-512.png` (anche `-pieno`, icona, etichetta; più misure)

**SVG** — `dist/svg/timbro-3.svg`

**JavaScript**, come [Lucide](https://lucide.dev):

```html
<script src="https://cdn.jsdelivr.net/gh/frazac/gradient-ai@v0.7.0/dist/gradient-ai.js"></script>

<i data-gradient="3"></i>
<i data-gradient="5" data-variant="label" data-filled></i>

<script>
  GradientAI.createBadges({ from: '#c8473d', to: '#52589a', weight: 2 });
</script>
```

Opzioni: `variant` (`stamp` | `icon` | `label`) · `color` · `from`/`to` (gradiente in cinque passi, interpolato in OKLCH) · `palette` (array di cinque colori) · `weight` (1–3, come lo `stroke-width` di Lucide) · `filled` · `size` · `lang` (`it` | `fr` | `en` | `zh`; di default la lingua della pagina) · `link` (di default ogni timbro porta alla scheda del livello su frazac.github.io/gradient-ai; `false` per toglierlo, oppure l'indirizzo di un profilo, es. `.../stem/`). Solo la stringa: `GradientAI.toSvg(3, { variant: 'icon' })`.

I testi completi dei livelli, per ogni profilo, sono in [`dati/livelli.it.json`](dati/livelli.it.json), [`dati/livelli.fr.json`](dati/livelli.fr.json), [`dati/livelli.en.json`](dati/livelli.en.json) e [`dati/livelli.zh.json`](dati/livelli.zh.json).

## Sviluppo

Nessuna dipendenza: Python 3 e Google Chrome.

```bash
python3 strumenti/build.py
```

rigenera `dist/gradient-ai.js` (da `src/gradient-ai.core.js` + dati + icone), le pagine del sito (`index.html`, `stem/`, `umanistiche/`, `afam/`, `fr/…`, `en/…` e `zh/…`, dai modelli `src/pagina.{it,fr,en,zh}.html`), `dist/svg/` e `dist/png/`. I file in `dist/` sono generati: si modificano i sorgenti e si ricompila. Anteprima locale: `python3 -m http.server` e poi `http://localhost:8000/`.

## Licenza e crediti

Due licenze, secondo la parte ([dettagli](LICENSE)):

- **Codice** — [MIT](LICENSE-MIT): libreria JavaScript, strumenti di build, codice del sito. Uso libero, anche commerciale.
- **Testi dei livelli e timbri** — [CC BY-NC-SA 4.0](LICENSE-CC-BY-NC-SA), la stessa della fonte: i testi in `dati/livelli.*.json` (e gli stessi testi nelle pagine e dentro `dist/gradient-ai.js`), timbri, pittogrammi ed etichette (file in `dist/svg/` e `dist/png/` o creati con la libreria), palette Mix Gradient. Niente uso commerciale.
- **Nome** — le licenze riguardano il diritto d'autore, non il nome: chi usa livelli e timbri li cita come «Gradiente IA», ma non dà questo nome a un proprio prodotto o progetto derivato.

- **Fonte**: AI Assessment Scale (AIAS) v2 di Mike Perkins, Leon Furze, Jasper Roe e Jason MacVaugh, CC BY-NC-SA 4.0 — [aiassessmentscale.com](https://aiassessmentscale.com/). Perkins, M., Furze, L., Roe, J., & MacVaugh, J. (2024). The Artificial Intelligence Assessment Scale (AIAS). *Journal of University Teaching and Learning Practice*, 21(6).
- **Icone**: [Lucide](https://lucide.dev) — ban, calendar-days, blender, bot, lighthouse — licenza ISC, © Lucide Icons and Contributors ([testo](src/icone/LICENSE-lucide.txt)).
- **Adattamento, testi italiani e timbri**: [Francesco Zaccaria](https://linktr.ee/frazac).

Gradiente IA è un adattamento indipendente: non è una traduzione ufficiale e non è approvato dagli autori della AIAS.

### Come attribuire

> Gradiente IA di Francesco Zaccaria, Livelli di integrazione dell'IA tratti da AIAS v2 di Mike Perkins, Leon Furze, Jasper Roe e Jason MacVaugh (licenza CC BY-NC-SA 4.0). Codice: licenza MIT. Icone: Lucide (licenza ISC).
