# Analiza przygotowania `WnG_Tools` do publicznego wydania

**Data analizy:** 2026-05-30
**Temat:** pełny audyt aplikacji i plan przygotowania publicznego wydania bez prywatnych danych właściciela
**Rodzaj dokumentu:** analiza stanu bieżącego i plan wdrożeniowy; dokument nie jest changelogiem i nie wprowadza jeszcze zmian w kodzie aplikacji

## Oryginalny pełny prompt użytkownika

```text
Przeprowadź analizę całej aplikacji WnG_Tools i wszystkich modułów. Wyniki analizy zapisz jako "Analizy/Release.md"
Celem będzie przygotowanie aplikacji do upublicznienia. W związku z tym trzeba będzie:

1. Wszędzie na powrót przywrócić menu rozwijane do zmiany wersji językowej
2. Zmienić kolejność wyświetlanych języków. Pierwszy ma być angielski a drugi polski
3. Zmienić domyślny język na angielski (w modułach w których jest możliwa zmiana wersji językowej)
4. Zmienić nazwy modułów/katalogów na wersje angielskie:
a. GeneratorNPC -> NPCGenerator
b. GeneratorNazw -> NameGenerator
c. Infoczytnik -> DataSlate
d. Kalkulator -> Calculators

Tak samo pliki HTML trzeba będzie zmienić. Np z Infoczytnik na DataSlate.

5. Trzeba usunąć wszystkie istniejące połączenia z Firebase i zostawić puste placeholdery, żeby inne grupy mogły samodzielnie przygotować własne Firebase i skonfigurować moduły lokalnie u siebie albo na swoich serwerach.

6. Wylistować pliki, które były użyteczne technicznie, ale w wersji do udostępnienia nie będą potrzebne (np. Kolumny.md, DetaleLayout.md, DoZrobienia.md, wersje testowe i backupowe plików GM i Infoczytnik)

7. W późniejszym etapie przygotuję makiety plików Repozytorim.xlsx i Audio_Manifest.xlsx. W module Audio jest plik data.json odnoszący się do moich plików audio, więc nie chcę tego udostępniać.

8. Niektóre moduły nie mają opcji zmiany języka (np. Main czy Infoczytnik) i tam trzeba będzie ręcznie zmienić wyświetlane nazwy na angielskie. Nie zakładam dodawania tam zmiany wersji językowych poprzez menu rozwijane.

9. W przypadku modułu GeneratorNazw niektóre nazwy są po polsku i są zaszyte w kodzie. Trzeba będzie przygotować nowy plik w folderze tego modułu, który będzie zawierać wypisane wszystkie nazwy i tytuły jakich używa skrypt, żeby potem je przetłumaczyć.

Przeprowadź pełną analizę modyfikacji wszystkich modułów i usunięcia prywatnych danych oraz zastąpienia ich placeholderami wraz z dokładną instrukcją jak inne grupy mają je uzupełnić (takie dane powinny być już w dokumentacji modułów)
```

## 1. Zakres i sposób przeprowadzenia analizy

Audyt objął wszystkie aktualnie istniejące moduły, wspólne pliki uruchomieniowe, dokumentację wdrożeniową oraz pliki danych. Nie założono z góry, że wcześniejsza lista modułów ani poprzedni model danych są nadal aktualne.

Sprawdzone zostały:

- aktualna lista plików śledzonych przez Git oraz pełna lista plików obecnych w repozytorium;
- główny `AGENTS.md` i dodatkowy `Infoczytnik/AGENTS.md`;
- wszystkie pliki HTML i JavaScript pod kątem wersji językowych, kolejności opcji oraz domyślnego języka;
- wszystkie wystąpienia nazw katalogów przeznaczonych do zmiany;
- wszystkie konfiguracje Firebase, mechanizmy Firebase Auth, Firestore i Realtime Database;
- konfiguracja Web Push oraz odnośniki do prywatnych usług i stron;
- obecne arkusze XLSX, pliki JSON, pliki testowe, backupy, drafty i pliki robocze;
- aktualne instrukcje Firebase znajdujące się przy modułach.

### Aktualna struktura aplikacji

Repozytorium zawiera obecnie następujące moduły i współdzielone zasoby:

| Obszar | Rola w aplikacji | Najważniejsze pliki uruchomieniowe |
| --- | --- | --- |
| `Main/` | strona startowa uruchamiająca pozostałe moduły | `Main/index.html` |
| `Audio/` | panel dźwięków z manifestem audio i opcjonalną synchronizacją ulubionych | `Audio/index.html` |
| `DataVault/` | przeglądanie i generowanie danych wykorzystywanych także przez NPC Generator | `DataVault/index.html`, `DataVault/app.js`, `DataVault/build_json.py`, `DataVault/xlsxCanonicalParser.js` |
| `DiceRoller/` | symulator rzutów kośćmi | `DiceRoller/index.html`, `DiceRoller/script.js` |
| `GeneratorNPC/` | generator NPC korzystający z danych DataVault i opcjonalnie zapisujący ulubione | `GeneratorNPC/index.html` |
| `GeneratorNazw/` | generator nazw, tytułów i kryptonimów | `GeneratorNazw/index.html`, `GeneratorNazw/script.js` |
| `Infoczytnik/` | ekran DataSlate dla graczy, panel GM i zaplecze zasobów wizualnych | `Infoczytnik/index.html`, `Infoczytnik/GM.html`, `Infoczytnik/Infoczytnik.html` |
| `Kalkulator/` | ekran startowy kalkulatorów, kalkulator PD i kreator postaci | `Kalkulator/index.html`, `Kalkulator/KalkulatorXP.html`, `Kalkulator/TworzeniePostaci.html` |
| `shared/` | wspólny loader prywatnych danych DataVault/NPC Generator i style bramki dostępu | `shared/firebase-config.js`, `shared/firebase-data-loader.js`, `shared/access-gate.css` |

Folder `WebView_FCM_Cloudflare_Worker/`, wymieniany w instrukcjach repozytorium jako szczególnie chroniony, nie istnieje w aktualnym drzewie plików.

## 2. Podsumowanie najważniejszych wniosków

Aplikacja nie jest jeszcze gotowa do publicznego udostępnienia. Przed wydaniem należy wykonać co najmniej pięć grup zmian:

1. **Ujednolicić publikowany interfejs w języku angielskim.** Moduły obsługujące PL/EN nadal startują po polsku, a część selektorów języka jest celowo ukryta.
2. **Przemianować cztery katalogi i zależne ścieżki.** Zmiana wymaga aktualizacji linków w kodzie, dokumentacji, instrukcjach Firebase oraz nazw plików HTML zawierających polskie nazwy.
3. **Usunąć konfiguracje właściciela.** W repozytorium są aktywne konfiguracje Firebase, prywatny techniczny e-mail Firebase Auth, aktywne endpointy Web Push, prywatne linki mapy i Discorda oraz odwołania do hostingu właściciela zapisane w arkuszach lub HTML.
4. **Zastąpić prywatne dane neutralnymi makietami.** Dotyczy to przede wszystkim `Audio/AudioManifest.xlsx`, przyszłego `DataVault/Repozytorium.xlsx`, generowanych plików `DataVault/data.json` i `firebase-import.json`, a także plików pomocniczych DataSlate zawierających odwołania do hostingu właściciela.
5. **Oczyścić paczkę dystrybucyjną.** Publiczna gałąź lub artefakt wydania nie powinny zawierać backupów, wersji testowych, draftów, notatek roboczych ani nieużywanych plików źródłowych instrukcji.

Ważne: przez „usunięcie połączeń Firebase” należy rozumieć usunięcie **konfiguracji konkretnych projektów właściciela**, a nie wycinanie funkcji integracyjnych. Kod ma pozostać konfigurowalny. Publiczna wersja powinna uruchamiać się bez prywatnych instancji, pokazywać czytelny stan „brak konfiguracji” tam, gdzie jest to możliwe, oraz zawierać placeholdery i kompletne instrukcje wdrożenia własnej usługi.

## 3. Analiza wersji językowych

### 3.1. Stan bieżący

