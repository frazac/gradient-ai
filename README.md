# Gradiente IA

**Livelli di integrazione dell'IA tratti da AIAS** — cinque livelli per dire, prima di una prova, quanto e come l'intelligenza artificiale può entrarci. Testi in italiano per l'università (STEM, materie umanistiche, AFAM) e un timbro per ogni livello, in PNG, SVG e JavaScript.

→ **https://frazac.github.io/gradient-ai/**

| | Livello | In breve |
|---|---|---|
| 1 | **Autonomia** | Senza IA |
| 2 | **Ideazione** | IA solo in fase preparatoria |
| 3 | **Co-creazione** | IA al fianco, con vaglio critico |
| 4 | **Regia** | IA diretta dallo studente |
| 5 | **Sperimentazione** | IA come terreno di ricerca |

## Usare i timbri

**PNG** — `dist/png/timbro-3-512.png` (anche `-pieno`, icona, etichetta; più misure)

**SVG** — `dist/svg/timbro-3.svg`

**JavaScript**, come [Lucide](https://lucide.dev):

```html
<script src="https://cdn.jsdelivr.net/gh/frazac/gradient-ai@v0.1.0/dist/gradient-ai.js"></script>

<i data-gradient="3"></i>
<i data-gradient="5" data-variant="label" data-filled></i>

<script>
  GradientAI.createBadges({ from: '#c8473d', to: '#1f2a44', weight: 2 });
</script>
```

Opzioni: `variant` (`stamp` | `icon` | `label`) · `color` · `from`/`to` (gradiente in cinque passi, interpolato in OKLCH) · `palette` (array di cinque colori) · `weight` (1–3, come lo `stroke-width` di Lucide) · `filled` · `size`. Solo la stringa: `GradientAI.toSvg(3, { variant: 'icon' })`.

I testi completi dei livelli, con gli esempi per contesto, sono in [`dati/livelli.it.json`](dati/livelli.it.json).

## Sviluppo

Nessuna dipendenza: Python 3 e Google Chrome.

```bash
python3 strumenti/build.py
```

rigenera `dist/gradient-ai.js` (da `src/gradient-ai.core.js` + dati + icone), le schede dei livelli in `index.html`, `dist/svg/` e `dist/png/`. I file in `dist/` sono generati: si modificano i sorgenti e si ricompila. Anteprima locale: `python3 -m http.server` e poi `http://localhost:8000/`.

## Licenza e crediti

[CC BY-NC-SA 4.0](LICENSE) — la stessa della fonte.

- **Fonte**: AI Assessment Scale (AIAS) v2 di Mike Perkins, Leon Furze, Jasper Roe e Jason MacVaugh, CC BY-NC-SA 4.0 — [aiassessmentscale.com](https://aiassessmentscale.com/). Perkins, M., Furze, L., Roe, J., & MacVaugh, J. (2024). The Artificial Intelligence Assessment Scale (AIAS). *Journal of University Teaching and Learning Practice*, 21(6).
- **Icone**: [Lucide](https://lucide.dev) — ban, calendar-days, blender, bot, lighthouse — licenza ISC, © Lucide Icons and Contributors ([testo](src/icone/LICENSE-lucide.txt)).
- **Adattamento, testi italiani e timbri**: [Francesco Zaccaria](https://linktr.ee/frazac).

Gradiente IA è un adattamento indipendente: non è una traduzione ufficiale e non è approvato dagli autori della AIAS.

### Come attribuire

> Gradiente IA – Livelli di integrazione dell'IA tratti da AIAS, v0.1.0, di Francesco Zaccaria, CC BY-NC-SA 4.0. Adattamento di AI Assessment Scale (AIAS) v2 di Mike Perkins, Leon Furze, Jasper Roe e Jason MacVaugh (CC BY-NC-SA 4.0). Icone: Lucide (ISC).
