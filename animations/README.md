# Same animacje projektów

Ten katalog zawiera **sześć animowanych prezentacji z sekcji „GitHub Prosjekter”**. Strona główna korzysta bezpośrednio z tych plików: poprawienie animacji tutaj zmienia również jej podgląd na stronie po opublikowaniu.

Możesz skopiować cały katalog `animations/` i pracować tylko na nim. Nie potrzebujesz reszty strony, dokumentów PDF, instalatorów, Node.js ani kompilacji. Wspólne skrypty i logo potrzebne animacjom są wewnątrz tego katalogu.

## Gdzie jest kod konkretnej animacji

| Projekt                             | Podgląd / HTML                                           | Scena i kod JavaScript                               | Style i przebieg animacji                              |
| ----------------------------------- | -------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| FlexiT — rejestracja czasu pracy    | [flexit.html](flexit.html)                               | [flexit.js](flexit.js)                               | [flexit.css](flexit.css)                               |
| Utgiftsanalyse — analiza wydatków   | [utgiftsanalyse.html](utgiftsanalyse.html)               | [utgiftsanalyse.js](utgiftsanalyse.js)               | [utgiftsanalyse.css](utgiftsanalyse.css)               |
| Eiendomsskatt — analiza 3D          | [eiendomsskatt-analyse.html](eiendomsskatt-analyse.html) | [eiendomsskatt-analyse.js](eiendomsskatt-analyse.js) | [eiendomsskatt-analyse.css](eiendomsskatt-analyse.css) |
| E-Skatt Assistent — lista kontrolna | [e-skatt-assistent.html](e-skatt-assistent.html)         | [e-skatt-assistent.js](e-skatt-assistent.js)         | [e-skatt-assistent.css](e-skatt-assistent.css)         |
| FAKASS — obieg faktury              | [fakass.html](fakass.html)                               | [fakass.js](fakass.js)                               | [fakass.css](fakass.css)                               |
| InvoiceFlowAI — analiza faktury     | [invoiceflowai.html](invoiceflowai.html)                 | [invoiceflowai.js](invoiceflowai.js)                 | [invoiceflowai.css](invoiceflowai.css)                 |

W animacjach FlexiT, Utgiftsanalyse, Eiendomsskatt (analiza 3D) i InvoiceFlowAI scenę opisuje obiekt `animation` w pliku `.js`: `name`, `badge`, `caption` oraz `graphic`. W E-Skatt Assistent i FAKASS rysunek SVG jest bezpośrednio w pliku `.html`; ich ruch opisują reguły `@keyframes` w odpowiednim `.css`.

Każda animacja ma własny CSS, więc jej kolory, układ i czasy możesz poprawiać bez zmieniania wyglądu pozostałych projektów. Na przykład, pracując nad FlexiT, edytuj `flexit.js` i `flexit.css`, a efekt oglądaj w `flexit.html`.

## Jak oglądać i poprawiać

1. Otwórz `index.html` z tego katalogu, aby zobaczyć galerię wszystkich sześciu animacji.
2. Wybierz „Otwórz animację”, aby pracować nad jednym projektem.
3. Edytuj jego pliki i odśwież podgląd. Przycisk „Pause animasjon” zatrzymuje ruch.

Pliki używają zwykłych skryptów, bez importów modułów ani pobierania danych. Można je otwierać w zwykłej przeglądarce z dysku. Do testowania przez HTTP wystarczy uruchomić **z tego katalogu**:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Parametr `?embed=1` ukrywa przycisk pauzy i plakietkę nagłówka podczas osadzania animacji w kafelku. Bez niego podgląd działa samodzielnie. Animacje respektują systemową preferencję ograniczenia ruchu.

## Pliki wspólne

- `shared/svg-helpers.js` — rysowanie prostokątów, tekstu, strzałek, wykresów i kalendarza.
- `shared/district-illustration.js` — wyłącznie schematyczna ilustracja brył 3D do animacji podatkowej; bez MapLibre, prawdziwej geografii i danych gminy.
- `shared/player.js` i `shared/player.css` — wyświetlanie sceny, pauza i komunikacja z kafelkami strony.
- `assets/flexit-logo.png` — logo używane przez animację FlexiT.
- `gallery.*` i `index.html` — osobny warsztat do przeglądania animacji.

Nie musisz edytować głównego `index.html`, `main.js` ani `style.css` strony. Pełne aplikacje i dashboardy pozostają poza tym katalogiem; tu jest tylko kod ich animowanych prezentacji. Stare adresy `project-preview.html?project=…`, `fakass-demo.html` oraz `eiendomsskatt-demo.html` przekierowują do odpowiednich plików tutaj.