| Moduł lub ekran | Selektor PL/EN istnieje w kodzie | Selektor obecnie widoczny | Kolejność obecna | Język domyślny obecny | Wymagana zmiana |
| --- | --- | --- | --- | --- | --- |
| `Audio/index.html` — widok admina | tak | nie | Polski, English | `pl` | odkryć selektor, ustawić English jako pierwsze i `en` jako domyślne |
| `Audio/index.html` — widok użytkownika | tak | nie | Polski, English | wspólne `pl` | odkryć drugi selektor i zsynchronizować start w `en` |
| `DataVault/index.html` + `DataVault/app.js` | tak | nie | Polski, English | `pl` | odkryć selektor, ustawić English jako pierwsze i `en` jako domyślne |
| `DiceRoller/index.html` + `DiceRoller/script.js` | tak | tak | Polski, English | `pl` | przestawić kolejność i domyślny język na `en` |
| `GeneratorNPC/index.html` | tak | nie | Polski, English | `pl` | po zmianie katalogu odkryć selektor i ustawić `en` |
| `GeneratorNazw/index.html` + `GeneratorNazw/script.js` | tak | nie | Polski, English | `pl` | po zmianie katalogu odkryć selektor i ustawić `en` |
| `Kalkulator/KalkulatorXP.html` | tak | tak | Polski, English | `pl` | po zmianie nazw przestawić kolejność i start na `en` |
| `Kalkulator/TworzeniePostaci.html` | tak | tak | Polski, English | `pl` | po zmianie nazw przestawić kolejność i start na `en`; zaktualizować komentarz opisujący domyślny język |
| `Main/index.html` | nie | nie dotyczy | nie dotyczy | statyczne teksty PL | ręcznie zastąpić wszystkie napisy użytkowe wersją EN; nie dodawać selektora |
| `Infoczytnik/index.html`, `GM*.html`, `Infoczytnik*.html` | nie | nie dotyczy | nie dotyczy | statyczne teksty PL | po zmianie nazwy na `DataSlate` ręcznie zastąpić napisy użytkowe wersją EN; nie dodawać selektora |
| `Kalkulator/index.html` | nie | nie dotyczy | nie dotyczy | statyczne teksty PL | po zmianie katalogu na `Calculators` ręcznie zastąpić ekran startowy wersją EN; nie trzeba dodawać selektora |

### 3.2. Zasada implementacyjna dla modułów z selektorem

W każdym module obsługującym PL/EN należy wykonać łącznie wszystkie poniższe czynności:

1. usunąć klasę `language-switcher--hidden`, jeżeli występuje;
2. ustawić opcje selektora w kolejności:

```html
<option value="en">English</option>
<option value="pl">Polski</option>
```

3. zmienić początkowe `<html lang="pl">` na `<html lang="en">`;
4. zmienić `currentLanguage = "pl"` lub `currentLanguage = 'pl'` na `en`;
5. sprawdzić, czy pierwsze renderowanie uruchamia funkcję typu `applyLanguage(currentLanguage)` albo `updateLanguage(currentLanguage)`;
6. przetestować wszystkie widoki, statusy, komunikaty błędów, potwierdzenia, puste stany oraz eksporty po przełączeniu EN → PL → EN.

### 3.3. Ekrany bez selektora języka

Zgodnie z założeniem użytkownika nie należy dodawać menu języka do `Main`, ekranów DataSlate ani głównego ekranu `Calculators`. W tych miejscach trzeba ręcznie zmienić widoczne napisy na angielskie, w tym:

- etykiety przycisków w `Main/index.html` (`Infoczytnik`, `Skarbiec Danych`, `Generator Nazw`, `Generator NPC`, `Obrazki`, `Mapa`, `Kalkulator`, `Rzut kośćmi` oraz notatki administratora);
- tytuły, przyciski i komunikaty na stronie wejściowej DataSlate;
- tytuły i stałe etykiety panelu GM oraz ekranu gracza DataSlate;
- przyciski startowe ekranu `Calculators/index.html`.

## 4. Plan przemianowania katalogów i plików HTML

### 4.1. Docelowe katalogi

| Stan obecny | Stan docelowy |
| --- | --- |
| `GeneratorNPC/` | `NPCGenerator/` |
| `GeneratorNazw/` | `NameGenerator/` |
| `Infoczytnik/` | `DataSlate/` |
| `Kalkulator/` | `Calculators/` |

### 4.2. Zalecane docelowe nazwy plików HTML

Pliki `index.html` powinny pozostać plikami wejściowymi katalogów. Dodatkowe pliki HTML zawierające polskie nazwy należy przemianować konsekwentnie:

| Stan obecny | Zalecany stan docelowy | Uwagi |
| --- | --- | --- |
| `Infoczytnik/Infoczytnik.html` | `DataSlate/DataSlate.html` | główny ekran odbiorcy |
| `Infoczytnik/Infoczytnik_test.html` | usunąć z publicznej paczki albo tymczasowo `DataSlate/DataSlate_test.html` | wersja testowa nie powinna trafić do finalnego wydania |
| `Infoczytnik/Infoczytnik_backup.html` | usunąć z publicznej paczki | backup nie jest potrzebny odbiorcom |
| `Infoczytnik/GM.html` | `DataSlate/GM.html` | nazwa GM jest już angielska i może pozostać |
| `Infoczytnik/GM_test.html` | usunąć z publicznej paczki albo tymczasowo `DataSlate/GM_test.html` | wersja testowa tylko dla gałęzi roboczej |
| `Infoczytnik/GM_backup.html` | usunąć z publicznej paczki | backup nie jest potrzebny odbiorcom |
| `Kalkulator/KalkulatorXP.html` | `Calculators/XPCalculator.html` | czytelna nazwa angielska |
| `Kalkulator/TworzeniePostaci.html` | `Calculators/CharacterCreation.html` | czytelna nazwa angielska |
| `Kalkulator/Old/Kalkulator_Org.html` | usunąć z publicznej paczki | plik archiwalny; nie trzeba go przemianowywać, jeżeli zostanie wykluczony |

### 4.3. Miejsca wymagające aktualizacji po zmianie nazw

Po przemianowaniu trzeba wykonać globalne wyszukiwanie starych nazw i poprawić co najmniej:

- linki modułów oraz logikę dynamicznego wyboru linku DataSlate w `Main/index.html`;
- linki powrotu do `Main` w modułach;
- odwołania w `manifest.webmanifest`, jeżeli po pełnym sprawdzeniu pojawią się tam ścieżki zależne od nazw katalogów;
- linki na stronie wejściowej DataSlate;
- tytuły dokumentów HTML i atrybuty `lang`;
- komentarze wdrożeniowe w kodzie;
- wszystkie ścieżki zapisane w `docs/README.md`, `docs/Documentation.md` i plikach `config/FirebaseREADME.md`;
- instrukcje kopiowania konfiguracji Firebase;
- ewentualne ścieżki w arkuszach XLSX przeznaczonych do pozostawienia w wydaniu.

### 4.4. Bloker dotyczący `DataSlate/AGENTS.md`

W folderze `Infoczytnik/` znajduje się lokalny `AGENTS.md`. Główny `AGENTS.md` zabrania agentowi AI edytowania, przenoszenia, zmiany nazwy i usuwania dowolnego pliku `AGENTS.md`. Oznacza to, że automatyczne przemianowanie całego katalogu `Infoczytnik/` na `DataSlate/` przeniosłoby również chroniony plik i naruszyłoby instrukcję repozytorium.

Przed etapem implementacji właściciel repozytorium powinien ręcznie rozstrzygnąć ten konflikt, na przykład ręcznie przenieść lokalny `AGENTS.md` razem z katalogiem albo ręcznie przygotować docelowy katalog i instrukcję obowiązującą dla `DataSlate/`. Agent AI może przemianować pozostałe pliki dopiero bez naruszania zakazu modyfikowania `AGENTS.md`.

## 5. Audyt Firebase i innych prywatnych połączeń

### 5.1. Wykryte konfiguracje wymagające wyczyszczenia

Repozytorium zawiera aktywne wartości konfiguracyjne należące do obecnego właściciela. Nie należy kopiować ich do publicznej wersji ani publikować ich ponownie w analizach, dokumentacji lub przykładach.

| Plik | Obecna rola | Co usunąć przed wydaniem | Co pozostawić |
| --- | --- | --- | --- |
| `shared/firebase-config.js` | wspólne prywatne dane DataVault oraz NPC Generator przez Firebase Auth + Realtime Database | wszystkie wartości konkretnego projektu, URL bazy i techniczny e-mail logowania | puste placeholdery dla `WG_FIREBASE_CONFIG` i `WG_DATA_ACCESS_EMAIL` |
| `Audio/config/firebase-config.js` | opcjonalny zapis ulubionych Audio do Firestore | wszystkie wartości konkretnego projektu | neutralny szablon `window.firebaseConfig` |
| `GeneratorNPC/config/firebase-config.js` | opcjonalny zapis ulubionych NPC do Firestore | wszystkie wartości konkretnego projektu | neutralny szablon; po zmianie katalogu plik przejdzie do `NPCGenerator/config/firebase-config.js` |
| `Infoczytnik/config/firebase-config.js` | komunikacja GM ↔ ekran gracza przez Firestore | wszystkie wartości konkretnego projektu | neutralny szablon; po zmianie katalogu plik przejdzie do `DataSlate/config/firebase-config.js` |
| `Kalkulator/config/firebase-config.js` | synchronizacja kreatora postaci przez Firestore | wszystkie wartości konkretnego projektu | neutralny szablon; po zmianie katalogu plik przejdzie do `Calculators/config/firebase-config.js` |
| `Infoczytnik/config/web-push-config.js` | aktywne endpointy Web Push właściciela i publiczny klucz VAPID | rzeczywisty klucz VAPID oraz endpointy usługi właściciela | placeholdery o strukturze zgodnej z `web-push-config.production.example.js` albo tylko plik `.example.js` |
| `Main/ZmienneHiperlacza.md` | dynamiczne linki do mapy i obrazków konkretnej grupy | rzeczywisty pokój mapy i kanał Discord | neutralne placeholdery oraz krótka instrukcja uzupełnienia |

