# Same animacje projektów

Ten katalog zawiera **osiem animowanych prezentacji z sekcji „GitHub Prosjekter”**. Strona główna korzysta bezpośrednio z tych plików. Poprawienie animacji zmienia również jej podgląd po opublikowaniu.

**[Pobierz tylko ten katalog jako ZIP](https://github.com/RobertCygan/robertcygan.no/raw/refs/heads/main/downloads/animacje-projektow.zip)**. Rozpakuj archiwum i otwórz `animations/index.html`.

W repozytorium paczkę można odświeżyć po zmianach poleceniem `python3 scripts/build_animations.py`.

Możesz skopiować cały katalog `animations/` i pracować tylko na nim. Zawiera wszystkie skrypty, filmy i grafiki potrzebne do otwarcia galerii.

## Gdzie jest kod konkretnej animacji

| Projekt                             | Podgląd / HTML                                           | Scena i kod JavaScript                               | Style i przebieg animacji                              |
| ----------------------------------- | -------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| FlexiT — rejestracja czasu pracy    | [flexit.html](flexit.html)                              | [Odtwarzacz](shared/video.js)                       | [Style filmu](shared/video.css)                      |
| Utgiftsanalyse — analiza wydatków   | [utgiftsanalyse.html](utgiftsanalyse.html)               | [utgiftsanalyse.js](utgiftsanalyse.js)               | [utgiftsanalyse.css](utgiftsanalyse.css)               |
| Eiendomsskatt — analiza 3D          | [eiendomsskatt-analyse.html](eiendomsskatt-analyse.html) | [eiendomsskatt-analyse.js](eiendomsskatt-analyse.js) | [eiendomsskatt-analyse.css](eiendomsskatt-analyse.css) |
| E-Skatt Assistent — lista kontrolna | [e-skatt-assistent.html](e-skatt-assistent.html)         | [e-skatt-assistent.js](e-skatt-assistent.js)         | [e-skatt-assistent.css](e-skatt-assistent.css)         |
| FAKASS — obieg faktury              | [fakass.html](fakass.html)                               | [fakass.js](fakass.js)                               | [fakass.css](fakass.css)                               |
| InvoiceFlowAI — analiza faktury     | [invoiceflowai.html](invoiceflowai.html)                 | [Odtwarzacz](shared/video.js)                       | [Style filmu](shared/video.css)                      |
| KviTerminal                        | [kviterminal.html](kviterminal.html)                     | [Odtwarzacz](shared/video.js)                       | [Style filmu](shared/video.css)                      |
| Lånndet — wypożyczanie sprzętu     | [laandet.html](laandet.html)                             | [Odtwarzacz](shared/video.js)                       | [Style filmu](shared/video.css)                      |

W prezentacjach wideo ścieżki do filmów i plakatów są w plikach HTML. FlexiT i InvoiceFlowAI mają kwadratowe wersje 540 i 960 px, Lånndet ma pionowe wersje 360 i 720 px, a KviTerminal ma jeden kwadratowy film 540 px. Dwa dodatkowe filmy InvoiceFlowAI są dostępne na stronie programu i do pobrania z galerii.

W animacjach Utgiftsanalyse i Eiendomsskatt (analiza 3D) scenę opisuje obiekt `animation` w pliku `.js`. W E-Skatt Assistent i FAKASS rysunek SVG znajduje się w pliku `.html`, a ruch opisują reguły `@keyframes` w odpowiednim `.css`.

## Jak oglądać i poprawiać

1. Otwórz `index.html` z tego katalogu, aby zobaczyć galerię wszystkich ośmiu animacji.
2. Wybierz „Otwórz animację”, aby pracować nad jednym projektem.
3. Edytuj jego pliki i odśwież podgląd. Przycisk „Pause animasjon” zatrzymuje ruch.

Pliki używają zwykłych skryptów, bez importów modułów ani pobierania danych. Można je otwierać w zwykłej przeglądarce z dysku. Do testowania przez HTTP wystarczy uruchomić **z tego katalogu**:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Parametr `?embed=1` ukrywa przycisk pauzy, plakietkę nagłówka i kontrolki filmu w kafelku. Filmy startują wyciszone i zapętlają się. Powiększony odtwarzacz umożliwia przewijanie. Odtwarzanie respektuje pauzę, ukrycie karty i systemową preferencję ograniczenia ruchu. Galeria i strona główna zatrzymują podglądy poza ekranem.

## Pliki wspólne

- `shared/svg-helpers.js` — rysowanie prostokątów, tekstu, strzałek, wykresów i kalendarza.
- `shared/district-illustration.js` — wyłącznie schematyczna ilustracja brył 3D do animacji podatkowej; bez MapLibre, prawdziwej geografii i danych gminy.
- `shared/player.js` i `shared/player.css` — wyświetlanie sceny, pauza i komunikacja z kafelkami strony.
- `shared/video.js` i `shared/video.css` — kontrolki, wybór plakatu i dopasowanie całego kadru.
- `assets/` — filmy i plakaty widoczne przed rozpoczęciem odtwarzania.
- `assets/flexit-logo.png` — logo FlexiT dostępne do dalszej edycji prezentacji.
- `gallery.*` i `index.html` — osobny warsztat do przeglądania animacji.

Nie musisz edytować głównego `index.html`, `main.js` ani `style.css` strony. Pełne aplikacje i dashboardy pozostają poza tym katalogiem; tu jest tylko kod ich animowanych prezentacji. Stare adresy `project-preview.html?project=…`, `fakass-demo.html` oraz `eiendomsskatt-demo.html` przekierowują do odpowiednich plików tutaj.
