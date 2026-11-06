# Przeniesienie strony na hosting

Strona jest statyczna: HTML, CSS i JavaScript. Nie wymaga Node.js, bazy danych ani etapu kompilacji na serwerze.

1. Utwórz paczkę: `python3 scripts/build_hosting.py /workspace/artifacts/robertcygan-website.zip`.
2. Rozpakuj jej zawartość do katalogu publicznego hostingu, np. `public_html`. Plik `index.html` powinien znajdować się bezpośrednio w tym katalogu.
3. Zachowaj katalogi `assets/` i `downloads/` oraz wielkość liter w nazwach. Hosting musi pozwalać pobierać pliki `.exe` i `.apk`.
4. Włącz HTTPS w panelu hostingu. Sprawdź stronę główną, wszystkie demonstracje, pobieranie CV i `downloads/InvoiceFlowAI.exe`.
5. Jeśli hosting ma cache, wyczyść go po aktualizacji strony.

Skrypt pakuje pliki publiczne bez katalogu Git, testów, źródłowych załączników i pliku `CNAME`, który dotyczy GitHub Pages. Nie publikuje strony ani nie zmienia DNS. Paczka zawiera także dotychczasowe pliki strony, w tym PDF-y, APK i wcześniejszy panel Steigen.

## Nowe projekty

- `flexit-lederpanel.html` — ekran demonstracyjny aplikacji Android (Start/Stopp i Fravær) oraz panel z załącznika, nowe logo FlexiT, kalendarz i zatwierdzanie. Dane prototypu są fikcyjne, a zmiany zapisywane w lokalnej pamięci przeglądarki.
- `utgiftsanalyse.html` — nowa publiczna demonstracja inspirowana analizą z załącznika: filtry, kategorie, dostawcy, fakturalinijki i CSV. Wszystkie rekordy powstają syntetycznie; oryginalnego zbioru finansowego nie włączono.
- `eiendomsskatt-simulasjon-2010-2026.html` — publiczna demonstracja z fikcyjnymi okręgami, obracaną mapą 3D z wysokością brył według wybranego miernika, osią czasu, filtrem zwolnień i zmianą promillesats. MapLibre jest hostowane lokalnie; geometria gminy i dane są fikcyjne. Nie zawiera rzeczywistej geografii ani danych podatkowych Steigen.
- `invoiceflowai.html` i `downloads/InvoiceFlowAI.exe` — prezentacja koncepcyjna oraz niezmieniony plik Windows od właściciela. Animacja nie jest nagraniem aplikacji. Pliku EXE nie uruchamiano w środowisku Linux.
- `project-preview.html?project=flexit|utgifter|eiendom|invoice` — wspólny szablon animowanych prezentacji. Parametr wybiera jeden projekt, np. `?project=flexit`.

Nowe demonstracje oraz fonty i ikony strony głównej działają bez CDN. Metadane istniejących kart GitHub nadal korzystają z `api.github.com`, a istniejący generator QR z `api.qrserver.com`. Starsze strony mogą korzystać z Google Fonts. Pobieranie E-Skatt dla Windows nadal prowadzi do istniejącego wydania GitHub.

Dotychczasowy panel Steigen i pobieranie E-Skatt mają bramki hasłowe w JavaScript, które nie zapewniają kontroli dostępu na serwerze. Jeżeli pliki mają być prywatne, przed publikacją włącz dla nich ochronę po stronie hostingu. Nowe publiczne dema gminne zawierają wyłącznie syntetyczne dane.

## Sprawdzenie lokalne

Z katalogu repozytorium: `python3 -m http.server 8000 --bind 127.0.0.1`.

Testy: `python3 -m unittest discover -s tests -v`. Wymagają biblioteki Python Playwright i Chromium. W przygotowanym środowisku są dostępne; domyślna ścieżka to `/usr/bin/chromium`, można ją zmienić zmienną `CHROMIUM_PATH`. Testy uruchamiają własny serwer lokalny i osobne sesje przeglądarki.

Fonty i Font Awesome mają zachowane licencje, wersje i sumy integralności w `assets/vendor/`.

## Certyfikaty i stopka

Nazwy certyfikatów w kompetencjach i w kafelkach otwierają ten sam oryginalny PDF w lokalnym podglądzie PDF.js. Dostępne dokumenty to PCAP (`python.pdf`), Power BI (`bi.pdf`), Excel (`excel.pdf`), Cybersecurity (`cyber.pdf`) i Data Science (`datascience.pdf`). Podgląd obsługuje pobieranie, otwieranie PDF w osobnej karcie i nawigację po stronach.

KSE oczekuje na dokument, co potwierdził właściciel strony. W repozytorium ani jego dostępnej historii nie ma PDF-ów ACCA i ISO/IEC 27001; kafelki informują, że dokument nie został opublikowany. Nie zastąpiono ich innymi certyfikatami. Po otrzymaniu plików należy dodać poprawne odnośniki do obu miejsc.

Stopka wskazuje G-PSI – GovTech Solutions jako twórcę strony, z logo z dostarczonych materiałów i odnośnikiem do `https://www.gpsi.ai`.