Publiczne klucze konfiguracji Firebase Web i publiczny klucz VAPID nie są sekretami równoważnymi hasłu, ale jednoznacznie wiążą paczkę z infrastrukturą właściciela. Zgodnie z celem wydania należy je wyczyścić. Jeżeli którakolwiek opublikowana wartość dawała dostęp szerszy niż przewidziano przez reguły usług, właściciel powinien dodatkowo zweryfikować reguły, wyłączyć stare projekty lub zrotować odpowiednie dane dostępowe.

### 5.2. Wykryte modele danych Firebase

| Moduł | Usługa | Ścieżka lub dokument | Zachowanie przy braku konfiguracji |
| --- | --- | --- | --- |
| `DataVault` | Firebase Auth + Realtime Database | `/datavault/live` | brak dostępu do danych prywatnych; kod wyświetla komunikaty diagnostyczne |
| `GeneratorNPC` | Firebase Auth + Realtime Database przez `shared/firebase-data-loader.js` | `/datavault/live` | brak danych źródłowych NPC bez skonfigurowania wspólnego projektu |
| `GeneratorNPC` | Firestore | `generatorNpc/favorites` | ulubione mogą działać lokalnie, gdy konfiguracja Firestore ulubionych nie jest ustawiona |
| `Audio` | Firestore | `audio/favorites` | moduł może działać w trybie ustawień lokalnych |
| `Infoczytnik` / przyszły `DataSlate` | Firestore | `dataslate/current` | komunikacja GM ↔ gracze wymaga poprawnej konfiguracji; bez niej ekran nie jest funkcjonalny |
| `Kalkulator/TworzeniePostaci.html` / przyszły `Calculators/CharacterCreation.html` | Firestore | `character_builder/current` | synchronizacja kreatora wymaga konfiguracji; należy zachować czytelny komunikat błędu lub tryb zgodny z obecną logiką |

### 5.3. Zalecane placeholdery

#### Wspólne dane DataVault i NPC Generator

Plik `shared/firebase-config.js` powinien mieć neutralną strukturę podobną do poniższej:

```js
window.WG_FIREBASE_CONFIG = {
  apiKey: "TU_WSTAW_API_KEY",
  authDomain: "TU_WSTAW_AUTH_DOMAIN",
  databaseURL: "TU_WSTAW_DATABASE_URL",
  projectId: "TU_WSTAW_PROJECT_ID",
  storageBucket: "TU_WSTAW_STORAGE_BUCKET",
  messagingSenderId: "TU_WSTAW_MESSAGING_SENDER_ID",
  appId: "TU_WSTAW_APP_ID"
};

window.WG_DATA_ACCESS_EMAIL = "TU_WSTAW_EMAIL_UZYTKOWNIKA_TECHNICZNEGO";
```

Nie wolno dodawać hasła użytkownika technicznego do repozytorium. Hasło wpisuje użytkownik podczas logowania w aplikacji.

#### Moduły korzystające z Firestore

Pliki `Audio/config/firebase-config.js`, przyszły `NPCGenerator/config/firebase-config.js`, przyszły `DataSlate/config/firebase-config.js` i przyszły `Calculators/config/firebase-config.js` powinny mieć neutralną strukturę:

```js
window.firebaseConfig = {
  apiKey: "TU_WSTAW_API_KEY",
  authDomain: "TU_WSTAW_AUTH_DOMAIN",
  projectId: "TU_WSTAW_PROJECT_ID",
  storageBucket: "TU_WSTAW_STORAGE_BUCKET",
  messagingSenderId: "TU_WSTAW_MESSAGING_SENDER_ID",
  appId: "TU_WSTAW_APP_ID"
};
```

#### DataSlate Web Push

Jeżeli Web Push ma być częścią publicznego szablonu, przyszły `DataSlate/config/web-push-config.js` powinien zawierać wyłącznie placeholdery:

```js
window.infWebPushConfig = {
  vapidPublicKey: "TU_WSTAW_PUBLICZNY_KLUCZ_VAPID",
  subscribeEndpoint: "https://TU_WSTAW_DOMENE/api/push/subscribe",
  triggerEndpoint: "https://TU_WSTAW_DOMENE/api/push/trigger"
};
```

Jeżeli kod backendu Web Push nie będzie udostępniany wraz z aplikacją, bezpieczniej opublikować tylko `web-push-config.production.example.js`, a funkcję opisać jako wymagającą osobnego wdrożenia kompatybilnej usługi.

### 5.4. Instrukcja konfiguracji dla innych grup

Po oczyszczeniu publiczna dokumentacja każdego modułu powinna zawierać pełną instrukcję PL i EN. Minimalna procedura dla odbiorcy powinna być następująca:

#### A. Wspólne dane DataVault i NPC Generator

1. Utwórz własny projekt Firebase.
2. Dodaj aplikację Web w Firebase Console.
3. Włącz Firebase Authentication i metodę logowania e-mail/hasło.
4. Utwórz technicznego użytkownika dostępu do danych. Jego e-mail wpisz wyłącznie do `shared/firebase-config.js`; hasła nie zapisuj w repozytorium.
5. Utwórz Firebase Realtime Database.
6. Ustaw reguły bazy tak, aby odczyt `/datavault/live` był dostępny wyłącznie po poprawnym uwierzytelnieniu zgodnym z instrukcją danej grupy.
7. Wklej własne wartości Web SDK do `shared/firebase-config.js`.
8. W trybie administratora DataVault wybierz własny `Repozytorium.xlsx`, wygeneruj `firebase-import.json` i zaimportuj wrapper do `/datavault/live`.
9. Sprawdź logowanie i odczyt danych zarówno w DataVault, jak i NPC Generator.

Plik `shared/FirebaseREADME.md` już opisuje model `/datavault/live` i powinien zostać zachowany, ale po zmianach trzeba go przejrzeć, usunąć odwołania specyficzne dla właściciela i zaktualizować nazwy katalogów.

#### B. Audio

1. Utwórz własny projekt Firebase oraz Firestore.
2. Wklej własne wartości Web SDK do `Audio/config/firebase-config.js`.
3. Utwórz dokument `audio/favorites` zgodnie z `Audio/config/FirebaseREADME.md`.
4. Umieść własny neutralny `AudioManifest.xlsx` w katalogu `Audio/`.
5. Uruchom stronę przez serwer HTTP i sprawdź tryb lokalny oraz opcjonalną synchronizację Firestore.

#### C. NPC Generator

1. Skonfiguruj wspólny projekt danych DataVault zgodnie z sekcją A.
2. Jeżeli ulubione NPC mają synchronizować się między urządzeniami, skonfiguruj dodatkowo Firestore i przyszły `NPCGenerator/config/firebase-config.js`.
3. Utwórz dokument `generatorNpc/favorites` zgodnie z przyszłym `NPCGenerator/config/FirebaseREADME.md`.
4. Sprawdź osobno logowanie do prywatnych danych i zapis ulubionych.

#### D. DataSlate

1. Utwórz własny projekt Firebase oraz Firestore.
2. Wklej własne wartości Web SDK do przyszłego `DataSlate/config/firebase-config.js`.
3. Utwórz dokument `dataslate/current` zgodnie z przyszłym `DataSlate/config/FirebaseREADME.md`.
4. Jeżeli grupa potrzebuje Web Push, wdroż osobny backend, wygeneruj własną parę VAPID i uzupełnij przyszły plik `DataSlate/config/web-push-config.js`.
5. Otwórz jednocześnie panel `GM.html` i ekran `DataSlate.html`, opublikuj wiadomość testową, sprawdź layout, logo, filler, ping i audio.

#### E. Calculators — kreator postaci

