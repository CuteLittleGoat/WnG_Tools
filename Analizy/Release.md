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

## Aktualizacja — 2026-05-30 — angielska bramka dostępu DataVault i NPCGenerator

### Oryginalny pełny prompt użytkownika

Pracujesz w repozytorium `WnG_Tools`.

Wykonaj małą poprawkę błędu językowego bramki dostępu do prywatnych danych.

KONTEKST:
Po etapie Release aplikacja ma domyślnie działać po angielsku. Obecnie ekran hasła / access gate w `DataVault` i `NPCGenerator` wyświetla polskie teksty:
- „Dostęp do danych z klauzulą tajności K.O.Z.A.”
- „Dane są zapieczętowane protokołami Ducha Maszyny...”
- „Litania Dostępu”
- „Rozpocznij Rytuał”

To jest błąd. Bramka dostępu ma być powiązana z aktualną wersją językową modułu i domyślnie wyświetlać się po angielsku.

WAŻNE:
- Przed rozpoczęciem przeczytaj:
  - `AGENTS.md`
  - `Analizy/Release.md`
- Nie modyfikuj żadnego pliku `AGENTS.md`.
- Nie przywracaj prywatnej konfiguracji Firebase właściciela.
- Nie wpisuj prawdziwych kluczy Firebase ani prawdziwego e-maila technicznego.
- Nie próbuj naprawiać hasła przez podłączenie repo do prywatnego Firebase.
- Nie zmieniaj Web Push.
- Nie usuwaj plików testowych ani backupowych.
- Nie wykonuj zmian niezwiązanych z bramką dostępu.
- Po zakończeniu dopisz krótką aktualizację do `Analizy/Release.md`.

CEL:
Bramka dostępu w `DataVault` i `NPCGenerator` ma:
- domyślnie pokazywać teksty po angielsku;
- przełączać teksty razem z selektorem języka EN/PL;
- nadal pokazywać polską wersję po wybraniu `Polski`;
- pokazywać komunikaty błędów w aktualnym języku;
- przy placeholderach Firebase pokazywać zrozumiały angielski komunikat, że konfiguracja Firebase nie jest ustawiona.

PLIKI DO SPRAWDZENIA I POPRAWY:
- `DataVault/index.html`
- `DataVault/app.js`
- `NPCGenerator/index.html`
- główny plik JS modułu `NPCGenerator`, w którym znajdują się `translations`, `currentLanguage`, `applyLanguage` albo odpowiednik tej logiki
- `shared/firebase-data-loader.js`, tylko jeżeli trzeba doprecyzować angielski komunikat błędu dla placeholderów; nie zmieniaj logiki logowania bez potrzeby

ZADANIA:

1. Popraw domyślne teksty HTML bramki dostępu w:
   - `DataVault/index.html`
   - `NPCGenerator/index.html`

   Domyślna treść HTML ma być po angielsku, na przykład:
   - `Access to K.O.Z.A. classified data`
   - `The data is sealed by Machine Spirit protocols. Enter the Access Litany to begin the Rite of Authentication.`
   - `Access Litany`
   - `Begin Rite`

   Dzięki temu, jeśli JS nie zdąży się wykonać albo pojawi się wczesny błąd konfiguracji, użytkownik nie zobaczy polskiego overlayu w domyślnej wersji Release.

2. Dodaj brakujące klucze tłumaczeń do słowników PL/EN w `DataVault/app.js`:
   - `accessTitle`
   - `accessDescription`
   - `accessPasswordLabel`
   - `accessUnlockButton`

   Wersja EN ma odpowiadać domyślnym tekstom HTML.
   Wersja PL może zachować obecny styl:
   - `Dostęp do danych z klauzulą tajności K.O.Z.A.`
   - `Dane są zapieczętowane protokołami Ducha Maszyny. Wprowadź Litanię Dostępu, aby rozpocząć Rytuał Uwierzytelnienia.`
   - `Litania Dostępu`
   - `Rozpocznij Rytuał`

3. Wykonaj analogiczną poprawkę w module `NPCGenerator`:
   - dodaj te same klucze do jego systemu tłumaczeń;
   - upewnij się, że `applyLanguage("en")` albo równoważna inicjalizacja obejmuje elementy bramki dostępu z `data-i18n`.

4. Upewnij się, że zmiana języka przez selektor działa także na otwartej bramce dostępu:
   - EN pokazuje angielskie teksty bramki;
   - PL pokazuje polskie teksty bramki;
   - ponowny powrót do EN znowu pokazuje angielskie teksty.

5. Sprawdź komunikaty błędów:
   - `shared/firebase-data-loader.js` już ma funkcję `getReadableAccessError(error, lang)`.
   - Nie zmieniaj jej logiki, jeżeli działa poprawnie.
   - Upewnij się tylko, że `DataVault` i `NPCGenerator` wywołują ją z aktualnym językiem, np. `currentLanguage`.
   - Przy placeholderach Firebase aplikacja ma pokazać angielski komunikat konfiguracji, a nie polski tekst domyślny bramki.

6. Nie naprawiaj hasła przez przywracanie prywatnego Firebase:
   - obecne placeholdery w `shared/firebase-config.js` oznaczają, że publiczna wersja nie jest połączona z Firebase właściciela;
   - to jest zgodne z celem Release;
   - prawdziwe hasło z prywatnego projektu nie będzie działać, dopóki użytkownik nie skonfiguruje własnego Firebase albo lokalnie nie podstawi własnych wartości.

TESTY:
Po zmianach wykonaj:
- `git status --short`
- wyszukiwanie tekstu `Dostęp do danych z klauzulą tajności K.O.Z.A.`
- wyszukiwanie tekstu `Litania Dostępu`
- wyszukiwanie tekstu `Rozpocznij Rytuał`
- wyszukiwanie kluczy:
  - `accessTitle`
  - `accessDescription`
  - `accessPasswordLabel`
  - `accessUnlockButton`
- `node --check DataVault/app.js`
- analogiczny `node --check` dla głównego pliku JS `NPCGenerator`, jeżeli plik nadaje się do sprawdzenia przez Node
- `git diff --check`

Jeżeli polskie teksty bramki pozostają w słowniku `pl`, to jest poprawne. Błędem jest tylko sytuacja, w której domyślny ekran Release po angielsku pokazuje polskie teksty.

AKTUALIZACJA `Analizy/Release.md`:
Na końcu dopisz nową sekcję zawierającą:
- datę;
- pełny prompt użytkownika;
- opis błędu;
- przyczynę błędu;
- listę zmienionych plików;
- informację, że bramka dostępu domyślnie jest teraz po angielsku;
- informację, że bramka jest powiązana z selektorem języka;
- informację, że hasło nie działa z placeholderami Firebase, ponieważ publiczna wersja nie jest już połączona z prywatnym Firebase właściciela;
- informację, że nie przywracano prywatnej konfiguracji Firebase;
- wyniki testów;
- ryzyka i następne kroki.

WYNIK:
Na końcu odpowiedzi podaj krótkie podsumowanie:
- co zmieniono;
- czy bramka startuje po angielsku;
- czy przełącznik EN/PL działa na bramce;
- czy hasło nadal wymaga prawdziwej konfiguracji Firebase;
- czy testy statyczne przeszły.
Pracujesz w repozytorium `WnG_Tools`.

Wykonaj małą poprawkę błędu językowego bramki dostępu do prywatnych danych.

KONTEKST:
Po etapie Release aplikacja ma domyślnie działać po angielsku. Obecnie ekran hasła / access gate w `DataVault` i `NPCGenerator` wyświetla polskie teksty:
- „Dostęp do danych z klauzulą tajności K.O.Z.A.”
- „Dane są zapieczętowane protokołami Ducha Maszyny...”
- „Litania Dostępu”
- „Rozpocznij Rytuał”

To jest błąd. Bramka dostępu ma być powiązana z aktualną wersją językową modułu i domyślnie wyświetlać się po angielsku.

WAŻNE:
- Przed rozpoczęciem przeczytaj:
  - `AGENTS.md`
  - `Analizy/Release.md`
- Nie modyfikuj żadnego pliku `AGENTS.md`.
- Nie przywracaj prywatnej konfiguracji Firebase właściciela.
- Nie wpisuj prawdziwych kluczy Firebase ani prawdziwego e-maila technicznego.
- Nie próbuj naprawiać hasła przez podłączenie repo do prywatnego Firebase.
- Nie zmieniaj Web Push.
- Nie usuwaj plików testowych ani backupowych.
- Nie wykonuj zmian niezwiązanych z bramką dostępu.
- Po zakończeniu dopisz krótką aktualizację do `Analizy/Release.md`.

CEL:
Bramka dostępu w `DataVault` i `NPCGenerator` ma:
- domyślnie pokazywać teksty po angielsku;
- przełączać teksty razem z selektorem języka EN/PL;
- nadal pokazywać polską wersję po wybraniu `Polski`;
- pokazywać komunikaty błędów w aktualnym języku;
- przy placeholderach Firebase pokazywać zrozumiały angielski komunikat, że konfiguracja Firebase nie jest ustawiona.

PLIKI DO SPRAWDZENIA I POPRAWY:
- `DataVault/index.html`
- `DataVault/app.js`
- `NPCGenerator/index.html`
- główny plik JS modułu `NPCGenerator`, w którym znajdują się `translations`, `currentLanguage`, `applyLanguage` albo odpowiednik tej logiki
- `shared/firebase-data-loader.js`, tylko jeżeli trzeba doprecyzować angielski komunikat błędu dla placeholderów; nie zmieniaj logiki logowania bez potrzeby

ZADANIA:

1. Popraw domyślne teksty HTML bramki dostępu w:
   - `DataVault/index.html`
   - `NPCGenerator/index.html`

   Domyślna treść HTML ma być po angielsku, na przykład:
   - `Access to K.O.Z.A. classified data`
   - `The data is sealed by Machine Spirit protocols. Enter the Access Litany to begin the Rite of Authentication.`
   - `Access Litany`
   - `Begin Rite`

   Dzięki temu, jeśli JS nie zdąży się wykonać albo pojawi się wczesny błąd konfiguracji, użytkownik nie zobaczy polskiego overlayu w domyślnej wersji Release.

2. Dodaj brakujące klucze tłumaczeń do słowników PL/EN w `DataVault/app.js`:
   - `accessTitle`
   - `accessDescription`
   - `accessPasswordLabel`
   - `accessUnlockButton`

   Wersja EN ma odpowiadać domyślnym tekstom HTML.
   Wersja PL może zachować obecny styl:
   - `Dostęp do danych z klauzulą tajności K.O.Z.A.`
   - `Dane są zapieczętowane protokołami Ducha Maszyny. Wprowadź Litanię Dostępu, aby rozpocząć Rytuał Uwierzytelnienia.`
   - `Litania Dostępu`
   - `Rozpocznij Rytuał`

3. Wykonaj analogiczną poprawkę w module `NPCGenerator`:
   - dodaj te same klucze do jego systemu tłumaczeń;
   - upewnij się, że `applyLanguage("en")` albo równoważna inicjalizacja obejmuje elementy bramki dostępu z `data-i18n`.

4. Upewnij się, że zmiana języka przez selektor działa także na otwartej bramce dostępu:
   - EN pokazuje angielskie teksty bramki;
   - PL pokazuje polskie teksty bramki;
   - ponowny powrót do EN znowu pokazuje angielskie teksty.

5. Sprawdź komunikaty błędów:
   - `shared/firebase-data-loader.js` już ma funkcję `getReadableAccessError(error, lang)`.
   - Nie zmieniaj jej logiki, jeżeli działa poprawnie.
   - Upewnij się tylko, że `DataVault` i `NPCGenerator` wywołują ją z aktualnym językiem, np. `currentLanguage`.
   - Przy placeholderach Firebase aplikacja ma pokazać angielski komunikat konfiguracji, a nie polski tekst domyślny bramki.

6. Nie naprawiaj hasła przez przywracanie prywatnego Firebase:
   - obecne placeholdery w `shared/firebase-config.js` oznaczają, że publiczna wersja nie jest połączona z Firebase właściciela;
   - to jest zgodne z celem Release;
   - prawdziwe hasło z prywatnego projektu nie będzie działać, dopóki użytkownik nie skonfiguruje własnego Firebase albo lokalnie nie podstawi własnych wartości.

TESTY:
Po zmianach wykonaj:
- `git status --short`
- wyszukiwanie tekstu `Dostęp do danych z klauzulą tajności K.O.Z.A.`
- wyszukiwanie tekstu `Litania Dostępu`
- wyszukiwanie tekstu `Rozpocznij Rytuał`
- wyszukiwanie kluczy:
  - `accessTitle`
  - `accessDescription`
  - `accessPasswordLabel`
  - `accessUnlockButton`
- `node --check DataVault/app.js`
- analogiczny `node --check` dla głównego pliku JS `NPCGenerator`, jeżeli plik nadaje się do sprawdzenia przez Node
- `git diff --check`

Jeżeli polskie teksty bramki pozostają w słowniku `pl`, to jest poprawne. Błędem jest tylko sytuacja, w której domyślny ekran Release po angielsku pokazuje polskie teksty.

AKTUALIZACJA `Analizy/Release.md`:
Na końcu dopisz nową sekcję zawierającą:
- datę;
- pełny prompt użytkownika;
- opis błędu;
- przyczynę błędu;
- listę zmienionych plików;
- informację, że bramka dostępu domyślnie jest teraz po angielsku;
- informację, że bramka jest powiązana z selektorem języka;
- informację, że hasło nie działa z placeholderami Firebase, ponieważ publiczna wersja nie jest już połączona z prywatnym Firebase właściciela;
- informację, że nie przywracano prywatnej konfiguracji Firebase;
- wyniki testów;
- ryzyka i następne kroki.

WYNIK:
Na końcu odpowiedzi podaj krótkie podsumowanie:
- co zmieniono;
- czy bramka startuje po angielsku;
- czy przełącznik EN/PL działa na bramce;
- czy hasło nadal wymaga prawdziwej konfiguracji Firebase;
- czy testy statyczne przeszły.

### Zakres prac

- Przeczytano `AGENTS.md` i aktualny dziennik `Analizy/Release.md` przed rozpoczęciem zmian.
- Sprawdzono domyślny markup HTML bramki dostępu, słowniki PL/EN, inicjalizację `currentLanguage`, funkcje `applyLanguage`, obsługę selektora języka oraz wywołania `getReadableAccessError(error, currentLanguage)` w `DataVault` i `NPCGenerator`.
- Zmieniono wyłącznie pliki związane z bramką dostępu oraz niniejszy dziennik Release. Nie zmieniano Web Push, plików testowych, backupów ani konfiguracji Firebase właściciela.

### Ustalenia i wnioski

- Błąd `DataVault` miał dwie przyczyny: domyślny markup HTML overlayu pozostawał po polsku, a słowniki `translations.pl.labels` i `translations.en.labels` nie zawierały kluczy `accessTitle`, `accessDescription`, `accessPasswordLabel` oraz `accessUnlockButton`. Funkcja `applyLanguage` przeglądała elementy `[data-i18n]`, ale nie mogła zaktualizować elementów bramki bez brakujących kluczy.
- `NPCGenerator` miał już klucze PL/EN oraz poprawne przejście po wszystkich elementach `[data-i18n]` w `applyLanguage`, lecz domyślny markup HTML overlayu nadal był zapisany po polsku. Ujednolicono angielską treść słownika z nowym domyślnym markupem.
- W `NPCGenerator/index.html` poprawiono również osadzony markup bramki znajdujący się w generowanym HTML karty, aby w tym samym pliku nie pozostawał drugi domyślny polski wariant overlayu.
- Oba moduły już przekazywały aktualny `currentLanguage` do `getReadableAccessError`; zachowano ten model.
- Publiczne placeholdery `INSERT_YOUR_*` były wartościami niepustymi, więc wcześniejsza walidacja mogła próbować inicjalizować Firebase zamiast od razu wyświetlić czytelny komunikat o braku konfiguracji. Dodano małą walidację placeholderów przed inicjalizacją Firebase i czytelny komunikat PL/EN.

### Decyzje i wymagania

- Domyślny markup HTML bramki dostępu jest teraz po angielsku, dzięki czemu ekran Release nie miga polskim overlayem przed wykonaniem JavaScriptu ani przy wczesnym błędzie konfiguracji.
- Bramka pozostaje powiązana z istniejącym selektorem języka. `English` pokazuje teksty angielskie, `Polski` pokazuje zachowane teksty polskie, a ponowny wybór `English` przywraca teksty angielskie.
- Hasło nie działa z placeholderami Firebase, ponieważ publiczna wersja nie jest już połączona z prywatnym Firebase właściciela. Aby uruchomić dostęp do prywatnych danych, nowa grupa musi podać własne ustawienia Firebase oraz własny techniczny e-mail dostępu.
- Nie przywracano prywatnej konfiguracji Firebase właściciela, prawdziwych kluczy ani prawdziwego technicznego e-maila.

