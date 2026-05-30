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

## Aktualizacja — 2026-05-30 — weryfikacja usunięcia blokera `AGENTS.md`

### Oryginalny pełny prompt użytkownika

Sprawdź czy obecna treść pliku AGENTS.md w dalszym ciągu blokuje prace związane z Release. Nic nie zmieniaj w kodzie aplikacji. Sprawdź czy bloker jest usunięty.

### Zakres prac

Wykonano wyłącznie analizę instrukcji repozytorium. Przed analizą odczytano aktualną treść `Analizy/Release.md`, sprawdzono stan Git oraz wyszukano wszystkie pliki `AGENTS.md` dostępne w obszarze roboczym `/workspace`.

Nie zmieniono kodu aplikacji, nazw katalogów, konfiguracji ani danych. Jedyną zmianą w repozytorium jest niniejszy wpis analityczny wymagany przez główny `AGENTS.md`.

### Ustalenia i wnioski

1. W obszarze roboczym istnieje obecnie tylko jeden plik instrukcji: `/workspace/WnG_Tools/AGENTS.md`.
2. Nie istnieje już lokalny plik `Infoczytnik/AGENTS.md` ani `DataSlate/AGENTS.md`, który wcześniej powodował konflikt przy planowanym przemianowaniu katalogu i ograniczał edycję plików produkcyjnych DataSlate.
3. Obecny główny `AGENTS.md` jednoznacznie opisuje etap Release jako aktywny cel repozytorium. Wprost dopuszcza prace wymagane dla wydania publicznego, w tym zmianę nazw modułów, usuwanie prywatnych konfiguracji, zastępowanie danych angielskimi placeholderami, usunięcie Web Push oraz zachowanie komunikacji Firestore DataSlate.
4. Sekcja dotycząca pracy z plikami `AGENTS.md` nadal zabrania agentowi samodzielnego edytowania, przenoszenia, zmiany nazw i usuwania plików `AGENTS.md`, o ile użytkownik wyraźnie nie poprosi właśnie o taką operację. Ten zakaz nie blokuje obecnie planowanych prac Release, ponieważ nie ma już lokalnego pliku instrukcji wewnątrz katalogu wymagającego przemianowania.
5. Wcześniejsze historyczne wpisy w niniejszym dzienniku, które nakazywały oczekiwanie na przeredagowanie instrukcji albo ręczne rozwiązanie konfliktu `Infoczytnik/AGENTS.md`, są już nieaktualne. Pozostają w pliku jako historia decyzji, ale nie powinny być traktowane jako obowiązujący bloker implementacji.

### Decyzje i wymagania

- Bloker organizacyjny związany z lokalnym `Infoczytnik/AGENTS.md` / `DataSlate/AGENTS.md` został usunięty.
- Można rozpoczynać kolejne prace Release z zachowaniem aktualnej treści głównego `AGENTS.md`.
- Nadal należy przed każdą zmianą czytać aktualny `Analizy/Release.md`, kontrolować stan Git i respektować zakaz samodzielnej modyfikacji plików `AGENTS.md`.

### Zmienione pliki

| Plik | Opis |
| --- | --- |
| `Analizy/Release.md` | Dodano bieżącą analizę potwierdzającą, że wcześniejszy bloker `AGENTS.md` został usunięty. |

### Szczegóły zmian w kodzie

Kod aplikacji nie został zmieniony. Aktualizacja dotyczy wyłącznie analizy i dziennika Release.

### Testy

Wykonano statyczne sprawdzenia organizacyjne:

- `find /workspace -name AGENTS.md -print` — wynik: znaleziono wyłącznie `/workspace/WnG_Tools/AGENTS.md`;
- `git status --short` przed analizą — wynik: drzewo robocze było czyste;
- `rg -n "AGENTS\\.md|bloker|blokad|wstrzym|sprzecz" Analizy/Release.md` — wynik: odnaleziono wcześniejsze historyczne wpisy opisujące bloker oraz potwierdzono potrzebę dopisania aktualnego rozstrzygnięcia;
- `nl -ba AGENTS.md | sed -n '1,38p;350,455p;475,570p'` — wynik: potwierdzono aktualny zakres prac Release i zasady obsługi plików `AGENTS.md`.

### Ryzyka i następne kroki

1. Historyczne sekcje `Analizy/Release.md` nadal zawierają opisy dawnego blokera. Nie należy ich usuwać; niniejsza późniejsza sekcja stanowi aktualne rozstrzygnięcie.
2. Zakaz modyfikowania plików `AGENTS.md` nadal obowiązuje. Jeżeli w przyszłości ponownie pojawi się lokalny `AGENTS.md` w katalogu objętym zmianą nazwy, trzeba ponownie ocenić możliwość wykonania operacji.
3. Usunięcie blokera organizacyjnego nie oznacza automatycznego wykonania prac Release. Kolejne zmiany powinny być wdrażane etapami i każdorazowo dokumentowane w tym pliku.

## Aktualizacja — 2026-05-30 — etap 1 Release: angielskie nazwy katalogów i naprawa ścieżek

### Oryginalny pełny prompt użytkownika

> Uwaga redakcyjna dziennika: użytkownik przekazał poniższy prompt dwa razy z rzędu w identycznym brzmieniu. Aby nie duplikować wielostronicowej treści bez dodawania informacji, poniżej zachowano pełną treść jednego identycznego bloku.

```text
Pracujesz w repozytorium `WnG_Tools`.

Wykonaj pierwszy etap prac Release: przygotowanie zmiany nazw, zmianę nazw katalogów i plików HTML oraz natychmiastową naprawę ścieżek/linków po tej zmianie.

WAŻNE:
- Przed rozpoczęciem przeczytaj aktualne pliki:
  - `AGENTS.md`
  - `Analizy/Release.md`
- Nie modyfikuj żadnego pliku `AGENTS.md`.
- Nie usuwaj starszych sekcji z `Analizy/Release.md`.
- Po zakończeniu prac dopisz do `Analizy/Release.md` nową sekcję zgodną z instrukcjami z `AGENTS.md`.
- Nie wykonuj jeszcze tłumaczenia całej aplikacji na angielski.
- Nie czyść jeszcze Firebase.
- Nie usuwaj jeszcze Web Push.
- Nie dodawaj jeszcze neutralnych makiet XLSX.
- Nie wykonuj zmian niezwiązanych z tym etapem.
- Nie commituj zmian, chyba że środowisko Codex wymaga tego jako sposobu oddania wyniku. Jeżeli commit jest wymagany, zrób jeden logiczny commit.

CEL ETAPU:
Zmienić nazwy folderów i wybranych plików HTML na docelowe angielskie nazwy oraz poprawić wszystkie bezpośrednio wynikające z tego ścieżki, linki i odwołania, tak aby aplikacja nie miała połamanej nawigacji po samej zmianie nazw.

KROK 1 — przygotowanie i inwentaryzacja

1. Sprawdź aktualny stan repozytorium:
   - `git status --short`
   - lista plików/katalogów w repozytorium
   - wyszukanie wszystkich wystąpień starych nazw:
     - `GeneratorNPC`
     - `GeneratorNazw`
     - `Infoczytnik`
     - `Kalkulator`
     - `KalkulatorXP.html`
     - `TworzeniePostaci.html`
     - `Infoczytnik.html`

2. Nie zmieniaj jeszcze logiki funkcjonalnej modułów. Ten etap ma dotyczyć nazw i ścieżek.

3. Zanotuj w pamięci roboczej, które pliki trzeba poprawić po rename.

KROK 2 — zmiana nazw folderów i plików

Wykonaj następujące zmiany nazw:

- `GeneratorNPC/` -> `NPCGenerator/`
- `GeneratorNazw/` -> `NameGenerator/`
- `Infoczytnik/` -> `DataSlate/`
- `Kalkulator/` -> `Calculators/`

Wykonaj także następujące zmiany nazw plików HTML:

- `DataSlate/Infoczytnik.html` -> `DataSlate/DataSlate.html`
- `Calculators/KalkulatorXP.html` -> `Calculators/XPCalculator.html`
- `Calculators/TworzeniePostaci.html` -> `Calculators/CharacterCreation.html`

Zasady:
- Pliki `index.html` mają pozostać plikami wejściowymi katalogów.
- Nie usuwaj jeszcze plików testowych, backupów, katalogów `Old`, draftów ani innych plików roboczych.
- Jeżeli istnieją pliki testowe typu `Infoczytnik_test.html`, nie usuwaj ich w tym etapie. Możesz zostawić nazwę bez zmian albo przemianować tylko wtedy, gdy jest to konieczne do uniknięcia połamanych ścieżek. Jeżeli nie masz pewności, zostaw je i opisz to w `Release.md`.

KROK 3 — naprawa ścieżek, linków i dokumentacja zmian

Po zmianie nazw wykonaj globalne wyszukiwanie starych nazw i popraw wszystkie odwołania, które muszą zostać poprawione, aby aplikacja działała po nowych ścieżkach.

Popraw w szczególności:

1. `Main/index.html`
   - linki do modułów:
     - `NPCGenerator`
     - `NameGenerator`
     - `DataSlate`
     - `Calculators`
   - logikę dynamicznego linku DataSlate zależną od trybu admina, jeżeli występuje;
   - widoczne nazwy modułów tylko wtedy, gdy są bezpośrednio powiązane ze zmianą ścieżek. Nie wykonuj jeszcze pełnego tłumaczenia interfejsu.

2. Linki powrotu do `Main` w modułach:
   - `Audio`
   - `DataVault`
   - `DiceRoller`
   - `NPCGenerator`
   - `NameGenerator`
   - `DataSlate`
   - `Calculators`

3. Linki wewnętrzne w `DataSlate`
   - wejście do panelu GM;
   - wejście do ekranu gracza;
   - odwołania do `DataSlate.html`;
   - ścieżki do konfiguracji, assetów i danych, jeżeli zmiana katalogu je naruszyła.

4. Linki wewnętrzne w `Calculators`
   - link do `XPCalculator.html`;
   - link do `CharacterCreation.html`;
   - linki powrotu;
   - ścieżki do instrukcji PDF, configów i wspólnych zasobów, jeżeli występują.

5. Dokumentację i instrukcje konfiguracyjne tylko w zakresie nazw i ścieżek:
   - `docs/README.md`
   - `docs/Documentation.md`
   - `config/FirebaseREADME.md`
   - `shared/FirebaseREADME.md`
   - inne pliki Markdown, jeżeli zawierają stare ścieżki, które po rename stały się błędne.

6. Pliki konfiguracyjne i manifesty:
   - sprawdź `manifest.webmanifest`;
   - popraw tylko te ścieżki, które faktycznie odnoszą się do przemianowanych katalogów albo plików.

7. Komentarze w kodzie:
   - popraw tylko komentarze, które po zmianie nazw stały się mylące lub wskazują błędne ścieżki;
   - nie wykonuj ogólnego porządkowania komentarzy.

TESTY I KONTROLA PO ZMIANACH

Po zmianach wykonaj statyczne testy:

1. `git status --short`
2. Globalne wyszukiwanie starych nazw:
   - `GeneratorNPC`
   - `GeneratorNazw`
   - `Infoczytnik`
   - `Kalkulator`
   - `KalkulatorXP.html`
   - `TworzeniePostaci.html`
   - `Infoczytnik.html`

3. Dla każdego pozostałego wystąpienia starej nazwy oceń:
   - czy jest błędem i trzeba je poprawić;
   - czy jest historycznym wpisem w `Analizy/Release.md`, którego nie wolno usuwać;
   - czy jest celowym odniesieniem w dokumentacji historii zmian.

4. Sprawdź, czy podstawowe pliki wejściowe istnieją pod nowymi ścieżkami:
   - `Main/index.html`
   - `Audio/index.html`
   - `DataVault/index.html`
   - `DiceRoller/index.html`
   - `NPCGenerator/index.html`
   - `NameGenerator/index.html`
   - `DataSlate/index.html`
   - `DataSlate/GM.html`
   - `DataSlate/DataSlate.html`
   - `Calculators/index.html`
   - `Calculators/XPCalculator.html`
   - `Calculators/CharacterCreation.html`

5. Jeżeli środowisko pozwala, uruchom prosty lokalny serwer HTTP i sprawdź przynajmniej statycznie, czy `Main/index.html` prowadzi do nowych ścieżek. Jeżeli nie da się uruchomić przeglądarkowego testu, opisz to w `Release.md`.

AKTUALIZACJA `Analizy/Release.md`

Na końcu dopisz do `Analizy/Release.md` nową sekcję:

- data;
- pełny prompt użytkownika;
- zakres prac;
- lista wykonanych rename;
- lista plików, w których poprawiono ścieżki;
- pozostałe wystąpienia starych nazw i uzasadnienie, dlaczego zostały albo nie zostały;
- wykonane testy;
- ryzyka i następne kroki.

W sekcji `Release.md` wyraźnie zaznacz, że:
- nie wykonywano jeszcze pełnego tłumaczenia UI;
- nie czyszczono jeszcze Firebase;
- nie usuwano jeszcze Web Push;
- nie dodawano jeszcze neutralnych makiet danych;
- ten etap dotyczył wyłącznie zmiany nazw i naprawy ścieżek po zmianie nazw.

WYNIK KOŃCOWY

Na końcu odpowiedzi podaj krótkie podsumowanie:
- jakie foldery i pliki przemianowano;
- jakie główne pliki zaktualizowano;
- czy pozostały jakieś stare nazwy i dlaczego;
- czy testy statyczne przeszły;
- jakie są proponowane następne kroki.
```