1. Utwórz własny projekt Firebase oraz Firestore.
2. Wklej własne wartości Web SDK do przyszłego `Calculators/config/firebase-config.js`.
3. Utwórz dokument `character_builder/current` zgodnie z przyszłym `Calculators/config/FirebaseREADME.md`.
4. Uruchom przyszły `Calculators/CharacterCreation.html` i sprawdź odczyt oraz zapis reguł.

### 5.5. Dokumentacja Firebase już obecna w repozytorium

Repozytorium zawiera już techniczne instrukcje konfiguracji:

- `shared/FirebaseREADME.md`;
- `Audio/config/FirebaseREADME.md`;
- `GeneratorNPC/config/FirebaseREADME.md`;
- `Infoczytnik/config/FirebaseREADME.md`;
- `Kalkulator/config/FirebaseREADME.md`.

Instrukcje są użyteczną bazą i nie powinny być usuwane z publicznego wydania. Po implementacji trzeba jednak:

- dostosować w nich ścieżki do nowych nazw katalogów;
- upewnić się, że przykłady nie zawierają realnych danych właściciela;
- utrzymać kompletne, osobne części 🇵🇱 i 🇬🇧;
- dopisać jasne rozróżnienie między obowiązkowym źródłem danych DataVault a opcjonalną synchronizacją ulubionych;
- nie mieszać instrukcji testowych z instrukcjami końcowego użytkownika.

## 6. Audyt danych prywatnych i plików do zastąpienia makietami

### 6.1. DataVault

W aktualnym drzewie Git nie ma plików `DataVault/Repozytorium.xlsx`, `DataVault/data.json` ani `firebase-import.json`. Kod nadal poprawnie przewiduje ich użycie:

- `Repozytorium.xlsx` jest lokalnym plikiem wejściowym wybieranym przez administratora;
- `DataVault/data.json` jest generowany jako backup;
- `firebase-import.json` jest generowany jako wrapper importowany do Firebase Realtime Database;
- `DataVault/build_json.py` jest alternatywną ścieżką generowania `data.json`.

Dla publicznego wydania właściciel planuje dostarczyć neutralną makietę `Repozytorium.xlsx`. To dobre rozwiązanie. Makieta powinna zachować wymagane nazwy arkuszy, kolumny i minimalne rekordy demonstracyjne, ale nie może zawierać prywatnych treści kampanii. Przed publikacją należy porównać wynik generowania przez `build_json.py` i parser przeglądarkowy, ponieważ instrukcje repozytorium wymagają zachowania zgodności obu ścieżek.

### 6.2. Audio

W aktualnym katalogu `Audio/` nie ma śledzonego pliku `data.json`. Moduł bezpośrednio pobiera `Audio/AudioManifest.xlsx`. Obecny arkusz zawiera nazwy plików audio i odnośniki do zasobów hostowanych przez właściciela. Dlatego należy:

1. nie publikować bieżącego `Audio/AudioManifest.xlsx`;
2. zastąpić go neutralną makietą o tej samej nazwie oczekiwanej przez kod albo zmienić kod i dokumentację na uzgodnioną nazwę `Audio_Manifest.xlsx`;
3. zachować wymagane kolumny używane przez moduł, w szczególności `NazwaSampla`, `NazwaPliku`, `LinkDoFolderu` oraz kolumny tagów;
4. w makiecie użyć neutralnych plików demonstracyjnych lub placeholderów, do których grupa może wpisać własne URL-e;
5. opisać w `Audio/docs/README.md` i `Audio/docs/Documentation.md`, jak dodać własne zasoby.

Wymaga doprecyzowania przed implementacją: użytkownik wspomniał o `Audio/data.json`, ale w aktualnym repozytorium taki plik nie istnieje. Faktycznym źródłem prywatnych odwołań jest obecnie `Audio/AudioManifest.xlsx`.

### 6.3. DataSlate

Folder `Infoczytnik/assets/data/` zawiera:

- `DataSlate_manifest.xlsx` — arkusz manifestu lokalnych layoutów, logo, audio, fontów i fillerów;
- `data.json` — wygenerowany snapshot tego manifestu;
- `Mapowanie.xlsx` — arkusz z odwołaniami do hostingu właściciela;
- `NiebieskaRamka.md` — notatkę techniczną.

Zalecenia:

- zachować w publicznej paczce neutralny, lokalny manifest DataSlate i zgodny `data.json`, jeżeli zasoby graficzne oraz audio mają być częścią publicznego szablonu i właściciel ma prawo je rozpowszechniać;
- usunąć albo zastąpić neutralną makietą `Mapowanie.xlsx`, ponieważ zawiera odwołania do hostingu właściciela;
- rozważyć usunięcie `NiebieskaRamka.md` z artefaktu wydania, ponieważ jest notatką techniczną, a nie plikiem potrzebnym w runtime;
- wykonać osobny przegląd praw do rozpowszechniania plików PNG i MP3 przed publikacją.

### 6.4. Main

`Main/ZmienneHiperlacza.md` zawiera obecnie rzeczywiste linki grupy do pokoju mapy i kanału Discord. W publicznej wersji plik powinien zawierać placeholdery, na przykład:

```text
Mapa: TU_WSTAW_LINK_DO_MAPY
Obrazki: TU_WSTAW_LINK_DO_FOLDERU_LUB_KANALU_Z_OBRAZKAMI
```

Dokumentacja `Main/docs/README.md` powinna wyjaśniać użytkownikowi nietechnicznym językiem, że musi otworzyć ten plik, wkleić własne linki po dwukropku i zapisać zmiany.

### 6.5. Web Push

`Infoczytnik/config/web-push-config.js` zawiera aktywne endpointy usługi właściciela. Publiczna paczka nie zawiera w aktualnym drzewie kodu tej usługi, dlatego samo pozostawienie placeholderów nie wystarczy do uruchomienia powiadomień przez inną grupę. Należy jasno opisać jedną z dwóch decyzji wydaniowych:

- **wariant A:** udostępnić osobno kompatybilny backend Web Push i jego instrukcję wdrożenia;
- **wariant B:** oznaczyć Web Push jako funkcję opcjonalną, pozostawić tylko szablon konfiguracji i opisać, że bez osobnego backendu funkcja pozostaje wyłączona.

## 7. Pliki niepotrzebne w publicznym artefakcie wydania

Poniższa lista dotyczy publicznej paczki dystrybucyjnej. Nie każdy plik musi zostać natychmiast usunięty z prywatnej gałęzi roboczej właściciela. Najbezpieczniej zbudować czysty artefakt wydania lub osobną gałąź publiczną.

### 7.1. Pliki robocze i notatki techniczne wysokiej pewności

| Plik lub katalog | Rekomendacja | Uzasadnienie |
| --- | --- | --- |
| `Kolumny.md` | wykluczyć | notatka techniczna, niepotrzebna w runtime |
| `DetaleLayout.md` | wykluczyć z artefaktu publicznego | dokument roboczy layoutu; pozostawić prywatnie, jeżeli nadal wspiera rozwój |
| `DoZrobienia.md` | wykluczyć | lista robocza |
| `Infoczytnik/assets/data/NiebieskaRamka.md` | wykluczyć po przeglądzie | notatka techniczna dotycząca zasobu |
| `Infoczytnik/Draft/` | wykluczyć | drafty i stare warianty grafik |
| `Kalkulator/Old/` | wykluczyć | archiwalne pliki kalkulatora |
| `Kalkulator/HowToUse/draft.docx` | wykluczyć | edytowalny draft instrukcji |
| `Kalkulator/Old/HowToUse_Org.pdf` | wykluczyć razem z `Old/` | archiwalna instrukcja |

### 7.2. Backupy i wersje testowe DataSlate

| Plik | Rekomendacja | Uwagi |
| --- | --- | --- |
| `Infoczytnik/GM_backup.html` | wykluczyć | backup produkcyjnego panelu GM |
| `Infoczytnik/Infoczytnik_backup.html` | wykluczyć | backup ekranu odbiorcy |
| `Infoczytnik/GM_test.html` | wykluczyć z finalnego artefaktu | potrzebny tylko w procesie roboczym zgodnie z lokalnym `AGENTS.md` |
| `Infoczytnik/Infoczytnik_test.html` | wykluczyć z finalnego artefaktu | potrzebny tylko w procesie roboczym zgodnie z lokalnym `AGENTS.md` |
| linki do wersji testowych w `Infoczytnik/index.html` | usunąć z finalnego ekranu publicznego | odbiorca końcowy nie powinien widzieć plików testowych |

Podczas przyszłej implementacji należy pamiętać, że lokalny `Infoczytnik/AGENTS.md` pozwala agentowi zmieniać kod DataSlate wyłącznie w plikach testowych, a produkcyjne pliki aktualizuje ręcznie właściciel. Oczyszczenie finalnego artefaktu powinno nastąpić dopiero po ręcznym przeniesieniu zatwierdzonego kodu do plików produkcyjnych.