### Zmienione pliki

| Plik | Opis |
| --- | --- |
| `DataVault/index.html` | Zmieniono domyślną treść HTML bramki z polskiej na angielską. |
| `DataVault/app.js` | Dodano brakujące klucze tłumaczeń bramki w słownikach PL/EN; istniejący `applyLanguage` obejmuje teraz overlay przez `[data-i18n]`. |
| `NPCGenerator/index.html` | Zmieniono domyślną treść HTML bramki na angielską, ujednolicono angielskie wpisy istniejącego słownika oraz poprawiono osadzony markup generowanego HTML karty. |
| `shared/firebase-data-loader.js` | Dodano wykrywanie publicznych placeholderów `INSERT_YOUR_*` i czytelny komunikat PL/EN, że Firebase nie jest skonfigurowane. Nie zmieniano logiki logowania hasłem. |
| `Analizy/Release.md` | Dopisano niniejszą append-only sekcję. |

### Szczegóły zmian w kodzie

- `DataVault/index.html`: statyczny overlay używa teraz tekstów `Access to K.O.Z.A. classified data`, `The data is sealed by Machine Spirit protocols. Enter the Access Litany to begin the Rite of Authentication.`, `Access Litany` i `Begin Rite`.
- `DataVault/app.js`: słowniki `pl.labels` i `en.labels` zawierają cztery klucze bramki. Istniejąca funkcja `applyLanguage` aktualizuje wszystkie elementy `[data-i18n]`, więc przełączanie EN → PL → EN działa również wtedy, gdy overlay jest otwarty.
- `NPCGenerator/index.html`: statyczny overlay oraz odpowiadające mu angielskie tłumaczenia używają tych samych tekstów co DataVault. Istniejąca funkcja `applyLanguage` nadal aktualizuje wszystkie elementy `[data-i18n]`, a obsługa błędów nadal wywołuje `getReadableAccessError(error, currentLanguage)`.
- `shared/firebase-data-loader.js`: walidacja runtime wykrywa pozostawione wartości `INSERT_YOUR_*` i zwraca błąd `FIREBASE_CONFIG_NOT_CONFIGURED`; `getReadableAccessError` mapuje go na czytelny komunikat w aktualnym języku.

### Testy

- `git status --short` — wykonano po zmianach; pokazał wyłącznie oczekiwane modyfikacje plików związanych z bramką i loaderem przed dopisaniem niniejszego dziennika.
- `rg -n -F 'Dostęp do danych z klauzulą tajności K.O.Z.A.' DataVault NPCGenerator shared || true` — wykonano; polski tekst pozostał wyłącznie w słownikach PL i dokumentacji modułów, co jest oczekiwane.
- `rg -n -F 'Litania Dostępu' DataVault NPCGenerator shared || true` — wykonano; polski tekst pozostał w słownikach PL, polskich komunikatach błędów i dokumentacji modułów, co jest oczekiwane.
- `rg -n -F 'Rozpocznij Rytuał' DataVault NPCGenerator shared || true` — wykonano; polski tekst pozostał w słownikach PL i dokumentacji modułów, co jest oczekiwane.
- `rg -n 'accessTitle|accessDescription|accessPasswordLabel|accessUnlockButton' DataVault NPCGenerator` — wykonano; potwierdzono komplet kluczy PL/EN oraz angielski markup domyślny.
- `node --check DataVault/app.js` — zaliczony.
- Ekstrakcja jedynego inline `<script>` z `NPCGenerator/index.html` do `/tmp/NPCGenerator-inline-script.js` oraz `node --check /tmp/NPCGenerator-inline-script.js` — zaliczone. Główna logika NPCGenerator jest skryptem inline, a nie osobnym plikiem JS.
- Statyczny skrypt asercji Python — zaliczony: potwierdzono angielski markup domyślny, słowniki PL/EN, `currentLanguage = "en"`, przejście po `[data-i18n]`, przekazywanie aktualnego języka do `getReadableAccessError` i czytelny komunikat placeholderów Firebase.
- `git diff --check` — zaliczony: brak błędów whitespace.
- `python3 -m http.server 8765` oraz `curl` dla `DataVault/index.html` i `NPCGenerator/index.html` — zaliczone: obie strony zwróciły HTTP 200 i zawierały angielski domyślny tytuł bramki.
- Nie wykonano zrzutu ekranu przeglądarki: środowisko nie zawiera binariów Chromium, Chrome ani Firefox oraz nie ma zainstalowanego Playwright/Puppeteer.

### Ryzyka i następne kroki

1. Pełny test integracyjny logowania wymaga własnego projektu Firebase nowej grupy, własnego technicznego e-maila oraz poprawnie skonfigurowanych reguł dostępu. Publiczne placeholdery celowo nie pozwalają zalogować się do prywatnej infrastruktury właściciela.
2. Po podaniu własnej konfiguracji Firebase należy ręcznie sprawdzić oba moduły w przeglądarce: otwarcie overlayu, EN → PL → EN, pustą Litanię Dostępu, błędne hasło, poprawne hasło i ładowanie danych.
3. Nie wykonano zmian w Web Push, backupach ani plikach testowych.

## Aktualizacja — 2026-05-30 — zmiana etykiety przycisku Main z `Map` na `VTT`

### Oryginalny pełny prompt użytkownika

```text
W module Main zmień nazwę przycisku "Map" na "VTT".\nW placeholderze zmień _YOUR_MAP_ na _YOUR_VTT_
```

### Zakres prac

W module `Main` zmieniono publiczną etykietę przycisku prowadzącego do zewnętrznego narzędzia mapowego z `Map` na `VTT`. Zmieniono również publiczny placeholder adresu URL z `INSERT_YOUR_MAP_LINK` na `INSERT_YOUR_VTT_LINK` oraz zaktualizowano dokumentację modułu tak, aby opisywała aktualną etykietę interfejsu.

### Ustalenia i wnioski

- Przycisk nadal korzysta z istniejącego atrybutu technicznego `data-map-link` i z istniejącego klucza konfiguracyjnego `Map:`. Nie zmieniono parsera ani logiki dynamicznego ładowania adresu URL, ponieważ zadanie dotyczy etykiety przycisku i treści placeholdera.
- Publiczny placeholder ma teraz postać `INSERT_YOUR_VTT_LINK`.
- Starsze sekcje niniejszego dziennika pozostają niezmienione jako historyczny zapis wcześniejszych etapów Release.

### Decyzje i wymagania

- Publiczna nazwa przycisku w `Main` to od tej aktualizacji `VTT`.
- Placeholder adresu dla tego przycisku musi używać członu `_YOUR_VTT_`, a nie `_YOUR_MAP_`.

### Zmienione pliki

| Plik | Opis zmiany |
| --- | --- |
| `Main/index.html` | Zmieniono widoczną etykietę przycisku `Map` na `VTT` i uaktualniono komentarz wdrożeniowy przy przycisku. |
| `Main/ZmienneHiperlacza.md` | Zmieniono placeholder `INSERT_YOUR_MAP_LINK` na `INSERT_YOUR_VTT_LINK`. |
| `Main/docs/README.md` | Zaktualizowano instrukcję użytkową PL/EN: nazwa przycisku to teraz `VTT`, a placeholder to `INSERT_YOUR_VTT_LINK`. |
| `Main/docs/Documentation.md` | Zaktualizowano techniczne opisy widocznego przycisku na `VTT`, pozostawiając udokumentowane klucze parsera `Map`/`Images`. |
| `Analizy/Release.md` | Dopisano niniejszy wpis dziennika Release. |

### Szczegóły zmian w kodzie

- `Main/index.html`: widoczny tekst odnośnika zmieniono z `Map` na `VTT`; komentarz obok odnośnika również wskazuje teraz nazwę `VTT`. Techniczny selektor `data-map-link` pozostaje bez zmian, dzięki czemu istniejąca logika dynamicznych linków działa tak samo jak wcześniej.
- `Main/ZmienneHiperlacza.md`: przy zachowaniu klucza `Map:` przykładową wartość zmieniono na `INSERT_YOUR_VTT_LINK`.
- Dokumentacja modułu: opisy przycisku i instrukcje podmiany placeholdera dostosowano do publicznej terminologii `VTT`.

### Testy

- Wyszukano `INSERT_YOUR_MAP_LINK` i `_YOUR_MAP_` w katalogu `Main`; stare warianty nie występują już w bieżących plikach modułu.
- Wyszukano `VTT` i `INSERT_YOUR_VTT_LINK` w katalogu `Main`; potwierdzono nową etykietę przycisku, komentarz wdrożeniowy, placeholder oraz aktualizacje dokumentacji.
- Wykonano `git diff --check`; nie wykryto błędów whitespace.
- Uruchomiono `python3 -m http.server 8768`, pobrano przez `curl` pliki `Main/index.html` oraz `Main/ZmienneHiperlacza.md` i potwierdzono odpowiednio widoczną etykietę `VTT` oraz wpis `Map: INSERT_YOUR_VTT_LINK`.
- Nie wykonano zrzutu ekranu zmiany: środowisko nie zawiera binariów Chromium, Chrome ani Firefox oraz nie ma zainstalowanego Playwright/Puppeteer.

### Ryzyka i następne kroki

- Klucz konfiguracyjny `Map:` oraz techniczny atrybut `data-map-link` celowo pozostają bez zmian dla zachowania kompatybilności i minimalnego zakresu modyfikacji. Jeżeli właściciel zdecyduje o pełnej migracji nazw technicznych na `VTT`, należy osobno rozszerzyć parser i zaktualizować konfigurację.

## Aktualizacja — 2026-05-30 — zachowanie pomocniczych plików testowych i backupowych DataSlate

### Oryginalny pełny prompt użytkownika

Prompt został przesłany dwukrotnie w identycznym brzmieniu. Poniżej zapisano pełną treść jednego z dwóch identycznych bloków, bez skracania:

```text
Pracujesz w repozytorium `WnG_Tools`.

Wykonaj porządkowe domknięcie aktualnego etapu Release po zmianie wymagań dotyczących plików testowych i backupowych DataSlate.

WAŻNE:
- Przed rozpoczęciem przeczytaj aktualne pliki:
  - `AGENTS.md`
  - `Analizy/Release.md`
- Tym razem WOLNO zmodyfikować `AGENTS.md`, ponieważ użytkownik wyraźnie zmienił wymaganie projektowe i poprosił o zapisanie go w instrukcjach.
- Nie usuwaj starszych sekcji z `Analizy/Release.md`.
- Po zakończeniu prac dopisz do `Analizy/Release.md` nową sekcję zgodną z instrukcjami z `AGENTS.md`.
- Nie usuwaj plików testowych i backupowych DataSlate.
- Nie czyść teraz Firebase.
- Nie zmieniaj teraz Web Push, chyba że znajdziesz martwą wzmiankę w dokumentacji związaną bezpośrednio z bieżącym porządkiem.
- Nie dodawaj neutralnych makiet XLSX.
- Nie tłumacz generowanych wyników `NameGenerator`.
- Nie wykonuj dużego refaktoru.
- Nie commituj zmian, chyba że środowisko Codex wymaga tego jako sposobu oddania wyniku. Jeżeli commit jest wymagany, zrób jeden logiczny commit.

NOWA DECYZJA WŁAŚCICIELA:
Wymaganie dotyczące starych plików testowych i backupowych DataSlate ulega zmianie.

Pliki testowe i backupowe w katalogu `DataSlate/` mają POZOSTAĆ w wersji Release. Mają służyć innym użytkownikom jako materiał do testowania własnych modyfikacji i jako punkt odniesienia przy eksperymentach.

W szczególności NIE WOLNO usuwać:
- `DataSlate/GM_test.html`
- `DataSlate/Infoczytnik_test.html`
- `DataSlate/GM_backup.html`
- `DataSlate/Infoczytnik_backup.html`

Jeżeli w dokumentacji lub `AGENTS.md` istnieją starsze zapisy mówiące, że te pliki mają zostać usunięte, należy je zmienić na nową decyzję: te pliki zostają w Release.

CEL ETAPU:
Domknąć porządek po ostatnich etapach bez usuwania plików testowych i backupowych DataSlate.

Zakres:
1. Zaktualizować `AGENTS.md`, żeby odzwierciedlał nowe wymaganie.
2. Zaktualizować `Analizy/Release.md`, zapisując zmianę decyzji właściciela.
3. Poprawić `DataSlate/index.html`, żeby nie wyglądał jak przypadkowa stara strona testowa, tylko jak świadomy launcher DataSlate.
4. Zachować linki do wersji testowych, ale opisać je jako świadomie pozostawione narzędzia testowe.
5. Usunąć lub poprawić stary, mylący adres projektu `WrathAndGlory`, jeżeli nadal występuje.
6. Zaktualizować placeholder `INSERT_YOUR_MAP_LINK` na `INSERT_YOUR_VTT_LINK` w instrukcjach, jeżeli nadal występuje w aktualnych publicznych instrukcjach.

SZCZEGÓŁOWE ZADANIA

1. Aktualizacja `AGENTS.md`

W `AGENTS.md` znajdź zapisy dotyczące plików testowych, backupowych, draftów lub czyszczenia DataSlate.

Zmień wymaganie dla DataSlate tak, aby było jasne, że:

- pliki testowe i backupowe DataSlate mają zostać w Release;
- pełnią funkcję pomocniczą dla użytkowników, którzy będą testować własne modyfikacje;
- nie należy ich usuwać w ramach finalnego czyszczenia publicznej paczki;
- jeżeli wymagają opisu, należy je opisać w dokumentacji, zamiast usuwać;
- nadal nie wolno traktować ich jako głównej ścieżki produkcyjnej aplikacji.

Dodaj albo popraw sekcję tak, żeby wymieniała przynajmniej:

- `DataSlate/GM_test.html`
- `DataSlate/Infoczytnik_test.html`
- `DataSlate/GM_backup.html`
- `DataSlate/Infoczytnik_backup.html`

Usuń lub zmień wcześniejsze sformułowania typu:
- „backupy i testowe pliki HTML nie powinny trafić do finalnej publicznej paczki”
- „stare pliki testowe i backupowe DataSlate są przeznaczone do skasowania”
- „usunąć zinwentaryzowane stare pliki DataSlate”

Jeżeli takie sformułowania są historycznym wpisem w `Analizy/Release.md`, nie usuwaj ich. W `Release.md` trzeba dopisać nową sekcję, że decyzja została zmieniona i poprzednie ustalenie jest nieaktualne.

W `AGENTS.md` popraw też przykład placeholderów:
- zastąp `INSERT_YOUR_MAP_LINK` przez `INSERT_YOUR_VTT_LINK`
- zostaw `INSERT_YOUR_IMAGE_FOLDER_OR_CHANNEL_LINK`

2. Aktualizacja `DataSlate/index.html`

Nie usuwaj linków do testowych plików.

Popraw stronę wejściową DataSlate tak, aby wyglądała jak świadomy launcher, a nie przypadkowy „test panel”.

Wymagany efekt:

- tytuł strony nie powinien brzmieć `DataSlate test panel`;
- użyj nazwy w rodzaju `DataSlate launcher` albo `DataSlate panel`;
- nagłówek powinien jasno mówić, że strona pozwala wybrać produkcyjne lub testowe widoki DataSlate;
- sekcja produkcyjna ma linkować do:
  - `GM.html`
  - `DataSlate.html`
- sekcja testowa ma zostać, ale jej opis ma jasno mówić, że to widoki pomocnicze dla testowania modyfikacji;
- linki testowe mają nadal prowadzić do:
  - `GM_test.html`
  - `Infoczytnik_test.html`
- jeżeli strona pokazuje stary adres `https://cutelittlegoat.github.io/WrathAndGlory/DataSlate/`, usuń go albo zastąp neutralnym opisem bez prywatnej/starej ścieżki;
- nie zmieniaj logiki `GM.html` ani `DataSlate.html` w tym zadaniu;
- nie zmieniaj zawartości plików testowych i backupowych, chyba że jest to absolutnie konieczne do naprawy martwego linku. Jeżeli nie jest konieczne, zostaw je bez zmian.

3. Dokumentacja

Sprawdź dokumentację DataSlate i ogólne README tylko pod kątem bieżącego wymagania.

Jeżeli dokumentacja mówi, że testowe lub backupowe pliki DataSlate będą usunięte, popraw ją.

