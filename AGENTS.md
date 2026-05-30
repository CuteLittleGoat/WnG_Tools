# AGENTS.md — instrukcje dla agentów pracujących w repozytorium `WnG_Tools`

Repozytorium `WnG_Tools` znajduje się obecnie na etapie przygotowania wersji Release.

Celem bieżących prac nie jest tworzenie pierwotnej prywatnej aplikacji od zera. Celem jest przygotowanie aplikacji do publicznego wydania poprzez:

- zmianę publicznego interfejsu na angielski;
- przywrócenie widocznych przełączników języka tam, gdzie mechanizm PL/EN już istnieje;
- ustawienie języka angielskiego jako domyślnego;
- zmianę nazw wybranych modułów, katalogów i plików HTML na angielskie;
- usunięcie prywatnych konfiguracji właściciela;
- zastąpienie prywatnych danych czytelnymi placeholderami po angielsku;
- zachowanie obecnej architektury funkcjonalnej aplikacji;
- bieżące zapisywanie analiz, decyzji, wymagań, zmian i testów w pliku `Analizy/Release.md`.

---

## 1. Główne źródło prawdy: `Analizy/Release.md`

Plik `Analizy/Release.md` jest głównym dziennikiem projektu Release.

Przed rozpoczęciem jakiejkolwiek analizy, zmiany kodu, zmiany dokumentacji, zmiany nazw plików, czyszczenia danych, zastępowania placeholderów albo testowania należy przeczytać aktualną treść `Analizy/Release.md`.

Ten plik należy traktować jako:

- changelog projektu Release;
- dziennik decyzji;
- dziennik wymagań;
- dziennik implementacji;
- rejestr ryzyk;
- rejestr testów;
- miejsce zapisywania wniosków;
- główny plik, do którego wracamy w trakcie całego projektu.

Nie należy tworzyć osobnych plików analitycznych dla prac Release, chyba że użytkownik wyraźnie o to poprosi.

Wszystkie analizy, ustalenia i zmiany związane z Release należy dopisywać do `Analizy/Release.md`.

Nie wolno usuwać starszych sekcji z `Analizy/Release.md`. Jeżeli późniejsza decyzja zmienia wcześniejsze ustalenia, należy dopisać nową datowaną sekcję wyjaśniającą zmianę i jej wpływ.

---

## 2. Obowiązkowa aktualizacja `Release.md` po każdym zadaniu

Po każdym istotnym zadaniu należy zaktualizować `Analizy/Release.md`.

Dotyczy to w szczególności:

- analiz;
- zmian kodu;
- zmian nazw katalogów lub plików;
- zastępowania prywatnych danych placeholderami;
- czyszczenia Firebase;
- usuwania Web Push;
- zmian językowych;
- zmian dokumentacji;
- integracji neutralnych makiet danych;
- testów;
- wykrytych ryzyk;
- nowych pytań;
- nowych decyzji właściciela.

Każda dopisana sekcja powinna zawierać, w zakresie pasującym do wykonanego zadania:

- nagłówek z datą i krótkim tytułem;
- pełny oryginalny prompt użytkownika, bez skracania;
- zakres prac;
- ustalenia i wnioski;
- decyzje oraz wymagania;
- listę zmienionych plików;
- dokładny opis zmian w kodzie;
- opis wykonanych testów;
- ryzyka i następne kroki.

Zalecany układ sekcji:

```markdown
## Aktualizacja — RRRR-MM-DD — krótki tytuł

### Oryginalny pełny prompt użytkownika

Tutaj należy wkleić pełny prompt użytkownika bez skracania.

### Zakres prac

Co zostało sprawdzone albo zmienione.

### Ustalenia i wnioski

Co wykryto, potwierdzono albo ustalono.

### Decyzje i wymagania

Nowe decyzje właściciela, wymagania, reguły interpretacyjne albo ograniczenia.

### Zmienione pliki

Tabela albo lista zmienionych plików wraz z krótkim opisem.

### Szczegóły zmian w kodzie

Dla każdego ważnego pliku należy opisać:
- lokalizację zmiany;
- stan przed zmianą;
- stan po zmianie;
- powód zmiany.

### Testy

Co zostało przetestowane i z jakim wynikiem.

### Ryzyka i następne kroki

Co nadal wymaga decyzji, testu albo dalszej pracy.
```

Jeżeli kod nie został zmieniony, należy wyraźnie zapisać, że aktualizacja dotyczyła tylko analizy.

---

## 3. Priorytety bieżącego etapu Release

Aktualne priorytety prac są następujące:

1. Usunąć konfiguracje prywatnej infrastruktury właściciela.
2. Zastąpić prywatne wartości placeholderami po angielsku.
3. Usunąć Web Push z wersji Release.
4. Zachować komunikację DataSlate przez Firestore między panelem GM i ekranem gracza.
5. Zmienić publiczny interfejs aplikacji na angielski.
6. Ustawić język angielski jako domyślny tam, gdzie istnieje przełącznik języka.
7. Przywrócić widoczne przełączniki języka tylko w modułach, które już mają obsługę PL/EN.
8. Zmienić nazwy wybranych katalogów i plików HTML na angielskie.
9. Nie psuć istniejącej logiki działania modułów.
10. Po każdej zmianie aktualizować `Analizy/Release.md`.

---

## 4. Plan zmiany nazw modułów

W ramach Release obowiązuje następujący plan zmiany nazw katalogów:

| Obecny katalog | Docelowy katalog |
| --- | --- |
| `GeneratorNPC/` | `NPCGenerator/` |
| `GeneratorNazw/` | `NameGenerator/` |
| `Infoczytnik/` | `DataSlate/` |
| `Kalkulator/` | `Calculators/` |

Planowane docelowe nazwy wybranych plików HTML:

| Obecny plik | Docelowy plik |
| --- | --- |
| `Infoczytnik/Infoczytnik.html` | `DataSlate/DataSlate.html` |
| `Kalkulator/KalkulatorXP.html` | `Calculators/XPCalculator.html` |
| `Kalkulator/TworzeniePostaci.html` | `Calculators/CharacterCreation.html` |

Pliki `index.html` powinny pozostać plikami wejściowymi swoich katalogów.

Po zmianie nazw należy globalnie wyszukać stare nazwy i zaktualizować:

- linki;
- tytuły stron;
- ścieżki w kodzie;
- ścieżki w dokumentacji;
- instrukcje Firebase;
- komentarze wdrożeniowe;
- odwołania w manifestach;
- odwołania w arkuszach lub plikach konfiguracyjnych, jeżeli występują.

---

## 5. Zasady językowe dla wersji Release

### 5.1. Moduły z istniejącym przełącznikiem języka

W modułach, które już mają mechanizm PL/EN, wersja Release musi:

- pokazywać przełącznik języka, jeżeli był ukryty;
- pokazywać `English` jako pierwszą opcję;
- pokazywać `Polski` jako drugą opcję;
- startować domyślnie po angielsku;
- mieć ustawione `<html lang="en">`;
- inicjalizować `currentLanguage` albo równoważny stan jako `en`;
- nadal pozwalać na przełączenie na język polski, jeżeli polskie tłumaczenie już istnieje.

Poprawna kolejność opcji:

```html
<option value="en">English</option>
<option value="pl">Polski</option>
```

Ta zasada dotyczy między innymi modułów:

- `Audio`;
- `DataVault`;
- `DiceRoller`;
- `NPCGenerator`;
- `NameGenerator`;
- `XPCalculator`;
- `CharacterCreation`.

### 5.2. Ekrany bez planowanego przełącznika języka

Nie należy dodawać nowych przełączników języka do ekranów, dla których plan Release zakłada ręczne przetłumaczenie statycznego interfejsu.

Dotyczy to:

- `Main`;
- strony wejściowej DataSlate;
- panelu GM DataSlate;
- ekranu gracza DataSlate;
- `Calculators/index.html`.

W tych miejscach należy ręcznie zmienić widoczne teksty użytkowe na angielskie.

---

## 6. Specjalna zasada dla `NameGenerator`

Na bieżącym etapie `NameGenerator` ma otrzymać angielski interfejs.

Nie należy jeszcze tłumaczyć generowanych wyników.

Nie należy jeszcze przebudowywać słowników wynikowych generatora.

Tłumaczenie generowanych nazw, tytułów i kryptonimów będzie osobnym późniejszym etapem.

Można przygotować katalog tłumaczeń jako materiał pomocniczy na przyszłość, ale nie może on blokować bieżącego etapu, którego celem jest angielski interfejs.

---

## 7. Zasady placeholderów

Wszystkie publiczne placeholdery muszą być po angielsku.

Należy używać czytelnych wartości, na przykład:

```text
INSERT_YOUR_API_KEY
INSERT_YOUR_AUTH_DOMAIN
INSERT_YOUR_DATABASE_URL
INSERT_YOUR_PROJECT_ID
INSERT_YOUR_STORAGE_BUCKET
INSERT_YOUR_MESSAGING_SENDER_ID
INSERT_YOUR_APP_ID
INSERT_YOUR_TECHNICAL_USER_EMAIL
INSERT_YOUR_VTT_LINK
INSERT_YOUR_IMAGE_FOLDER_OR_CHANNEL_LINK
```