### 7.3. Pliki danych lub konfiguracje wymagające zastąpienia, a nie prostego usunięcia

| Plik | Rekomendacja |
| --- | --- |
| `Audio/AudioManifest.xlsx` | zastąpić neutralną makietą właściciela |
| przyszły `DataVault/Repozytorium.xlsx` | dodać neutralną makietę właściciela |
| `Infoczytnik/assets/data/Mapowanie.xlsx` | usunąć albo zastąpić neutralną makietą |
| `Main/ZmienneHiperlacza.md` | zachować jako konfigurowalny plik z placeholderami |
| wszystkie `*/config/firebase-config.js` | zachować jako szablony z placeholderami |
| `shared/firebase-config.js` | zachować jako szablon z placeholderami |
| `Infoczytnik/config/web-push-config.js` | zastąpić placeholderami albo nie publikować pliku runtime i zostawić tylko przykład |
| `Infoczytnik/backend/data/subscriptions.json` | pozostawić wyłącznie jako pustą makietę, jeżeli backend jest publikowany; obecnie plik jest pusty |

### 7.4. Pliki wymagające decyzji właściciela

| Plik | Pytanie przed publikacją |
| --- | --- |
| `Kalkulator/HowToUse/en.pdf`, `Kalkulator/HowToUse/pl.pdf` | czy publiczne wydanie ma zawierać oba podręczniki PDF, czy instrukcja Markdown wystarczy? |
| `Audio/Disclaimer.md` | czy zachować informację o inspiracji zewnętrznym projektem w publicznej paczce? |
| grafiki i audio w `Infoczytnik/assets/` | czy właściciel ma prawo je publicznie redystrybuować? |
| `IkonaGlowna.png`, `IkonaPowiadomien.png`, `IkonaPowiadomien2.png`, logo w `Main/` | czy licencje pozwalają na publiczne rozpowszechnianie? |
| `manifest.webmanifest` | czy nazwa aplikacji i ikony mają pozostać w obecnej formie po anglicyzacji? |

## 8. Generator nazw: plik katalogu do tłumaczenia

### 8.1. Stan bieżący

`GeneratorNazw/script.js` zawiera dwa rodzaje tekstów:

1. **teksty interfejsu** w obiekcie `translations`, które już mają warianty PL i EN;
2. **dane generatora** zaszyte w licznych tablicach oraz obiektach, z których część zawiera polskie wyrazy generowane jako wynik, a część zawiera tylko etykiety kategorii i opcji.

Obiekt `DATA` ma pola `name` i `nameEn`, ale to nie wyczerpuje zakresu tłumaczenia. Trzeba zinwentaryzować również teksty w tablicach źródłowych używanych przez funkcje generujące ludzi, Aeldari, Necronów, Orków, Sororitas, Astartes, Adeptus Mechanicus, Chaos, maszyny bojowe, okręty, kryptonimy oddziałów i kryptonimy operacji.

### 8.2. Zalecany nowy plik

Po przemianowaniu katalogu należy utworzyć:

```text
NameGenerator/TranslationCatalog.md
```

Plik powinien zawierać kompletną listę tekstów wymagających decyzji tłumaczeniowej, ale nie powinien być ręcznie utrzymywanym duplikatem bez kontroli. Zalecana struktura:

```markdown
# NameGenerator translation catalog

## UI labels
| Source key | Polish value | English value | Status |

## Category and option labels
| DATA key | Polish value | English value | Status |

## Generated vocabulary
| Source constant | Group | Polish token or title | Proposed English token or title | Keep untranslated? | Notes |
```

### 8.3. Zalecany sposób przygotowania katalogu

Najbezpieczniej dodać pomocniczy skrypt generujący katalog bezpośrednio z danych `NameGenerator/script.js` albo jednorazowo przygotować plik i podczas wdrożenia porównać go z wszystkimi stałymi generatora. W pliku należy rozróżnić:

- nazwy własne świata, których nie trzeba tłumaczyć;
- polskie etykiety interfejsu;
- polskie tytuły będące częścią generowanego wyniku;
- polskie rzeczowniki i przymiotniki w kryptonimach;
- wartości posiadające już odpowiednik EN;
- wartości wymagające decyzji redakcyjnej, a nie dosłownego tłumaczenia.

Po utworzeniu katalogu tłumaczeń trzeba zdecydować, czy generator ma:

- generować osobne słowniki wynikowe PL i EN zależnie od bieżącego języka;
- zawsze generować jedną kanoniczną wersję nazw, a tłumaczyć wyłącznie UI;
- oferować osobny wybór języka wyników niezależny od języka interfejsu.

Dla publicznego wydania angielskiego najbardziej intuicyjny jest pierwszy wariant: interfejs EN generuje angielskie wyniki, a przełączenie na PL generuje polskie wyniki.

## 9. Analiza moduł po module

### 9.1. `Main/`

**Stan bieżący:** statyczna strona po polsku, bez selektora języka. Linkuje bezpośrednio do katalogów przeznaczonych do zmiany nazw. Ładuje prywatne linki mapy i obrazków z `Main/ZmienneHiperlacza.md`.

**Zmiany wymagane:**

- zmienić wszystkie widoczne etykiety na EN;
- zaktualizować linki do `NameGenerator`, `NPCGenerator`, `DataSlate` i `Calculators`;
- zaktualizować logikę linku DataSlate zależnego od `?admin=1`;
- zastąpić prywatne linki placeholderami;
- zaktualizować `Main/docs/README.md` i `Main/docs/Documentation.md`.

### 9.2. `Audio/`

**Stan bieżący:** moduł PL/EN z dwoma ukrytymi selektorami języka. Startuje w PL. Ładuje `AudioManifest.xlsx`. Firestore `audio/favorites` jest opcjonalne i ma fallback lokalny.

**Zmiany wymagane:**

- odkryć selektory admina i użytkownika;
- ustawić EN jako pierwszy i domyślny;
- wyczyścić `Audio/config/firebase-config.js`;
- zastąpić prywatny `AudioManifest.xlsx` neutralną makietą;
- opisać kolumny makiety i konfigurację własnych URL-i;
- zaktualizować dokumentację.

### 9.3. `DataVault/`

**Stan bieżący:** selektor języka istnieje, ale jest ukryty; start PL. Moduł generuje `data.json` i `firebase-import.json` z lokalnego XLSX. Dane runtime ładuje z prywatnego RTDB przez wspólny loader.

**Zmiany wymagane:**

- odkryć selektor i ustawić EN jako pierwszy oraz domyślny;
- wyczyścić wspólną konfigurację Firebase i e-mail techniczny;
- zachować parsery bez upraszczania;
- po dostarczeniu makiety `Repozytorium.xlsx` porównać wyniki parsera Python i parsera przeglądarkowego;
- zaktualizować dokumentację i instrukcję importu RTDB.

### 9.4. `DiceRoller/`

**Stan bieżący:** selektor języka jest widoczny, ale PL jest pierwsze i domyślne. Moduł nie korzysta z Firebase.

**Zmiany wymagane:**

- ustawić EN jako pierwsze i domyślne;
- zmienić początkowy `lang` dokumentu;
- sprawdzić tłumaczenia wszystkich komunikatów rzutu;
- zaktualizować dokumentację.

### 9.5. `GeneratorNPC/` → `NPCGenerator/`

**Stan bieżący:** selektor PL/EN jest ukryty, start PL. Moduł pobiera prywatne dane przez wspólny loader DataVault i opcjonalnie zapisuje ulubione do osobnego Firestore.

**Zmiany wymagane:**

- przemianować katalog;
- poprawić wszystkie ścieżki i dokumentację;
- odkryć selektor, ustawić EN jako pierwsze i domyślne;
- wyczyścić `config/firebase-config.js`;
- zachować wspólny loader DataVault, ale wyczyścić `shared/firebase-config.js`;
- sprawdzić osobno fallback lokalny ulubionych oraz logowanie do prywatnych danych;
- zaktualizować dokumentację bez historycznych sekcji zmian.

### 9.6. `GeneratorNazw/` → `NameGenerator/`

**Stan bieżący:** selektor PL/EN jest ukryty, start PL. Część etykiet ma odpowiedniki `nameEn`, ale słowniki wynikowe wymagają pełnej inwentaryzacji.

**Zmiany wymagane:**

- przemianować katalog i ścieżki;
- odkryć selektor, ustawić EN jako pierwsze i domyślne;
- dodać `NameGenerator/TranslationCatalog.md`;
- zinwentaryzować wszystkie tokeny generatora;
- po tłumaczeniu rozdzielić słowniki wynikowe zależnie od wybranego języka;
- zaktualizować dokumentację.