Jeżeli dokumentacja w ogóle nie wyjaśnia, czemu testowe pliki istnieją, dodaj krótką informację, że:
- produkcyjne pliki to `GM.html` i `DataSlate.html`;
- pliki testowe i backupowe są pozostawione celowo jako narzędzia pomocnicze dla użytkowników testujących własne modyfikacje;
- nie są główną ścieżką uruchamiania DataSlate.

Nie zamieniaj dokumentacji modułu w changelog. Changelog i historia decyzji mają trafić do `Analizy/Release.md`.

4. Aktualizacja `Analizy/Release.md`

Na końcu `Analizy/Release.md` dopisz nową sekcję.

Sekcja musi zawierać:
- datę;
- pełny oryginalny prompt użytkownika;
- zakres prac;
- nową decyzję właściciela;
- wyraźną informację, że poprzednie ustalenie o usunięciu testowych i backupowych plików DataSlate zostało zmienione;
- listę plików DataSlate, które mają pozostać w Release:
  - `DataSlate/GM_test.html`
  - `DataSlate/Infoczytnik_test.html`
  - `DataSlate/GM_backup.html`
  - `DataSlate/Infoczytnik_backup.html`
- listę zmienionych plików;
- opis zmian w `AGENTS.md`;
- opis zmian w `DataSlate/index.html`;
- informację, że plików testowych i backupowych nie usunięto;
- informację, że nie ruszano Firebase;
- informację, że nie ruszano Web Push;
- informację, że nie dodawano makiet XLSX;
- wyniki testów;
- ryzyka i następne kroki.

5. Testy i wyszukiwania po zmianach

Wykonaj statyczne sprawdzenia:

- `git status --short`
- wyszukiwanie `INSERT_YOUR_MAP_LINK`
- wyszukiwanie `INSERT_YOUR_VTT_LINK`
- wyszukiwanie `DataSlate test panel`
- wyszukiwanie `WrathAndGlory`
- wyszukiwanie `GM_test.html`
- wyszukiwanie `Infoczytnik_test.html`
- wyszukiwanie `GM_backup.html`
- wyszukiwanie `Infoczytnik_backup.html`
- wyszukiwanie sformułowań sugerujących usunięcie testowych/backupowych plików DataSlate
- `git diff --check`

Oczekiwane wyniki:
- `INSERT_YOUR_MAP_LINK` nie powinno pozostawać w aktualnych instrukcjach Release, chyba że jest w historycznym wpisie `Analizy/Release.md`;
- `INSERT_YOUR_VTT_LINK` powinno występować jako aktualny placeholder;
- `DataSlate test panel` nie powinno pozostać jako tytuł produkcyjnej strony wejściowej;
- `WrathAndGlory` nie powinno pozostać jako aktualny adres publicznego modułu, chyba że jest historycznym wpisem w `Analizy/Release.md`;
- linki do `GM_test.html` i `Infoczytnik_test.html` mogą pozostać w `DataSlate/index.html`, bo są teraz celowo wspierane;
- pliki `GM_backup.html` i `Infoczytnik_backup.html` mają nadal istnieć w repozytorium;
- starsze wzmianki o usuwaniu tych plików mogą pozostać wyłącznie w historycznych sekcjach `Analizy/Release.md`, ale muszą być nadpisane nową decyzją w najnowszej sekcji.

Jeżeli środowisko pozwala, sprawdź przez lokalny HTTP:
- `DataSlate/index.html`
- `DataSlate/GM.html`
- `DataSlate/DataSlate.html`
- `DataSlate/GM_test.html`
- `DataSlate/Infoczytnik_test.html`

Jeżeli nie da się wykonać testu przeglądarkowego, opisz to w `Analizy/Release.md`.

6. Wynik końcowy odpowiedzi

Na końcu odpowiedzi podaj krótkie podsumowanie:
- że nowa decyzja została zapisana;
- że pliki testowe i backupowe DataSlate zostały zachowane;
- co zmieniono w `AGENTS.md`;
- co zmieniono w `DataSlate/index.html`;
- czy usunięto/poprawiono stary adres `WrathAndGlory`;
- czy placeholder `INSERT_YOUR_MAP_LINK` został zastąpiony przez `INSERT_YOUR_VTT_LINK` w aktualnych instrukcjach;
- jakie testy statyczne wykonano;
- jaki jest proponowany następny krok.
```

### Zakres prac

- Przeczytano aktualne `AGENTS.md` oraz `Analizy/Release.md` przed rozpoczęciem zmian.
- Zaktualizowano obowiązujące instrukcje Release w `AGENTS.md` zgodnie z nową decyzją właściciela.
- Przekształcono `DataSlate/index.html` z przypadkowo wyglądającego panelu testowego w świadomy launcher DataSlate.
- Sprawdzono i zaktualizowano dokumentację użytkową oraz techniczną DataSlate wyłącznie w zakresie rozróżnienia ścieżki produkcyjnej od zachowanych materiałów pomocniczych.
- Wykonano wymagane wyszukiwania statyczne, test istnienia zachowanych plików, kontrolę whitespace oraz testy dostępności przez lokalny HTTP.

### Ustalenia i wnioski

- Poprzednie ustalenie, zgodnie z którym testowe i backupowe pliki DataSlate miały zostać usunięte albo wykluczone z finalnej paczki publicznej, zostało zmienione. Starsze wpisy w niniejszym dzienniku pozostają historycznym zapisem wcześniejszych decyzji, ale nie są już obowiązującym wymaganiem.
- Główną ścieżką produkcyjną DataSlate są `DataSlate/GM.html` oraz `DataSlate/DataSlate.html`.
- Widoki testowe i backupy pozostają celowo dostępne jako narzędzia pomocnicze dla użytkowników testujących własne modyfikacje i jako punkt odniesienia podczas eksperymentów. Nie należy traktować ich jako głównej ścieżki uruchamiania modułu.
- Stary adres `https://cutelittlegoat.github.io/WrathAndGlory/DataSlate/` został usunięty z bieżącego launchera i zastąpiony neutralną instrukcją użycia własnego wdrożenia.
- Placeholder `INSERT_YOUR_MAP_LINK` został zastąpiony przez `INSERT_YOUR_VTT_LINK` w aktualnych instrukcjach `AGENTS.md`. Starsze wystąpienia `INSERT_YOUR_MAP_LINK` pozostają wyłącznie w historycznych sekcjach niniejszego dziennika.
- Nie zmieniono konfiguracji Firebase ani integracji Firestore.
- Nie zmieniono Web Push.
- Nie dodano neutralnych makiet XLSX.
- Nie zmieniono generowanych wyników `NameGenerator`.

### Decyzje i wymagania

W wersji Release mają pozostać następujące pliki:

- `DataSlate/GM_test.html`;
- `DataSlate/Infoczytnik_test.html`;
- `DataSlate/GM_backup.html`;
- `DataSlate/Infoczytnik_backup.html`.

Plików tych nie należy usuwać podczas finalnego czyszczenia publicznej paczki. Jeżeli wymagają dodatkowego kontekstu, należy wyjaśnić ich rolę w dokumentacji. Pliki produkcyjne `GM.html` i `DataSlate.html` pozostają podstawowymi punktami wejścia do regularnego użycia DataSlate.

### Zmienione pliki

| Plik | Opis zmiany |
| --- | --- |
| `AGENTS.md` | Zastąpiono starszą zasadę usuwania plików testowych i backupowych DataSlate nową decyzją o ich zachowaniu; wymieniono cztery chronione pliki; zmieniono przykłady placeholderów z `INSERT_YOUR_MAP_LINK` na `INSERT_YOUR_VTT_LINK`. |
| `DataSlate/index.html` | Zmieniono tytuł i nagłówek na `DataSlate launcher`, doprecyzowano rozdział widoków produkcyjnych i pomocniczych widoków testowych oraz usunięto stary adres `WrathAndGlory`. |
| `DataSlate/docs/README.md` | W instrukcji PL/EN wskazano `GM.html` i `DataSlate.html` jako pliki używane podczas sesji oraz opisano celowo zachowane pliki testowe i backupowe. |
| `DataSlate/docs/Documentation.md` | W dokumentacji technicznej rozróżniono produkcyjne punkty wejścia, pomocnicze widoki testowe i zachowane backupy. |
| `Analizy/Release.md` | Dopisano niniejszy wpis dziennika Release. |

### Szczegóły zmian w kodzie

- `AGENTS.md`: usunięto aktualne sformułowanie sugerujące wykluczenie backupów i testowych plików HTML DataSlate z publicznej paczki. Zastąpiono je jednoznaczną regułą ich zachowania, funkcją pomocniczą oraz listą czterech chronionych plików. Poprawiono również dwa aktualne przykłady placeholdera VTT.
- `DataSlate/index.html`: produkcyjne przyciski nadal kierują do `GM.html` i `DataSlate.html`. Linki pomocnicze nadal kierują do `GM_test.html` i `Infoczytnik_test.html`, ale sekcja testowa otrzymała wyraźny opis przeznaczenia. Usunięto stary adres projektu i zastąpiono go neutralną informacją o użyciu własnego wdrożenia.
- `DataSlate/docs/README.md`: instrukcja użytkowa PL/EN wskazuje teraz pliki produkcyjne jako podstawową ścieżkę sesji, a pliki testowe i backupowe jako świadomie zachowane materiały pomocnicze.
- `DataSlate/docs/Documentation.md`: techniczny opis struktury katalogu wymienia pliki produkcyjne, testowe i backupowe z ich aktualnymi rolami.
- Nie zmodyfikowano zawartości `DataSlate/GM.html`, `DataSlate/DataSlate.html`, `DataSlate/GM_test.html`, `DataSlate/Infoczytnik_test.html`, `DataSlate/GM_backup.html` ani `DataSlate/Infoczytnik_backup.html`.

### Testy

- `git status --short` — wykonano; przed dopisaniem niniejszego dziennika widoczne były wyłącznie oczekiwane zmiany w `AGENTS.md`, `DataSlate/index.html`, `DataSlate/docs/README.md` oraz `DataSlate/docs/Documentation.md`.
- `rg -n -F 'INSERT_YOUR_MAP_LINK' . || true` — wykonano; stare wystąpienia pozostały wyłącznie w historycznych wpisach `Analizy/Release.md`.
- `rg -n -F 'INSERT_YOUR_VTT_LINK' . || true` — wykonano; potwierdzono aktualny placeholder w `AGENTS.md`, plikach modułu `Main` i historycznym opisie ostatniej migracji.
- `rg -n -F 'DataSlate test panel' . || true` — wykonano; brak wystąpień po zmianie launchera.
- `rg -n -F 'WrathAndGlory' . || true` — wykonano; brak wystąpień po usunięciu starego adresu z launchera.
- Wyszukiwania `GM_test.html`, `Infoczytnik_test.html`, `GM_backup.html` i `Infoczytnik_backup.html` — wykonano; potwierdzono aktualne odniesienia w instrukcjach i dokumentacji oraz historyczne wpisy w dzienniku.
- Wyszukiwanie sformułowań sugerujących usunięcie testowych i backupowych plików DataSlate — wykonano; takie sformułowania pozostały wyłącznie w historycznych sekcjach `Analizy/Release.md`, które zgodnie z zasadami dziennika nie zostały usunięte.
- Test `test -f` dla `DataSlate/GM_test.html`, `DataSlate/Infoczytnik_test.html`, `DataSlate/GM_backup.html` i `DataSlate/Infoczytnik_backup.html` — zaliczony; wszystkie cztery pliki istnieją.
- `git diff --check` — zaliczony; brak błędów whitespace.
- `python3 -m http.server 8770` oraz `curl` dla `DataSlate/index.html`, `DataSlate/GM.html`, `DataSlate/DataSlate.html`, `DataSlate/GM_test.html` i `DataSlate/Infoczytnik_test.html` — zaliczone; każdy widok zwrócił HTTP 200.
- `curl -fsS http://127.0.0.1:8770/DataSlate/index.html | rg -n 'DataSlate launcher|Production versions|Supporting test views|GM_test\\.html|Infoczytnik_test\\.html|Use this launcher from your own deployment'` — zaliczony; potwierdzono nowy tytuł launchera, sekcje i zachowane linki pomocnicze.
- Nie wykonano zrzutu ekranu przeglądarki: środowisko nie zawiera binariów Chromium, Chrome ani Firefox oraz nie ma zainstalowanego Playwright/Puppeteer.

### Ryzyka i następne kroki

1. Pełne testy funkcjonalne DataSlate przez Firestore wymagają własnej konfiguracji Firebase nowej grupy. W tym zadaniu celowo nie czyszczono ani nie modyfikowano Firebase.
2. Następny zalecany krok to osobny, kontrolowany etap czyszczenia prywatnych konfiguracji Firebase i usuwania Web Push z wersji Release, bez naruszania komunikacji Firestore DataSlate i bez usuwania zachowanych materiałów testowych oraz backupowych.
3. W środowisku z przeglądarką warto dodatkowo wykonać ręczny test wizualny launchera oraz pełny przepływ GM → Firestore → ekran gracza dla widoków produkcyjnych i pomocniczych.

## Aktualizacja — 2026-05-30 — uporządkowanie dwujęzycznej dokumentacji modułów

### Oryginalny pełny prompt użytkownika

> Pracujesz w repozytorium `WnG_Tools`.
>
> Wykonaj poboczne zadanie dokumentacyjne: przeedytuj wszystkie pliki dokumentacji typu `README.md` i `Documentation.md` tak, aby miały pełną wersję angielską na początku oraz pełną wersję polską po niej.
>
> WAŻNE: przed rozpoczęciem przeczytaj `AGENTS.md` i `Analizy/Release.md`; nie usuwaj starszych sekcji dziennika; po zakończeniu dopisz do `Analizy/Release.md` nową sekcję zgodną z instrukcjami; nie traktuj `README.md` ani `Documentation.md` jako changeloga; nie dopisuj historii zmian; opisuj wyłącznie aktualny stan aplikacji; nie zmieniaj kodu aplikacji poza ewentualną oczywistą literówką w linku dokumentacyjnym; nie czyść Firebase; nie zmieniaj Web Push; nie dodawaj neutralnych makiet XLSX; nie tłumacz generowanych wyników `NameGenerator`; nie usuwaj testowych ani backupowych plików DataSlate; nie commituj zmian, chyba że środowisko Codex wymaga jednego logicznego commita.
>
> CEL: wszystkie pliki dokumentacyjne typu `README.md` i `Documentation.md` mają zostać uporządkowane językowo i merytorycznie. Każdy `README.md` ma mieć najpierw `# 🇬🇧 User instructions (EN)` z pełną angielską instrukcją użytkownika, a potem `# 🇵🇱 Instrukcja dla użytkownika (PL)` z pełną instrukcją polską. Każdy `Documentation.md` ma mieć najpierw `# 🇬🇧 Technical documentation (EN)` z pełną dokumentacją techniczną po angielsku, a potem `# 🇵🇱 Dokumentacja techniczna (PL)` z pełną dokumentacją techniczną po polsku. Nie wolno mieszać języków sekcja po sekcji.
>
> ZAKRES: znajdź wszystkie `README.md` i `Documentation.md` w repozytorium; nie edytuj `Analizy/Release.md` poza końcową sekcją; nie edytuj `AGENTS.md`; nie edytuj plików niebędących dokumentacją poza ewentualną oczywistą korektą bezpośrednio linkowanej ścieżki; nie usuwaj automatycznie dokumentów archiwalnych i szkiców.
>
> README: przygotuj szczegółową, prostą, praktyczną instrukcję dla osoby nietechnicznej. Wyjaśnij cel modułu, uruchomienie, kliknięcia, efekty przycisków, funkcje, mechaniki, komunikaty, pola, przełączniki, widoki, typowe sytuacje, błędy, puste stany, brak konfiguracji Firebase tam, gdzie dotyczy, oraz role produkcyjnych, testowych i backupowych widoków DataSlate.
>
> DOCUMENTATION: przygotuj szczegółową, precyzyjną, aktualną dokumentację techniczną dla programisty lub agenta odtwarzającego moduł 1:1. Opisz strukturę plików, role plików, style, layouty, kolory, fonty, odstępy, responsywność, JavaScript, logikę, obliczenia, mechaniki UI, Firebase, strukturę danych, zależności, skrypty pomocnicze, procedurę odtworzenia, placeholdery oraz role produkcyjnych, testowych i backupowych plików DataSlate. Nie zapisuj historii zmian.
>
> DATASLATE: zapisz aktualny stan: produkcyjny panel GM to `DataSlate/GM.html`, produkcyjny ekran gracza to `DataSlate/DataSlate.html`, launcher to `DataSlate/index.html`; `DataSlate/GM_test.html`, `DataSlate/Infoczytnik_test.html`, `DataSlate/GM_backup.html` i `DataSlate/Infoczytnik_backup.html` mają pozostać, służą testowaniu własnych modyfikacji i nie są główną produkcyjną ścieżką.
>
> FIREBASE: opisuj własną konfigurację użytkownika lub administratora z angielskimi placeholderami; nie wpisuj prywatnych wartości właściciela; wyjaśnij konieczność własnego projektu; nie zapisuj sekretów w repozytorium; nie opisuj Web Push jako funkcji publicznej wersji.
>
> MAIN: opisuj mapę jako `VTT`; używaj `INSERT_YOUR_VTT_LINK` i `INSERT_YOUR_IMAGE_FOLDER_OR_CHANNEL_LINK`; nie używaj `INSERT_YOUR_MAP_LINK` jako aktualnego placeholdera.
>
> NAMEGENERATOR: opisz angielski domyślny interfejs, przełącznik UI na polski i fakt, że generowane wyniki nadal mogą korzystać z dotychczasowych słowników.
>
> DATAVAULT I NPCGENERATOR: przy bramce dostępu opisz angielski ekran domyślny, polską wersję z selektora, publiczne placeholdery Firebase niełączące aplikacji z prywatną bazą oraz konieczność konfiguracji własnego Firebase, aby hasło działało.
>
> KONTROLA JAKOŚCI: znajdź wszystkie `README.md` i `Documentation.md`; sprawdź obecność sekcji `🇬🇧` i `🇵🇱` oraz kolejność EN → PL; wyszukaj `wcześniej`, `stara wersja`, `dodano`, `zmieniono`, `Release`, `INSERT_YOUR_MAP_LINK`, `INSERT_YOUR_VTT_LINK`, `Web Push`, `GM_test.html`, `Infoczytnik_test.html`, `GM_backup.html`, `Infoczytnik_backup.html`; oceń każde pozostałe wystąpienie; wykonaj `git diff --check`.
>
> AKTUALIZACJA `Analizy/Release.md`: dopisz datę, pełny oryginalny prompt, zakres prac, listy znalezionych i przeedytowanych `README.md` oraz `Documentation.md`, układ językowy, informację że dokumentacja nie jest changelogiem, decyzję o zachowaniu plików testowych i backupowych DataSlate, brak zmian kodu aplikacji, brak zmian Firebase, brak zmian Web Push, brak makiet XLSX, wyniki testów, ryzyka i następne kroki.
>
> WYNIK KOŃCOWY: podaj liczbę przeedytowanych `README.md` i `Documentation.md`, potwierdź pełne wersje EN i PL, angielski jako pierwszą wersję, usunięcie informacji historycznych/changelogowych, zapisanie decyzji DataSlate, wynik testów statycznych i proponowane następne kroki.

