# Novità

Il progetto segue il [versionamento semantico](https://semver.org/lang/it/) con una numerazione propria; la versione della AIAS da cui deriva (v2, 2024) è dichiarata a parte.

## Non ancora rilasciato

- Schede dei livelli in una colonna: prima il testo, poi le uscite (badge, pulsanti, testo con link, Markdown, indicazione per chi esegue). Tutti i pulsanti con lo stesso stile e la spunta ✓ quando l'azione riesce.
- Testata sticky, con logo e nome che compaiono dopo lo scorrimento; pannello di personalizzazione non più sticky; menu dei 5 livelli sticky con traccia di avanzamento.
- Scala tipografica rivista (h3 > h4; etichette delle schede in maiuscoletto a parte); elenchi con pallino appeso fuori dal testo.
- «Come questo progetto ha usato l'IA» in tutte e tre le lingue, con badge contornati neri (tema chiaro) o bianchi (tema scuro).
- Contenuti dichiarati a livello 3 (Co-creazione): i testi sono scritti insieme all'IA e rivisti dall'autore. Tolto un doppione della sezione nella pagina italiana.
- Badge sempre su sfondo trasparente; nel pannello «Sfondo di prova» (trasparente, bianco, nero o un colore a scelta) cambia solo l'anteprima, non i file.
- Marchio in testata solo testuale (l'icona resta nella favicon).
- Selettore lingua come menu a tendina sotto il globo (si apre verso destra se a sinistra non c'è spazio).
- Lingue anche nel piè di pagina, sempre aperte, accanto allo switch chiaro/scuro.
- Testata: voci allineate a sinistra; dopo il titolo il menu diventa una briciola a tendina (come l'indice di madeprogram): «Gradiente IA — [sezione corrente ▾]»: il nome è un link semplice alla home della lingua, la sezione è un pulsante a pillola sempre visibile che apre l'elenco di tutti gli h2; globo sempre a destra.
- Icona del selettore lingua: Lucide `globe` al posto di `earth`.
- Licenza: bollino CC e, sotto, il testo in piccolo (prima finiva su più colonne).
- Badge: sotto timbro e pittogramma, sull'arco esterno, «CC BY-NC-SA 4.0 getgradient.it» in corpo piccolo (sul pittogramma «Gradient IA n/5 — CC BY-NC-SA 4.0 getgradient.it»); opzione `credit: false` per toglierlo (la favicon non lo porta). Timbro ed etichetta indicano il grado come n/5. Etichetta a larghezza variabile secondo il nome.
- Colore predefinito del livello 5 schiarito (#1f2a44 → #52589a, indaco): leggibile sia sul tema chiaro sia su quello scuro.
- Pannello: «Forma: timbro / etichetta / pittogramma» (in quest'ordine; «icona» diventa «pittogramma») e «Colore: …» dentro i menu, senza etichetta a parte; interruttore «Traccia ○ Pieno»; sfondi di prova senza grigio e rosso (resta il selettore libero); 10 px in più sopra e sotto.
- Sotto il pannello, una striscia «Condividi questa configurazione» (copia un indirizzo con le scelte, es. `?forma=label&pieno=1`, che all'apertura ha la precedenza su quelle salvate) e «Reset».
- Testo del profilo sopra i pulsanti dei profili, in una fascia con filetti al vivo come il pannello; «Introduzione» come h2 sotto il sottotitolo (entra anche nella briciola).
- Nelle schede, dopo «Indicazione per chi realizza» (o «Consegna per chi studia»): «(Profilo: Generale, modifica)», con il nome del profilo in uso e un link che riporta alla fascia dei profili (`#profili`).
- Avviso «This page is in Simple English»: senza la barra a sinistra, filetto uguale su tutti i lati (2 px, colore d'accento) e angoli tutti stondati.
- «Come questo progetto ha usato l'IA»: sotto, una riga «Fatto con Claude, il modello di IA di Anthropic, usato attraverso Claude Code», in testo semplice e senza logo. Claude non compare fra i contributori del repository.
- Tolti i post-it di revisione (caricati solo in locale): le revisioni passano dalla chat.
- Fasce richiudibili come accordion (profilo, «Personalizza», «Condividi»): titolo a sinistra e tondino con + che diventa × quando la fascia è aperta; all'avvio sono tutte aperte. «Reset» riporta anche al profilo generale.
- Filetto di 1 px (nero sul chiaro, bianco sullo scuro) sopra ogni titolo h2.
- Pannello su quattro righe: forma (tre pulsanti: timbro, etichetta, pittogramma); colore (gradiente · da ◯ a ◯ · unico ◯ · nero, con i selettori dentro i pulsanti; il colore unico ha un suo selettore, chiave `unico` nell'indirizzo); peso, traccia/pieno e sfondo di prova; licenza, con il cursore largo quanto la colonna.
- Etichetta: altezza identica per tutti i livelli (varia solo la larghezza), sul sito come nei file; licenza in riga sotto la pillola («Gradient IA — CC BY-NC-SA 4.0 getgradient.it»), regolabile con «Licenza». Nella galleria le etichette stanno una sotto l'altra, a bandiera a sinistra.
- Grado n/5 tutto nello stesso corpo, su timbro ed etichetta.
- Pallini tutti di circa 9 px, come quello della briciola: elenchi (pallino disegnato, appeso fuori dal testo) e pallini ai lati del timbro.
- Sezione «4. JavaScript»: tolto il paragone con Lucide in apertura.
- Testata: nella briciola un pallino pieno al posto del trattino fra il nome e la sezione.
- Licenza sotto timbro e pittogramma più grande (timbro 10, pittogramma 3,4 unità; l'arco si allunga da solo per farci stare il testo) e regolabile: comando «Licenza» nel pannello (0,5–2, solo per timbro e pittogramma), opzione `creditSize` / attributo `data-credit-size`, chiave `licenza` nell'indirizzo condiviso.

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