### Zakres prac

Wykonano wyłącznie pierwszy etap przygotowania Release: inwentaryzację, zmianę nazw czterech katalogów modułów, zmianę nazw trzech produkcyjnych plików HTML i naprawę bezpośrednio wynikających z tego ścieżek, linków, komentarzy ścieżkowych oraz instrukcji konfiguracyjnych. Przed rozpoczęciem odczytano aktualne `AGENTS.md` i `Analizy/Release.md`, sprawdzono czysty stan Git oraz wyszukano stare nazwy.

Nie wykonywano jeszcze pełnego tłumaczenia UI. Nie czyszczono jeszcze Firebase. Nie usuwano jeszcze Web Push. Nie dodawano jeszcze neutralnych makiet XLSX ani innych makiet danych. Ten etap dotyczył wyłącznie zmiany nazw i naprawy ścieżek po zmianie nazw.

### Ustalenia i wnioski

1. Przed zmianami drzewo robocze było czyste.
2. W repozytorium znajduje się tylko główny `AGENTS.md`; nie zmodyfikowano go.
3. W `Main/index.html` istniała dynamiczna logika wyboru linku DataSlate zależna od trybu administratora. Zaktualizowano oba warianty: panel modułu oraz produkcyjny ekran gracza.
4. Testowe i backupowe pliki DataSlate pozostawiono w repozytorium zgodnie z poleceniem. Zachowano ich historyczne nazwy plików, np. `DataSlate/Infoczytnik_test.html` i `DataSlate/Infoczytnik_backup.html`, ponieważ ich zmiana nie była wymagana do naprawienia produkcyjnej nawigacji i mogłaby niepotrzebnie rozszerzyć zakres etapu.
5. Nie znaleziono starych bezpośrednich ścieżek katalogowych ani starych produkcyjnych nazw plików HTML poza nieedytowalnym `AGENTS.md` i append-only dziennikiem `Analizy/Release.md`.
6. Pozostałe wystąpienia słów `Infoczytnik` i `Kalkulator` poza `AGENTS.md` oraz `Analizy/Release.md` są celowe: dotyczą zachowanych nazw plików testowych i backupowych, historycznych opisów zmian, polskich etykiet UI pozostawionych do późniejszego etapu tłumaczenia albo polskich nazw funkcjonalnych takich jak `Kalkulator PD`. Nie są połamanymi ścieżkami produkcyjnymi.

### Decyzje i wymagania

- Docelowe katalogi publiczne to `NPCGenerator/`, `NameGenerator/`, `DataSlate/` i `Calculators/`.
- Produkcyjny ekran gracza DataSlate ma nazwę `DataSlate/DataSlate.html`.
- Produkcyjne pliki Calculators mają nazwy `Calculators/XPCalculator.html` i `Calculators/CharacterCreation.html`.
- Pliki `index.html` pozostały plikami wejściowymi swoich katalogów.
- Zachowane pliki `_test`, `_backup`, `Old`, `Draft` i inne pliki robocze nie zostały usunięte ani masowo przemianowane.

### Zmienione pliki

#### Wykonane rename katalogów i plików produkcyjnych

| Stan przed zmianą | Stan po zmianie |
| --- | --- |
| `GeneratorNPC/` | `NPCGenerator/` |
| `GeneratorNazw/` | `NameGenerator/` |
| `Infoczytnik/` | `DataSlate/` |
| `Kalkulator/` | `Calculators/` |
| `Infoczytnik/Infoczytnik.html` | `DataSlate/DataSlate.html` |
| `Kalkulator/KalkulatorXP.html` | `Calculators/XPCalculator.html` |
| `Kalkulator/TworzeniePostaci.html` | `Calculators/CharacterCreation.html` |

#### Pliki z poprawionymi odwołaniami lub opisami ścieżek

- `Main/index.html`, `Main/docs/README.md`, `Main/docs/Documentation.md`;
- `DataSlate/index.html`, `DataSlate/DataSlate.html`, `DataSlate/GM.html`, `DataSlate/config/firebase-config.js`, `DataSlate/config/FirebaseREADME.md`, `DataSlate/docs/README.md`, `DataSlate/docs/Documentation.md`, `DataSlate/assets/data/NiebieskaRamka.md` oraz zachowane pliki testowe i backupowe, jeżeli zawierały ścieżki katalogowe;
- `Calculators/index.html`, `Calculators/XPCalculator.html`, `Calculators/CharacterCreation.html`, `Calculators/config/firebase-config.js`, `Calculators/config/FirebaseREADME.md`, `Calculators/docs/README.md`, `Calculators/docs/Documentation.md`;
- `NPCGenerator/index.html`, `NPCGenerator/config/FirebaseREADME.md`, `NPCGenerator/docs/README.md`, `NPCGenerator/docs/Documentation.md`;
- `NameGenerator/docs/README.md`, `NameGenerator/docs/Documentation.md`;
- `DataVault/docs/README.md`, `DataVault/docs/Documentation.md`;
- `Audio/docs/Documentation.md`;
- `shared/FirebaseREADME.md`, `shared/access-gate.css`, `shared/firebase-data-loader.js`;
- `DetaleLayout.md` i `manifest.webmanifest`.

### Szczegóły zmian w kodzie

- W `Main/index.html` zaktualizowano linki modułów do nowych katalogów, produkcyjny link DataSlate do `../DataSlate/DataSlate.html` oraz wariant administratora do `../DataSlate/index.html`. Widoczne etykiety `DataSlate` i `Calculators` zmieniono tylko dlatego, że są bezpośrednio związane z rename modułów.
- W `DataSlate/index.html` produkcyjny link ekranu gracza prowadzi teraz do `./DataSlate.html`. Zachowano linki do `GM_test.html` i `Infoczytnik_test.html`, ponieważ pliki testowe nie zostały przemianowane.
- W `Calculators/index.html` linki prowadzą do `XPCalculator.html` i `CharacterCreation.html`.
- We wspólnej dokumentacji, dokumentacji modułów, komentarzach konfiguracji i manifeście poprawiono wyłącznie referencje ścieżkowe lub nazwy modułów bezpośrednio wynikające z rename.
- Nie zmieniano logiki Firebase, logiki Web Push ani logiki funkcjonalnej modułów.

### Pozostałe wystąpienia starych nazw

- `AGENTS.md` zawiera tabelę historycznego planu rename i pozostaje niezmieniony zgodnie z zakazem modyfikacji.
- Starsze sekcje `Analizy/Release.md` pozostają niezmienione jako append-only historia decyzji.
- `DataSlate/Infoczytnik_test.html`, `DataSlate/Infoczytnik_backup.html` oraz referencje do tych plików pozostały celowo, ponieważ użytkownik nakazał nie usuwać plików testowych i backupowych oraz pozwolił zachować ich nazwy, jeżeli rename nie jest konieczny do naprawy ścieżek.
- Pozostałe polskie etykiety i historyczne opisy `Infoczytnik` / `Kalkulator` są poza zakresem etapu pełnego tłumaczenia UI i nie są błędnymi ścieżkami.

### Testy

Wykonano następujące sprawdzenia:

- `git status --short` przed zmianami — wynik: czyste drzewo robocze;
- `find . -maxdepth 2 -mindepth 1 -print | sort` — wynik: wykonano inwentaryzację plików i katalogów;
- `git grep -nE 'GeneratorNPC|GeneratorNazw|Infoczytnik|KalkulatorXP\\.html|TworzeniePostaci\\.html|Infoczytnik\\.html|Kalkulator' -- ':!Analizy/Release.md'` — wynik: zinwentaryzowano odwołania wymagające oceny;
- sprawdzenie obecności 12 wymaganych plików wejściowych przez `test -f` — wynik: wszystkie istnieją pod docelowymi ścieżkami;
- sprawdzenie braku czterech starych katalogów i obecności czterech nowych katalogów przez `test ! -e` / `test -d` — wynik: poprawny;
- skrypt Python wykorzystujący `html.parser` — wynik: lokalne atrybuty `href` i `src` w 12 podstawowych plikach HTML wskazują na istniejące zasoby;
- `git -c core.whitespace=cr-at-eol diff --check` — wynik: brak nowych błędów whitespace;
- `python3 -m http.server 8765` oraz `curl` — wynik: HTTP 200 dla `Main/index.html`, nowych plików wejściowych `NPCGenerator`, `NameGenerator`, `DataSlate` i `Calculators`; treść `Main/index.html` pobrana przez HTTP zawiera nowe linki modułów i oba warianty dynamicznego linku DataSlate;
- `rg -n --hidden --glob '!AGENTS.md' --glob '!Analizy/Release.md' 'GeneratorNPC/|GeneratorNazw/|Infoczytnik/|Kalkulator/|KalkulatorXP\\.html|TworzeniePostaci\\.html|Infoczytnik\\.html' .` — wynik: brak starych bezpośrednich ścieżek poza nieedytowalnym `AGENTS.md` i append-only dziennikiem Release.

Nie wykonano interaktywnego testu w przeglądarce, ponieważ etap ograniczono do statycznej walidacji ścieżek i lokalnego testu HTTP. Pełne testy UI i integracyjne należy wykonać w kolejnych etapach po zmianach językowych, Firebase i Web Push.

### Ryzyka i następne kroki

1. Zachowane pliki testowe i backupowe DataSlate nadal używają nazw `Infoczytnik_*`. Ich finalny status należy rozstrzygnąć osobno przed publikacją publicznej paczki.
2. Polskie etykiety UI nadal występują w aplikacji zgodnie z zakresem tego etapu. Następny etap językowy powinien wprowadzić angielski interfejs i domyślny język angielski tam, gdzie mechanizm PL/EN już istnieje.
3. Prywatne konfiguracje Firebase pozostają do zastąpienia angielskimi placeholderami w osobnym etapie.
4. Web Push pozostaje do usunięcia w osobnym etapie bez uszkodzenia komunikacji Firestore DataSlate.
5. Neutralne arkusze XLSX pozostają do dostarczenia i walidacji w osobnym etapie.
6. Przed publicznym Release należy wrócić do decyzji dotyczących plików roboczych, backupów, draftów, ikon i finalnej nazwy aplikacji w manifeście.