Uwaga ewidencyjna: prompt został przekazany w wiadomości użytkownika dwukrotnie w identycznym brzmieniu. Powyżej zapisano pełną treść merytoryczną jednego egzemplarza bez ponownego wklejania identycznego duplikatu.

### Zakres prac

1. Przeczytano obowiązujący `AGENTS.md` oraz aktualną treść `Analizy/Release.md` przed zmianami.
2. Znaleziono wszystkie bieżące pliki `README.md` i `Documentation.md` w repozytorium.
3. Uporządkowano 8 instrukcji użytkownika oraz 8 dokumentacji technicznych w układzie pełna wersja angielska → pełna wersja polska.
4. Usunięto z dokumentacji modułowych historyczne i changelogowe sformułowania. Dokumentacja opisuje aktualny stan aplikacji.
5. Uporządkowano aktualny opis DataSlate: produkcyjne punkty wejścia, pomocnicze widoki testowe oraz zachowane backupy.
6. Poprawiono oczywistą nieaktualną ścieżkę dokumentacyjną `Audio/config/Firebase-config.md` na istniejący plik `Audio/config/FirebaseREADME.md`.
7. Nie edytowano kodu aplikacji, konfiguracji Firebase, logiki Web Push ani arkuszy XLSX.

### Ustalenia i wnioski

- Repozytorium zawiera dokładnie 8 aktualnych plików `README.md` oraz 8 aktualnych plików `Documentation.md` w katalogach `docs/` modułów.
- Każdy dokument zaczyna się pełną angielską wersją i zawiera pełną polską wersję po niej.
- Dokumentacja modułowa nie pełni funkcji changeloga. Historia, decyzje i opis prac pozostają w `Analizy/Release.md`.
- W dokumentacji `Main` aktualnym placeholderem VTT jest `INSERT_YOUR_VTT_LINK`; `INSERT_YOUR_MAP_LINK` nie występuje w bieżących instrukcjach ani dokumentacji technicznej.
- Dokumentacja DataSlate jednoznacznie rozróżnia produkcyjne punkty wejścia (`index.html`, `GM.html`, `DataSlate.html`) oraz pomocnicze pliki testowe i backupowe.
- Wyszukiwanie `Web Push` w bieżących `README.md` i `Documentation.md` nie zwraca wyników. W tym zadaniu logika aplikacji nie była modyfikowana.

### Decyzje i wymagania

- Obowiązującym układem każdego `README.md` jest:
  1. `# 🇬🇧 User instructions (EN)`;
  2. pełna instrukcja angielska;
  3. `# 🇵🇱 Instrukcja dla użytkownika (PL)`;
  4. pełna instrukcja polska.
- Obowiązującym układem każdego `Documentation.md` jest:
  1. `# 🇬🇧 Technical documentation (EN)`;
  2. pełna dokumentacja techniczna angielska;
  3. `# 🇵🇱 Dokumentacja techniczna (PL)`;
  4. pełna dokumentacja techniczna polska.
- Pliki `DataSlate/GM_test.html`, `DataSlate/Infoczytnik_test.html`, `DataSlate/GM_backup.html` i `DataSlate/Infoczytnik_backup.html` mają pozostać w publicznej paczce jako pomocnicze materiały do testowania własnych modyfikacji oraz punkt odniesienia podczas eksperymentów. Nie są główną ścieżką produkcyjną DataSlate.

### Zmienione pliki

#### Znalezione i przeedytowane pliki `README.md`

| Plik | Opis |
| --- | --- |
| `Audio/docs/README.md` | Pełna instrukcja EN → PL; bieżący opis widoku użytkownika, admina, manifestu audio i Firebase. |
| `Calculators/docs/README.md` | Pełna instrukcja EN → PL; bieżący opis kalkulatora XP, tworzenia postaci i zapisu Firebase. |
| `DataSlate/docs/README.md` | Pełna instrukcja EN → PL; produkcyjne punkty wejścia, zachowane testy i backupy, Firestore oraz aktualne opcje logo. |
| `DataVault/docs/README.md` | Pełna instrukcja EN → PL; bramka dostępu, runtime danych, XLSX i własny Firebase. |
| `DiceRoller/docs/README.md` | Pełna instrukcja EN → PL; pola testu, rzuty, wyniki i walidacja. |
| `Main/docs/README.md` | Pełna instrukcja EN → PL; launcher, widoki, VTT i publiczne placeholdery linków. |
| `NPCGenerator/docs/README.md` | Pełna instrukcja EN → PL; generowanie NPC, ulubione, bramka dostępu i własny Firebase. |
| `NameGenerator/docs/README.md` | Pełna instrukcja EN → PL; generowanie, seed, kopiowanie, język UI i dotychczasowe słowniki wyników. |

#### Znalezione i przeedytowane pliki `Documentation.md`

| Plik | Opis |
| --- | --- |
| `Audio/docs/Documentation.md` | Pełna dokumentacja EN → PL; architektura, manifest, UI, Firestore i poprawiona ścieżka referencji Firebase. |
| `Calculators/docs/Documentation.md` | Pełna dokumentacja EN → PL; struktura, obliczenia XP, tworzenie postaci, style i Firebase. |
| `DataSlate/docs/Documentation.md` | Pełna dokumentacja EN → PL; produkcja, testy, backupy, assety i przepływ Firestore. |
| `DataVault/docs/Documentation.md` | Pełna dokumentacja EN → PL; runtime, loader, parser XLSX, generator Python i zależność NPCGenerator. |
| `DiceRoller/docs/Documentation.md` | Pełna dokumentacja EN → PL; frontend, mechanika kości, layout i rekonstrukcja. |
| `Main/docs/Documentation.md` | Pełna dokumentacja EN → PL; launcher, layout, linki VTT i zachowanie przeglądarki. |
| `NPCGenerator/docs/Documentation.md` | Pełna dokumentacja EN → PL; UI, DataVault, Firebase, tabele, druk i rekonstrukcja. |
| `NameGenerator/docs/Documentation.md` | Pełna dokumentacja EN → PL; pliki, RNG, słowniki, generatory, UI i rekonstrukcja. |

#### Dziennik Release

| Plik | Opis |
| --- | --- |
| `Analizy/Release.md` | Dopisano niniejszą sekcję zadania dokumentacyjnego bez usuwania starszych wpisów. |

### Szczegóły zmian w kodzie

- Kod aplikacji nie został zmieniony.
- Nie zmieniono plików HTML, CSS, JavaScript, Python, konfiguracji Firebase ani arkuszy XLSX.
- Jedyna korekta ścieżki dotyczyła tekstu dokumentacji: w `Audio/docs/Documentation.md` wskazano istniejący plik `Audio/config/FirebaseREADME.md` zamiast nieistniejącego `Audio/config/Firebase-config.md`.
- Nie czyszczono Firebase.
- Nie zmieniano Web Push.
- Nie dodawano neutralnych makiet XLSX.
- Nie tłumaczono generowanych wyników `NameGenerator`.
- Nie usuwano plików testowych ani backupowych DataSlate.

### Testy

- `find . -type f -name README.md -print | sort` — znaleziono 8 bieżących instrukcji użytkownika.
- `find . -type f -name Documentation.md -print | sort` — znaleziono 8 bieżących dokumentacji technicznych.
- Skrypt Python sprawdzający nagłówki i kolejność sekcji — zaliczony dla wszystkich 16 dokumentów: każdy dokument zawiera dokładnie jedną wymaganą sekcję EN i jedną wymaganą sekcję PL, a EN występuje pierwsze.
- Wyszukiwania `wcześniej`, `stara wersja`, `dodano`, `zmieniono`, `Release`, `INSERT_YOUR_MAP_LINK` i `Web Push` w bieżących `README.md` oraz `Documentation.md` — brak wystąpień.
- Wyszukiwanie `INSERT_YOUR_VTT_LINK` — oczekiwane wystąpienia wyłącznie w bieżącej dokumentacji `Main`.
- Wyszukiwania `GM_test.html`, `Infoczytnik_test.html`, `GM_backup.html` i `Infoczytnik_backup.html` — oczekiwane wystąpienia w bieżącej dokumentacji DataSlate potwierdzające ich zachowanie i role pomocnicze.
- `test -f` dla `DataSlate/index.html`, `DataSlate/GM.html`, `DataSlate/DataSlate.html`, `DataSlate/GM_test.html`, `DataSlate/Infoczytnik_test.html`, `DataSlate/GM_backup.html` i `DataSlate/Infoczytnik_backup.html` — zaliczony; wszystkie wymagane pliki istnieją.
- `rg -n 'Firebase-config\\.md'` dla dokumentacji — brak wystąpień nieaktualnej ścieżki.
- `git diff --check` — zaliczony; brak błędów whitespace.

### Ryzyka i następne kroki

1. To zadanie porządkowało dokumentację i nie weryfikowało funkcjonalnie aplikacji w przeglądarce. Kolejne zmiany kodu powinny aktualizować obie pełne wersje językowe dokumentacji.
2. Osobny etap powinien wyczyścić prywatne konfiguracje Firebase oraz usunąć Web Push z kodu publicznej wersji bez naruszenia komunikacji Firestore DataSlate.
3. Po dostarczeniu neutralnych arkuszy należy osobno sprawdzić `AudioManifest.xlsx` i neutralny `DataVault/Repozytorium.xlsx` zgodnie z zasadami parserów i loaderów.
4. Warto wykonać ręczny przegląd dokumentacji przez użytkownika nietechnicznego oraz osobny przegląd techniczny procedur rekonstrukcji modułów.

## Aktualizacja — 2026-05-30 — przykładowe pliki produkcyjne i dokumentacja DataVault

### Oryginalny pełny prompt użytkownika

```text
Wgrałem plik:
Audio/AudioManifest.xlsx
jest on pozbawiony wrażliwych danych. Może być używany produkcyjnie.

Wgrałem też przykładowy plik DataVault/SampleFiles/Repozytorium.xlsx
Wygeneruj z niego pliki json i wgraj do DataVault/SampleFiles/

Następnie dopisz do instrukcji informacje, że w tym folderze znajdują się przykładowe pliki.
Plik xlsx ma gotową strukturę zakładek i kolumn. Zawiera też przykładowe dane pokazujące zasady formatowania (np. przekreślenie i czerwony kolor).

Trzeba dopisać tę informację do części instrukcji po angielsku i części instrukcji po polsku.
```

### Zakres prac

- Przeczytano aktualne instrukcje repozytorium, wcześniejsze sekcje dziennika Release, dokumentację DataVault oraz kod generatorów `DataVault/build_json.py`, `DataVault/xlsxCanonicalParser.js` i logikę generowania z panelu administratora w `DataVault/app.js`.
- Potwierdzono obecność plików wejściowych `Audio/AudioManifest.xlsx` oraz `DataVault/SampleFiles/Repozytorium.xlsx`.
- Użyto referencyjnego generatora CLI `DataVault/build_json.py` do wygenerowania przykładowego `DataVault/SampleFiles/data.json` z dostarczonego arkusza XLSX.
- Utworzono `DataVault/SampleFiles/firebase-import.json` zgodnie z istniejącym wrapperem `datavault-firebase-import-v1` zdefiniowanym w `DataVault/app.js`: obiekt zawiera `schemaVersion`, znacznik czasu `createdAt`, nazwę źródła `Repozytorium.xlsx` oraz pełny `data.json` zapisany jako tekst pod kluczem `dataJson`.
- Rozszerzono oba kanoniczne parsery XLSX o przenoszenie istniejących markerów formatowania dla stylów całej komórki. Zmiana była potrzebna, ponieważ przykładowe przekreślenie w dostarczonym arkuszu zapisano jako styl całej komórki, a wcześniejsza implementacja zachowywała z pełnokomórkowych stylów wyłącznie czerwony tekst.
- Uzupełniono dwujęzyczne instrukcje DataVault o użytkowy opis folderu `DataVault/SampleFiles/`.
- Sprawdzono instrukcje modułu Audio. Nie wymagały korekty: opisują istniejący manifest i oczekiwaną nazwę `AudioManifest.xlsx`, bez sugestii, że neutralny plik dopiero ma zostać przygotowany.

### Ustalenia i wnioski

- Właściciel dostarczył `Audio/AudioManifest.xlsx` jako plik pozbawiony wrażliwych danych i dopuszczony do użycia produkcyjnego. Plik istnieje, jest technicznie poprawnym arkuszem XLSX i zawiera wymagane kolumny `NazwaSampla`, `NazwaPliku` oraz `LinkDoFolderu`.
- `DataVault/SampleFiles/Repozytorium.xlsx` jest przykładowym plikiem DataVault z gotową strukturą zakładek i kolumn oraz neutralnymi rekordami pokazującymi zasady formatowania.
- Referencyjną ścieżką CLI pozostaje `DataVault/build_json.py`. Przycisk administratora korzysta z równoważnego parsera przeglądarkowego `DataVault/xlsxCanonicalParser.js`, a następnie buduje wrapper importu RTDB funkcją z `DataVault/app.js`.
- Dostarczony XLSX zawiera czerwony tekst, pogrubienie, kursywę oraz przekreślenie. Po lokalnej poprawce parserów wygenerowany JSON zachowuje istniejący model markerów, w tym `{{RED}}...{{/RED}}` i `{{S}}...{{/S}}`.
- Format danych DataVault nie został zmieniony. Poprawka jedynie rozszerza odczyt stylów całej komórki do markerów już obsługiwanych przez runtime.

### Decyzje i wymagania

- `Audio/AudioManifest.xlsx` może pozostać produkcyjnym manifestem publicznej wersji Release.
- Folder `DataVault/SampleFiles/` ma pozostać źródłem przykładowych plików dla użytkowników konfigurujących własny zestaw danych.
- `DataVault/SampleFiles/Repozytorium.xlsx` może być kopiowany jako wzór struktury i formatowania, po czym użytkownik powinien zastąpić neutralne przykłady własnymi rekordami.
- `DataVault/SampleFiles/firebase-import.json` jest przykładem importu do Firebase RTDB pod ścieżkę `/datavault/live`, zgodnie z istniejącą instrukcją DataVault.
- Nie usuwano ani nie zmieniano integracji Firebase. Nie ruszano Web Push, pomocniczych plików testowych i backupowych DataSlate ani generowanych wyników NameGenerator.