### 9.7. `Infoczytnik/` → `DataSlate/`

**Stan bieżący:** brak selektora języka. Panel GM i ekran odbiorcy działają przez Firestore `dataslate/current`. Istnieją produkcyjne pliki HTML, backupy, wersje testowe, aktywna konfiguracja Firebase, aktywna konfiguracja Web Push, lokalne manifesty, snapshot `data.json`, arkusz z linkami właściciela, grafiki i audio.

**Zmiany wymagane:**

- ręcznie rozwiązać konflikt chronionego `AGENTS.md` przed przemianowaniem katalogu;
- zmienić nazwy `Infoczytnik*.html` na `DataSlate*.html` tam, gdzie pliki pozostaną;
- ręcznie przetłumaczyć UI na EN bez dodawania selektora;
- wyczyścić Firebase i Web Push;
- usunąć wersje testowe i backupowe z finalnego artefaktu;
- usunąć albo zamienić `Mapowanie.xlsx`;
- sprawdzić prawa do grafik i audio;
- zaktualizować dokumentację i stronę wejściową.

### 9.8. `Kalkulator/` → `Calculators/`

**Stan bieżący:** ekran startowy jest statyczny PL; kalkulator PD oraz kreator postaci mają selektor PL/EN i startują w PL. Kreator postaci korzysta z Firestore `character_builder/current`. Katalog zawiera też stare wersje i draft instrukcji.

**Zmiany wymagane:**

- przemianować katalog;
- przemianować HTML na `XPCalculator.html` i `CharacterCreation.html`;
- ręcznie przetłumaczyć ekran startowy;
- ustawić EN jako pierwszy i domyślny w obu ekranach z selektorem;
- wyczyścić konfigurację Firebase;
- wykluczyć `Old/` i draft DOCX z publicznego artefaktu;
- zdecydować, czy publiczne PDF-y instrukcji pozostają;
- zaktualizować dokumentację.

### 9.9. `shared/`

**Stan bieżący:** wspólna bramka danych i loader Firebase Auth + RTDB. Konfiguracja zawiera dane projektu właściciela i techniczny adres e-mail.

**Zmiany wymagane:**

- pozostawić kod loadera;
- zastąpić konfigurację placeholderami;
- zaktualizować komunikat błędu zawierający starą nazwę `GeneratorNPC` oraz wdrożeniowe odniesienia specyficzne dla obecnego projektu;
- zaktualizować `shared/FirebaseREADME.md` po przemianowaniu `NPCGenerator`.

## 10. Dokumentacja po przyszłych zmianach kodu

Instrukcje repozytorium wymagają, aby po każdej zmianie kodu zaktualizować odpowiednie:

- `docs/README.md` — pełna instrukcja użytkownika nietechnicznego;
- `docs/Documentation.md` — pełna dokumentacja techniczna i odtworzeniowa;
- `DetaleLayout.md` — jeżeli zmiana wpływa na wygląd, układ, selektor języka, etykiety widoczne w UI lub responsywność.

Po przemianowaniu katalogów dokumentacja ma znajdować się w nowych ścieżkach modułów. Dokumenty użytkowe muszą zawierać dwie kompletne części językowe: najpierw 🇵🇱, potem 🇬🇧, zgodnie z instrukcjami repozytorium. Nie należy mieszać języków akapit po akapicie.

Obecna dokumentacja części modułów zawiera historyczne dopiski opisujące wcześniejsze zmiany. Przy przygotowywaniu publicznego wydania trzeba przepisać te fragmenty tak, aby opisywały wyłącznie aktualny stan. Dokumentacja nie może działać jak changelog.

## 11. Kolejność bezpiecznej implementacji

Zalecana kolejność prac minimalizuje ryzyko uszkodzenia ścieżek i przypadkowego opublikowania danych prywatnych:

1. **Utworzyć osobną gałąź lub czysty artefakt wydania.** Nie usuwać roboczych backupów z prywatnej kopii bez potrzeby.
2. **Ręcznie rozwiązać problem chronionego `Infoczytnik/AGENTS.md`.** Dopiero potem przemianować `Infoczytnik/`.
3. **Przemianować katalogi i pliki HTML.** Następnie wykonać globalne wyszukiwanie starych nazw.
4. **Poprawić routing i linki.** Zacząć od `Main`, stron wejściowych modułów i linków powrotu.
5. **Wyczyścić konfiguracje Firebase, Web Push i prywatne linki.** Uruchomić skan repozytorium pod kątem realnych URL-i, e-maili oraz identyfikatorów projektów.
6. **Wprowadzić angielski interfejs domyślny.** Odkryć selektory tylko tam, gdzie mechanizm tłumaczeń już istnieje.
7. **Dodać neutralne makiety danych.** Poczekać na przygotowane przez właściciela makiety `Repozytorium.xlsx` i manifestu Audio.
8. **Dodać katalog tłumaczeń NameGenerator.** Następnie przetłumaczyć słowniki wynikowe zgodnie z wybraną strategią.
9. **Usunąć pliki robocze z artefaktu publicznego.** Nie usuwać plików wymaganych przez proces prywatnego rozwoju, jeżeli wydanie jest generowane osobno.
10. **Zaktualizować pełną dokumentację modułów i `DetaleLayout.md`.** Dokumentować wyłącznie stan końcowy.
11. **Wykonać testy funkcjonalne bez konfiguracji.** Publiczna kopia nie może łączyć się z usługami właściciela.
12. **Wykonać testy funkcjonalne z testowymi projektami nowej grupy.** Potwierdzić, że placeholdery i instrukcje wystarczają do uruchomienia aplikacji od zera.
13. **Wykonać przegląd licencji zasobów.** Dotyczy obrazów, audio, logo, ikon i PDF-ów.

## 12. Plan testów końcowych

### 12.1. Testy statyczne

- wyszukać wszystkie stare nazwy katalogów i plików;
- wyszukać wszystkie realne URL-e inne niż zależności CDN i oficjalne endpointy bibliotek;
- wyszukać e-maile, klucze Firebase, identyfikatory projektów, URL-e baz, endpointy Web Push i tokeny;
- upewnić się, że w artefakcie nie ma prywatnych XLSX, JSON, backupów, testów i draftów;
- upewnić się, że wszystkie placeholdery są czytelne i spójne z dokumentacją.

### 12.2. Testy językowe

Dla `Audio`, `DataVault`, `DiceRoller`, `NPCGenerator`, `NameGenerator`, `XPCalculator` i `CharacterCreation`:

1. otworzyć moduł bez parametrów;
2. potwierdzić start w EN;
3. potwierdzić kolejność `English`, `Polski`;
4. przełączyć EN → PL → EN;
5. sprawdzić etykiety, statusy, błędy, potwierdzenia, puste stany, eksporty i przyciski powrotu.

Dla `Main`, `DataSlate` i `Calculators/index.html`:

- potwierdzić ręcznie, że wszystkie widoczne teksty są po angielsku;
- potwierdzić, że nie dodano nieplanowanego selektora języka.

### 12.3. Testy Firebase i danych

- uruchomić publiczną kopię z placeholderami i potwierdzić brak połączeń do usług właściciela;
- skonfigurować testowy Firebase nowej grupy;
- sprawdzić RTDB `/datavault/live` w DataVault i NPC Generator;
- sprawdzić Firestore `generatorNpc/favorites`;
- sprawdzić Firestore `audio/favorites` oraz fallback lokalny;
- sprawdzić Firestore `dataslate/current` na dwóch ekranach;
- sprawdzić Firestore `character_builder/current`;
- wygenerować dane DataVault z makiety obiema ścieżkami i porównać wynik;
- sprawdzić własny manifest Audio i brak odwołań do zasobów właściciela.

### 12.4. Testy DataSlate zgodne z lokalnymi instrukcjami

Przy przyszłych zmianach testowych plików DataSlate należy dodatkowo:

- synchronizować `INF_VERSION` w obu plikach testowych;
- używać czasu lokalnego Polski w formacie `rrrr-MM-dd_HH-mm-ss`;
- uruchomić testowy panel GM i testowy ekran odbiorcy;
- wysłać wiadomość;
- sprawdzić layout lub frakcję;
- uzbroić audio i sprawdzić dźwięk;
- sprawdzić konsolę lub debug overlay przy zmianach Firebase, audio albo komunikacji.

## 13. Ryzyka i decyzje wymagające właściciela

### Ryzyka krytyczne