Nie należy używać polskich placeholderów typu `TU_WSTAW...` w publicznej wersji Release.

Nie wolno zostawiać wartości właściciela w:

- konfiguracjach;
- przykładach;
- dokumentacji;
- komentarzach;
- plikach generowanych;
- plikach danych;
- szablonach przeznaczonych do publicznego użycia.

---

## 8. Zasady Firebase

Wersja Release nie może zawierać aktywnych konfiguracji Firebase należących do właściciela.

Nie należy jednak usuwać integracji Firebase tam, gdzie jest ona częścią planowanej, konfigurowalnej architektury aplikacji.

Poprawne podejście:

- zachować kod integracji tam, gdzie moduł potrzebuje Firebase;
- usunąć konkretne wartości projektu właściciela;
- zastąpić je placeholderami po angielsku;
- opisać w dokumentacji, jak inna grupa ma skonfigurować własny projekt Firebase.

Dotyczy to między innymi:

- `shared/firebase-config.js`;
- `Audio/config/firebase-config.js`;
- przyszłego `NPCGenerator/config/firebase-config.js`;
- przyszłego `DataSlate/config/firebase-config.js`;
- przyszłego `Calculators/config/firebase-config.js`.

Nie wolno commitować:

- haseł;
- tokenów;
- prywatnych kluczy;
- plików kont usługowych;
- prawdziwych sekretów produkcyjnych;
- danych logowania.

Publiczne wartości Web SDK Firebase nie są hasłami, ale w tym projekcie Release również muszą zostać zastąpione, ponieważ wiążą publiczną paczkę z infrastrukturą właściciela.

---

## 9. Zasady dla DataVault i wspólnego loadera danych

`DataVault` i `NPCGenerator` korzystają ze wspólnego modelu ładowania prywatnych danych.

Szczególnie ostrożnie należy traktować pliki:

- `DataVault/app.js`;
- `DataVault/build_json.py`;
- `DataVault/xlsxCanonicalParser.js`;
- `shared/firebase-data-loader.js`;
- `shared/firebase-config.js`.

Nie wolno upraszczać parserów, generatorów ani fallbacków bez sprawdzenia, czy wynik pozostaje zgodny z oczekiwanym formatem.

Po dostarczeniu neutralnego pliku `DataVault/Repozytorium.xlsx` należy sprawdzić, czy:

- parser przeglądarkowy działa poprawnie;
- generator Python działa poprawnie, jeżeli nadal jest używany;
- wynik nie zawiera prywatnych danych kampanii;
- struktura danych pozostaje zgodna z modułami, które ją czytają.

---

## 10. Zasady dla modułu Audio

Moduł Audio ma nadal używać nazwy manifestu aktualnie oczekiwanej przez kod:

```text
AudioManifest.xlsx
```

Nie należy zmieniać nazwy na `Audio_Manifest.xlsx`, chyba że użytkownik później zmieni tę decyzję.

Właściciel przygotuje neutralny arkusz XLSX z przykładowymi danymi.

Po otrzymaniu neutralnego manifestu należy sprawdzić:

- czy moduł poprawnie ładuje plik;
- czy wymagane kolumny istnieją;
- czy przykładowe rekordy nie zawierają prywatnych URL-i;
- czy filtry i widoki działają;
- czy dokumentacja wyjaśnia, jak podmienić przykłady na własne linki audio.

---

## 11. Zasady dla DataSlate

`DataSlate` jest docelową angielską nazwą modułu `Infoczytnik`.

Wersja Release musi zachować główny model działania DataSlate:

- panel GM zapisuje dane do Firestore;
- ekran gracza odczytuje dane z Firestore;
- dokument `dataslate/current` albo jego udokumentowany odpowiednik pozostaje częścią konfigurowalnego setupu.

Nie wolno przypadkowo usunąć komunikacji Firestore podczas usuwania Web Push.

Lokalne assety DataSlate oraz `assets/data/data.json` pozostają w wersji Release, chyba że użytkownik później zmieni tę decyzję.

Pliki testowe i backupowe DataSlate mają pozostać w wersji Release jako materiały pomocnicze dla użytkowników testujących własne modyfikacje i jako punkt odniesienia przy eksperymentach. Nie należy usuwać ich podczas finalnego czyszczenia publicznej paczki. Jeżeli wymagają dodatkowego kontekstu, należy opisać ich rolę w dokumentacji zamiast je usuwać. Nie są one jednak główną ścieżką produkcyjnego uruchamiania modułu.