### Zmienione pliki

| Plik | Opis |
| --- | --- |
| `DataVault/SampleFiles/data.json` | Wygenerowany przykładowy backup JSON z neutralnego `Repozytorium.xlsx`. |
| `DataVault/SampleFiles/firebase-import.json` | Wygenerowany przykładowy wrapper importu Firebase RTDB zgodny z bieżącą logiką panelu administratora. |
| `DataVault/build_json.py` | Rozszerzono referencyjny parser CLI o zachowanie pełnokomórkowych markerów pogrubienia, kursywy i przekreślenia obok wcześniej obsługiwanego czerwonego tekstu. |
| `DataVault/xlsxCanonicalParser.js` | Wprowadzono analogiczną zmianę w kanonicznym parserze przeglądarkowym, aby utrzymać zgodność z generatorem CLI. |
| `DataVault/docs/README.md` | Dodano angielską i polską sekcję użytkową opisującą przykładowe pliki, strukturę XLSX, formatowanie i import RTDB. |
| `Analizy/Release.md` | Dopisano niniejszą sekcję dziennika Release. |

### Szczegóły zmian w kodzie

#### `DataVault/build_json.py`

- Przed zmianą loader stylów sprowadzał styl całej komórki do pojedynczej flagi czerwonego tekstu.
- Po zmianie loader zachowuje dla stylu całej komórki zestaw flag `red`, `bold`, `italic` i `strike`, a następnie przekazuje je do istniejącej funkcji `_wrap_with_markers()`.
- Powód zmiany: przykładowe komórki `Bestiary!W3` i `Bestiary!W4` mają przekreślenie zapisane jako styl całej komórki. Bez poprawki wygenerowany plik pomijał ten przykład formatowania.

#### `DataVault/xlsxCanonicalParser.js`

- Przed zmianą parser przeglądarkowy również mapował style całej komórki wyłącznie na flagę czerwonego tekstu.
- Po zmianie parser przeglądarkowy przenosi ten sam zestaw flag `red`, `bold`, `italic` i `strike`, używając istniejącego modelu markerów.
- Powód zmiany: zachowanie parytetu z referencyjnym generatorem CLI i wynikami przycisku **Generate data files**.

#### `DataVault/docs/README.md`

- Dodano sekcje **Sample files** i **Przykładowe pliki**.
- Obie wersje językowe opisują `Repozytorium.xlsx`, `data.json`, `firebase-import.json`, gotową strukturę zakładek i kolumn, przykładowe formatowanie oraz możliwość zastąpienia przykładów własnymi danymi.

### Testy

- Potwierdzono istnienie obu plików wejściowych poleceniem `stat -c '%n | %s bytes' Audio/AudioManifest.xlsx DataVault/SampleFiles/Repozytorium.xlsx`.
- Wygenerowano przykładowy JSON poleceniem `python3 DataVault/build_json.py DataVault/SampleFiles/Repozytorium.xlsx DataVault/SampleFiles/data.json`.
- Zweryfikowano składnię Pythona poleceniem `python3 -m py_compile DataVault/build_json.py`.
- Zweryfikowano składnię parsera JavaScript poleceniem `node --check DataVault/xlsxCanonicalParser.js`.
- Parsowano oba pliki JSON przy użyciu `json.loads`, sprawdzono round-trip pola `dataJson` wrappera Firebase i potwierdzono zgodność odtworzonego obiektu z `data.json`.
- Potwierdzono zachowanie formatowania w wygenerowanym `data.json`: 10 otwierających markerów `{{RED}}`, 2 markery `{{S}}`, 2 markery `{{B}}` i 6 markerów `{{I}}`.
- Sprawdzono strukturę `Audio/AudioManifest.xlsx` jako archiwum XLSX ZIP/XML i potwierdzono wymagane kolumny: `NazwaSampla`, `NazwaPliku`, `LinkDoFolderu`.
- Przeskanowano teksty komórek i zewnętrzne relacje `Audio/AudioManifest.xlsx` pod kątem URL-i oraz wartości infrastruktury. Jedyny wykryty adres to neutralny przykład `https://example.site/examplefolder/`; nie znaleziono prywatnego URL-a właściciela.

### Ryzyka i następne kroki

- `firebase-import.json` zawiera znacznik czasu `createdAt`, tak samo jak plik pobierany z panelu administratora. Ponowna generacja artefaktu celowo zmieni tę wartość.
- Poprawka parserów obejmuje istniejący model markerów stylu całej komórki i nie wprowadza nowego formatu danych. Przy kolejnych neutralnych arkuszach warto nadal testować parytet generatora CLI oraz przycisku przeglądarkowego.
- Test faktycznego importu do projektu Firebase RTDB `/datavault/live` pozostaje krokiem wdrożeniowym dla administratora konfigurującego własny projekt grupy. W ramach tego etapu nie łączono się z żadnym projektem Firebase i nie modyfikowano integracji Firebase.
- Nie wykonywano zmian w Web Push, DataSlate ani NameGenerator.

## Aktualizacja — 2026-05-30 — finalny audyt publicznej paczki po dodaniu manifestu Audio i SampleFiles DataVault

### Oryginalny pełny prompt użytkownika

> Uwaga redakcyjna: wiadomość wejściowa zawierała poniższy prompt dwukrotnie, w identycznym brzmieniu. Dla czytelności dziennika zachowano pełną treść jednego egzemplarza i jawnie odnotowano identyczne powtórzenie zamiast duplikowania kilkuset linii bez nowej informacji.

```text
Pracujesz w repozytorium `WnG_Tools`.

Wykonaj kolejny etap Release: finalny audyt publicznej paczki po dodaniu produkcyjnego `Audio/AudioManifest.xlsx` oraz przykładowych plików DataVault w `DataVault/SampleFiles/`.

WAŻNE:
- Przed rozpoczęciem przeczytaj aktualne pliki:
  - `AGENTS.md`
  - `Analizy/Release.md`
  - `DataVault/docs/README.md`
  - `Audio/docs/README.md`
  - główne pliki wejściowe modułów publicznych.
- Nie usuwaj starszych sekcji z `Analizy/Release.md`.
- Po zakończeniu prac dopisz do `Analizy/Release.md` nową sekcję zgodną z instrukcjami z `AGENTS.md`.
- Nie usuwaj ani nie zmieniaj integracji Firebase.
- Nie przywracaj Web Push.
- Nie usuwaj plików testowych i backupowych DataSlate.
- Nie tłumacz generowanych wyników `NameGenerator`.
- Nie wykonuj dużego refaktoru.
- Nie zmieniaj struktury danych DataVault ani Audio, chyba że znajdziesz bezpośredni błąd blokujący Release.
- Nie modyfikuj plików XLSX, chyba że wykryjesz oczywisty błąd techniczny i opiszesz powód w `Analizy/Release.md`.
- Nie commituj zmian, chyba że środowisko Codex wymaga commita jako sposobu oddania wyniku. Jeżeli commit jest wymagany, zrób jeden logiczny commit.

CEL ETAPU:
Sprawdzić, czy publiczna wersja aplikacji jest spójna po ostatnich zmianach i czy nie zawiera już oczywistych blokujących problemów Release:
- prywatnych linków lub prywatnych konfiguracji właściciela;
- starych nazw katalogów/modułów w aktualnych ścieżkach użytkowych;
- mylących informacji w dokumentacji;
- polskich tekstów widocznych w publicznym angielskim UI tam, gdzie Release wymaga angielskiego interfejsu;
- brakujących informacji o przykładowych plikach DataVault i produkcyjnym manifeście Audio.

ZAKRES PRAC:

1. Audyt plików i dokumentacji Release

Sprawdź, czy istnieją i są śledzone/obecne:
- `Audio/AudioManifest.xlsx`
- `DataVault/SampleFiles/Repozytorium.xlsx`
- `DataVault/SampleFiles/data.json`
- `DataVault/SampleFiles/firebase-import.json`

Sprawdź, czy dokumentacja DataVault opisuje po angielsku i po polsku folder `DataVault/SampleFiles/` jako miejsce z przykładowymi plikami:
- `Repozytorium.xlsx`
- `data.json`
- `firebase-import.json`

Sprawdź, czy dokumentacja Audio nie sugeruje już, że manifest Audio dopiero ma zostać przygotowany, jeśli aktualny `Audio/AudioManifest.xlsx` jest plikiem produkcyjnym.

2. Audyt prywatnych danych i prywatnych linków

Wyszukaj w całym repozytorium aktualne, niehistoryczne wystąpienia potencjalnie prywatnych danych lub starych ścieżek, w szczególności:
- stare adresy GitHub Pages lub stare nazwy projektu `WrathAndGlory`;
- prywatne linki Discorda, map, kanałów, folderów lub hostingów właściciela;
- aktywne endpointy Web Push;
- stare endpointy Cloudflare Worker;
- prawdziwe wartości Firebase właściciela;
- prywatne e-maile techniczne właściciela;
- wartości, które wyglądają jak prawdziwe klucze, tokeny, hasła, service account albo sekrety.

Nie traktuj jako błędu:
- placeholderów typu `INSERT_YOUR_API_KEY`;
- historycznych wpisów w `Analizy/Release.md`, jeśli są jasno częścią starego dziennika;
- instrukcji w `AGENTS.md`, jeśli opisują zasady ogólne;
- zamierzonego brandingu `Cute Little Goat’s`.

Jeżeli znajdziesz prywatne dane w aktualnym kodzie, dokumentacji albo plikach konfiguracyjnych, zastąp je angielskimi placeholderami i opisz zmianę.

3. Audyt pozostałych starych nazw modułów i plików

Sprawdź, czy w aktualnym kodzie i dokumentacji użytkowej nie ma już nieaktualnych nazw jako aktywnych linków lub instrukcji:
- `GeneratorNPC`
- `GeneratorNazw`
- `Infoczytnik`
- `Kalkulator`
- `KalkulatorXP`
- `TworzeniePostaci`

Nie usuwaj tych nazw z historycznych sekcji `Analizy/Release.md`.

Jeżeli stare nazwy występują w aktywnej instrukcji użytkowej, aktywnym linku albo aktualnym komentarzu wdrożeniowym, popraw je na aktualne nazwy:
- `NPCGenerator`
- `NameGenerator`
- `DataSlate`
- `Calculators`
- `XPCalculator`
- `CharacterCreation`

4. Audyt publicznych tekstów UI

Sprawdź publiczne pliki wejściowe modułów:
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

Celem jest znalezienie polskich tekstów widocznych dla użytkownika w miejscach, gdzie Release wymaga angielskiego UI.

Popraw tylko oczywiste pozostałości w UI, np. etykiety przycisków, nagłówki, statusy, placeholdery, komunikaty i opisy widoczne na stronie.

Nie tłumacz:
- polskiej części dokumentacji;
- komentarzy technicznych PL/EN;
- historycznych wpisów w `Analizy/Release.md`;
- generowanych wyników `NameGenerator`;
- nazw przykładowych danych, jeżeli są celowo danymi demonstracyjnymi i nie są elementem interfejsu.

5. Audyt DataSlate data.json

Sprawdź `DataSlate/assets/data/data.json` pod kątem nazw widocznych w selektorach panelu GM.

Jeżeli są tam polskie nazwy presetów, które są częścią publicznego UI, przetłumacz je na angielski bez zmiany identyfikatorów, ścieżek plików ani struktury JSON.

Przykładowy zakres:
- nazwy backgroundów;
- nazwy fontów/presetów;
- inne nazwy widoczne w dropdownach.

Nie zmieniaj treści fillerów, jeżeli są już po angielsku albo są zamierzonym tekstem klimatycznym.

6. Audyt dokumentacji użytkowej

Sprawdź dokumentację modułów:
- `Audio/docs/README.md`
- `DataVault/docs/README.md`
- `DataSlate/docs/README.md`
- inne README modułów, jeżeli istnieją.

Popraw tylko aktualne instrukcje użytkowe, które są niezgodne ze stanem Release.

Upewnij się, że:
- `Audio/AudioManifest.xlsx` jest opisany jako produkcyjny, neutralny manifest, jeżeli dokumentacja Audio o tym wspomina;
- `DataVault/SampleFiles/` jest opisany po angielsku i po polsku;
- instrukcje Firebase nadal mówią, że użytkownik ma podstawić własny projekt Firebase;
- dokumentacja nie sugeruje konfiguracji Web Push;
- dokumentacja nie sugeruje usuwania testowych/backupowych plików DataSlate, skoro aktualna decyzja właściciela mówi, że zostają.

7. Testy po zmianach

Wykonaj i zapisz wyniki w `Analizy/Release.md`:
- `git status --short`
- wyszukiwanie starych nazw:
  - `GeneratorNPC`
  - `GeneratorNazw`
  - `Infoczytnik`
  - `Kalkulator`
  - `KalkulatorXP`
  - `TworzeniePostaci`
- wyszukiwanie Web Push:
  - `web-push`
  - `webPush`
  - `Web Push`
  - `vapid`
  - `VAPID`
  - `PushManager`
  - `Notification`
  - `push/subscribe`
  - `push/trigger`
  - `wrathandglory-push-api`
  - `tarczynski-pawel.workers.dev`
- wyszukiwanie placeholderów i prywatnych wartości:
  - `INSERT_YOUR_API_KEY`
  - `INSERT_YOUR_VTT_LINK`
  - `INSERT_YOUR_IMAGE_FOLDER_OR_CHANNEL_LINK`
  - potencjalne stare prywatne linki lub stare domeny, jeżeli były wcześniej znane z `Release.md`
- walidacja JSON:
  - `python3 -m json.tool DataVault/SampleFiles/data.json > /dev/null`
  - `python3 -m json.tool DataVault/SampleFiles/firebase-import.json > /dev/null`
  - `python3 -m json.tool DataSlate/assets/data/data.json > /dev/null`, jeśli ten plik został zmieniony
- statyczne sprawdzenie składni JS, jeżeli dotknięto osobnych plików JS:
  - `node --check DataVault/app.js`
  - `node --check DiceRoller/script.js`
  - `node --check NameGenerator/script.js`
- `git diff --check`

Dla każdego pozostałego trafienia oceń, czy:
- jest błędem do poprawy;
- jest placeholderem, który powinien zostać;
- jest historycznym wpisem w `Analizy/Release.md`;
- jest ogólną zasadą w `AGENTS.md`;
- jest zamierzonym elementem testowym lub demonstracyjnym.

8. Aktualizacja `Analizy/Release.md`

Na końcu `Analizy/Release.md` dopisz nową sekcję.

Sekcja musi zawierać:
- datę;
- pełny oryginalny prompt użytkownika bez skracania;
- zakres prac;
- ustalenia i wnioski;
- decyzje oraz wymagania;
- listę zmienionych plików;
- szczegóły zmian w kodzie/dokumentacji;
- opis wykonanych testów;
- listę pozostałych ryzyk;
- następne kroki.

W sekcji wyraźnie zapisz:
- czy znaleziono prywatne dane lub prywatne linki;
- czy `Audio/AudioManifest.xlsx` pozostaje produkcyjnym plikiem neutralnym;
- czy przykładowe pliki DataVault w `DataVault/SampleFiles/` są obecne i poprawne;
- czy poprawiano polskie resztki UI;
- czy nie ruszano Firebase, Web Push, DataSlate test/backup ani generowanych wyników NameGenerator.

WYNIK KOŃCOWY ODPOWIEDZI:
Na końcu odpowiedzi podaj krótkie podsumowanie:
- co sprawdzono;
- co zmieniono;
- jakie testy przeszły;
- jakie trafienia zostały uznane za historyczne albo poprawne;
- jakie ryzyka lub następne kroki pozostały.
```

### Zakres prac

- Przeczytano aktualne `AGENTS.md`, cały dotychczasowy dziennik `Analizy/Release.md`, dokumentacje `DataVault/docs/README.md`, `Audio/docs/README.md`, `DataSlate/docs/README.md` oraz publiczne pliki wejściowe wskazane w prompcie.
- Sprawdzono stan Git przed zmianami: repozytorium było czyste.
- Potwierdzono obecność i śledzenie czterech wymaganych artefaktów: `Audio/AudioManifest.xlsx`, `DataVault/SampleFiles/Repozytorium.xlsx`, `DataVault/SampleFiles/data.json`, `DataVault/SampleFiles/firebase-import.json`.
- Przeszukano repozytorium pod kątem prywatnych URL-i, domen, e-maili, konfiguracji Firebase właściciela, sekretów, starych nazw oraz pozostałości Web Push.
- Sprawdzono publiczne wejścia UI, nazwy presetów DataSlate, dokumentacje modułów, integralność XLSX, poprawność JSON, zgodność przykładu XLSX DataVault z wygenerowanym JSON i lokalne ścieżki `href`/`src` publicznych wejść.

