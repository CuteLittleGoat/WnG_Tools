# 🇬🇧 Technical documentation (EN)

## 1. Purpose and architecture
`Main` is the static launcher for the toolkit. `index.html` contains the visible cards, user/admin view switch, configured external links, styling, and small browser-maintenance logic. It does not require Firebase.

## 2. Files and layout
- `index.html` is the complete launcher implementation.
- `wrath-glory-logo-warhammer.png` is the visible branding image.
- `ZmienneHiperlacza.md` is the simple configuration reference for external links.
The page uses a dark themed background, centered content, responsive module cards, and an administrator switch that exposes maintenance links intended for the person configuring the deployment.

## 3. Public links
Describe and configure the map link as `VTT`. Use `INSERT_YOUR_VTT_LINK` for the VTT destination and `INSERT_YOUR_IMAGE_FOLDER_OR_CHANNEL_LINK` for the image destination. Replace these strings with the group’s own URLs before publication. No private group links belong in the public repository.

## 4. Runtime behavior and reconstruction
Module cards navigate to relative module entry points. External buttons navigate to configured URLs. Browser-maintenance logic unregisters service workers and removes related caches for this launcher scope so stale cached launchers do not interfere with the current static page. To rebuild the module, restore the HTML file and logo, preserve relative paths, replace public placeholders for a deployment, and verify normal/admin views, every card, both external links, and mobile wrapping.

# 🇵🇱 Dokumentacja techniczna (PL)

# Main — dokumentacja techniczna (odtworzenie 1:1)

## 1. Cel i zakres modułu
`Main` to statyczny launcher modułów Wrath & Glory. Odpowiada za:
- prezentację przycisków modułów,
- przełączanie widoku użytkownik/admin,
- dynamiczne wczytywanie linków VTT/Obrazki.

## 2. Struktura plików
- `Main/index.html` — HTML + CSS + JS modułu.
- `Main/ZmienneHiperlacza.md` — konfiguracja linków VTT/Obrazki (`Nazwa: URL`).
- `Main/wrath-glory-logo-warhammer.png` — logo strony.
- `manifest.webmanifest` (repo root) — manifest PWA wspólny.
- `service-worker.js` (repo root) — globalny plik `service-worker.js` utrzymywany kompatybilnie, ale moduł Main działa jako strona online i czyści starsze rejestracje SW z poziomu `index.html`.

## 3. Widoki i routing
### 3.1. Tryb użytkownika
Domyślny widok (bez parametru `admin`) pokazuje podstawowe moduły.

### 3.2. Tryb administratora
Aktywowany parametrem URL: `?admin=1`.
- Odsłania przyciski adminowe (Generator Nazw, Generator NPC, Audio).
- Pokazuje notatki dotyczące wejścia do paneli admina DataVault i Audio.
- Link DataVault jest przełączany na wariant z parametrem `?admin=1`.

## 4. Struktura HTML (`Main/index.html`)
- `main` — kontener główny.
- `img.logo` — logo (z jawnie ustawionymi `width`/`height` dla stabilnego layoutu).
- `.actions` — siatka przycisków modułów.
- Przyciski adminowe oznaczone `data-admin-only="true"`.
- Linki dynamiczne:
  - `data-map-link` — URL mapy,
  - `data-images-link` — URL obrazków,
  - `data-datavault-link` — URL DataVault zależny od trybu.

## 5. Stylizacja (CSS)
Motyw „zielonego terminala” oparty o zmienne CSS:
- `--bg`, `--panel`, `--border`, `--text`, `--accent`, `--accent-dark`, `--glow`, `--radius`.

Kluczowe cechy:
- centralny panel z zieloną ramką i glow,
- przyciski z animacją hover/active,
- responsywna siatka `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`,
- notki pomocnicze (`.note`) widoczne kontekstowo tylko dla admina.

## 6. Logika JavaScript
### 6.1. Detekcja roli
```js
const isAdmin = new URLSearchParams(window.location.search).get('admin') === '1';
```
Na tej podstawie JS:
- pokazuje/ukrywa elementy `data-admin-only`,
- przełącza target linku DataSlate,
- przełącza URL DataVault.

### 6.2. Wczytywanie konfiguracji linków
- Parser czyta `Main/ZmienneHiperlacza.md`.
- Wyszukuje publiczne wpisy `Map:` i `Images:` oraz zachowuje zgodność wsteczną z `Mapa:` i `Obrazki:`.
- Podmienia `href` odpowiednich przycisków.

## 7. Service Worker i PWA

Moduł Main nie rejestruje obecnie Service Workera i nie działa jako samodzielna aplikacja PWA/offline.


Ten mechanizm nie jest funkcją offline. Jego celem jest uniknięcie sytuacji, w której użytkownik widzi nieaktualną wersję strony z pamięci podręcznej przeglądarki.

## 8. Implementacja językowa
- Moduł nie używa bezpośrednio Firebase.

## 9. Bezpieczeństwo i nawigacja
1. Utwórz `Main/index.html` z osadzonym CSS/JS.
2. Dodaj logo `wrath-glory-logo-warhammer.png`.
3. Dodaj `ZmienneHiperlacza.md` i parser wpisów `Mapa`/`Obrazki`.
4. Dodaj obsługę `?admin=1` + warunkowe sekcje admin.
5. Podłącz `manifest.webmanifest` tylko wtedy, gdy jest potrzebny do metadanych instalacyjnych hostingu.
6. Nie rejestruj Service Workera; zachowaj jedynie mechanizm czyszczenia starych rejestracji w `Main/index.html`.

