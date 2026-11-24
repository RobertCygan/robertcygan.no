# Same animacje projektów

Galeria zawiera sześć prezentacji z sekcji „GitHub Prosjekter”. Strona główna korzysta z tych samych odtwarzaczy.

**[Pobierz katalog animacji jako ZIP](../downloads/animacje-projektow.zip)**. Rozpakuj archiwum i otwórz `animations/index.html`.

W repozytorium paczkę można odświeżyć po zmianach poleceniem `python3 scripts/build_animations.py`.

## Podglądy projektów

| Projekt | Odtwarzacz | Warianty |
| --- | --- | --- |
| InvoiceFlowAI | [invoiceflowai.html](invoiceflowai.html) | Kwadratowe filmy 540 i 960 px |
| FxTranslator | [fx-translator.html](fx-translator.html) | Wyciszony podgląd i pełny film z dźwiękiem |
| Eiendomsskatt | [eiendomsskatt-analyse.html](eiendomsskatt-analyse.html) | Kwadratowy film po powiększeniu oraz wyciszone podglądy kwadratowy i poziomy |
| FlexiT | [flexit.html](flexit.html) | Kwadratowe filmy 540 i 960 px |
| Lånndet | [laandet.html](laandet.html) | Pionowe filmy 360 i 720 px |
| Utgiftsanalyse | [utgiftsanalyse.html](utgiftsanalyse.html) | Lżejszy podgląd i pełny film |

Dwa dodatkowe filmy InvoiceFlowAI można obejrzeć na stronie programu lub pobrać z galerii.

## Odtwarzanie i edycja

Otwórz `index.html` z tego katalogu, aby zobaczyć wszystkie animacje. „Otwórz animację” uruchamia pełny odtwarzacz z przewijaniem. Filmy zaczynają wyciszone i zapętlają się. Galeria i strona główna zatrzymują podglądy poza ekranem i respektują systemową preferencję ograniczenia ruchu.

Parametr `?embed=1` wybiera podgląd kafelka i ukrywa kontrolki. Atrybuty `src` i `data-preview-src` wskazują odpowiednio film w pełnym odtwarzaczu i jego wariant w podglądzie. Ścieżki do plakatów są w atrybutach `poster`, `data-small-poster` i `data-preview-poster`.

- `assets/` zawiera filmy i plakaty WebP.
- `shared/video.js` i `shared/video.css` ustawiają kontrolki, wybierają plakat i dopasowują cały kadr.
- `shared/player.js` i `shared/player.css` obsługują pauzę i komunikację z kafelkami.
- `gallery.*` i `index.html` tworzą samodzielną galerię.

Do testowania galerii przez HTTP uruchom polecenie z katalogu `animations/`.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Adresy `project-preview.html?project=…`, `fakass-demo.html` oraz `eiendomsskatt-demo.html` przekierowują do odpowiadających im prezentacji.
