# Novità

Il progetto segue il [versionamento semantico](https://semver.org/lang/it/) con una numerazione propria; la versione della AIAS da cui deriva (v2, 2024) è dichiarata a parte.

## Non ancora rilasciato

- Schede dei livelli in una colonna: prima il testo, poi le uscite (badge, pulsanti, testo con link, Markdown, indicazione per chi esegue). Tutti i pulsanti con lo stesso stile e la spunta ✓ quando l'azione riesce.
- Testata sticky, con logo e nome che compaiono dopo lo scorrimento; pannello di personalizzazione non più sticky; menu dei 5 livelli sticky con traccia di avanzamento.
- Scala tipografica rivista (h3 > h4; etichette delle schede in maiuscoletto a parte); elenchi con pallino appeso fuori dal testo.
- «Come questo progetto ha usato l'IA» in tutte e tre le lingue, con badge contornati neri (tema chiaro) o bianchi (tema scuro).

## 0.4.0 — 2026-09-29

- **Francese**: pagine `fr/`, `fr/stem/`, `fr/sciences-humaines/`, `fr/arts/`, timbri francesi in `dist/*/fr/`, `lang: 'fr'` nella libreria.
- Selettore lingua come orco.it: globo (Lucide `earth`) che apre un pannello con Italiano, Français, Simple English.
- Pannello di personalizzazione nello stile di masterismi.dev: menu a pillola, colori a cerchio, interruttore «Pieno», pulsante principale pieno.
- Schede dei livelli: consegna e attribuzione in un box arrotondato con icona copia (Lucide `copy` → `check`); sotto il badge i pulsanti del badge, il badge testuale con link e la versione Markdown `[testo](url)` con «Copia in formato MD». Tolto «Copia l'indicazione».

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