## 10. Zależności zewnętrzne / Firebase
1. Wejście bez `?admin=1` pokazuje tylko widok user.
2. Wejście z `?admin=1` pokazuje komplet przycisków admin.
3. VTT/Obrazki otwierają właściwe URL z `ZmienneHiperlacza.md`.
4. DataVault w adminie używa `?admin=1`.
5. Wszystkie przyciski modułów otwierają poprawne ścieżki lokalne i zewnętrzne.

## 11. Logika uruchamiania i widoczność modułów
### 11.1. Zmienne CSS i kolorystyka
Deklaracje z `:root`:
- `--bg`: kompozycja 2 gradientów radialnych + kolor bazowy `#031605`.
- `--panel: #000`
- `--border: #16c60c`
- `--text: #9cf09c`
- `--accent: #16c60c`
- `--accent-dark: #0d7a07`
- `--glow: 0 0 25px rgba(22, 198, 12, 0.45)`
- `--radius: 10px`

- ramka: `#ff3b30`,
- tło: `rgba(255, 59, 48, 0.2)`,
- tekst: `#ffe5e3`,
- glow: `0 0 14px rgba(255, 59, 48, 0.35)`.

### 11.2. Layout i responsywność
- `main`: `width: min(860px, 100%)`, `padding: 32px 32px 28px`, `gap: 22px`, układ kolumnowy.
- `.actions`: `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`, `gap: 18px 20px`.
- `body`: centrowanie pion/poziom + `padding-bottom` z `env(safe-area-inset-bottom)`.
- `.logo`: `max-width: clamp(220px, 40vw, 320px)`.

### 11.3. Typografia i interakcje
- Globalny font-stack: `"Consolas", "Fira Code", "Source Code Pro", monospace`.
- `.btn`: `font-size: 15px`, `font-weight: 600`, `border: 2px solid`.
- Hover `.btn`: przesunięcie `translateY(-1px)` + glow.
- Active `.btn`: cofnięcie przesunięcia i mocniejsze tło.

## 12. Style szczegółowe
- `applyDynamicLinks(links)` — podmienia `href` dla przycisków VTT/Obrazki po sparsowaniu `ZmienneHiperlacza.md`.

Inicjalizacja skryptu:
1. Wylicza `isAdmin` z query string (`admin=1`).
2. Usuwa elementy `data-admin-only="true"` dla użytkownika końcowego.
3. Przełącza link DataSlate (`DataSlate.html` vs panel modułu).
4. Przełącza link DataVault (`?admin=1` tylko dla admina).
5. Ładuje dynamiczne linki VTT/Obrazki z pliku markdown.
6. Pozostawia interfejs bez dodatkowych akcji asynchronicznych poza dynamicznym ładowaniem linków.

## 13. Procedura odtworzenia 1:1
- **Style i kolory:** zawarte w sekcjach 5 i 11.
- **Funkcje i logika:** sekcje 6 i 12.
- **Mechaniki przełączania ról i linków:** sekcje 3, 6.1, 12.
- **PWA (manifest + SW):** sekcja 7.
- **Firebase:** brak bezpośredniej integracji w tym module.
- **Node.js bootstrap:** nie dotyczy modułu Main; DataSlate komunikuje się z Firestore bezpośrednio z przeglądarki.

## 14. Znane ograniczenia
- Linki zewnętrzne modułu Main są utrzymywane w pliku `Main/ZmienneHiperlacza.md` (`Map`/`Images`); przy zmianie środowiska wdrożeniowego trzeba zaktualizować ich wartości.
- Dotyczy to szczególnie wdrożeń dla nowej grupy użytkowników, gdzie adresy kanałów zewnętrznych różnią się od oryginału.
## 16. Konfiguracja multi-tenant
- `Main/index.html` zawiera jawne komentarze `WAŻNE/IMPORTANT` przy:
  - przyciskach modułów,
  - przyciskach `VTT` i `Obrazki`,
  - domyślnych wartościach obiektu `links`.
- Przy wdrożeniu dla nowej grupy trzeba:
  1. zastąpić angielskie placeholdery we wpisach `Map:` i `Images:` w `Main/ZmienneHiperlacza.md`,
  2. zweryfikować wszystkie hiperłącza modułów (lokalne i zewnętrzne),
  3. potwierdzić działanie przy `admin=1` i bez parametru.


## 15. Bootstrap Node.js
Bootstrap Node.js nie dotyczy modułu Main. Moduł jest statycznym frontendem, a dane i konfiguracje obsługują odpowiednie moduły oraz usługi zewnętrzne, głównie Firebase.

## Dodawanie nowej wersji językowej (PL)

To jest mapa miejsc, które trzeba zaktualizować przy dodaniu kolejnego języka (np. FR/DE):

1. **Kod modułu**: znajdź obiekt/słownik tłumaczeń (`translations`) oraz funkcję przełączającą język (`applyLanguage` / `updateLanguage`).
2. **Selektor języka**: jeśli moduł ma menu języka, dopisz nową opcję w `<select>` i upewnij się, że po zmianie języka odświeżane są wszystkie etykiety oraz komunikaty.
3. **Treści stałe bez przełącznika**: w modułach bez menu językowego (np. Main) ręcznie zaktualizuj napisy przycisków i opisy.
4. **Instrukcje/PDF**: jeśli moduł otwiera instrukcję zależną od języka, dodaj odpowiedni plik dla nowego języka.
5. **Test użytkownika**: przejdź cały moduł po zmianie języka i sprawdź: przyciski, statusy, błędy, komunikaty potwierdzeń, puste stany, eksport/druk.

Miejsca w kodzie są oznaczone komentarzem: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.