1. **Chroniony `AGENTS.md` blokuje automatyczne przemianowanie `Infoczytnik/`.** Właściciel musi wykonać lub zatwierdzić ręczny krok organizacyjny.
2. **Prywatna infrastruktura jest nadal wpisana w repozytorium.** Publiczne wydanie bez czyszczenia mogłoby nadal odwoływać się do usług właściciela.
3. **Audio manifest odwołuje się do prywatnych zasobów.** Musi zostać zastąpiony przed publikacją.
4. **Brak backendu Web Push w bieżącym drzewie.** Placeholdery same nie umożliwią innym grupom uruchomienia powiadomień.
5. **Niezweryfikowane prawa do zasobów.** Publiczne wydanie wymaga przeglądu licencji grafik, audio, ikon, logo i PDF-ów.

### Decyzje do podjęcia

1. Czy publiczne wydanie jest osobną gałęzią, czy generowanym artefaktem bez plików roboczych?
2. Czy Web Push ma być publicznie wspierany wraz z osobną instrukcją backendu, czy tylko oznaczony jako opcjonalny?
3. Czy `DataSlate/assets/data/data.json` i lokalne zasoby wizualne mają być publiczną makietą, czy właściciel przygotuje osobny neutralny zestaw?
4. Czy docelowa nazwa manifestu Audio pozostaje zgodna z kodem jako `AudioManifest.xlsx`, czy ma zostać ujednolicona do `Audio_Manifest.xlsx`?
5. Czy angielski NameGenerator ma generować angielskie wyniki, czy tylko angielski interfejs?
6. Czy PDF-y instrukcji Calculators mają pozostać w publicznym wydaniu?
7. Czy nazwa aplikacji w `manifest.webmanifest` i publiczne ikony pozostają bez zmian?

## 14. Rekomendowane następne kroki

Najbliższy etap implementacyjny powinien rozpocząć się dopiero po odpowiedzi właściciela na decyzje z sekcji 13 oraz po ręcznym rozwiązaniu konfliktu `Infoczytnik/AGENTS.md`. Następnie warto wykonać prace w dwóch rozdzielonych fazach:

### Faza A — odłączenie prywatnych danych

- placeholdery Firebase i Web Push;
- placeholdery linków Main;
- neutralne makiety XLSX i JSON;
- skan sekretów, URL-i i danych osobowych;
- sprawdzenie uruchomienia bez prywatnej infrastruktury.

### Faza B — anglicyzacja i porządkowanie wydania

- zmiana nazw katalogów i HTML;
- routing;
- angielski domyślny interfejs;
- odkrycie selektorów języka;
- katalog tłumaczeń NameGenerator;
- aktualizacja dokumentacji;
- zbudowanie czystego publicznego artefaktu;
- kompletne testy z pustymi placeholderami oraz z testową infrastrukturą nowej grupy.

---

## 15. Uzupełnienie analizy po decyzjach właściciela — 2026-05-30

### 15.1. Oryginalny pełny prompt użytkownika

```text
Przeczyaj i rozbuduj analizę Analizy/Release.md\nNic nie usuwaj. Dodaj tylko pełen nowy prompt i nowe uwagi/uzupełnienia oraz wnioski.\n\n4.4. Bloker dotyczący DataSlate/AGENTS.md\n- Pliki AGENTS.md zostaną przeredagowane. Nie będą blokerami.\n\n5.3. Zalecane placeholdery\n- Placeholdery powinny być po angielsku\n\nDataSlate Web Push\n- W wersji Release nie będzie funkcjonalności powiadomień. Wszystkie konfiguracje z tym związane są do usunięcia.\n\n6.2. Audio\n- Przygotuję nowy plik xlsx z przykładowymi danymi (tak jak przygotuję szablon pliku Repozytorium.xlsx)\n\n6.4. Main\n- Placeholdery powinny być po angielsku\n\n7.4. Pliki wymagające decyzji właściciela\n- Zostawmy to na dalszy etap. Nie ma jeszcze decyzj w tym zakresie.\n\nDecyzje do podjęcia\n1. Czy publiczne wydanie jest osobną gałęzią, czy generowanym artefaktem bez plików roboczych?\n- nie rozumiem pytania\n\n2. Czy Web Push ma być publicznie wspierany wraz z osobną instrukcją backendu, czy tylko oznaczony jako opcjonalny?\n- nie rozumiem pytania\n\n3. Czy DataSlate/assets/data/data.json i lokalne zasoby wizualne mają być publiczną makietą, czy właściciel przygotuje osobny neutralny zestaw?\n- Pliki w DataSlate nie są chronione żadnymi prawami autorskimi i mogą być wykorzystywane w takich projektach. Assety w DataSlate zostają jak jest.\n\n4. Czy docelowa nazwa manifestu Audio pozostaje zgodna z kodem jako AudioManifest.xlsx, czy ma zostać ujednolicona do Audio_Manifest.xlsx?\n- Plik xlsx będzie mieć taką nazwę jak obecnie jest wykorzystywany w kodzie. Zmienię tylko jego zawartość.\n\n5. Czy angielski NameGenerator ma generować angielskie wyniki, czy tylko angielski interfejs?\n- Na tym etapie tylko interfejs angielski. Wynikami zajmiemy się na kolejnym etapie\n\n6. Czy PDF-y instrukcji Calculators mają pozostać w publicznym wydaniu?\n- Tak. Pliki PDF z instrukcjami mają pozostać.\n\n7. Czy nazwa aplikacji w manifest.webmanifest i publiczne ikony pozostają bez zmian?\n- Decyzja zostanie podjęta na późniejszym etapie.
```

### 15.2. Zasada interpretacji tego uzupełnienia

Poniższe ustalenia są aktualnymi decyzjami właściciela i mają pierwszeństwo przy planowaniu dalszych prac. Wcześniejsze sekcje pozostają w pliku, ponieważ właściciel polecił niczego nie usuwać. Jeżeli wcześniejsza rekomendacja jest sprzeczna z niniejszym uzupełnieniem, podczas implementacji należy stosować treść sekcji 15.

### 15.3. Aktualizacja sekcji 4.4 — `DataSlate/AGENTS.md`

Pliki `AGENTS.md` zostaną przeredagowane przez właściciela i docelowo nie będą blokerami prac nad wydaniem Release. Oznacza to, że wcześniejszy bloker organizacyjny nie powinien być traktowany jako trwałe ograniczenie planu wydania.

Do momentu faktycznego przeredagowania plików nadal obowiązuje ich aktualna treść. Agent AI nie może samodzielnie modyfikować, usuwać, przenosić ani tworzyć plików `AGENTS.md`. Przed rozpoczęciem przyszłej implementacji trzeba ponownie odczytać bieżące instrukcje lokalne i dopiero na ich podstawie ustalić dozwolony zakres zmian.

### 15.4. Aktualizacja sekcji 5.3 i 6.4 — placeholdery wyłącznie po angielsku

W publicznym wydaniu wszystkie placeholdery muszą być zapisane po angielsku. Dotyczy to zarówno konfiguracji Firebase, jak i plików konfiguracyjnych modułu `Main` oraz pozostałych neutralnych szablonów przeznaczonych do samodzielnego uzupełnienia przez odbiorcę.

Przykładowa docelowa forma wspólnej konfiguracji Firebase:

```js
window.WG_FIREBASE_CONFIG = {
  apiKey: "INSERT_YOUR_API_KEY",
  authDomain: "INSERT_YOUR_AUTH_DOMAIN",
  databaseURL: "INSERT_YOUR_DATABASE_URL",
  projectId: "INSERT_YOUR_PROJECT_ID",
  storageBucket: "INSERT_YOUR_STORAGE_BUCKET",
  messagingSenderId: "INSERT_YOUR_MESSAGING_SENDER_ID",
  appId: "INSERT_YOUR_APP_ID"
};

window.WG_DATA_ACCESS_EMAIL = "INSERT_YOUR_TECHNICAL_USER_EMAIL";
```

Przykładowa docelowa forma konfiguracji Firestore używanej przez moduły:

```js
window.firebaseConfig = {
  apiKey: "INSERT_YOUR_API_KEY",
  authDomain: "INSERT_YOUR_AUTH_DOMAIN",
  projectId: "INSERT_YOUR_PROJECT_ID",
  storageBucket: "INSERT_YOUR_STORAGE_BUCKET",
  messagingSenderId: "INSERT_YOUR_MESSAGING_SENDER_ID",
  appId: "INSERT_YOUR_APP_ID"
};
```

Przykładowa docelowa forma pliku linków `Main/ZmienneHiperlacza.md`:

```text
Map: INSERT_YOUR_MAP_LINK
Images: INSERT_YOUR_IMAGE_FOLDER_OR_CHANNEL_LINK
```

