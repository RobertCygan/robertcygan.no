# Same animacje projektów

Ten katalog zawiera **sześć animowanych prezentacji z sekcji „GitHub Prosjekter”**. Strona główna korzysta bezpośrednio z tych plików: poprawienie animacji tutaj zmienia również jej podgląd na stronie po opublikowaniu.

**[Pobierz tylko ten katalog jako ZIP](https://github.com/RobertCygan/robertcygan.no/raw/refs/heads/main/downloads/animacje-projektow.zip)**. Rozpakuj archiwum i otwórz `animations/index.html`.

W repozytorium paczkę można odświeżyć po zmianach poleceniem `python3 scripts/build_animations.py`.

Możesz skopiować cały katalog `animations/` i pracować tylko na nim. Nie potrzebujesz reszty strony, dokumentów PDF, instalatorów, Node.js ani kompilacji. Wspólne skrypty, film MP4 i grafiki potrzebne animacjom są wewnątrz tego katalogu.

## Gdzie jest kod konkretnej animacji

| Projekt                             | Podgląd / HTML                                           | Scena i kod JavaScript                               | Style i przebieg animacji                              |
| ----------------------------------- | -------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| FlexiT — rejestracja czasu pracy    | [flexit.html](flexit.html)                               | [flexit.js](flexit.js)                               | [flexit.css](flexit.css)                               |
| Utgiftsanalyse — analiza wydatków   | [utgiftsanalyse.html](utgiftsanalyse.html)               | [utgiftsanalyse.js](utgiftsanalyse.js)               | [utgiftsanalyse.css](utgiftsanalyse.css)               |
| Eiendomsskatt — analiza 3D          | [eiendomsskatt-analyse.html](eiendomsskatt-analyse.html) | [eiendomsskatt-analyse.js](eiendomsskatt-analyse.js) | [eiendomsskatt-analyse.css](eiendomsskatt-analyse.css) |
| E-Skatt Assistent — lista kontrolna | [e-skatt-assistent.html](e-skatt-assistent.html)         | [e-skatt-assistent.js](e-skatt-assistent.js)         | [e-skatt-assistent.css](e-skatt-assistent.css)         |
| FAKASS — obieg faktury              | [fakass.html](fakass.html)                               | [fakass.js](fakass.js)                               | [fakass.css](fakass.css)                               |
| InvoiceFlowAI — analiza faktury     | [invoiceflowai.html](invoiceflowai.html)                 | [invoiceflowai.js](invoiceflowai.js)                 | [invoiceflowai.css](invoiceflowai.css)                 |

**FlexiT wyświetla dostarczony film `assets/flexit-demo-18s-square.mp4`** (18 sekund, 1080 × 1080). `flexit.html` zawiera odtwarzacz oraz ścieżki do filmu i plakatu `assets/flexit-video-poster.jpg`. `flexit.js` ustawia wyciszenie i widoczność kontrolek, a `flexit.css` dopasowuje cały kwadratowy obraz bez kadrowania. Aby zmienić nagranie, podmień MP4 i plakat albo zmień ich ścieżki w HTML.

W animacjach Utgiftsanalyse, Eiendomsskatt (analiza 3D) i InvoiceFlowAI scenę opisuje obiekt `animation` w pliku `.js`: `name`, `badge`, `caption` oraz `graphic`. W E-Skatt Assistent i FAKASS rysunek SVG jest bezpośrednio w pliku `.html`; ich ruch opisują reguły `@keyframes` w odpowiednim `.css`.

Każda animacja ma własny CSS, więc jej kolory i układ możesz poprawiać bez zmieniania wyglądu pozostałych projektów. Czas i zawartość prezentacji FlexiT zmieniasz w pliku wideo; animacje SVG edytujesz w ich plikach HTML, JS i CSS.

## Jak oglądać i poprawiać

1. Otwórz `index.html` z tego katalogu, aby zobaczyć galerię wszystkich sześciu animacji.
2. Wybierz „Otwórz animację”, aby pracować nad jednym projektem.
3. Edytuj jego pliki i odśwież podgląd. Przycisk „Pause animasjon” zatrzymuje ruch.

Pliki używają zwykłych skryptów, bez importów modułów ani pobierania danych. Można je otwierać w zwykłej przeglądarce z dysku. Do testowania przez HTTP wystarczy uruchomić **z tego katalogu**:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Parametr `?embed=1` ukrywa przycisk pauzy, plakietkę nagłówka i kontrolki filmu podczas osadzania animacji w kafelku. Bez niego podgląd działa samodzielnie. Film FlexiT startuje wyciszony i zapętla się; powiększony odtwarzacz pozwala przewijać i włączyć dźwięk. Animacje i film respektują pauzę, ukrycie karty oraz systemową preferencję ograniczenia ruchu. Galeria i strona główna zatrzymują też podglądy poza ekranem.

## Pliki wspólne

- `shared/svg-helpers.js` — rysowanie prostokątów, tekstu, strzałek, wykresów i kalendarza.
- `shared/district-illustration.js` — wyłącznie schematyczna ilustracja brył 3D do animacji podatkowej; bez MapLibre, prawdziwej geografii i danych gminy.
- `shared/player.js` i `shared/player.css` — wyświetlanie sceny, pauza i komunikacja z kafelkami strony.
- `assets/flexit-demo-18s-square.mp4` — oryginalny film FlexiT, bez konwersji.
- `assets/flexit-video-poster.jpg` — plakat filmu widoczny przed rozpoczęciem odtwarzania.
- `assets/flexit-logo.png` — logo FlexiT dostępne do dalszej edycji prezentacji.
- `gallery.*` i `index.html` — osobny warsztat do przeglądania animacji.

Nie musisz edytować głównego `index.html`, `main.js` ani `style.css` strony. Pełne aplikacje i dashboardy pozostają poza tym katalogiem; tu jest tylko kod ich animowanych prezentacji. Stare adresy `project-preview.html?project=…`, `fakass-demo.html` oraz `eiendomsskatt-demo.html` przekierowują do odpowiednich plików tutaj.