### Ustalenia i wnioski

- Nie znaleziono aktywnych prywatnych danych właściciela, prywatnych linków grupy, prywatnych e-maili technicznych, prawdziwych sekretów, kluczy VAPID, aktywnych endpointów Web Push ani endpointów Cloudflare Worker.
- `Audio/AudioManifest.xlsx` pozostaje śledzonym, produkcyjnym plikiem neutralnym. Integralność XLSX jest poprawna, a zawartość używa neutralnego przykładowego adresu `https://example.site/examplefolder/`. Pliku XLSX nie modyfikowano.
- Wszystkie trzy przykładowe pliki `DataVault/SampleFiles/` są obecne, śledzone i poprawne syntaktycznie. `DataVault/SampleFiles/Repozytorium.xlsx` przechodzi test integralności ZIP/XLSX, a referencyjny generator Python tworzy JSON równy `DataVault/SampleFiles/data.json`. Wrapper `firebase-import.json` przechodzi round-trip: `JSON.parse(dataJson)` odpowiada przykładowemu `data.json`.
- `DataVault/docs/README.md` już przed audytem opisywał folder `DataVault/SampleFiles/` po angielsku i po polsku, wraz z rolami `Repozytorium.xlsx`, `data.json` oraz `firebase-import.json`; nie wymagał zmiany.
- `Audio/docs/README.md` wymagał jawnego opisu, że bieżący manifest jest neutralnym manifestem produkcyjnym. W części angielskiej pozostały też polskie nazwy przycisków; poprawiono je.
- W `DataSlate/assets/data/data.json` znaleziono polskie nazwy presetów widoczne w dropdownach GM: dziewięć nazw backgroundów i dwie nazwy fontów. Przetłumaczono wyłącznie pola `name`, bez zmiany ID, ścieżek, fillerów ani struktury JSON.
- W `Audio/index.html` znaleziono dwa aktywne, nieprzetłumaczone alerty błędu odtwarzania. Podłączono je do istniejącego mechanizmu PL/EN przez nowe etykiety `playbackError`.
- Poprawiono tytuły kart przeglądarki `NameGenerator/index.html` i `Calculators/XPCalculator.html`, ponieważ tytuły te nie były aktualizowane przez mechanizm językowy runtime.
- Poprawiono aktywny identyfikator modułu zapisu Character Creation oraz aktualny komentarz konfiguracji Firebase z `Calculators/TworzeniePostaci` na `Calculators/CharacterCreation`. Sama integracja Firebase pozostała niezmieniona.
- Poprawiono aktualne instrukcje użytkowe i techniczne Main/Calculators, które nadal używały starych nazw jako nazw bieżących modułów lub plików.
- Pozostałe trafienia starych nazw zostały ocenione jako poprawne: historyczne wpisy `Analizy/Release.md` i `DetaleLayout.md`, jawne ogólne zasady w `AGENTS.md`, zachowane nazwy pomocniczych plików DataSlate `Infoczytnik_test.html` i `Infoczytnik_backup.html`, wewnętrzny selektor `data-infoczytnik-link` w Main, rzeczywiste zachowane nazwy plików CSS/backupów Calculators oraz stabilne klucze danych Firestore/localStorage `generatorNpc` w NPCGenerator.
- Trafienia `Notification` w DataVault/NPCGenerator wynikają z komentarza dotyczącego miejsca na ikonę powiadomienia logowania, a nie z Web Push. Trafienia `Web Push` w `DataSlate/config/FirebaseREADME.md` są poprawnymi instrukcjami mówiącymi wprost, że Release nie zawiera Web Push.
- Nie modyfikowano integracji Firebase, nie przywracano Web Push, nie usuwano ani nie edytowano plików testowych/backupowych DataSlate, nie zmieniano generowanych wyników `NameGenerator`, nie zmieniano plików XLSX i nie przebudowywano struktur danych Audio ani DataVault.

### Decyzje i wymagania

- `Audio/AudioManifest.xlsx` należy traktować jako neutralny manifest produkcyjny publicznej paczki.
- `DataVault/SampleFiles/` pozostaje publicznym katalogiem przykładowym z gotowymi plikami XLSX, backup JSON i wrapperem importowym Firebase RTDB.
- Zachowane pomocnicze nazwy plików DataSlate `Infoczytnik_test.html` oraz `Infoczytnik_backup.html` nadal są zamierzone i nie podlegają zmianie nazwy w tym etapie.
- Stabilnych kluczy danych `generatorNpc`, nazw istniejących plików CSS/backupów oraz ścieżek assetów nie należy zmieniać wyłącznie z powodu dopasowania tekstowego do starych nazw.

### Zmienione pliki

| Plik | Opis zmiany |
| --- | --- |
| `Audio/docs/README.md` | Dodano angielski i polski opis neutralnego manifestu produkcyjnego oraz poprawiono polskie etykiety przycisków w angielskiej instrukcji. |
| `Audio/index.html` | Dodano tłumaczenie komunikatu błędu odtwarzania i użyto go w dwóch alertach runtime. |
| `Calculators/CharacterCreation.html` | Zmieniono aktywny identyfikator modułu zapisu na `Calculators/CharacterCreation`. |
| `Calculators/XPCalculator.html` | Zmieniono statyczny tytuł karty przeglądarki na `XP Calculator`. |
| `Calculators/config/firebase-config.js` | Zaktualizowano wyłącznie komentarz wdrożeniowy do nazwy `Calculators/CharacterCreation`; wartości i logika Firebase nie zostały zmienione. |
| `Calculators/docs/README.md` | Poprawiono bieżące odwołania do pliku `CharacterCreation.html`. |
| `DataSlate/assets/data/data.json` | Przetłumaczono widoczne nazwy presetów backgroundów i fontów; zachowano ID, ścieżki i strukturę JSON. |
| `Main/docs/Documentation.md` | Zastąpiono aktywne odwołania do Infoczytnika nazwą DataSlate i usunięto mylące stwierdzenie o backendzie Node.js. |
| `Main/docs/README.md` | Ujednolicono nazwę przycisku/modułu `Calculators` w instrukcji EN i PL. |
| `NameGenerator/index.html` | Zmieniono statyczny tytuł karty przeglądarki na `Name Generator`; wyników generatora nie tłumaczono. |
| `Analizy/Release.md` | Dopisano niniejszą sekcję audytu. |

### Szczegóły zmian w kodzie i dokumentacji

- Audio zachowuje dotychczasowy parser i strukturę manifestu. Jedyna zmiana runtime to przeniesienie polskiego alertu do słownika tłumaczeń i dodanie angielskiego odpowiednika.
- DataSlate zachowuje identyczne ID i pola `file`. Zmieniono tylko teksty `name`, które panel GM pokazuje w dropdownach.
- Character Creation zachowuje dotychczasową strukturę zapisywanego obiektu. Zmieniono jedynie opisowy identyfikator `module`, aby nie publikować starej nazwy pliku.
- Dokumentacja Audio opisuje stan faktyczny po dodaniu manifestu, a dokumentacje Main i Calculators nie kierują już użytkownika do starych nazw bieżących modułów lub plików.

### Testy

- `git status --short` przed zmianami: PASS — repozytorium było czyste.
- `git status --short` po zmianach: PASS — pokazuje wyłącznie pliki zmienione w ramach tego audytu.
- `git ls-files --error-unmatch Audio/AudioManifest.xlsx DataVault/SampleFiles/Repozytorium.xlsx DataVault/SampleFiles/data.json DataVault/SampleFiles/firebase-import.json`: PASS — wszystkie wymagane pliki są śledzone.
- Test integralności ZIP przez Python `ZipFile.testzip()` dla `Audio/AudioManifest.xlsx` i `DataVault/SampleFiles/Repozytorium.xlsx`: PASS.
- `python3 DataVault/build_json.py DataVault/SampleFiles/Repozytorium.xlsx /tmp/wng-release-audit/data.json`: PASS.
- Porównanie wygenerowanego `/tmp/wng-release-audit/data.json` z `DataVault/SampleFiles/data.json`: PASS — obiekty JSON są równe.
- Round-trip `json.loads(firebase-import.json["dataJson"]) == data.json`: PASS.
- `python3 -m json.tool DataVault/SampleFiles/data.json > /dev/null`: PASS.
- `python3 -m json.tool DataVault/SampleFiles/firebase-import.json > /dev/null`: PASS.
- `python3 -m json.tool DataSlate/assets/data/data.json > /dev/null`: PASS.
- `node --check DataVault/app.js`: PASS.
- `node --check DiceRoller/script.js`: PASS.
- `node --check NameGenerator/script.js`: PASS.
- `git diff --check`: PASS.
- Statyczny skrypt Python sprawdzający lokalne `href`/`src` w 12 publicznych wejściach: PASS — brak brakujących lokalnych celów.
- Wyszukiwanie starych nazw `GeneratorNPC|GeneratorNazw|Infoczytnik|Kalkulator|KalkulatorXP|TworzeniePostaci`: PASS po klasyfikacji trafień — brak niepoprawnych aktywnych ścieżek użytkowych po zmianach; pozostały wpisy historyczne, stabilne klucze wewnętrzne, zachowane istniejące nazwy plików i zamierzone nazwy pomocniczych plików DataSlate.
- Wyszukiwanie `web-push|webPush|Web Push|vapid|VAPID|PushManager|Notification|push/subscribe|push/trigger|wrathandglory-push-api|tarczynski-pawel.workers.dev`: PASS po klasyfikacji trafień — brak aktywnego Web Push; pozostały instrukcje wykluczające Web Push, historia i komentarze dotyczące ikony logowania.
- Wyszukiwanie `INSERT_YOUR_API_KEY|INSERT_YOUR_VTT_LINK|INSERT_YOUR_IMAGE_FOLDER_OR_CHANNEL_LINK`: PASS — trafienia są zamierzonymi angielskimi placeholderami Release.
- Wyszukiwanie potencjalnych prywatnych domen, e-maili i sekretów: PASS — nie znaleziono aktywnych prywatnych wartości właściciela.
- Próba ustalenia możliwości wykonania zrzutu ekranu: WARNING — środowisko nie zawiera Playwright, Selenium ani lokalnej przeglądarki Chromium, dlatego nie wykonano automatycznego screenshotu zmienionych dropdownów DataSlate.

### Ryzyka i następne kroki

- Audyt statyczny nie zastępuje testu przeglądarkowego z rzeczywistym serwerem HTTP i własnym projektem Firebase. Następny krok wdrożeniowy to ręczne sprawdzenie DataSlate GM → ekran gracza po podstawieniu własnego Firestore oraz Audio w trybie user/admin po uruchomieniu hostingu statycznego.
- Warto ręcznie obejrzeć dropdowny DataSlate po hostowaniu, aby wizualnie potwierdzić angielskie nazwy presetów. Automatyczny screenshot nie był możliwy w tym środowisku z powodu braku przeglądarki.
- Zachowane stabilne identyfikatory wewnętrzne i nazwy plików pomocniczych mogą nadal pojawiać się w wynikach prostych wyszukiwań; nie są blokadą Release i nie powinny być masowo zmieniane bez osobnej decyzji migracyjnej.

#### Uzupełnienie testów końcowych po dopisaniu sekcji audytu

- Wyodrębnienie inline JavaScript z `Audio/index.html`, `Calculators/XPCalculator.html` i `Calculators/CharacterCreation.html` do tymczasowych plików `.mjs`, a następnie `node --check /tmp/wng-inline-js/*.mjs`: PASS — składnia wszystkich trzech zmienionych skryptów osadzonych jest poprawna.
- Ponowne globalne wyszukiwanie wymaganych starych nazw po dopisaniu dziennika: PASS po klasyfikacji. Trafienia obejmują przede wszystkim historię, niniejszy prompt audytowy, dozwolone pliki pomocnicze DataSlate, zachowane nazwy techniczne oraz stabilne identyfikatory wewnętrzne.
- Ponowne globalne wyszukiwanie wymaganych fraz Web Push po dopisaniu dziennika: PASS po klasyfikacji. Trafienia obejmują historię, niniejszy prompt audytowy, ogólne reguły `AGENTS.md`, poprawne instrukcje o braku Web Push oraz komentarze ikony logowania; nie znaleziono aktywnej implementacji Web Push.
- Ponowne globalne wyszukiwanie wymaganych placeholderów po dopisaniu dziennika: PASS — znaleziono wyłącznie zamierzone placeholdery Release i ich dokumentację.

## Aktualizacja — 2026-05-30 — audyt zbędnych, roboczych i historycznych plików przed publicznym Release

### Oryginalny pełny prompt użytkownika

Teraz trzeba zrobić audyt zbędnych plików, np. DoZrobienia.md

### Zakres prac

Wykonano osobny etap Release obejmujący wyłącznie analizę plików śledzonych przez Git. Nie usunięto ani nie przeniesiono żadnego pliku, nie zmieniono kodu aplikacji, nie ruszono integracji Firebase, nie przywrócono ani nie zmieniono Web Push i nie tłumaczono wyników `NameGenerator`.

Audyt objął:

- odczyt obowiązujących plików `AGENTS.md` oraz `Analizy/Release.md` przed rozpoczęciem analizy;
- pełną inwentaryzację przez `git ls-files`;
- sprawdzenie nazw wskazujących na drafty, backupy, testy, pliki robocze i stare wersje;
- sprawdzenie powiązań podejrzanych plików przez `rg`, analizę odwołań w HTML, JS i dokumentacji oraz porównanie SHA-256 dla roboczych i produkcyjnych logo DataSlate;
- sprawdzenie lokalizacji i rozmiarów plików binarnych bez prób odczytywania ich zawartości na siłę;
- przygotowanie rekomendacji do osobnej akceptacji właściciela.

### Metoda audytu

1. Uruchomiono `git status --short`, aby potwierdzić czysty stan początkowy.
2. Uruchomiono `git ls-files`; repozytorium zawiera **137 śledzonych plików**.
3. Listę podzielono według roli: runtime aplikacji, konfiguracja i wdrożenie, dokumentacja, przykłady Release, pomocnicze testy i backupy zachowywane decyzją właściciela, materiały robocze/historyczne oraz kandydaci do decyzji.
4. Dla podejrzanych plików uruchomiono wyszukiwania dokładnych nazw i nazw bez rozszerzeń. Przy ocenie odróżniono aktywne odwołania runtime od wpisów historycznych w `Analizy/Release.md`.
5. Dla `DataSlate/Draft/Loga/*.png` porównano SHA-256 z `DataSlate/assets/logos/*.png`. Wszystkie 14 plików roboczych mają identyczne odpowiedniki produkcyjne; różni się wyłącznie nazwa roboczego `Chaos.png`, którego identyczny produkcyjny odpowiednik to `Chaos_Undivided.png`.
6. Dla plików binarnych użyto nazw, lokalizacji, rozmiarów, dokumentacji i odwołań tekstowych. Nie rozpakowywano ani nie interpretowano zawartości binarnej na siłę.

### Pełna inwentaryzacja repozytorium według kategorii