Podczas implementacji należy wyszukać wszystkie placeholdery w repozytorium i ujednolicić je po angielsku. Nie należy ograniczać kontroli tylko do przykładów wymienionych wyżej.

### 15.5. Aktualizacja DataSlate Web Push — funkcja poza zakresem Release

Wersja Release nie będzie zawierała funkcjonalności powiadomień Web Push. Nie należy publikować tej funkcji jako opcjonalnej ani przygotowywać dla niej placeholderów, przykładowej konfiguracji lub instrukcji wdrożenia backendu.

W trakcie implementacji Release trzeba usunąć z publicznej wersji:

- konfiguracje Web Push, w tym aktywne endpointy i publiczny klucz VAPID;
- przykładowe pliki konfiguracji Web Push, jeżeli służą wyłącznie usuniętej funkcji;
- elementy interfejsu uruchamiające albo konfigurujące powiadomienia;
- odwołania JavaScript, rejestrację subskrypcji i wywołania endpointów związane z powiadomieniami;
- pliki backendu oraz dane subskrypcji, jeżeli dotyczą wyłącznie Web Push;
- instrukcje użytkowe i techniczne opisujące Web Push;
- testy Web Push oraz pozostałe odwołania do funkcji powiadomień w artefakcie Release.

Przed usunięciem należy przeprowadzić inwentaryzację odwołań, aby nie pozostawić martwych przycisków, importów, komunikatów ani nieużywanych plików. Firebase używany przez właściwą komunikację DataSlate GM ↔ ekran gracza pozostaje osobnym zagadnieniem i nie powinien zostać usunięty przypadkowo razem z Web Push.

Wcześniejsze pytanie, czy Web Push ma być wspierany wraz z backendem, czy pozostawiony jako funkcja opcjonalna, jest nieaktualne: aktualną decyzją jest całkowite wyłączenie funkcji z Release.

### 15.6. Aktualizacja sekcji 6.2 — neutralny manifest Audio

Właściciel przygotuje nowy arkusz XLSX z przykładowymi danymi dla modułu `Audio`, analogicznie do planowanego szablonu `DataVault/Repozytorium.xlsx`.

Arkusz Audio ma zachować nazwę aktualnie wykorzystywaną przez kod, czyli `AudioManifest.xlsx`. Na tym etapie nie należy przemianowywać go na `Audio_Manifest.xlsx`. Zmieni się zawartość arkusza, a nie kontrakt nazwy pliku.

Po dostarczeniu neutralnego pliku trzeba sprawdzić:

1. czy moduł ładuje arkusz bez błędów;
2. czy arkusz zachowuje wymagane kolumny;
3. czy przykładowe dane nie zawierają prywatnych URL-i ani danych właściciela;
4. czy wszystkie widoki i filtry Audio działają na danych przykładowych;
5. czy dokumentacja opisuje aktualny format arkusza i sposób zastąpienia przykładów własnymi danymi.

### 15.7. Aktualizacja sekcji 6.3 — zasoby DataSlate pozostają

Pliki `DataSlate/assets/data/data.json` oraz lokalne zasoby wizualne DataSlate mają pozostać w publicznym wydaniu. Zgodnie z informacją właściciela pliki te mogą być wykorzystywane w takich projektach i nie wymagają przygotowania osobnego neutralnego zestawu.

Ta decyzja dotyczy lokalnych assetów DataSlate. Nadal należy osobno usunąć konfiguracje Web Push oraz sprawdzić pliki zawierające prywatne odwołania do infrastruktury właściciela, takie jak mapowania hostingu, jeżeli nadal występują w repozytorium podczas implementacji.

### 15.8. Aktualizacja sekcji 7.4 — decyzje odłożone na dalszy etap

Pełne rozstrzygnięcie listy plików wymagających decyzji właściciela zostaje odłożone na dalszy etap. Nie należy teraz usuwać plików tylko dlatego, że zostały wymienione w sekcji 7.4.

Jednocześnie właściciel podał dwie konkretne informacje, które można już zapisać jako obowiązujące:

- pliki PDF z instrukcjami `Calculators` mają pozostać w publicznym wydaniu;
- decyzja o nazwie aplikacji w `manifest.webmanifest` i publicznych ikonach zostanie podjęta później.

Pozostałe pozycje sekcji 7.4 wymagają ponownego omówienia przed finalizacją publicznego artefaktu.

### 15.9. Wyjaśnienie pytania o osobną gałąź i generowany artefakt

Wcześniejsze pytanie brzmiało: „Czy publiczne wydanie jest osobną gałęzią, czy generowanym artefaktem bez plików roboczych?”. Dotyczyło ono sposobu utrzymywania czystej wersji publicznej:

- **osobna gałąź publiczna** oznacza oddzielną gałąź Git, w której stale utrzymuje się wersję przeznaczoną do publikacji;
- **generowany artefakt** oznacza paczkę przygotowywaną z gałęzi roboczej przez skrypt lub ręczną procedurę, która kopiuje tylko pliki potrzebne użytkownikowi i pomija pliki robocze.

Decyzja nie jest jeszcze konieczna do rozpoczęcia porządkowania modułów. Należy wrócić do niej przed zaprojektowaniem finalnego procesu publikacji, ponieważ wpływa na sposób wykluczania backupów, draftów, analiz i plików testowych bez utraty materiałów potrzebnych do prywatnego rozwoju.

### 15.10. Aktualizacja NameGenerator — tylko angielski interfejs na tym etapie

Na bieżącym etapie `NameGenerator` ma otrzymać angielski interfejs. Nie należy jeszcze tłumaczyć generowanych wyników ani przebudowywać słowników wynikowych.

Katalog tłumaczeń może nadal zostać przygotowany jako materiał do kolejnego etapu, ale nie powinien blokować wydania angielskiego interfejsu. W testach bieżącego etapu trzeba potwierdzić angielskie etykiety, przyciski, komunikaty i domyślny język UI. Ocena języka wygenerowanych nazw zostaje odłożona.

### 15.11. Zaktualizowane wnioski

1. Przyszła implementacja nie powinna traktować `DataSlate/AGENTS.md` jako trwałego blokera, ale musi respektować aktualne instrukcje lokalne do czasu ich przeredagowania przez właściciela.
2. Wszystkie publiczne placeholdery mają być po angielsku, w tym wartości Firebase oraz linki konfiguracyjne `Main`.
3. Web Push należy całkowicie usunąć z wersji Release. Nie jest to funkcja opcjonalna publicznego wydania.
4. Komunikacja DataSlate przez Firestore pozostaje niezależna od usuwanej funkcji Web Push i musi zostać zachowana.
5. Właściciel dostarczy neutralne arkusze `DataVault/Repozytorium.xlsx` oraz `Audio/AudioManifest.xlsx`. Nazwa manifestu Audio pozostaje zgodna z aktualnym kodem.
6. Lokalne assety DataSlate i `DataSlate/assets/data/data.json` pozostają w wydaniu.
7. PDF-y instrukcji Calculators pozostają w wydaniu.
8. Decyzje dotyczące pozostałych plików z sekcji 7.4, nazwy aplikacji oraz ikon zostają odłożone.
9. Na tym etapie `NameGenerator` otrzymuje angielski interfejs, natomiast tłumaczenie generowanych wyników będzie osobnym późniejszym zadaniem.
10. Wybór pomiędzy osobną gałęzią publiczną a generowanym artefaktem pozostaje otwarty i wymaga decyzji dopiero przed przygotowaniem procesu publikacji.

### 15.12. Zaktualizowane następne kroki

1. Poczekać na przeredagowanie plików `AGENTS.md` przez właściciela i przed implementacją ponownie odczytać wszystkie instrukcje lokalne.
2. Zinwentaryzować wszystkie odwołania do Web Push i przygotować ich kompletne usunięcie z wersji Release bez naruszania komunikacji Firestore DataSlate.
3. Zastąpić prywatne konfiguracje Firebase angielskimi placeholderami i ujednolicić angielskie placeholdery w `Main` oraz innych publicznych szablonach.
4. Po otrzymaniu nowych arkuszy sprawdzić neutralny `DataVault/Repozytorium.xlsx` oraz `Audio/AudioManifest.xlsx` w rzeczywistych ścieżkach ładowania danych.
5. Zachować lokalne assety DataSlate, ale ponownie przeskanować repozytorium pod kątem prywatnych URL-i, mapowań hostingu i danych właściciela.
6. Wprowadzić angielski interfejs `NameGenerator` bez ingerencji w język generowanych wyników.
7. Zachować PDF-y Calculators.
8. Wrócić na dalszym etapie do nierozstrzygniętych plików z sekcji 7.4 oraz decyzji o `manifest.webmanifest`, ikonach i sposobie budowania publicznej paczki.