## Aktualizacja — 2026-05-30 — Etap 2 Release: angielski interfejs i widoczne selektory języka

### Oryginalny pełny prompt użytkownika

> Pracujesz w repozytorium `WnG_Tools`.
>
> Wykonaj drugi etap prac Release: wprowadzenie angielskiego interfejsu, ustawienie języka angielskiego jako domyślnego oraz przywrócenie widocznych selektorów języka tam, gdzie mechanizm PL/EN już istnieje.
>
> WAŻNE: przed rozpoczęciem przeczytaj `AGENTS.md` i `Analizy/Release.md`; nie modyfikuj `AGENTS.md`; nie usuwaj starszych sekcji `Analizy/Release.md`; po zakończeniu dopisz nową sekcję zgodną z `AGENTS.md`; nie czyść Firebase; nie usuwaj Web Push; nie dodawaj neutralnych makiet XLSX; nie usuwaj plików testowych, backupowych, `Old`, `Draft` ani innych plików roboczych; nie wykonuj zmian niezwiązanych z etapem językowym; nie commituj zmian, chyba że środowisko Codex wymaga tego jako sposobu oddania wyniku, a wtedy zrób jeden logiczny commit.
>
> DODATKOWA DECYZJA DO ZAPISANIA W `Analizy/Release.md`: na późniejszym etapie czyszczenia plików stare pliki testowe i backupowe DataSlate są przeznaczone do skasowania z publicznej paczki Release, w szczególności `DataSlate/GM_test.html`, `DataSlate/Infoczytnik_test.html`, `DataSlate/GM_backup.html`, `DataSlate/Infoczytnik_backup.html`. Jeżeli znajdziesz inne stare pliki testowe lub backupowe w `DataSlate/`, dopisz je do listy kandydatów. Nie usuwaj ich w tym etapie.
>
> CEL ETAPU: aplikacja po otwarciu ma domyślnie pokazywać publiczny interfejs po angielsku. Tam, gdzie moduł ma mechanizm PL/EN, selektor ma być widoczny, język domyślny ma być `en`, a kolejność opcji ma być `English`, potem `Polski`. Tam, gdzie nie planujemy selektora, widoczne teksty statyczne mają zostać ręcznie zmienione na angielskie.
>
> ZAKRES PRAC: popraw `Audio/index.html`, `DataVault/index.html`, `DataVault/app.js`, `DiceRoller/index.html`, `DiceRoller/script.js`, `NPCGenerator/index.html`, `NameGenerator/index.html`, `NameGenerator/script.js`, `Calculators/XPCalculator.html`, `Calculators/CharacterCreation.html`; ustaw `<html lang="en">`, startowe `en`, pierwsze renderowanie EN, kolejność `English` / `Polski`, usuń ukrycie selektora, zachowaj przełączanie EN → PL → EN i polskie tłumaczenia. Ręcznie przetłumacz statyczne UI bez nowych selektorów w `Main/index.html`, `DataSlate/index.html`, `DataSlate/GM.html`, `DataSlate/DataSlate.html`, `Calculators/index.html`. Dla `NameGenerator` przetłumacz wyłącznie UI i nie tłumacz wyników ani słowników generatora. Nie wykonuj czyszczenia Firebase, usuwania Web Push, zmian Firestore DataSlate, zmian XLSX, usuwania plików roboczych, tłumaczenia wyników `NameGenerator`, finalnego czyszczenia paczki, zmian ikon, brandingu ani dużych refaktorów. Dokumentację aktualizuj wyłącznie w zakresie językowym. Wykonaj statyczne wyszukiwania wskazane w promptcie oraz lokalny test HTTP 12 plików wejściowych, jeżeli środowisko pozwala. Na końcu dopisz pełną sekcję do `Analizy/Release.md` i podsumuj wynik.
>
> Uwaga techniczna: treść promptu została przesłana w wiadomości dwukrotnie w identycznym brzmieniu. Powyżej zapisano pełną merytoryczną treść jednokrotnie, bez powielania identycznego bloku.

### Zakres prac

- Przeczytano obowiązujący `AGENTS.md` oraz pełną aktualną zawartość `Analizy/Release.md` przed edycją.
- Zmieniono ustawienia startowe modułów z istniejącym mechanizmem PL/EN na język angielski.
- Odkryto selektory ukryte klasą `language-switcher--hidden` i ustawiono kolejność opcji `English`, `Polski`.
- Ręcznie przetłumaczono widoczne teksty ekranów statycznych wskazanych przez właściciela.
- Zinwentaryzowano kandydatów DataSlate do późniejszego usunięcia; w bieżącym etapie nie usunięto żadnego pliku.

### Ustalenia i wnioski

- Domyślny język `en` ustawiono w: Audio, DataVault, DiceRoller, NPCGenerator, NameGenerator, XPCalculator oraz CharacterCreation.
- Widoczne selektory PL/EN przywrócono w: Audio (oba widoki selektora), DataVault, NPCGenerator i NameGenerator. DiceRoller, XPCalculator oraz CharacterCreation miały już widoczne selektory; poprawiono ich kolejność opcji i język startowy.
- Statyczne UI ręcznie przetłumaczono w: Main, stronie wejściowej DataSlate, panelu GM DataSlate, ekranie gracza DataSlate (atrybut dokumentu) oraz stronie wejściowej Calculators.
- Polskie warianty tłumaczeń w modułach PL/EN pozostawiono celowo. Polskie dane słowników i generowane wyniki NameGenerator również pozostawiono celowo do osobnego późniejszego etapu.
- Pozostałe polskie komentarze techniczne dwujęzyczne nie są widocznym UI i nie wymagały zmiany w tym etapie. Zachowane pliki testowe i backupowe DataSlate mogą nadal zawierać stare polskie UI do czasu późniejszego czyszczenia.

### Decyzje i wymagania

- Stare pliki testowe i backupowe DataSlate mają zostać usunięte z publicznej paczki Release w późniejszym etapie czyszczenia plików, ale nie w bieżącym etapie.
- Zinwentaryzowane kandydaty do późniejszego usunięcia:
  - `DataSlate/GM_test.html`;
  - `DataSlate/Infoczytnik_test.html`;
  - `DataSlate/GM_backup.html`;
  - `DataSlate/Infoczytnik_backup.html`.
- Nie znaleziono dodatkowych plików `*test*` ani `*backup*` w głównym katalogu `DataSlate/`.
- Zgodnie z zakresem nie czyszczono Firebase, nie zmieniano wartości Firebase na placeholdery, nie usuwano Web Push, nie dodawano neutralnych makiet XLSX i nie usuwano plików roboczych.

### Zmienione pliki

- `Audio/index.html` — język dokumentu, widoczność dwóch selektorów, kolejność opcji i domyślny język EN.
- `DataVault/index.html`, `DataVault/app.js` — język dokumentu, widoczność selektora, kolejność opcji i domyślny język EN.
- `DiceRoller/index.html`, `DiceRoller/script.js` — język dokumentu, kolejność opcji i domyślny język EN.
- `NPCGenerator/index.html` — język dokumentu, widoczność selektora, kolejność opcji i domyślny język EN.
- `NameGenerator/index.html`, `NameGenerator/script.js` — język dokumentu, widoczność selektora, kolejność opcji i domyślny język interfejsu EN bez zmian słowników wynikowych.
- `Calculators/XPCalculator.html`, `Calculators/CharacterCreation.html` — język dokumentu, kolejność opcji i domyślny język EN.
- `Main/index.html`, `DataSlate/index.html`, `DataSlate/GM.html`, `DataSlate/DataSlate.html`, `Calculators/index.html` — statyczny interfejs angielski i `lang="en"`.
- `Analizy/Release.md` — niniejszy append-only wpis decyzji, zmian i testów.

### Szczegóły zmian w kodzie

- Nie przebudowano architektury tłumaczeń. Zmieniono wyłącznie startowy język, widoczność istniejących selektorów, ich kolejność oraz teksty statycznego UI.
- W `Main/index.html` dynamiczny parser linków akceptuje angielskie klucze `Map` i `Images`, nadal zachowując zgodność wsteczną z polskimi kluczami istniejącego pliku konfiguracyjnego.
- W `DataSlate/GM.html` przetłumaczono etykiety, przyciski, placeholder wiadomości, komunikaty statusu oraz komunikaty błędów importu. Nie zmieniano komunikacji Firestore ani logiki push.
- W `NameGenerator` nie zmieniono danych służących do generowania nazw, tytułów ani kryptonimów.

### Testy

- `git status --short` — wykonano przed i po zmianach; przed zmianami drzewo było czyste, po zmianach lista obejmuje wyłącznie pliki etapu językowego i ten dziennik.
- `rg` dla `language-switcher--hidden`, `currentLanguage = "pl"`, `currentLanguage = 'pl'` i `<html lang="pl">` w produkcyjnych plikach objętych etapem — brak aktywnych trafień.
- `rg` oraz ręczna ocena pozostałych polskich tekstów — pozostały polskie warianty tłumaczeń, generowane wyniki NameGenerator, komentarze techniczne, zgodność wsteczna parsera linków oraz nieedytowane pliki testowe/backupowe DataSlate.
- `node --check DataVault/app.js`, `node --check DiceRoller/script.js`, `node --check NameGenerator/script.js` — zaliczone.
- `git -c core.whitespace=cr-at-eol diff --check` — zaliczone.
- `python3 -m http.server 8765` oraz `curl` — HTTP 200 dla wszystkich 12 wymaganych plików wejściowych: Main, Audio, DataVault, DiceRoller, NPCGenerator, NameGenerator, DataSlate index, DataSlate GM, DataSlate ekran gracza, Calculators index, XPCalculator i CharacterCreation.
- Nie wykonano interaktywnego testu przeglądarkowego EN → PL → EN, ponieważ środowisko terminalowe nie zapewnia interaktywnej przeglądarki. Zachowano istniejące listenery zmiany języka i wykonano statyczną walidację ich konfiguracji startowej.

### Ryzyka i następne kroki

1. Wykonać ręczny smoke test w przeglądarce dla przełączania EN → PL → EN oraz dla layoutów responsywnych.
2. W osobnym etapie wyczyścić prywatne konfiguracje Firebase i zastąpić je angielskimi placeholderami bez usunięcia Firestore DataSlate.
3. W osobnym etapie usunąć Web Push bez naruszenia komunikacji Firestore GM → ekran gracza.
4. W późniejszym etapie usunąć zinwentaryzowane testowe i backupowe pliki DataSlate z publicznej paczki.
5. Po dostarczeniu neutralnych XLSX zwalidować parsery i przykładowe dane.
6. Tłumaczenie generowanych wyników NameGenerator pozostaje świadomie odłożone.

#### Uzupełnienie dokumentacji etapu językowego

Po statycznym wyszukiwaniu zaktualizowano również dokumentację modułów Audio, DataVault, NPCGenerator, NameGenerator i Calculators, ponieważ zawierała nieaktualne opisy ukrytych selektorów albo polskiego języka startowego. Dokumentacja opisuje teraz widoczny selektor PL/EN i domyślny język angielski. Zmienione pliki dokumentacji: `Audio/docs/README.md`, `Audio/docs/Documentation.md`, `DataVault/docs/README.md`, `DataVault/docs/Documentation.md`, `NPCGenerator/docs/README.md`, `NPCGenerator/docs/Documentation.md`, `NameGenerator/docs/README.md`, `NameGenerator/docs/Documentation.md`, `Calculators/docs/Documentation.md`.

## Aktualizacja — 2026-05-30 — etap 3 Release: czyszczenie Firebase i linków Main

### Oryginalny pełny prompt użytkownika

Pracujesz w repozytorium `WnG_Tools`.

Wykonaj trzeci etap prac Release: wyczyszczenie prywatnych konfiguracji Firebase oraz prywatnych linków w module Main i zastąpienie ich czytelnymi placeholderami po angielsku.

