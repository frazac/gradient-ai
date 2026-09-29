# Novità

Il progetto segue il [versionamento semantico](https://semver.org/lang/it/) con una numerazione propria; la versione della AIAS da cui deriva (v2, 2024) è dichiarata a parte.

## 0.3.0 — 2026-09-29

- Versione in **Simple English** (`/en/`, `/en/stem/`, `/en/humanities/`, `/en/arts/`), scritta secondo ISO 24495-1:2023 e le regole della Simple English Wikipedia, con rimando alla versione inglese originale della AIAS. Selettore IT/EN in testata, link `hreflang`.
- Libreria: opzione `lang` (`it` | `en`, di default la lingua della pagina); timbri inglesi in `dist/svg/en/` e `dist/png/en/`.
- Sito: più spazio fra il pannello dei comandi e i badge; tolta la riga sulla versione originale sotto la galleria; post-it di revisione caricati solo in locale.

## 0.2.0 — 2026-09-29

- Quattro profili con testi propri per ogni livello: **Generale** (contesto professionale, in homepage), **Didattica STEM**, **Didattica umanistica**, **Didattica AFAM** (pagine `/stem/`, `/umanistiche/`, `/afam/`). Livelli, nomi e timbri restano gli stessi.
- Livello 4: sottotitolo «IA sotto direzione umana» (valido per tutti i profili).
- Badge solo testo con link alla scheda del livello; gli snippet PNG/SVG sono già avvolti nel link.
- Libreria: opzione `link` (di default il timbro porta alla scheda del livello), corretto `data-filled` senza valore.
- Sito: anteprima identica al file scaricato, colonna di 700 px, switch chiaro/scuro e banner cookie come masterismi.dev, favicon adattiva, footer con note legali.

## 0.1.0 — 2026-09-25

Prima bozza.

- Testi italiani dei cinque livelli (Autonomia, Ideazione, Co-creazione, Regia, Sperimentazione), con indicazioni per chi insegna, consegna per chi studia ed esempi per STEM, materie umanistiche e AFAM.
- Timbri tondi, icone ed etichette, contornati o pieni: libreria `dist/gradient-ai.js`, file SVG e PNG.
- Colori personalizzabili (gradiente fra due estremi, colore unico, palette) e peso del tratto.
- Homepage per GitHub Pages con personalizzazione, download e codice pronto da copiare.