| Kategoria | Pliki lub zakresy plików | Liczba | Ocena |
| --- | --- | ---: | --- |
| Główne pliki aplikacji | `Audio/index.html`; `Calculators/index.html`, `Calculators/XPCalculator.html`, `Calculators/CharacterCreation.html`, `Calculators/kalkulatorxp.css`; `DataSlate/index.html`, `DataSlate/GM.html`, `DataSlate/DataSlate.html`; `DataVault/index.html`, `DataVault/app.js`, `DataVault/style.css`, `DataVault/xlsxCanonicalParser.js`, `DataVault/build_json.py`; `DiceRoller/index.html`, `DiceRoller/script.js`, `DiceRoller/style.css`; `Main/index.html`; `NPCGenerator/index.html`, `NPCGenerator/style.css`; `NameGenerator/index.html`, `NameGenerator/script.js`, `NameGenerator/style.css`; `shared/access-gate.css`, `shared/firebase-data-loader.js`; `manifest.webmanifest` | 25 | Produkcyjne; zostawić. |
| Konfiguracje Firebase i instrukcje wdrożeniowe | `shared/firebase-config.js`, `shared/FirebaseREADME.md`; `Audio/config/*`; `Calculators/config/*`; `DataSlate/config/*`; `NPCGenerator/config/*` | 10 | Wymagane przez konfigurowalną architekturę Release; zostawić. |
| Dokumentacja modułów i dokumenty wymagane publicznie | `Audio/docs/*`, `Audio/Disclaimer.md`; `Calculators/docs/*`; `DataSlate/docs/README.md`, `DataSlate/docs/Documentation.md`; `DataVault/docs/*`; `DiceRoller/docs/*`; `Main/docs/*`; `NPCGenerator/docs/*`; `NameGenerator/docs/*`; `AGENTS.md`; `Analizy/Release.md`; `Main/ZmienneHiperlacza.md` | 21 | Zostawić; `Audio/Disclaimer.md` wymaga decyzji wyłącznie w sprawie sposobu ekspozycji, nie automatycznego usunięcia. |
| Produkcyjne lub wspierające assety Audio, Calculators, DataVault, Main i root | `Audio/AudioManifest.xlsx`; `Calculators/Koza.gif`, `Calculators/Modal_Icon.png`, `Calculators/Skull.png`, `Calculators/HowToUse/en.pdf`, `Calculators/HowToUse/pl.pdf`; `DataVault/Icon.png`; `Main/wrath-glory-logo-warhammer.png`; `IkonaGlowna.png`; `IkonaPowiadomien2.png` | 10 | Używane albo jawnie zachowane; zostawić. |
| Produkcyjne i modyfikacyjne assety DataSlate | `DataSlate/assets/backgrounds/*` (10), `DataSlate/assets/logos/*` (14), `DataSlate/assets/ramki/*` (10), `DataSlate/assets/audios/*` (2), `DataSlate/assets/data/DataSlate_manifest.xlsx`, `DataSlate/assets/data/Mapowanie.xlsx`, `DataSlate/assets/data/NiebieskaRamka.md`, `DataSlate/assets/data/data.json` | 40 | Zostawić. Ramki, mapowanie i notatka obliczeniowa wspierają modyfikacje layoutu, nawet gdy część wyników jest zaszyta w HTML. |
| Publiczne przykłady DataVault | `DataVault/SampleFiles/Repozytorium.xlsx`, `DataVault/SampleFiles/data.json`, `DataVault/SampleFiles/firebase-import.json` | 3 | Celowo zachowane w Release decyzją właściciela. |
| Pomocnicze testy i backupy DataSlate | `DataSlate/GM_test.html`, `DataSlate/Infoczytnik_test.html`, `DataSlate/GM_backup.html`, `DataSlate/Infoczytnik_backup.html` | 4 | Celowo zachowane w Release decyzją właściciela. |
| Kandydaci do usunięcia po akceptacji | `DoZrobienia.md`; `IkonaPowiadomien.png`; `DataSlate/Draft/Loga/*.png` (14) | 16 | Niepotrzebne w publicznej paczce według audytu; nie usunięto ich w tym etapie. |
| Kandydaci do archiwizacji po akceptacji | `Kolumny.md`; `DetaleLayout.md`; `Calculators/HowToUse/draft.docx`; `Calculators/Old/HowToUse_Org.pdf`; `Calculators/Old/Kalkulator_Org.html`; `DataSlate/Draft/old_Inquisition.png`; `DataSlate/Draft/old_Mechanicus.png`; `DataSlate/docs/Prefixy_i_Suffixy.txt` | 8 | Zachowują wartość historyczną, projektową albo pomocniczą, ale nie są potrzebne w głównej paczce runtime. |

Suma kategorii: **137 plików**. Kategorie są rozłączne. Pliki wskazane do usunięcia albo archiwizacji nadal fizycznie pozostają w repozytorium po tym audycie.

### Ustalenia i wnioski

#### Znani kandydaci wskazani przez właściciela

- `DoZrobienia.md` istnieje. Jest krótką prywatną listą roboczą zawierającą trzy punkty dotyczące tooltipów DataVault, polskich liter oraz flickera w dawnym Infoczytniku. Nie jest linkowany poza historią `Analizy/Release.md`, nie stanowi dokumentacji Release i powinien zostać usunięty po akceptacji właściciela.
- `Kolumny.md` istnieje. Jest rozbudowaną techniczną notatką o szerokościach i formatowaniu tabel DataVault, opartą na polskich nazwach arkuszy. Nie jest importowany ani linkowany jako wymagany plik runtime. Może nadal pomagać podczas rozwoju, dlatego bezpieczniej przenieść go do prywatnego archiwum po akceptacji właściciela zamiast usuwać bezpowrotnie.
- `DetaleLayout.md` istnieje. Jest historyczno-technologicznym dziennikiem decyzji layoutowych. Nadal jest wymieniony w `DataVault/docs/Documentation.md` jako główny dokument opisujący layout, więc archiwizacja wymaga równoczesnej aktualizacji tej aktywnej dokumentacji. Nie należy usuwać go bez przygotowania tej poprawki.

#### Dodatkowe wykryte materiały robocze i historyczne

- `Calculators/HowToUse/draft.docx` nie ma odwołań tekstowych. Produkcyjne instrukcje to `Calculators/HowToUse/en.pdf` i `Calculators/HowToUse/pl.pdf`; draft powinien trafić do archiwum po akceptacji.
- `Calculators/Old/HowToUse_Org.pdf` i `Calculators/Old/Kalkulator_Org.html` są stare i nie są ścieżką runtime. Obecna dokumentacja wymienia je tylko w drzewie plików. Z uwagi na wartość referencyjną rekomendowana jest archiwizacja, nie natychmiastowe usunięcie.
- `DataSlate/Draft/Loga/*.png` zawiera 14 roboczych kopii logo. Porównanie SHA-256 potwierdziło, że każdy plik ma identyczny odpowiednik w `DataSlate/assets/logos/`; ścieżki runtime prowadzą do `assets/logos/`, nie do `Draft/Loga/`. Te kopie można usunąć po akceptacji.
- `DataSlate/Draft/old_Inquisition.png` i `DataSlate/Draft/old_Mechanicus.png` nie mają odwołań poza historią i nie są identyczne z aktualnymi produkcyjnymi logo. Ich nazwy wskazują na starsze wersje projektowe, dlatego rekomendowana jest archiwizacja.
- `DataSlate/docs/Prefixy_i_Suffixy.txt` nie jest linkowany ani ładowany runtime. Zawiera katalog tekstów tematycznych, który może być użytecznym źródłem projektowym dla przyszłych zmian DataSlate. Rekomendowana jest archiwizacja po akceptacji właściciela, a nie bezpowrotne usunięcie.
- `IkonaPowiadomien.png` nie ma aktywnych odwołań. Używaną ikoną bramki dostępu jest `IkonaPowiadomien2.png`. Ponieważ Web Push pozostaje poza zakresem Release, nieużywana starsza ikona jest kandydatem do usunięcia po akceptacji.

#### Pliki, które początkowo mogą wyglądać na zbędne, ale należy zostawić

- `DataSlate/assets/data/DataSlate_manifest.xlsx` jest ładowany przez panel GM i opisany w dokumentacji jako źródło importu XLSX → JSON.
- `DataSlate/assets/data/Mapowanie.xlsx`, `DataSlate/assets/data/NiebieskaRamka.md` oraz `DataSlate/assets/ramki/*` wspierają przeliczanie prostokątów treści dla ramek. Aktualne wyniki są wpisane jako `CONTENT_RECTS_BY_BACKGROUND_ID` w ekranach gracza, a komentarze i dokument pomocniczy wskazują źródłowe mapowanie. Te pliki warto zachować dla użytkowników modyfikujących DataSlate.
- `Audio/Disclaimer.md` nie jest obecnie linkowany z UI, ale zawiera informację o inspiracji i atrybucję. Nie należy usuwać go automatycznie. Właściciel powinien zdecydować osobno, czy dodać widoczne odwołanie z dokumentacji lub interfejsu.
- `IkonaGlowna.png` jest używany przez `manifest.webmanifest`.
- `IkonaPowiadomien2.png` jest używany przez bramki dostępu DataVault i NPCGenerator.
- `Calculators/HowToUse/en.pdf` oraz `Calculators/HowToUse/pl.pdf` są publicznymi instrukcjami otwieranymi dynamicznie z `CharacterCreation.html`.

### Tabela rekomendacji plików

| Plik | Typ pliku | Obecna rola | Czy jest używany/linkowany | Ryzyko usunięcia | Rekomendacja | Uzasadnienie |
| --- | --- | --- | --- | --- | --- | --- |
| `DoZrobienia.md` | notatka Markdown | Prywatna lista trzech zadań roboczych | Tylko historia `Analizy/Release.md` | niskie | usunąć po akceptacji właściciela | Nie jest dokumentacją ani zależnością runtime; zawiera nieaktualne robocze punkty. |
| `IkonaPowiadomien.png` | PNG | Starsza ikona powiadomień | Brak aktywnych odwołań | niskie | usunąć po akceptacji właściciela | Używana bramka dostępu odwołuje się do `IkonaPowiadomien2.png`; Web Push nie należy do Release. |
| `DataSlate/Draft/Loga/*.png` (14 plików) | PNG | Robocze kopie logo | Brak aktywnych ścieżek do `Draft/Loga/` | niskie | usunąć po akceptacji właściciela | SHA-256 każdego pliku odpowiada produkcyjnemu plikowi z `DataSlate/assets/logos/`. |
| `Kolumny.md` | notatka Markdown | Techniczna mapa szerokości tabel DataVault | Nie jest wymagany runtime; zachowuje wartość pomocniczą | średnie | przenieść do archiwum po akceptacji właściciela | Dokument może pomagać w rozwoju, ale zawiera szczegółowe notatki robocze i polskie nazwy arkuszy. |
| `DetaleLayout.md` | dokument Markdown | Historyczno-techniczny dziennik layoutu | Wymieniony w `DataVault/docs/Documentation.md` | średnie | przenieść do archiwum po akceptacji właściciela | Nie jest zależnością runtime, lecz przed archiwizacją trzeba usunąć lub zastąpić aktywne odwołanie dokumentacyjne. |
| `Calculators/HowToUse/draft.docx` | DOCX | Draft instrukcji Calculators | Brak odwołań | niskie | przenieść do archiwum po akceptacji właściciela | Produkcyjne instrukcje PDF pozostają; plik źródłowy może mieć wartość edycyjną. |
| `Calculators/Old/HowToUse_Org.pdf` | PDF | Historyczna instrukcja Calculators | Tylko drzewo plików w dokumentacji Calculators | niskie | przenieść do archiwum po akceptacji właściciela | Nie jest używany runtime, ale może być punktem odniesienia. |
| `Calculators/Old/Kalkulator_Org.html` | HTML | Historyczna wersja kalkulatora | Tylko drzewo plików w dokumentacji Calculators | niskie | przenieść do archiwum po akceptacji właściciela | Nie jest aktywną stroną; zachowuje wartość referencyjną. |
| `DataSlate/Draft/old_Inquisition.png` | PNG | Starszy wariant logo | Brak aktywnych odwołań | niskie | przenieść do archiwum po akceptacji właściciela | Stary asset projektowy, odmienny od obecnego logo produkcyjnego. |
| `DataSlate/Draft/old_Mechanicus.png` | PNG | Starszy wariant logo | Brak aktywnych odwołań | niskie | przenieść do archiwum po akceptacji właściciela | Stary asset projektowy, odmienny od obecnego logo produkcyjnego. |
| `DataSlate/docs/Prefixy_i_Suffixy.txt` | TXT | Katalog pomocniczych tekstów tematycznych | Brak aktywnych odwołań | średnie | przenieść do archiwum po akceptacji właściciela | Nie jest potrzebny runtime, ale może być materiałem źródłowym przy przyszłych zmianach. |
| `DataSlate/assets/data/NiebieskaRamka.md` | dokument Markdown | Instrukcja obliczania prostokątów treści | Powiązany z `Mapowanie.xlsx`, ramkami i kodem `CONTENT_RECTS_BY_BACKGROUND_ID` | średnie | zostawić | Dokument wspiera modyfikacje DataSlate i wyjaśnia pochodzenie zaszytych wartości layoutu. |
| `DataSlate/assets/data/Mapowanie.xlsx` | XLSX | Mapa tło → ramka używana przy przeliczaniu layoutu | Wymieniona w komentarzach ekranów gracza i w `NiebieskaRamka.md` | średnie | zostawić | Jest źródłem pomocniczym dla modyfikacji układu; nie należy usuwać go automatycznie. |
| `DataSlate/assets/ramki/*` (10 plików) | PNG | Źródłowe nakładki ramek | Opisane w dokumentacji DataSlate i `NiebieskaRamka.md` | średnie | zostawić | Są częścią pakietu modyfikacyjnego DataSlate, nawet jeżeli runtime używa przeliczonych prostokątów. |
| `Audio/Disclaimer.md` | dokument Markdown | Atrybucja inspiracji dla modułu Audio | Nie jest linkowany z UI | średnie | wymaga decyzji właściciela | Nie usuwać automatycznie; zdecydować, czy dodać widoczne odwołanie z dokumentacji albo UI. |
| `Audio/AudioManifest.xlsx` | XLSX | Neutralny manifest produkcyjny Audio | Ładowany przez `Audio/index.html`, opisany w dokumentacji | wysokie | celowo zachowany w Release | Jawny wyjątek właściciela i produkcyjne źródło danych. |
| `DataVault/SampleFiles/Repozytorium.xlsx` | XLSX | Neutralny przykład wejścia DataVault | Opisany jako publiczny sample | wysokie | celowo zachowany w Release | Jawny wyjątek właściciela. |
| `DataVault/SampleFiles/data.json` | JSON | Neutralny przykład wyniku DataVault | Opisany jako publiczny sample | wysokie | celowo zachowany w Release | Jawny wyjątek właściciela. |
| `DataVault/SampleFiles/firebase-import.json` | JSON | Neutralny przykład importu Firebase | Opisany jako publiczny sample | wysokie | celowo zachowany w Release | Jawny wyjątek właściciela. |
| `DataSlate/GM_test.html` | HTML | Pomocniczy panel testowy DataSlate | Opisany w dokumentacji | wysokie | celowo zachowany w Release | Jawna decyzja właściciela: plik pozostaje jako materiał do testowania modyfikacji. |
| `DataSlate/Infoczytnik_test.html` | HTML | Pomocniczy ekran gracza DataSlate | Opisany w dokumentacji | wysokie | celowo zachowany w Release | Jawna decyzja właściciela: plik pozostaje jako materiał do testowania modyfikacji. |
| `DataSlate/GM_backup.html` | HTML | Backup referencyjny panelu GM | Opisany w dokumentacji | wysokie | celowo zachowany w Release | Jawna decyzja właściciela: backup pozostaje jako punkt odniesienia. |
| `DataSlate/Infoczytnik_backup.html` | HTML | Backup referencyjny ekranu gracza | Opisany w dokumentacji | wysokie | celowo zachowany w Release | Jawna decyzja właściciela: backup pozostaje jako punkt odniesienia. |

### Plan kolejnego kroku

#### A. Pliki, które można bezpiecznie usunąć po akceptacji właściciela

- `DoZrobienia.md`;
- `IkonaPowiadomien.png`;
- 14 zduplikowanych plików `DataSlate/Draft/Loga/*.png`.

Łącznie: **16 plików**.

#### B. Pliki, które lepiej przenieść do archiwum zamiast usuwać

- `Kolumny.md`;
- `DetaleLayout.md`;
- `Calculators/HowToUse/draft.docx`;
- `Calculators/Old/HowToUse_Org.pdf`;
- `Calculators/Old/Kalkulator_Org.html`;
- `DataSlate/Draft/old_Inquisition.png`;
- `DataSlate/Draft/old_Mechanicus.png`;
- `DataSlate/docs/Prefixy_i_Suffixy.txt`.

Łącznie: **8 plików**.

#### C. Pliki, które trzeba zostawić

- wszystkie główne pliki HTML, JS i CSS aplikacji;
- wszystkie publiczne konfiguracje Firebase z placeholderami oraz instrukcje ich wdrożenia;
- `Main/ZmienneHiperlacza.md`;
- produkcyjne assety Audio, Calculators, DataVault, Main, NPCGenerator, DataSlate i manifestu PWA;
- `DataSlate/assets/data/DataSlate_manifest.xlsx`;
- `DataSlate/assets/data/Mapowanie.xlsx`;
- `DataSlate/assets/data/NiebieskaRamka.md`;
- `DataSlate/assets/data/data.json`;
- `DataSlate/assets/ramki/*`;
- bieżącą dokumentację modułów, `AGENTS.md` i `Analizy/Release.md`.

#### D. Pliki wymagające decyzji właściciela