WAŻNE:
- Przed rozpoczęciem przeczytaj aktualne pliki:
  - `AGENTS.md`
  - `Analizy/Release.md`
- Nie modyfikuj żadnego pliku `AGENTS.md`.
- Nie usuwaj starszych sekcji z `Analizy/Release.md`.
- Po zakończeniu prac dopisz do `Analizy/Release.md` nową sekcję zgodną z instrukcjami z `AGENTS.md`.
- Nie usuwaj jeszcze Web Push.
- Nie zmieniaj jeszcze logiki Web Push.
- Nie dodawaj jeszcze neutralnych makiet XLSX.
- Nie usuwaj jeszcze plików testowych, backupowych, `Old`, `Draft` ani innych plików roboczych.
- Nie tłumacz teraz generowanych wyników `NameGenerator`.
- Nie wykonuj zmian niezwiązanych z czyszczeniem konfiguracji Firebase i prywatnych linków.
- Nie commituj zmian, chyba że środowisko Codex wymaga tego jako sposobu oddania wyniku. Jeżeli commit jest wymagany, zrób jeden logiczny commit.

CEL ETAPU:
Publiczna wersja repozytorium nie może zawierać prywatnych konfiguracji Firebase właściciela ani prywatnych linków właściciela do mapy, obrazków, Discorda lub innych usług grupy. Kod integracji Firebase ma pozostać konfigurowalny. Należy usunąć konkretne wartości projektu właściciela i zastąpić je placeholderami po angielsku.

NIE WOLNO:
- usuwać całej integracji Firebase;
- usuwać komunikacji Firestore DataSlate GM -> ekran gracza;
- usuwać komunikacji DataVault / NPCGenerator przez wspólny loader;
- usuwać fallbacków lokalnych;
- usuwać albo zmieniać Web Push w tym etapie;
- wpisywać prawdziwych sekretów, haseł, tokenów lub danych właściciela do dokumentacji lub `Release.md`.

ZAKRES PLIKÓW DO SPRAWDZENIA I POPRAWY

Sprawdź i w razie potrzeby popraw przede wszystkim:

- `shared/firebase-config.js`
- `Audio/config/firebase-config.js`
- `NPCGenerator/config/firebase-config.js`
- `DataSlate/config/firebase-config.js`
- `Calculators/config/firebase-config.js`
- `Main/ZmienneHiperlacza.md`

Sprawdź także dokumentację powiązaną z konfiguracją Firebase i linkami:

- `shared/FirebaseREADME.md`
- `Audio/config/FirebaseREADME.md`
- `NPCGenerator/config/FirebaseREADME.md`
- `DataSlate/config/FirebaseREADME.md`
- `Calculators/config/FirebaseREADME.md`
- `Main/docs/README.md`
- `Main/docs/Documentation.md`
- dokumentacje modułów, jeżeli zawierają konkretne stare wartości albo nieaktualne instrukcje konfiguracji.

PLACEHOLDERY

Wszystkie placeholdery mają być po angielsku.

Dla wspólnego DataVault / NPCGenerator użyj struktury w stylu:

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

Dla modułów korzystających z Firestore użyj struktury w stylu:

window.firebaseConfig = {
  apiKey: "INSERT_YOUR_API_KEY",
  authDomain: "INSERT_YOUR_AUTH_DOMAIN",
  projectId: "INSERT_YOUR_PROJECT_ID",
  storageBucket: "INSERT_YOUR_STORAGE_BUCKET",
  messagingSenderId: "INSERT_YOUR_MESSAGING_SENDER_ID",
  appId: "INSERT_YOUR_APP_ID"
};

Jeżeli dany moduł wymaga `databaseURL`, zachowaj pole `databaseURL` i użyj:

databaseURL: "INSERT_YOUR_DATABASE_URL"

Nie dodawaj hasła użytkownika technicznego do repozytorium. Hasło ma wpisywać użytkownik podczas logowania w aplikacji.

Dla `Main/ZmienneHiperlacza.md` użyj angielskich kluczy i placeholderów, np.:

Map: INSERT_YOUR_MAP_LINK
Images: INSERT_YOUR_IMAGE_FOLDER_OR_CHANNEL_LINK

Jeżeli kod `Main/index.html` zachowuje zgodność wsteczną z polskimi kluczami, nie usuwaj tej zgodności, chyba że jest to konieczne. W tym etapie wystarczy, aby publiczny plik konfiguracyjny miał angielskie klucze i placeholdery.

SZCZEGÓŁOWE ZADANIA

1. Inwentaryzacja przed zmianami

Wyszukaj w repozytorium potencjalne prywatne konfiguracje i linki, w szczególności:
- realne wartości `apiKey`;
- `authDomain`;
- `databaseURL`;
- `projectId`;
- `storageBucket`;
- `messagingSenderId`;
- `appId`;
- techniczne adresy e-mail;
- prywatne URL-e;
- linki Discord;
- linki do mapy;
- polskie placeholdery typu `TU_WSTAW`.

Nie wklejaj znalezionych prawdziwych wartości do odpowiedzi ani do `Release.md`. W dzienniku opisz je ogólnie, np. „usunięto realną konfigurację Firebase właściciela”.

2. Czyszczenie `shared/firebase-config.js`

Usuń konkretne wartości właściciela i zastąp je angielskimi placeholderami.

Zachowaj:
- nazwę `window.WG_FIREBASE_CONFIG`;
- nazwę `window.WG_DATA_ACCESS_EMAIL`;
- strukturę oczekiwaną przez `shared/firebase-data-loader.js`.

Nie zmieniaj logiki loadera, chyba że jest to absolutnie konieczne do poprawnej obsługi placeholderów. Jeżeli zmieniasz loader, opisz dokładnie dlaczego.

3. Czyszczenie konfiguracji Firestore modułów

Wyczyść i zastąp placeholderami konfiguracje w:

- `Audio/config/firebase-config.js`
- `NPCGenerator/config/firebase-config.js`
- `DataSlate/config/firebase-config.js`
- `Calculators/config/firebase-config.js`

Zachowaj nazwy globalnych zmiennych oczekiwane przez moduły.

Nie usuwaj funkcji synchronizacji ulubionych Audio/NPC.

Nie usuwaj funkcji komunikacji DataSlate przez Firestore.

Nie usuwaj funkcji synchronizacji CharacterCreation przez Firestore.

4. Czyszczenie `Main/ZmienneHiperlacza.md`

Zastąp prywatne linki właściciela angielskimi placeholderami.

Upewnij się, że `Main/index.html` nadal potrafi obsłużyć plik po tej zmianie.

Nie wykonuj dodatkowego tłumaczenia UI, jeżeli nie jest związane z placeholderami.

5. Dokumentacja

Zaktualizuj dokumentację tylko w zakresie konfiguracji Firebase i prywatnych linków.

Dokumentacja powinna jasno mówić:
- gdzie użytkownik ma wkleić własne wartości Firebase;
- że wartości w plikach są placeholderami;
- że hasła nie wolno zapisywać w repozytorium;
- że trzeba utworzyć własny projekt Firebase;
- które moduły używają Firestore;
- że DataVault i NPCGenerator używają wspólnej konfiguracji `shared/firebase-config.js`;
- że DataSlate Firestore służy do komunikacji GM -> ekran gracza;
- że `Main/ZmienneHiperlacza.md` zawiera linki użytkownika do własnej mapy i obrazków.

Nie opisuj Web Push jako aktualnie konfigurowanej funkcji Release. Web Push będzie usuwany osobno w kolejnym etapie.

Jeżeli dokumentacja zawiera prawdziwe stare wartości właściciela albo polskie placeholdery `TU_WSTAW`, zastąp je angielskimi placeholderami.

6. Czego nie robić z Web Push

W tym etapie nie usuwaj:
- `DataSlate/config/web-push-config.js`;
- logiki Web Push;
- elementów UI Web Push;
- backendu Web Push;
- dokumentacji Web Push, chyba że zawiera bezpośrednio prywatną wartość Firebase lub prywatny link niezwiązany z samym Web Push.

Jeżeli podczas skanowania znajdziesz aktywne endpointy Web Push albo klucze VAPID, nie przepisuj ich do `Release.md`. Zanotuj ogólnie, że pozostają do osobnego etapu usuwania Web Push.

7. Testy po zmianach

Po zakończeniu zmian wykonaj statyczne testy:

- `git status --short`;
- wyszukiwanie realnych wartości Firebase;
- wyszukiwanie `TU_WSTAW`;
- wyszukiwanie `INSERT_YOUR`;
- wyszukiwanie prywatnych URL-i;
- wyszukiwanie technicznych adresów e-mail;
- wyszukiwanie nazw starych projektów Firebase, jeżeli były widoczne przed zmianą;
- `git diff --check`.

Sprawdź, czy podstawowe pliki nadal istnieją i dają się pobrać przez lokalny HTTP, jeżeli środowisko pozwala:

- `Main/index.html`
- `Audio/index.html`
- `DataVault/index.html`
- `DiceRoller/index.html`
- `NPCGenerator/index.html`
- `NameGenerator/index.html`
- `DataSlate/index.html`
- `DataSlate/GM.html`
- `DataSlate/DataSlate.html`
- `Calculators/index.html`
- `Calculators/XPCalculator.html`
- `Calculators/CharacterCreation.html`

Jeżeli środowisko pozwala na statyczne sprawdzenie JS, wykonaj przynajmniej:
- `node --check DataVault/app.js`
- `node --check DiceRoller/script.js`
- `node --check NameGenerator/script.js`

Jeżeli któryś test nie może zostać wykonany, opisz powód w `Analizy/Release.md`.

8. Aktualizacja `Analizy/Release.md`

Na końcu dopisz do `Analizy/Release.md` nową sekcję.

Sekcja musi zawierać:
- datę;
- pełny oryginalny prompt użytkownika;
- zakres prac;
- listę zmienionych plików;
- opis usuniętych typów prywatnych wartości, bez podawania samych wartości;
- listę plików, w których wstawiono placeholdery;
- informację, że placeholdery są po angielsku;
- informację, że nie usunięto integracji Firebase;
- informację, że nie naruszono Firestore DataSlate;
- informację, że nie usuwano jeszcze Web Push;
- informację, że nie dodawano jeszcze makiet XLSX;
- informację, że nie usuwano plików testowych i backupowych;
- wyniki testów;
- pozostałe ryzyka;
- następne kroki.

W ryzykach i następnych krokach zapisz, że kolejnym logicznym etapem po czyszczeniu Firebase powinno być osobne usunięcie Web Push z Release bez naruszenia komunikacji Firestore DataSlate.

9. Wynik końcowy odpowiedzi

Na końcu odpowiedzi podaj krótkie podsumowanie:
- które konfiguracje wyczyszczono;
- gdzie wstawiono placeholdery;
- czy zostały znalezione pozostałe prywatne wartości;
- czego celowo nie ruszano;
- czy testy statyczne przeszły;
- jaki jest proponowany następny krok.
Pracujesz w repozytorium `WnG_Tools`.

Wykonaj trzeci etap prac Release: wyczyszczenie prywatnych konfiguracji Firebase oraz prywatnych linków w module Main i zastąpienie ich czytelnymi placeholderami po angielsku.

WAŻNE:
- Przed rozpoczęciem przeczytaj aktualne pliki:
  - `AGENTS.md`
  - `Analizy/Release.md`
- Nie modyfikuj żadnego pliku `AGENTS.md`.
- Nie usuwaj starszych sekcji z `Analizy/Release.md`.
- Po zakończeniu prac dopisz do `Analizy/Release.md` nową sekcję zgodną z instrukcjami z `AGENTS.md`.
- Nie usuwaj jeszcze Web Push.
- Nie zmieniaj jeszcze logiki Web Push.
- Nie dodawaj jeszcze neutralnych makiet XLSX.
- Nie usuwaj jeszcze plików testowych, backupowych, `Old`, `Draft` ani innych plików roboczych.
- Nie tłumacz teraz generowanych wyników `NameGenerator`.
- Nie wykonuj zmian niezwiązanych z czyszczeniem konfiguracji Firebase i prywatnych linków.
- Nie commituj zmian, chyba że środowisko Codex wymaga tego jako sposobu oddania wyniku. Jeżeli commit jest wymagany, zrób jeden logiczny commit.