W szczególności w wersji Release pozostają:

- `DataSlate/GM_test.html`;
- `DataSlate/Infoczytnik_test.html`;
- `DataSlate/GM_backup.html`;
- `DataSlate/Infoczytnik_backup.html`.

---

## 12. Usunięcie Web Push

Web Push jest poza zakresem wersji Release.

Nie należy publikować Web Push jako funkcji opcjonalnej.

Nie należy zostawiać konfiguracji Web Push jako placeholderów, chyba że użytkownik później zmieni tę decyzję.

Z wersji Release należy usunąć albo wykluczyć elementy dotyczące Web Push, w szczególności:

- konfiguracje Web Push;
- placeholdery kluczy VAPID;
- logikę subskrypcji push;
- logikę triggerowania push;
- elementy interfejsu służące wyłącznie powiadomieniom push;
- backend używany wyłącznie przez Web Push;
- dokumentację konfiguracji Web Push;
- testy i notatki sugerujące, że Web Push jest częścią publicznego Release.

Przed usunięciem należy zinwentaryzować odwołania, aby nie zostawić martwych przycisków, importów, skryptów, komunikatów lub fragmentów dokumentacji.

Nie wolno mylić Web Push z komunikacją Firestore DataSlate. Firestore zostaje.

---

## 13. Placeholdery linków w module Main

`Main` nie może zawierać prywatnych linków właściciela do mapy, obrazków, Discorda ani innych usług grupy.

Należy użyć placeholderów po angielsku, na przykład:

```text
Map: INSERT_YOUR_VTT_LINK
Images: INSERT_YOUR_IMAGE_FOLDER_OR_CHANNEL_LINK
```

Dokumentacja powinna prostym językiem wyjaśniać, gdzie inna grupa ma wkleić własne linki.

---

## 14. Zasady dla Calculators

`Kalkulator/` ma zostać przemianowany na `Calculators/`.

Planowane publiczne nazwy plików:

- `XPCalculator.html`;
- `CharacterCreation.html`.

Pliki PDF z instrukcjami Calculators pozostają w wersji Release, chyba że użytkownik później zmieni tę decyzję.

Stare wersje, backupy i drafty należy rozpatrywać osobno przed finalną publikacją. Nie należy usuwać plików z listy „do decyzji właściciela” tylko dlatego, że zostały wcześniej wymienione jako wymagające decyzji.

---

## 15. Dokumentacja

Dokumentacja ma opisywać aktualny stan po zmianach.

Nie wolno zostawiać dokumentacji, która opisuje:

- stare ścieżki;
- stare polskie nazwy modułów;
- stare wartości Firebase;
- stare działanie Web Push;
- prywatną infrastrukturę właściciela;
- nieistniejące pliki lub funkcje.

Jeżeli zmiana wpływa na zachowanie użytkownika, należy zaktualizować dokumentację użytkową danego modułu.

Jeżeli zmiana wpływa na architekturę techniczną, należy zaktualizować dokumentację techniczną danego modułu.

Informacje historyczne, changelog, decyzje implementacyjne, analizy i notatki Release należy zapisywać w:

```text
Analizy/Release.md
```

Nie należy rozpraszać tych informacji po dokumentacjach modułów, chyba że użytkownik wyraźnie o to poprosi.

---

## 16. Komentarze w kodzie

Komentarze w kodzie mają być aktualne i przydatne.

Jeżeli plik ma już styl komentarzy dwujęzycznych, można go zachować, ale nie należy dodawać komentarzy, które tylko powtarzają nazwę zmiennej.

Nie wolno zostawiać komentarzy opisujących:

- usunięte zachowanie;
- starą prywatną infrastrukturę;
- nieaktualne polskie nazwy katalogów;
- Web Push jako funkcję Release;
- placeholdery w starym formacie.

Jeżeli komentarz opisuje konfigurację albo wdrożenie, musi być zgodny z modelem publicznych placeholderów Release.

---

## 17. Bezpieczeństwo i dane prywatne

Nie wolno dodawać do repozytorium danych wrażliwych.

Dotyczy to między innymi:

- haseł;
- tokenów;
- prywatnych kluczy;
- plików kont usługowych;
- prawdziwych sekretów produkcyjnych;
- prywatnych konfiguracji Firebase;
- prywatnych URL-i baz danych;
- prywatnych linków Discorda;
- prywatnych linków do mapy;
- aktywnych endpointów Web Push;
- prawdziwych kluczy VAPID;
- danych osobowych niepotrzebnych w publicznym Release.

