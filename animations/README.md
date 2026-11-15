# Prezentacje projektów

Galeria `animations/index.html` pokazuje osiem prezentacji w kolejności strony głównej:
ControlIQ, InvoiceFlowAI, FlexiT, Eiendomsskatt, fx Translator, Utgiftsanalyse, E-Skatt Assistent i FAKASS.

Filmiki MP4 uruchamiają się automatycznie, wyciszone i zapętlone. Podglądy poza ekranem są zatrzymywane. Systemowa preferencja ograniczenia ruchu oraz przycisk pauzy nadal działają. W powiększeniu dostępne są kontrolki filmu.

| Projekt | Podgląd | Materiał |
| --- | --- | --- |
| ControlIQ | `controliq.html` | `assets/controllq.mp4` |
| InvoiceFlowAI | `invoiceflowai.html` | `assets/invoiceflow.mp4` |
| FlexiT | `flexit.html` | Kafelek: `assets/flexit-preview.mp4`; powiększenie: `assets/flexit-demo-18s-square.mp4` |
| Eiendomsskatt | `../eiendomsskatt-promo-v3/promo.html` | Oryginalna prezentacja HTML v3 z filmem `assets/app-v3.mp4` |
| fx Translator | `fx-translator.html` | `assets/fx-translator.mp4` |
| Utgiftsanalyse | `utgiftsanalyse.html` | Animacja SVG |
| E-Skatt Assistent | `e-skatt-assistent.html` | Animacja SVG |
| FAKASS | `fakass.html` | Animacja SVG |

`shared/player.js` obsługuje pauzę, widoczność oraz start filmu po inicjalizacji ramki. `shared/video.css` zachowuje cały kadr filmu bez przycinania. Parametr `?embed=1` ukrywa kontrolki w kafelku. Każdy MP4 ma plakat widoczny przed rozpoczęciem odtwarzania.

Paczka `downloads/animacje-projektow.zip` zawiera teraz **dwa katalogi**: `animations/` i `eiendomsskatt-promo-v3/`. Zachowaj je obok siebie i otwórz `animations/index.html`. Skopiowanie samego `animations/` nie obejmuje nowej prezentacji podatkowej.

Po zmianach odśwież paczkę: `python scripts/build_animations.py`. Pełny hosting: `python scripts/build_hosting.py SCIEZKA_POZA_REPO.zip`.

Film InvoiceFlowAI jest prezentacją promocyjną procesu, a nie nagraniem interfejsu programu. Podgląd ControlIQ jest nagraniem demonstracji. Pełne dema analizy wydatków, symulacji podatkowej i panelu FlexiT pozostają dostępne przez osobne przyciski na stronie.