CEL ETAPU:
Publiczna wersja repozytorium nie może zawierać prywatnych konfiguracji Firebase właściciela ani prywatnych linków właściciela do mapy, obrazków, Discorda lub innych usług grupy. Kod integracji Firebase ma pozostać konfigurowalny. Należy usunąć konkretne wartości projektu właściciela i zastąpić je placeholderami po angielsku.

NIE WOLNO:
- usuwać całej integracji Firebase;
- usuwać komunikacji Firestore DataSlate GM -> ekran gracza;
- usuwać komunikacji DataVault / NPCGenerator przez wspólny loader;
- usuwać fallbacków lokalnych;
- usuwać albo zmieniać Web Push w tym etapie;
- wpisywać prawdziwych sekretów, haseł, tokenów lub danych właściciela do dokumentacji lub `Release.md`.

ZAKRES PLIKÓW DO SPRAWDZENIA I POPRAWY

Sprawdź i w razie potrzeby popraw przede wszystkim:

- `shared/firebase-config.js`
- `Audio/config/firebase-config.js`
- `NPCGenerator/config/firebase-config.js`
- `DataSlate/config/firebase-config.js`
- `Calculators/config/firebase-config.js`
- `Main/ZmienneHiperlacza.md`

Sprawdź także dokumentację powiązaną z konfiguracją Firebase i linkami:

- `shared/FirebaseREADME.md`
- `Audio/config/FirebaseREADME.md`
- `NPCGenerator/config/FirebaseREADME.md`
- `DataSlate/config/FirebaseREADME.md`
- `Calculators/config/FirebaseREADME.md`
- `Main/docs/README.md`
- `Main/docs/Documentation.md`
- dokumentacje modułów, jeżeli zawierają konkretne stare wartości albo nieaktualne instrukcje konfiguracji.

PLACEHOLDERY

Wszystkie placeholdery mają być po angielsku.

Dla wspólnego DataVault / NPCGenerator użyj struktury w stylu:

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

Dla modułów korzystających z Firestore użyj struktury w stylu:

window.firebaseConfig = {
  apiKey: "INSERT_YOUR_API_KEY",
  authDomain: "INSERT_YOUR_AUTH_DOMAIN",
  projectId: "INSERT_YOUR_PROJECT_ID",
  storageBucket: "INSERT_YOUR_STORAGE_BUCKET",
  messagingSenderId: "INSERT_YOUR_MESSAGING_SENDER_ID",
  appId: "INSERT_YOUR_APP_ID"
};

Jeżeli dany moduł wymaga `databaseURL`, zachowaj pole `databaseURL` i użyj:

databaseURL: "INSERT_YOUR_DATABASE_URL"

Nie dodawaj hasła użytkownika technicznego do repozytorium. Hasło ma wpisywać użytkownik podczas logowania w aplikacji.

Dla `Main/ZmienneHiperlacza.md` użyj angielskich kluczy i placeholderów, np.:

Map: INSERT_YOUR_MAP_LINK
Images: INSERT_YOUR_IMAGE_FOLDER_OR_CHANNEL_LINK

Jeżeli kod `Main/index.html` zachowuje zgodność wsteczną z polskimi kluczami, nie usuwaj tej zgodności, chyba że jest to konieczne. W tym etapie wystarczy, aby publiczny plik konfiguracyjny miał angielskie klucze i placeholdery.

SZCZEGÓŁOWE ZADANIA

1. Inwentaryzacja przed zmianami

Wyszukaj w repozytorium potencjalne prywatne konfiguracje i linki, w szczególności:
- realne wartości `apiKey`;
- `authDomain`;
- `databaseURL`;
- `projectId`;
- `storageBucket`;
- `messagingSenderId`;
- `appId`;
- techniczne adresy e-mail;
- prywatne URL-e;
- linki Discord;
- linki do mapy;
- polskie placeholdery typu `TU_WSTAW`.

Nie wklejaj znalezionych prawdziwych wartości do odpowiedzi ani do `Release.md`. W dzienniku opisz je ogólnie, np. „usunięto realną konfigurację Firebase właściciela”.

2. Czyszczenie `shared/firebase-config.js`

Usuń konkretne wartości właściciela i zastąp je angielskimi placeholderami.

Zachowaj:
- nazwę `window.WG_FIREBASE_CONFIG`;
- nazwę `window.WG_DATA_ACCESS_EMAIL`;
- strukturę oczekiwaną przez `shared/firebase-data-loader.js`.

Nie zmieniaj logiki loadera, chyba że jest to absolutnie konieczne do poprawnej obsługi placeholderów. Jeżeli zmieniasz loader, opisz dokładnie dlaczego.

3. Czyszczenie konfiguracji Firestore modułów

Wyczyść i zastąp placeholderami konfiguracje w:

- `Audio/config/firebase-config.js`
- `NPCGenerator/config/firebase-config.js`
- `DataSlate/config/firebase-config.js`
- `Calculators/config/firebase-config.js`

Zachowaj nazwy globalnych zmiennych oczekiwane przez moduły.

Nie usuwaj funkcji synchronizacji ulubionych Audio/NPC.

Nie usuwaj funkcji komunikacji DataSlate przez Firestore.

Nie usuwaj funkcji synchronizacji CharacterCreation przez Firestore.

4. Czyszczenie `Main/ZmienneHiperlacza.md`

Zastąp prywatne linki właściciela angielskimi placeholderami.

Upewnij się, że `Main/index.html` nadal potrafi obsłużyć plik po tej zmianie.

Nie wykonuj dodatkowego tłumaczenia UI, jeżeli nie jest związane z placeholderami.

5. Dokumentacja

Zaktualizuj dokumentację tylko w zakresie konfiguracji Firebase i prywatnych linków.

Dokumentacja powinna jasno mówić:
- gdzie użytkownik ma wkleić własne wartości Firebase;
- że wartości w plikach są placeholderami;
- że hasła nie wolno zapisywać w repozytorium;
- że trzeba utworzyć własny projekt Firebase;
- które moduły używają Firestore;
- że DataVault i NPCGenerator używają wspólnej konfiguracji `shared/firebase-config.js`;
- że DataSlate Firestore służy do komunikacji GM -> ekran gracza;
- że `Main/ZmienneHiperlacza.md` zawiera linki użytkownika do własnej mapy i obrazków.

Nie opisuj Web Push jako aktualnie konfigurowanej funkcji Release. Web Push będzie usuwany osobno w kolejnym etapie.

Jeżeli dokumentacja zawiera prawdziwe stare wartości właściciela albo polskie placeholdery `TU_WSTAW`, zastąp je angielskimi placeholderami.

6. Czego nie robić z Web Push

W tym etapie nie usuwaj:
- `DataSlate/config/web-push-config.js`;
- logiki Web Push;
- elementów UI Web Push;
- backendu Web Push;
- dokumentacji Web Push, chyba że zawiera bezpośrednio prywatną wartość Firebase lub prywatny link niezwiązany z samym Web Push.

Jeżeli podczas skanowania znajdziesz aktywne endpointy Web Push albo klucze VAPID, nie przepisuj ich do `Release.md`. Zanotuj ogólnie, że pozostają do osobnego etapu usuwania Web Push.

7. Testy po zmianach

Po zakończeniu zmian wykonaj statyczne testy:

- `git status --short`;
- wyszukiwanie realnych wartości Firebase;
- wyszukiwanie `TU_WSTAW`;
- wyszukiwanie `INSERT_YOUR`;
- wyszukiwanie prywatnych URL-i;
- wyszukiwanie technicznych adresów e-mail;
- wyszukiwanie nazw starych projektów Firebase, jeżeli były widoczne przed zmianą;
- `git diff --check`.

Sprawdź, czy podstawowe pliki nadal istnieją i dają się pobrać przez lokalny HTTP, jeżeli środowisko pozwala:

- `Main/index.html`
- `Audio/index.html`
- `DataVault/index.html`
- `DiceRoller/index.html`
- `NPCGenerator/index.html`
- `NameGenerator/index.html`
- `DataSlate/index.html`
- `DataSlate/GM.html`
- `DataSlate/DataSlate.html`
- `Calculators/index.html`
- `Calculators/XPCalculator.html`
- `Calculators/CharacterCreation.html`

Jeżeli środowisko pozwala na statyczne sprawdzenie JS, wykonaj przynajmniej:
- `node --check DataVault/app.js`
- `node --check DiceRoller/script.js`
- `node --check NameGenerator/script.js`

Jeżeli któryś test nie może zostać wykonany, opisz powód w `Analizy/Release.md`.

8. Aktualizacja `Analizy/Release.md`

Na końcu dopisz do `Analizy/Release.md` nową sekcję.

Sekcja musi zawierać:
- datę;
- pełny oryginalny prompt użytkownika;
- zakres prac;
- listę zmienionych plików;
- opis usuniętych typów prywatnych wartości, bez podawania samych wartości;
- listę plików, w których wstawiono placeholdery;
- informację, że placeholdery są po angielsku;
- informację, że nie usunięto integracji Firebase;
- informację, że nie naruszono Firestore DataSlate;
- informację, że nie usuwano jeszcze Web Push;
- informację, że nie dodawano jeszcze makiet XLSX;
- informację, że nie usuwano plików testowych i backupowych;
- wyniki testów;
- pozostałe ryzyka;
- następne kroki.

W ryzykach i następnych krokach zapisz, że kolejnym logicznym etapem po czyszczeniu Firebase powinno być osobne usunięcie Web Push z Release bez naruszenia komunikacji Firestore DataSlate.

9. Wynik końcowy odpowiedzi

Na końcu odpowiedzi podaj krótkie podsumowanie:
- które konfiguracje wyczyszczono;
- gdzie wstawiono placeholdery;
- czy zostały znalezione pozostałe prywatne wartości;
- czego celowo nie ruszano;
- czy testy statyczne przeszły;
- jaki jest proponowany następny krok.

### Zakres prac

- Przeczytano aktualne `AGENTS.md` i `Analizy/Release.md` przed analizą i edycją.
- Zinwentaryzowano aktywne konfiguracje Firebase, adres technicznego użytkownika wspólnego loadera, linki zewnętrzne Main, dokumentację konfiguracji oraz istniejące odwołania Web Push.
- Usunięto konkretne wartości wdrożeniowe właściciela z konfiguracji Firebase i zastąpiono je czytelnymi placeholderami po angielsku.
- Zastąpiono prywatne linki Main do mapy i obrazków placeholderami po angielsku.
- Poprawiono minimalnie obsługę angielskich kluczy `Map` i `Images` w Main przy zachowaniu zgodności wstecznej z `Mapa` i `Obrazki`.
- Zneutralizowano nazwę nazwanej aplikacji wspólnego loadera Firebase, ponieważ zawierała stary identyfikator projektu właściciela. Model named-app, loader, autoryzacja i fallbacki pozostały zachowane.
- Zaktualizowano wyłącznie dokumentację związaną z konfiguracją Firebase, wspólnym loaderem i linkami Main.

### Ustalenia i wnioski