Jeżeli agent wykryje w repozytorium wartość, która może dawać niezamierzony dostęp, powinien usunąć ją z aktualnej wersji plików i poinformować użytkownika, że wartość należy zweryfikować oraz ewentualnie zrotować.

---

## 18. Testy

Po zmianach należy wykonać odpowiednie testy i zapisać wynik w `Analizy/Release.md`.

Minimalny zakres testów zależy od typu zmiany.

### 18.1. Testy językowe

Należy sprawdzić, czy:

- moduł otwiera się domyślnie po angielsku;
- kolejność selektora to `English`, potem `Polski`;
- przełączanie EN → PL → EN działa tam, gdzie istnieje mechanizm PL/EN;
- statyczne ekrany bez selektora pokazują teksty po angielsku.

### 18.2. Testy Firebase i placeholderów

Należy sprawdzić, czy:

- nie pozostały wartości projektu Firebase właściciela;
- placeholdery są po angielsku;
- brak konfiguracji daje zrozumiały błąd albo czytelny stan wymagający konfiguracji;
- moduły nadal dają się skonfigurować przez własne dane nowej grupy.

### 18.3. Testy DataSlate

Należy sprawdzić, czy:

- panel GM i ekran gracza nadal komunikują się przez Firestore po konfiguracji;
- usunięcie Web Push nie uszkodziło wysyłania wiadomości;
- layout, logo, fillery, ping i audio nadal działają tam, gdzie mają działać.

### 18.4. Testy DataVault

Należy sprawdzić, czy:

- parser danych nadal działa;
- generowane pliki nie zawierają prywatnych danych;
- neutralny XLSX ładuje się poprawnie, gdy zostanie dostarczony;
- struktura danych pozostaje zgodna z modułami zależnymi.

### 18.5. Testy statyczne repozytorium

Należy wyszukać:

- stare nazwy katalogów;
- stare nazwy plików HTML;
- prywatne URL-e;
- adresy e-mail;
- identyfikatory projektów Firebase;
- URL-e baz danych;
- endpointy Web Push;
- klucze VAPID;
- polskie placeholdery w publicznych szablonach.

---

## 19. Praca z plikami `AGENTS.md`

Przed edycją plików należy przeczytać najbliższy obowiązujący `AGENTS.md`.

Jednocześnie trzeba pamiętać, że projekt jest obecnie na etapie zastępowania nieaktualnych instrukcji, które dotyczyły pierwotnego tworzenia prywatnej aplikacji.

Jeżeli stary lokalny `AGENTS.md` jest sprzeczny z planem Release, nie należy ignorować konfliktu po cichu. Konflikt należy zapisać w `Analizy/Release.md` i zapytać użytkownika, jeżeli poprawne działanie nie wynika jednoznacznie z aktualnych decyzji.

Nie wolno edytować, przenosić, zmieniać nazwy ani usuwać plików `AGENTS.md`, chyba że użytkownik wyraźnie poprosi właśnie o taką zmianę.

Jeżeli użytkownik prosi tylko o przygotowanie treści nowego `AGENTS.md`, należy podać treść w odpowiedzi bez commitowania i bez modyfikowania repozytorium.

---

## 20. Zasady pracy z repozytorium

Nie wolno commitować zmian, chyba że użytkownik wyraźnie o to poprosi.

Nie wolno tworzyć pull requestów, chyba że użytkownik wyraźnie o to poprosi.

Przed zmianą plików należy sprawdzić aktualny stan repozytorium. Nie wolno zakładać, że wcześniejsza analiza jest nadal w pełni aktualna.

Jeżeli użytkownik prosi o przygotowanie treści pliku, należy podać treść w odpowiedzi albo zapisać plik lokalnie w rozmowie, zgodnie z poleceniem użytkownika.

Zmiany w kodzie powinny być możliwie małe, czytelne i łatwe do opisania w `Analizy/Release.md`.

---

## 21. Decyzje nadal otwarte

Niektóre decyzje zostały świadomie odłożone.

Nie należy ich wymuszać, dopóki użytkownik do nich nie wróci.

Dotyczy to między innymi:

- finalnej publicznej nazwy aplikacji w `manifest.webmanifest`;
- publicznego zestawu ikon;
- sposobu publikacji: osobna gałąź publiczna albo generowany artefakt Release;
- pozostałych plików z wcześniejszej listy „do decyzji właściciela”;
- pełnego tłumaczenia generowanych wyników `NameGenerator`.

Każdą nową decyzję dotyczącą tych tematów należy zapisać w `Analizy/Release.md`.