- `Audio/Disclaimer.md` — plik należy zachować, ale właściciel powinien zdecydować, czy dodać widoczne odwołanie do atrybucji z dokumentacji albo UI Audio.
- Pakiet 16 kandydatów z listy A wymaga akceptacji przed usunięciem.
- Pakiet 8 kandydatów z listy B wymaga akceptacji przed przeniesieniem oraz decyzji, czy archiwum ma pozostać poza publicznym repozytorium, czy w osobnym katalogu publicznym.

#### E. Pliki wyłączone z usuwania na mocy aktualnych decyzji Release

- `Audio/AudioManifest.xlsx`;
- `DataVault/SampleFiles/Repozytorium.xlsx`;
- `DataVault/SampleFiles/data.json`;
- `DataVault/SampleFiles/firebase-import.json`;
- `DataSlate/GM_test.html`;
- `DataSlate/Infoczytnik_test.html`;
- `DataSlate/GM_backup.html`;
- `DataSlate/Infoczytnik_backup.html`.

### Zmienione pliki

| Plik | Opis zmiany |
| --- | --- |
| `Analizy/Release.md` | Dopisano niniejszą sekcję audytu, inwentaryzację, klasyfikację ryzyka, tabelę rekomendacji, wyniki wyszukiwań i plan następnego kroku. |

### Szczegóły zmian w kodzie

Kod aplikacji nie został zmieniony. Nie usunięto i nie przeniesiono żadnego pliku. Aktualizacja dotyczy wyłącznie analizy i dokumentacji Release.

### Testy i wyszukiwania

- `git status --short` przed audytem: PASS — repozytorium było czyste.
- `git ls-files`: PASS — zapisano i przeanalizowano listę **137 śledzonych plików**.
- `rg -n -F "DoZrobienia.md" . || true`: PASS — trafienia wyłącznie w historycznych sekcjach `Analizy/Release.md`; brak aktywnych odwołań.
- `rg -n -F "Kolumny.md" . || true`: PASS — trafienia wyłącznie w historycznych sekcjach `Analizy/Release.md`; brak aktywnych odwołań do pełnej nazwy pliku.
- `rg -n -F "DetaleLayout.md" . || true`: PASS — oprócz historii znaleziono aktywne odwołanie dokumentacyjne w `DataVault/docs/Documentation.md`; należy je zaktualizować przy przyszłej archiwizacji.
- `rg -n -i "do zrobienia|todo|fixme|draft|backup|kopia|robocze|roboczy|testowy|tymczas" . || true`: PASS po klasyfikacji — wykryto historię Release, celowo zachowane testy i backupy DataSlate, draft Calculators oraz materiały robocze sklasyfikowane w tabeli.
- `git ls-files | rg -i "(backup|test|draft|old|copy|kopia|roboczy|tmp|temp|todo|dozrobienia|do_zrobienia)" || true`: PASS po klasyfikacji — wykryto `Calculators/HowToUse/draft.docx`, `Calculators/Old/*`, `DataSlate/Draft/*`, cztery celowo zachowane pliki testowe/backupowe DataSlate oraz `DoZrobienia.md`.
- Wyszukiwanie dokładnych nazw kandydatów przez `rg -n -F`: PASS — potwierdzono brak aktywnych odwołań do `DoZrobienia.md`, `IkonaPowiadomien.png`, `Calculators/HowToUse/draft.docx`, `DataSlate/docs/Prefixy_i_Suffixy.txt` i ścieżek `DataSlate/Draft/Loga/`.
- `sha256sum DataSlate/Draft/Loga/*.png DataSlate/Draft/*.png DataSlate/assets/logos/*.png | sort -k1,1`: PASS — wszystkie 14 plików `DataSlate/Draft/Loga/*.png` mają identyczne produkcyjne odpowiedniki w `DataSlate/assets/logos/`; dwa pliki `DataSlate/Draft/old_*.png` są odrębnymi starszymi wariantami.
- Wyszukiwanie `DataSlate_manifest.xlsx`, `Mapowanie.xlsx`, `NiebieskaRamka.md`, `IkonaGlowna.png`, `IkonaPowiadomien2.png`, assetów Calculators i danych przykładowych: PASS — potwierdzono role opisane w tabeli i brak podstaw do ich automatycznego usuwania.
- `git diff --check` przed dopisaniem raportu: PASS.

### Ryzyka

- Archiwizacja `DetaleLayout.md` bez jednoczesnej aktualizacji `DataVault/docs/Documentation.md` pozostawiłaby nieaktualne aktywne odwołanie dokumentacyjne.
- Usunięcie `DataSlate/assets/ramki/*`, `DataSlate/assets/data/Mapowanie.xlsx` albo `DataSlate/assets/data/NiebieskaRamka.md` utrudniłoby publicznym użytkownikom modyfikowanie layoutu DataSlate, mimo że część plików nie jest pobierana bezpośrednio w zwykłym runtime.
- `Audio/Disclaimer.md` zawiera atrybucję, ale nie jest widocznie linkowany. Przed publicznym wydaniem właściciel powinien określić sposób ekspozycji informacji zamiast usuwać plik jako „nieużywany”.
- Pliki przeznaczone do archiwizacji mogą trafić do prywatnego archiwum poza publiczną paczką albo do jawnego katalogu archiwalnego. Właściciel powinien zdecydować, który wariant obowiązuje przed przenoszeniem.

### Proponowany następny krok

Po akceptacji właściciela wykonać osobny, mały etap czyszczenia:

1. usunąć 16 zaakceptowanych plików z listy A;
2. przenieść 8 zaakceptowanych plików z listy B do ustalonej lokalizacji archiwum;
3. zaktualizować `DataVault/docs/Documentation.md` przy archiwizacji `DetaleLayout.md` oraz usunąć historyczne wpisy drzewa plików z `Calculators/docs/Documentation.md`, jeżeli archiwum będzie poza publiczną paczką;
4. zdecydować, gdzie widocznie odwołać się do `Audio/Disclaimer.md`;
5. ponownie uruchomić wyszukiwania nazw, kontrolę lokalnych odwołań i `git diff --check`.

#### Uzupełnienie kontroli końcowych po dopisaniu raportu

- Skrypt Python klasyfikujący każdy wynik `git ls-files` do dokładnie jednej kategorii: PASS — potwierdzono rozłączny podział wszystkich **137 plików**: 25 głównych plików aplikacji, 10 plików konfiguracji Firebase i instrukcji wdrożeniowych, 21 dokumentów publicznych, 10 pozostałych produkcyjnych assetów, 40 assetów DataSlate, 3 publiczne przykłady DataVault, 4 celowo zachowane testy/backupy DataSlate, 16 kandydatów do usunięcia i 8 kandydatów do archiwizacji.
- Ponowne `git status --short`: PASS — zmieniony jest wyłącznie `Analizy/Release.md`.
- Ponowne `git diff --check`: PASS — brak błędów whitespace po dopisaniu raportu.
- Ponowne wymagane wyszukiwania `rg` po dopisaniu raportu: PASS po klasyfikacji — nowe trafienia w `Analizy/Release.md` są częścią niniejszego dziennika audytu, nie aktywnymi zależnościami aplikacji.

## Aktualizacja — 2026-05-30 — usunięcie zaakceptowanych materiałów roboczych i zachowanie pozostałych plików

### Oryginalny pełny prompt użytkownika

```text
Poniższe pliki są do usunięcia:\nDoZrobienia.md\nIkonaPowiadomien.png\nDataSlate/Draft/Loga/*.png (14 plików)\nKolumny.md\nCalculators/HowToUse/draft.docx\nDataSlate/Draft/old_Inquisition.png\nDataSlate/Draft/old_Mechanicus.png\nDataSlate/docs/Prefixy_i_Suffixy.txt\nCalculators/Old/Kalkulator_Org.html\nCalculators/Old/HowToUse_Org.pdf\n\n\nZgodnie z opisem z Release.md zaktualizuj dokumentację DataVault/docs/Documentation.md a następnie usuń \nDetaleLayout.md\n\nPozostałe pliki z Tabela rekomendacji plików uznajemy jako konieczne do zatrzymania.\n\nPo wykonaniu zadania zaktualizuj plik Release.md
```

### Zakres prac

- Zweryfikowano czysty stan repozytorium oraz ponownie przeczytano bieżący dziennik Release i obowiązujący `AGENTS.md` przed rozpoczęciem zmian.
- Usunięto zaakceptowany pakiet **24 śledzonych plików**: 16 plików z wcześniejszej listy kandydatów do usunięcia oraz 8 plików z wcześniejszej listy kandydatów do archiwizacji.
- Przed usunięciem `DetaleLayout.md` zaktualizowano aktywne odwołanie w `DataVault/docs/Documentation.md`.
- Usunięto nieaktualny wpis katalogu `Old/` z drzewa referencyjnego w `Calculators/docs/Documentation.md`, ponieważ zaakceptowane pliki `Calculators/Old/*` nie są już częścią publicznej paczki.
- Wykonano kontrolę nieaktualnych odwołań, zachowania produkcyjnych logo DataSlate oraz poprawności diffu.

### Ustalenia i wnioski

- Wcześniejsza tabela rekomendacji wymieniała dokładnie zaakceptowany obecnie pakiet 16 kandydatów do usunięcia oraz 8 kandydatów do archiwizacji. Użytkownik zdecydował o usunięciu wszystkich tych 24 plików z repozytorium zamiast przenoszenia materiałów historycznych do archiwum w publicznej paczce.
- `DetaleLayout.md` nie był zależnością runtime. Jego jedyne aktywne odwołanie poza historią `Analizy/Release.md` znajdowało się w `DataVault/docs/Documentation.md`.
- Dokumentacja techniczna DataVault zawiera już opis fontów, kolorów, wyjątków formatowania, clamp i szerokości kolumn. Po usunięciu osobnego dziennika `DetaleLayout.md` dokumentacja DataVault została jawnie oznaczona jako samowystarczalne źródło tych informacji.
- Wszystkie 14 usuniętych kopii `DataSlate/Draft/Loga/*.png` pozostaje reprezentowanych przez zachowane produkcyjne assety w `DataSlate/assets/logos/`.
- Po usunięciach wyszukiwanie nie wykazało aktywnych odwołań poza historycznym dziennikiem `Analizy/Release.md` do usuniętych nazw i ścieżek.

### Decyzje i wymagania

- Usunąć z publicznego repozytorium wskazane przez użytkownika pliki robocze, drafty, starsze warianty, nadmiarowe kopie i dwa wcześniejsze materiały Calculators.
- Usunąć `DetaleLayout.md` dopiero po aktualizacji aktywnej dokumentacji DataVault.
- Wszystkie **pozostałe** pliki wymienione we wcześniejszej „Tabeli rekomendacji plików” uznać za konieczne do zatrzymania. Nie należy usuwać ani archiwizować kolejnych pozycji z tej tabeli bez nowej, wyraźnej decyzji właściciela.
- Produkcyjne logo DataSlate w `DataSlate/assets/logos/`, zachowane materiały pomocnicze DataSlate, pliki przykładowe DataVault, manifest Audio i pozostałe wcześniej sklasyfikowane pliki zostają w repozytorium.

### Zmienione pliki

| Plik lub grupa plików | Opis zmiany |
| --- | --- |
| `DataVault/docs/Documentation.md` | Zastąpiono aktywne odwołanie do usuniętego `DetaleLayout.md` informacją, że bieżący dokument jest samowystarczalnym źródłem opisu layoutu 1:1. |
| `Calculators/docs/Documentation.md` | Usunięto nieaktualną gałąź `Old/` z referencyjnego drzewa katalogów. |
| `DoZrobienia.md` | Usunięto zaakceptowany plik roboczy. |
| `IkonaPowiadomien.png` | Usunięto zaakceptowany nieużywany asset. |
| `Kolumny.md` | Usunięto zaakceptowany materiał roboczy. |
| `DetaleLayout.md` | Usunięto historyczno-techniczny dziennik layoutu po przeniesieniu aktywnej roli dokumentacyjnej do dokumentacji DataVault. |
| `Calculators/HowToUse/draft.docx` | Usunięto draft instrukcji. |
| `Calculators/Old/HowToUse_Org.pdf` | Usunięto starszą instrukcję Calculators. |
| `Calculators/Old/Kalkulator_Org.html` | Usunięto starszy plik HTML Calculators. |
| `DataSlate/Draft/Loga/*.png` | Usunięto 14 nadmiarowych kopii PNG; produkcyjne odpowiedniki pozostają w `DataSlate/assets/logos/`. |
| `DataSlate/Draft/old_Inquisition.png` | Usunięto starszy wariant assetu. |
| `DataSlate/Draft/old_Mechanicus.png` | Usunięto starszy wariant assetu. |
| `DataSlate/docs/Prefixy_i_Suffixy.txt` | Usunięto zaakceptowany materiał pomocniczy. |
| `Analizy/Release.md` | Dopisano niniejszą sekcję decyzji, implementacji i testów. |

### Szczegóły zmian w kodzie i dokumentacji

#### `DataVault/docs/Documentation.md`

- **Stan przed zmianą:** dokument wskazywał `DetaleLayout.md` w katalogu głównym jako główny dokument opisujący fonty, kolory, wyjątki formatowania, clamp i szerokości kolumn 1:1.
- **Stan po zmianie:** dokument wskazuje sam siebie jako główne, samowystarczalne źródło tego opisu.
- **Powód:** użytkownik zaakceptował usunięcie `DetaleLayout.md`; nie wolno było pozostawić aktywnego odwołania do nieistniejącego pliku.

#### `Calculators/docs/Documentation.md`

- **Stan przed zmianą:** referencyjne drzewo katalogów dokumentowało folder `Old/` oraz pliki `HowToUse_Org.pdf` i `Kalkulator_Org.html`.
- **Stan po zmianie:** gałąź `Old/` została usunięta z drzewa.
- **Powód:** użytkownik zaakceptował usunięcie obu plików; dokumentacja publiczna ma opisywać aktualny stan paczki.

#### Usunięte pliki

- Pliki usunięto bez zmian w logice runtime aplikacji.
- Nie usunięto produkcyjnych odpowiedników logo DataSlate z `DataSlate/assets/logos/`.
- Nie usunięto żadnych innych plików z wcześniejszej tabeli rekomendacji poza pozycjami jawnie wymienionymi przez użytkownika.

### Testy

- `git status --short` przed zmianami: PASS — repozytorium było czyste.
- `git ls-files -- DoZrobienia.md IkonaPowiadomien.png Kolumny.md DetaleLayout.md Calculators/HowToUse/draft.docx DataSlate/Draft/old_Inquisition.png DataSlate/Draft/old_Mechanicus.png DataSlate/docs/Prefixy_i_Suffixy.txt Calculators/Old/Kalkulator_Org.html Calculators/Old/HowToUse_Org.pdf 'DataSlate/Draft/Loga/*.png'`: PASS — potwierdzono oczekiwany pakiet **24 śledzonych plików** przed usunięciem, w tym 14 plików `DataSlate/Draft/Loga/*.png`.
- Kontrola `test ! -e` dla wskazanych plików oraz `find DataSlate/Draft/Loga -maxdepth 1 -type f -name '*.png'`: PASS — wszystkie zaakceptowane pliki są nieobecne w drzewie roboczym.
- `rg -n 'DetaleLayout\\.md|DoZrobienia\\.md|IkonaPowiadomien\\.png|Kolumny\\.md|draft\\.docx|HowToUse_Org\\.pdf|Kalkulator_Org\\.html|Prefixy_i_Suffixy\\.txt|DataSlate/Draft/Loga/|old_Inquisition\\.png|old_Mechanicus\\.png' . --glob '!Analizy/Release.md' || true`: PASS — brak aktywnych odwołań poza historycznym dziennikiem Release.
- `test "$(find DataSlate/assets/logos -maxdepth 1 -type f -name '*.png' | wc -l)" -ge 14`: PASS — zachowano 14 produkcyjnych plików PNG logo DataSlate.
- `git diff --check`: PASS — brak błędów whitespace.

### Ryzyka i następne kroki

- Historyczne sekcje `Analizy/Release.md` nadal wymieniają usunięte pliki. Jest to celowe: zgodnie z zasadą dziennika Release starsze wpisy pozostają niezmienione, a niniejsza datowana sekcja rejestruje późniejszą decyzję właściciela.
- `DataVault/docs/Documentation.md` nadal zawiera obszerną polską część techniczną po angielskim skrócie. Nie zmieniano jej w ramach tego zadania, ponieważ zakres obejmował usunięcie nieaktualnego odwołania do `DetaleLayout.md`, a nie pełne tłumaczenie dokumentacji technicznej.
- Pozostałych plików z wcześniejszej tabeli rekomendacji nie należy usuwać bez nowej decyzji właściciela.