- Przed zmianą aktywne pliki konfiguracyjne zawierały realne wartości Firebase właściciela, w tym web config, identyfikatory projektów i techniczny adres e-mail wspólnego loadera. Wartości usunięto bez zapisywania ich w dzienniku.
- Przed zmianą `Main/ZmienneHiperlacza.md` zawierał prywatne adresy zewnętrzne właściciela. Wartości usunięto bez zapisywania ich w dzienniku.
- `shared/firebase-data-loader.js` zachował strukturę oczekiwaną przez DataVault i NPCGenerator. Zmieniono wyłącznie nazwę named-app na neutralne `wg-private-data`, aby usunąć pozostałość starego identyfikatora projektu właściciela.
- Integracja Firebase pozostała konfigurowalna. Nie usunięto synchronizacji Audio/NPC, odczytu DataVault/NPCGenerator przez wspólny loader, synchronizacji Character Creation ani komunikacji Firestore DataSlate panel GM → ekran gracza.
- Podczas inwentaryzacji potwierdzono obecność plików i odwołań Web Push. Nie ujawniono ich wartości i nie modyfikowano ich w tym etapie.
- Nie dodawano neutralnych makiet XLSX. Nie usuwano plików testowych, backupowych, `Old`, `Draft` ani innych plików roboczych. Nie tłumaczono generowanych wyników NameGenerator.

### Decyzje i wymagania

- Wszystkie publiczne placeholdery konfiguracyjne w bieżącym etapie są po angielsku.
- Każda grupa wdrażająca aplikację ma utworzyć własny projekt Firebase i wkleić własne wartości do odpowiednich plików konfiguracyjnych.
- Hasła, tokeny i pliki kont usługowych nie mogą być zapisywane w repozytorium. Hasło użytkownika technicznego wspólnego loadera wpisuje użytkownik podczas logowania w aplikacji.
- `DataVault` i `NPCGenerator` nadal korzystają ze wspólnej konfiguracji `shared/firebase-config.js` oraz wspólnego loadera.
- Firestore DataSlate nadal służy do komunikacji panel GM → ekran gracza przez dokument `dataslate/current`.
- Web Push pozostaje poza zakresem tego etapu i wymaga osobnego usunięcia w kolejnym etapie Release.

### Zmienione pliki

- `shared/firebase-config.js` — realne wartości Firebase i techniczny e-mail zastąpiono angielskimi placeholderami.
- `Audio/config/firebase-config.js` — realne wartości Firestore zastąpiono angielskimi placeholderami.
- `NPCGenerator/config/firebase-config.js` — realne wartości Firestore ulubionych zastąpiono angielskimi placeholderami.
- `DataSlate/config/firebase-config.js` — realne wartości Firestore zastąpiono angielskimi placeholderami bez naruszenia komunikacji GM → ekran gracza.
- `Calculators/config/firebase-config.js` — realne wartości Firestore Character Creation zastąpiono angielskimi placeholderami.
- `Main/ZmienneHiperlacza.md` — prywatne linki zastąpiono angielskimi kluczami `Map`, `Images` i angielskimi placeholderami.
- `Main/index.html` — przypisanie linków obsługuje angielskie klucze publicznego pliku i zachowuje zgodność wsteczną z polskimi kluczami.
- `shared/firebase-data-loader.js` — nazwę named-app zawierającą stary identyfikator projektu zastąpiono neutralnym `wg-private-data`; logika loadera i fallbacki pozostały bez zmian.
- `shared/FirebaseREADME.md`, `Audio/config/FirebaseREADME.md`, `NPCGenerator/config/FirebaseREADME.md`, `DataSlate/config/FirebaseREADME.md`, `Calculators/config/FirebaseREADME.md` — doprecyzowano tworzenie własnego projektu Firebase, zastępowanie placeholderów i zakaz commitowania haseł, tokenów oraz plików kont usługowych; opisano role modułów.
- `Audio/docs/Documentation.md` — przykładowy format konfiguracji używa angielskich placeholderów.
- `Main/docs/README.md`, `Main/docs/Documentation.md` — instrukcje linków opisują angielskie klucze i placeholdery oraz zgodność wsteczną parsera.
- `DataVault/docs/README.md`, `DataVault/docs/Documentation.md`, `NPCGenerator/docs/Documentation.md` — dokumentację wspólnego loadera zaktualizowano do neutralnej nazwy `wg-private-data`.
- `Analizy/Release.md` — dopisano niniejszą append-only sekcję.

### Szczegóły zmian w kodzie

- `shared/firebase-config.js` zachowuje globalne nazwy `window.WG_FIREBASE_CONFIG` i `window.WG_DATA_ACCESS_EMAIL`, pole `databaseURL` oraz strukturę oczekiwaną przez `shared/firebase-data-loader.js`.
- Modułowe pliki `firebase-config.js` zachowują globalną nazwę `window.firebaseConfig` i istniejący zestaw pól Firestore.
- `Main/ZmienneHiperlacza.md` zawiera teraz `Map: INSERT_YOUR_MAP_LINK` i `Images: INSERT_YOUR_IMAGE_FOLDER_OR_CHANNEL_LINK`.
- `Main/index.html` wybiera `links.map || links.mapa` oraz `links.images || links.obrazki`. Dzięki temu publiczny plik z angielskimi kluczami działa, a istniejąca zgodność wsteczna pozostaje zachowana.
- `shared/firebase-data-loader.js` nadal inicjalizuje named-app i nie przywraca ryzykownego fallbacku do beznazwowego `getApp()`. Neutralizacja nazwy aplikacji była konieczna wyłącznie dlatego, że poprzednia nazwa zawierała identyfikator projektu właściciela.

### Testy

- `git status --short` — wykonano przed zmianami i po zmianach; przed zmianami drzewo było czyste, po zmianach lista obejmuje wyłącznie pliki etapu 3 i niniejszy dziennik.
- Skrypt walidacji placeholderów Python — zaliczony: wymagane angielskie placeholdery istnieją w pięciu konfiguracjach, techniczny e-mail jest placeholderem, a Main zawiera angielskie placeholdery i zgodność wsteczną parsera.
- Skrypt porównawczy Python względem `HEAD` — zaliczony: brak poprzednich konkretnych wartości właściciela poza `Analizy/Release.md`; skrypt nie wypisywał samych wartości.
- `rg -n 'TU_WSTAW' --glob '!AGENTS.md' --glob '!Analizy/Release.md' .` — brak trafień w publicznych plikach.
- `rg -n 'INSERT_YOUR_' shared Audio NPCGenerator DataSlate Calculators Main` — potwierdzono angielskie placeholdery w oczekiwanych konfiguracjach, dokumentacji przykładowej i pliku Main.
- `rg` dla adresów e-mail poza `Analizy/Release.md` — brak commitowanych adresów e-mail.
- `rg` dla URL-i Discord poza `AGENTS.md` i `Analizy/Release.md` — brak trafień w publicznych plikach.
- `git diff --quiet -- DataSlate/config/web-push-config.js DataSlate/config/web-push-config.production.example.js` — zaliczone: pliki konfiguracji Web Push nie zostały zmienione.
- `git -c core.whitespace=cr-at-eol diff --check` — zaliczone.
- `node --check DataVault/app.js`, `node --check DiceRoller/script.js`, `node --check NameGenerator/script.js` — zaliczone.
- `node --check shared/firebase-config.js`, `node --check Audio/config/firebase-config.js`, `node --check NPCGenerator/config/firebase-config.js`, `node --check DataSlate/config/firebase-config.js`, `node --check Calculators/config/firebase-config.js` — zaliczone.
- `python3 -m http.server 8765` oraz `curl` — pierwsza próba wystartowała zbyt wolno dla natychmiastowego żądania; po dodaniu oczekiwania na gotowość serwera test zaliczono: HTTP 200 dla wszystkich 12 wymaganych stron wejściowych.

### Ryzyka i następne kroki

1. Kolejnym logicznym etapem po czyszczeniu Firebase powinno być osobne usunięcie Web Push z Release bez naruszenia komunikacji Firestore DataSlate panel GM → ekran gracza.
2. Po wdrożeniu własnego projektu Firebase należy wykonać ręczne testy integracyjne Firestore i RTDB: DataSlate GM → ekran gracza, Audio favorites/settings, NPC favorites, Character Creation save/load oraz wspólny loader DataVault/NPCGenerator.
3. Placeholdery celowo powodują stan wymagający konfiguracji do czasu wpisania wartości własnej grupy.
4. Neutralna nazwa named-app `wg-private-data` zmienia klucz lokalnej sesji Firebase względem prywatnego wdrożenia właściciela; po wpisaniu własnej konfiguracji użytkownik powinien zalogować się ponownie.
5. Neutralne makiety XLSX nadal wymagają dostarczenia i walidacji w osobnym etapie.
6. Pliki testowe, backupowe i robocze nadal wymagają osobnej decyzji lub czyszczenia przed finalną publiczną paczką.

## Aktualizacja — 2026-05-30 — tytuły kart przeglądarki

### Oryginalny pełny prompt użytkownika

```text
Trzeba zmienić tytuły kart, jakie są wyświetlane w przeglądarce.\nObecnie, po przetłumaczeniu, jest np "Goat Toolkit". Zmień to na "Cute Little Goat’s Toolbox"\nPodobnie w zakładce z kalkulatorami. Zamiast "Goat" itp ma być "Cute Little Goat’s"\nDodatkowo w zakładce "Audio" jest wciąż nazwa po polsku "Kozie Audio". Zmień na "Cute Little Goat’s Audio"\n\nDopisz tę zmianę do Release.md
```

### Zakres prac

Zmieniono tytuły kart przeglądarki w publicznej stronie głównej, stronie wejściowej Calculators oraz module Audio. Dopisano niniejszą sekcję do append-only dziennika Release. Nie zmieniano treści interfejsu, logiki modułów, konfiguracji Firebase ani pozostałych plików HTML.

### Ustalenia i wnioski

- `Main/index.html` nadal wyświetlał w karcie przeglądarki tytuł `Goat Toolkit`.
- `Calculators/index.html` nadal wyświetlał w karcie przeglądarki tytuł `Goat Calculators`.
- `Audio/index.html` nadal wyświetlał w karcie przeglądarki polski tytuł `Kozie Audio`.
- Zgodnie z nową decyzją właściciela publiczne tytuły tych kart mają używać formy dzierżawczej `Cute Little Goat’s`.

### Decyzje i wymagania

- Tytuł karty strony głównej ma brzmieć `Cute Little Goat’s Toolbox`.
- Tytuł karty strony wejściowej kalkulatorów ma brzmieć `Cute Little Goat’s Calculators`.
- Tytuł karty modułu Audio ma brzmieć `Cute Little Goat’s Audio`.
- Zakres tego zadania obejmuje wyłącznie wskazane tytuły kart przeglądarki.

### Zmienione pliki

- `Main/index.html` — zaktualizowano element `<title>` strony głównej.
- `Calculators/index.html` — zaktualizowano element `<title>` strony wejściowej kalkulatorów.
- `Audio/index.html` — zaktualizowano element `<title>` modułu Audio.
- `Analizy/Release.md` — dopisano niniejszą append-only sekcję dokumentującą zmianę.

### Szczegóły zmian w kodzie

- W `Main/index.html` zmieniono `<title>Goat Toolkit</title>` na `<title>Cute Little Goat’s Toolbox</title>`.
- W `Calculators/index.html` zmieniono `<title>Goat Calculators</title>` na `<title>Cute Little Goat’s Calculators</title>`.
- W `Audio/index.html` zmieniono `<title>Kozie Audio</title>` na `<title>Cute Little Goat’s Audio</title>`.

### Testy

- `rg -n '<title>Goat Toolkit</title>|<title>Goat Calculators</title>|<title>Kozie Audio</title>' Main Calculators Audio` — zaliczony: stare tytuły nie występują już we wskazanych modułach.
- Skrypt walidacyjny Python sprawdzający dokładnie po jednym oczekiwanym nowym elemencie `<title>` w `Main/index.html`, `Calculators/index.html` i `Audio/index.html` — zaliczony.
- `git diff --check` — zaliczony: brak błędów whitespace.
- `python3 -m http.server 8765` oraz skrypt walidacyjny Python pobierający strony przez HTTP — zaliczony: serwer zwrócił oczekiwane nowe tytuły dla `Main/index.html`, `Calculators/index.html` i `Audio/index.html`.

### Ryzyka i następne kroki

- Zmiana dotyczy wyłącznie tytułów kart przeglądarki. Nie zmieniano tekstów alternatywnych logo ani innych elementów brandingu, ponieważ nie należały do wskazanego zakresu.
- Pozostałe tytuły kart innych modułów mogą zostać ujednolicone w osobnym zadaniu, jeżeli właściciel wybierze dla nich docelowe brzmienie.

## Aktualizacja — 2026-05-30 — etap 4 Release: całkowite usunięcie Web Push

### Oryginalny pełny prompt użytkownika

> Uwaga redakcyjna dziennika: wiadomość użytkownika zawierała dwa identyczne wystąpienia poniższego promptu. Aby nie duplikować wielokrotnie tej samej treści w append-only dzienniku, zachowano pełną treść jednego wystąpienia i odnotowano, że drugie wystąpienie było jego dokładnym powtórzeniem.

```text
Pracujesz w repozytorium `WnG_Tools`.

Wykonaj czwarty etap prac Release: całkowite usunięcie Web Push z wersji Release bez naruszenia komunikacji Firestore DataSlate GM -> ekran gracza.

WAŻNE:
- Przed rozpoczęciem przeczytaj aktualne pliki:
  - `AGENTS.md`
  - `Analizy/Release.md`
- Nie modyfikuj żadnego pliku `AGENTS.md`.
- Nie usuwaj starszych sekcji z `Analizy/Release.md`.
- Po zakończeniu prac dopisz do `Analizy/Release.md` nową sekcję zgodną z instrukcjami z `AGENTS.md`.
- Nie usuwaj integracji Firebase.
- Nie usuwaj ani nie psuj komunikacji Firestore DataSlate GM -> ekran gracza.
- Nie usuwaj funkcji `Send`, `Ping`, `Clear message`, `Restore defaults` ani mechanizmu zapisu do dokumentu Firestore `dataslate/current`, o ile są częścią komunikacji DataSlate, a nie Web Push.
- Nie zmieniaj placeholderów Firebase, chyba że znajdziesz bezpośredni błąd powiązany z Web Push.
- Nie dodawaj neutralnych makiet XLSX.
- Nie tłumacz generowanych wyników `NameGenerator`.
- Nie usuwaj jeszcze starych plików testowych i backupowych DataSlate; one są przeznaczone do późniejszego etapu czyszczenia plików.
- Nie wykonuj zmian niezwiązanych z usunięciem Web Push.
- Nie commituj zmian, chyba że środowisko Codex wymaga tego jako sposobu oddania wyniku. Jeżeli commit jest wymagany, zrób jeden logiczny commit.

CEL ETAPU:
W publicznej wersji Release nie ma być funkcjonalności Web Push, konfiguracji Web Push, placeholderów Web Push, instrukcji Web Push, endpointów Web Push, kluczy VAPID, backendu Web Push ani UI sugerującego obsługę powiadomień push.

Jednocześnie DataSlate ma nadal działać jako narzędzie, w którym:
- panel GM zapisuje wiadomości do Firestore;
- ekran gracza odczytuje wiadomości z Firestore;
- ping DataSlate przez Firestore nadal działa, jeżeli jest częścią obecnego modelu DataSlate;
- audio i lokalne assety DataSlate pozostają.

ROZRÓŻNIENIE:
- Web Push = subskrypcje push, VAPID, Notification API, PushManager, service worker używany do powiadomień, endpointy `/api/push/subscribe`, `/api/push/trigger`, konfiguracje `web-push-config`.
- Firestore DataSlate = normalna komunikacja GM -> ekran gracza przez Firebase/Firestore. Tego nie wolno usuwać.
- Przycisk `Ping` w DataSlate nie jest automatycznie Web Push. Jeżeli zapisuje typ `ping` do Firestore i służy ekranowi gracza/audio, zostaw go.

ZAKRES PRAC

1. Inwentaryzacja Web Push

Wyszukaj w całym repozytorium wystąpienia związane z Web Push, w szczególności:

- `web-push`
- `webPush`
- `Web Push`
- `infWebPushConfig`
- `vapid`
- `VAPID`
- `subscribeEndpoint`
- `triggerEndpoint`
- `PushManager`
- `Notification`
- `serviceWorker`
- `service-worker`
- `navigator.serviceWorker`
- `push/subscribe`
- `push/trigger`
- `firebase-messaging`
- `messaging`
- `getToken`
- `onMessage`
- `wrathandglory-push-api`
- `tarczynski-pawel.workers.dev`

Nie przepisuj prawdziwych kluczy, endpointów ani URL-i do odpowiedzi ani do `Analizy/Release.md`. Opisuj je ogólnie, np. „usunięto aktywny endpoint Web Push”.

2. Usuń konfiguracje Web Push

Usuń z wersji Release pliki konfiguracyjne Web Push, jeżeli służą wyłącznie tej funkcji, w szczególności:

- `DataSlate/config/web-push-config.js`
- `DataSlate/config/web-push-config.production.example.js`

Jeżeli znajdziesz inne pliki konfiguracyjne Web Push, usuń je albo opisz, dlaczego muszą zostać.

Nie zastępuj Web Push placeholderami. Decyzja właściciela: Web Push nie jest funkcją opcjonalną Release, tylko funkcją do usunięcia.

3. Usuń odwołania skryptowe i importy

Usuń z HTML/JS wszystkie odwołania do plików Web Push, np.:

- `<script src="config/web-push-config.js"></script>`
- importy lub referencje do `web-push-config`
- inicjalizacje `window.infWebPushConfig`
- użycie `subscribeEndpoint`
- użycie `triggerEndpoint`
- użycie VAPID key.

Po usunięciu upewnij się, że nie zostają martwe zmienne, martwe funkcje, niedostępne skrypty ani błędy referencji.

4. Usuń logikę Web Push

Usuń logikę dotyczącą:

- proszenia o zgodę na powiadomienia przeglądarkowe;
- rejestracji subskrypcji push;
- wysyłania subskrypcji do backendu;
- triggerowania powiadomienia push po wysłaniu wiadomości przez GM;
- obsługi klucza VAPID;
- obsługi endpointów Web Push;
- service workera używanego wyłącznie do push;
- komunikatów statusu dotyczących push;
- UI dotyczącego aktywacji lub konfiguracji powiadomień push.

Jeżeli service worker albo plik zawierający `serviceWorker` służy także do czegoś innego niż Web Push, nie usuwaj go automatycznie. Usuń tylko część związaną z Web Push i opisz decyzję w `Analizy/Release.md`.

5. Usuń UI Web Push

Usuń albo zmień elementy interfejsu, które odnoszą się wyłącznie do Web Push, np.:

- przyciski typu „Enable push notifications”;
- checkboxy lub statusy Web Push;
- komunikaty o zgodzie na powiadomienia;
- instrukcje aktywacji powiadomień push;
- sekcje panelu GM służące wyłącznie push.

Nie usuwaj przycisku `Ping`, jeżeli działa przez Firestore i jest częścią normalnej komunikacji DataSlate.

6. Dokumentacja

Zaktualizuj dokumentację tylko w zakresie usunięcia Web Push.

Sprawdź i popraw w szczególności:

- `DataSlate/config/FirebaseREADME.md`
- `DataSlate/docs/README.md`
- `DataSlate/docs/Documentation.md`
- inne dokumentacje, jeżeli zawierają Web Push jako funkcję Release;
- `README.md`, jeżeli zawiera informację o Web Push;
- `DetaleLayout.md`, jeżeli zawiera instrukcje lub opisy dotyczące Web Push.

Dokumentacja po zmianie ma mówić, że:
- Release nie zawiera Web Push;
- konfiguracja Web Push nie jest wymagana;
- DataSlate nadal używa Firestore do komunikacji GM -> ekran gracza;
- zwykły ping/audio DataSlate, jeżeli istnieje, nie jest Web Push.

Nie dodawaj instrukcji konfiguracji Web Push.
Nie zostawiaj placeholderów Web Push.
Nie zostawiaj informacji sugerujących, że użytkownik może opcjonalnie uruchomić Web Push w publicznym Release.

7. Testy po zmianach

Po zakończeniu zmian wykonaj statyczne testy:

- `git status --short`;
- wyszukiwanie `web-push`;
- wyszukiwanie `webPush`;
- wyszukiwanie `Web Push`;
- wyszukiwanie `infWebPushConfig`;
- wyszukiwanie `vapid`;
- wyszukiwanie `VAPID`;
- wyszukiwanie `subscribeEndpoint`;
- wyszukiwanie `triggerEndpoint`;
- wyszukiwanie `PushManager`;
- wyszukiwanie `Notification`;
- wyszukiwanie `navigator.serviceWorker`;
- wyszukiwanie `push/subscribe`;
- wyszukiwanie `push/trigger`;
- wyszukiwanie `wrathandglory-push-api`;
- wyszukiwanie `tarczynski-pawel.workers.dev`;
- `git diff --check`.

Dla każdego pozostałego wystąpienia oceń i zapisz, czy:
- jest błędem i trzeba je usunąć;
- jest historycznym wpisem w `Analizy/Release.md`, którego nie wolno usuwać;
- jest ogólną wzmianką w `AGENTS.md`, którego nie wolno modyfikować;
- jest neutralnym, historycznym lub ostrzegawczym opisem, który powinien zostać;
- jest częścią innej funkcji niezwiązanej z Web Push.

Sprawdź, czy podstawowe strony nadal istnieją i dają się pobrać przez lokalny HTTP, jeżeli środowisko pozwala:

- `Main/index.html`
- `Audio/index.html`
- `DataVault/index.html`
- `DiceRoller/index.html`
- `NPCGenerator/index.html`
- `NameGenerator/index.html`
- `DataSlate/index.html`
- `DataSlate/GM.html`
- `DataSlate/DataSlate.html`
- `Calculators/index.html`
- `Calculators/XPCalculator.html`
- `Calculators/CharacterCreation.html`

Jeżeli środowisko pozwala, wykonaj statyczne sprawdzenie składni JS:

- `node --check DataVault/app.js`
- `node --check DiceRoller/script.js`
- `node --check NameGenerator/script.js`

Jeżeli zmieniasz jakikolwiek osobny plik JS związany z DataSlate, sprawdź go również przez `node --check`, o ile jest to możliwe dla tego typu pliku.

8. Kontrola DataSlate po usunięciu Web Push

Po zmianach upewnij się statycznie, że:

- `DataSlate/GM.html` nadal ładuje `config/firebase-config.js`;
- `DataSlate/GM.html` nadal ładuje Firebase App i Firestore;
- `DataSlate/GM.html` nadal zapisuje dane do Firestore;
- `DataSlate/DataSlate.html` nadal ładuje `config/firebase-config.js`;
- `DataSlate/DataSlate.html` nadal odczytuje dane z Firestore;
- dokument albo ścieżka `dataslate/current` nadal występuje tam, gdzie była częścią komunikacji DataSlate;
- funkcje wysyłania wiadomości i ping przez Firestore nie zostały usunięte.

Nie musisz wykonywać pełnego testu integracyjnego z prawdziwym Firebase, ponieważ konfiguracje są placeholderami. Opisz w `Analizy/Release.md`, że test integracyjny wymaga własnego projektu Firebase.

9. Aktualizacja `Analizy/Release.md`

Na końcu dopisz do `Analizy/Release.md` nową sekcję.

Sekcja musi zawierać:

- datę;
- pełny oryginalny prompt użytkownika;
- zakres prac;
- listę usuniętych plików Web Push;
- listę plików, w których usunięto odwołania Web Push;
- listę dokumentacji zaktualizowanej w zakresie usunięcia Web Push;
- opis usuniętych typów wartości prywatnych bez podawania samych wartości;
- informację, że nie dodano placeholderów Web Push;
- informację, że Web Push nie jest funkcją opcjonalną Release;
- informację, że integracja Firebase pozostała;
- informację, że Firestore DataSlate GM -> ekran gracza nie został naruszony;
- informację, że nie dodawano makiet XLSX;
- informację, że nie usuwano jeszcze starych plików testowych i backupowych DataSlate;
- wyniki testów;
- pozostałe ryzyka;
- następne kroki.

W następnych krokach zapisz, że po usunięciu Web Push logicznym kolejnym etapem będzie czyszczenie publicznej paczki z plików testowych, backupowych, `Old`, `Draft` i innych plików roboczych, w tym usunięcie zinwentaryzowanych starych plików DataSlate:
- `DataSlate/GM_test.html`
- `DataSlate/Infoczytnik_test.html`
- `DataSlate/GM_backup.html`
- `DataSlate/Infoczytnik_backup.html`

10. Wynik końcowy odpowiedzi

Na końcu odpowiedzi podaj krótkie podsumowanie:

- które pliki Web Push usunięto;
- z których plików usunięto odwołania Web Push;
- czy zostały jakieś wystąpienia fraz Web Push i dlaczego;
- czy Firestore DataSlate nadal jest zachowany;
- czego celowo nie ruszano;
- czy testy statyczne przeszły;
- jaki jest proponowany następny krok.
```

### Zakres prac

- Przeczytano aktualne `AGENTS.md` i `Analizy/Release.md` przed analizą oraz zmianami.
- Wykonano globalną inwentaryzację fraz i mechanizmów związanych z Web Push, w tym konfiguracji, klucza VAPID, endpointów backendu, subskrypcji, `Notification`, `PushManager`, service workerów i Firebase Messaging.
- Usunięto artefakty służące wyłącznie Web Push.
- Sprawdzono produkcyjne pliki `DataSlate/GM.html` i `DataSlate/DataSlate.html`. Nie zawierały one odwołań skryptowych, importów, UI ani aktywnej logiki Web Push wymagającej usunięcia.
- Zachowano integrację Firebase/Firestore DataSlate oraz lokalne audio i assety.
- Zaktualizowano dokumentację DataSlate wyłącznie w zakresie decyzji o usunięciu Web Push.
- Nie zmodyfikowano żadnego pliku `AGENTS.md`.

### Ustalenia i wnioski

- Publiczne produkcyjne ekrany DataSlate komunikują się przez Firestore: panel GM zapisuje payload do `dataslate/current`, a ekran gracza nasłuchuje tego dokumentu przez `onSnapshot`.
- Funkcja `Ping` nie jest Web Push. Panel GM zapisuje payload typu `ping` do Firestore, a ekran gracza odtwarza lokalny plik audio ping po odebraniu zmiany dokumentu.
- W produkcyjnych plikach HTML DataSlate nie było aktywnych odwołań do konfiguracji Web Push, backendu push, VAPID, `Notification`, `PushManager` ani service workera push. Nie było zatem martwych importów HTML/JS do usunięcia.
- Katalog backendu zawierał wyłącznie plik danych subskrypcji Web Push. Po jego usunięciu nie pozostał backend Web Push do publikacji.
- `Main/index.html` nadal zawiera neutralny mechanizm porządkowy wyrejestrowujący stare service workery. Został zachowany, ponieważ nie rejestruje powiadomień i służy migracyjnemu czyszczeniu starszych rejestracji aplikacji online-only. Powiązana dokumentacja `Main/docs/Documentation.md` pozostaje zgodna z tym zachowaniem.
- `messagingSenderId` w konfiguracjach Firebase pozostał bez zmian: jest standardowym polem Web SDK Firebase i nie stanowi aktywnej funkcjonalności Web Push.

### Decyzje i wymagania

- Web Push nie jest funkcją opcjonalną wersji Release. Został całkowicie usunięty zamiast zastąpienia wartości placeholderami.
- Nie dodano żadnych placeholderów Web Push.
- Integracja Firebase pozostała w repozytorium.
- Komunikacja Firestore DataSlate panel GM → ekran gracza przez `dataslate/current` nie została naruszona.
- Zachowano funkcje `Send`, `Ping`, `Clear message`, `Restore defaults`, zapis Firestore oraz odczyt Firestore.
- Nie dodawano neutralnych makiet XLSX.
- Nie tłumaczono generowanych wyników `NameGenerator`.
- Nie usuwano jeszcze starych plików testowych i backupowych DataSlate.

### Zmienione pliki

| Plik | Rodzaj zmiany |
| --- | --- |
| `DataSlate/config/web-push-config.js` | usunięto runtime konfigurację Web Push zawierającą klucz publiczny VAPID i aktywne endpointy prywatnej usługi właściciela |
| `DataSlate/config/web-push-config.production.example.js` | usunięto przykładową konfigurację Web Push, ponieważ Web Push nie jest opcją publicznego Release |
| `DataSlate/backend/data/subscriptions.json` | usunięto plik danych backendu przeznaczony wyłącznie dla subskrypcji Web Push |
| `DataSlate/config/FirebaseREADME.md` | dopisano informację PL/EN, że Release nie zawiera Web Push, nie wymaga konfiguracji push, a ping/audio pozostają funkcjami Firestore i lokalnych assetów |
| `DataSlate/docs/README.md` | dopisano informację użytkową PL/EN o braku Web Push i zachowaniu komunikacji Firestore, ping oraz audio |
| `DataSlate/docs/Documentation.md` | dopisano techniczne wyjaśnienie zakresu komunikacji Release |
| `Analizy/Release.md` | dopisano niniejszą append-only sekcję etapu 4 |

### Usunięte typy wartości prywatnych

- Usunięto publiczny klucz VAPID zapisany w konfiguracji Web Push.
- Usunięto aktywne endpointy prywatnej usługi backendowej Web Push właściciela.
- Usunięto plik danych subskrypcji przeznaczony wyłącznie dla backendu Web Push.
- Zgodnie z wymaganiem bezpieczeństwa nie zapisano w tej sekcji samych wartości klucza, endpointów ani prywatnych URL-i.

### Szczegóły zmian w kodzie

- Nie zmieniano kodu `DataSlate/GM.html`: produkcyjny panel GM już nie ładował konfiguracji Web Push ani nie triggerował backendu push. Nadal ładuje `config/firebase-config.js`, Firebase App i Firestore; nadal zapisuje wiadomości oraz ping do `dataslate/current`.
- Nie zmieniano kodu `DataSlate/DataSlate.html`: produkcyjny ekran gracza już nie subskrybował Web Push. Nadal ładuje `config/firebase-config.js`, Firebase App i Firestore; nadal nasłuchuje `dataslate/current`, czyści komunikat dla typu `clear`, odtwarza lokalny ping dla typu `ping` i audio wiadomości dla typu `message`.
- Nie zmieniano placeholderów Firebase.
- Nie zmieniano `Main/index.html`: zachowano niezależny mechanizm czyszczenia starych service workerów, ponieważ nie publikuje on ani nie aktywuje Web Push.

### Ocena pozostałych wystąpień fraz

- `Analizy/Release.md` zawiera historyczne wpisy, wcześniejsze analizy, decyzje i niniejszą dokumentację etapu. Zgodnie z regułą append-only nie wolno ich usuwać.
- `AGENTS.md` zawiera ogólne wymagania Release dotyczące usunięcia Web Push. Pliku nie wolno modyfikować.
- `DataSlate/config/FirebaseREADME.md`, `DataSlate/docs/README.md` i `DataSlate/docs/Documentation.md` zawierają neutralne, ostrzegawcze informacje, że Release nie zawiera Web Push i że zwykły ping/audio nie są Web Push. Te wzmianki powinny pozostać.
- `DetaleLayout.md` zawiera historyczny opis wcześniejszego dodania i późniejszego usunięcia CTA powiadomień w Main. Nie jest instrukcją uruchomienia Web Push ani aktywną konfiguracją; zachowano go jako historyczny dziennik layoutu.
- `Main/index.html` i `Main/docs/Documentation.md` zawierają neutralne czyszczenie starszych rejestracji service workerów dla aplikacji online-only. Nie jest to rejestracja ani obsługa Web Push.
- Pola `messagingSenderId` w konfiguracjach Firebase są standardową częścią neutralnych placeholderów Firebase Web SDK i nie są aktywną obsługą Web Push.
- Trafienia `Notification` w komentarzach slotu ikony powiadomienia DataVault/NPCGenerator oraz fragmenty nazw typu `validationMessages` nie są funkcjonalnością Web Push.
- Poza powyższymi kategoriami nie pozostały aktywne konfiguracje, klucze VAPID, endpointy, backend, subskrypcje, importy ani UI Web Push.

### Testy

- `git status --short` — wykonano przed zmianami i po zmianach; przed zmianami drzewo było czyste, po zmianach widoczne są wyłącznie celowe usunięcia, aktualizacje dokumentacji oraz niniejsza aktualizacja dziennika.
- Wykonano osobne wyszukiwania `rg -n -F` dla: `web-push`, `webPush`, `Web Push`, `infWebPushConfig`, `vapid`, `VAPID`, `subscribeEndpoint`, `triggerEndpoint`, `PushManager`, `Notification`, `navigator.serviceWorker`, `push/subscribe`, `push/trigger`, `wrathandglory-push-api`, `tarczynski-pawel.workers.dev` — aktywne wartości Web Push usunięto; pozostałe wyniki sklasyfikowano powyżej.
- `rg -n -i 'serviceWorker|service-worker|firebase-messaging|messaging|getToken|onMessage' --glob '!AGENTS.md' --glob '!Analizy/Release.md' .` — sprawdzono dodatkowe frazy; pozostały neutralne placeholdery Firebase `messagingSenderId` oraz mechanizm czyszczenia dawnych service workerów Main.
- Skrypt statycznych asercji Python dla `DataSlate/GM.html` i `DataSlate/DataSlate.html` — zaliczony: potwierdzono konfigurację Firebase, Firebase App, Firestore, `dataslate/current`, zapis wiadomości, zapis ping, `send`, `ping`, `restoreDefaults`, `onSnapshot`, obsługę `ping` i obsługę `clear`.
- `node --check DataVault/app.js` — zaliczony.
- `node --check DiceRoller/script.js` — zaliczony.
- `node --check NameGenerator/script.js` — zaliczony.
- `python3 -m http.server 8765` oraz skrypt Python pobierający strony — zaliczony: HTTP 200 dla wszystkich 12 wymaganych stron wejściowych: `Main/index.html`, `Audio/index.html`, `DataVault/index.html`, `DiceRoller/index.html`, `NPCGenerator/index.html`, `NameGenerator/index.html`, `DataSlate/index.html`, `DataSlate/GM.html`, `DataSlate/DataSlate.html`, `Calculators/index.html`, `Calculators/XPCalculator.html`, `Calculators/CharacterCreation.html`.
- `git diff --check` — zaliczony: brak błędów whitespace.
- Nie wykonano pełnego testu integracyjnego z prawdziwym Firestore, ponieważ wersja Release celowo zawiera placeholdery Firebase. Test integracyjny wymaga własnego projektu Firebase grupy.

### Ryzyka i następne kroki

1. Po wpisaniu własnej konfiguracji Firebase należy wykonać ręczny test integracyjny dwóch ekranów: wysłanie wiadomości GM → ekran gracza, `Ping`, `Clear message`, `Restore defaults`, audio wiadomości oraz lokalne assety.
2. Logiczny kolejny etap to czyszczenie publicznej paczki z plików testowych, backupowych, `Old`, `Draft` i innych plików roboczych.
3. W kolejnym etapie należy usunąć zinwentaryzowane stare pliki DataSlate:
   - `DataSlate/GM_test.html`;
   - `DataSlate/Infoczytnik_test.html`;
   - `DataSlate/GM_backup.html`;
   - `DataSlate/Infoczytnik_backup.html`.
4. Neutralne makiety XLSX nadal pozostają osobnym późniejszym etapem.
