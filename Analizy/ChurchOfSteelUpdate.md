# Church of Steel Update — analiza przeniesienia zmian z `WrathAndGlory` do `WnG_Tools`

**Data analizy:** 2026-06-16  
**Repo źródłowe:** `CuteLittleGoat/WrathAndGlory`  
**Repo docelowe:** `CuteLittleGoat/WnG_Tools`  
**Zakres:** analiza różnic i lista zmian do późniejszego wdrożenia.  
**Wykonane zmiany w repo:** utworzono wyłącznie ten plik analizy. Kod aplikacji nie był modyfikowany.

---

## 0. Pełny prompt użytkownika

```text
Porównaj repozytoria "WrathAndGlory" oraz "WnG_Tools"

WrathAndGlory - główna aplikacja produkcyjna z językiem polskim jako głównym.
WnG_Tools - kopia aplikacji w wersji "release" (bez danych prywatnych takich jak połączenia z Firebase).

Repo "WnG_Tools" zostało utworzone przed kilkoma update "WrathAndGlory" i teraz trzeba je wprowadzić do "WnG_Tools".

Część dokumentacji masz w Analizy (repo WrathAndGlory). Główne zmiany dotyczyły aktualizacji modułu DataVault oraz GeneratorNPC (w repo WnG_Tools ten moduł nazywa się NPCGenerator).
Moduł GeneratorNPC teraz odnosi się do nazw zakładek z data.json. W wersji angielskiej zakładki będą po angielsku, więc to trzeba będzie poprawić. Podobnie trzeba sprawdzić czy są ustawione jakieś filtry i widoki domyślne - przy zmianie wersji językowej może się to popsuć. Dlatego trzeba wprowadzić zmianę, która sprawi, że widok domyślny i widok pełny będą tożsame (zawsze wszystko widoczne). Trzeba tylko WYRAŹNIE zaznaczyć w dokumentacji, README oraz jako komentarz w samym kodzie gdzie dokładnie trzeba co wpisać, żeby filtry zakładały się automatycznie i były przypisane jako "Widok Domyślny".

Część zmian dotyczyła też aktualizacji plików z dokumentacją. W repo WnG_Tools wersja angielska ma być pierwsza w dokumentacji.

Nie wprowadzaj zmian w kodzie. Przygotuj tylko plik z analizą i zapisz go w repo "WnG_Tools" jako Analizy/ChurchOfSteelUpdate.md

W pliku z analizą zapisz wszystkie różnice jakie są między modułami i co trzeba poprawić w WnG_Tools.
W repo WnG_Tools jest też folder z przykładowymi plikami zawierającymi placeholdery DataVault/SampleFiles
W repo WrathAndGlory wrzuciłem tymczasowo plik z prawdziwymi danymi po polsku Analizy/test.json (po przeprowadzeniu analizy zostanie on usunięty).

Przed wykonaniem zadania możesz zadać pytania doprecyzowujące. Po moich odpowiedziach możesz zadać kolejną serię pytań, jeżeli to jest potrzebne. W utworzonej analizie ma się znaleźć pełen prompt oraz odpowiedzi na ewentualne pytania.
```

### Pytania doprecyzowujące i odpowiedzi

Nie zadawałem pytań doprecyzowujących. Zakres był wystarczająco jasny: przygotować analizę i zapisać ją jako osobny plik w `WnG_Tools`, bez zmian w kodzie aplikacji.

---

## 1. Podsumowanie wykonawcze

`WnG_Tools` jest release'ową, anglojęzyczną kopią starszego stanu aplikacji. Najważniejsza różnica architektoniczna polega na tym, że nowszy `WrathAndGlory` ma bardziej deterministyczną obsługę danych DataVault oraz GeneratorNPC, ale ta deterministyka jest oparta na polskich nazwach zakładek i kolumn. W `WnG_Tools` dane przykładowe w `DataVault/SampleFiles` są już po angielsku, więc bez warstwy mapowania część mechanizmów będzie niestabilna albo przestanie działać.

Najważniejsze wnioski:

1. **Nie kopiować zmian 1:1.** W `WrathAndGlory` kanoniczne są polskie nazwy arkuszy. W `WnG_Tools` kanoniczny runtime release powinien obsługiwać angielskie zakładki, a najlepiej mapowanie PL/EN.
2. **Widok Domyślny w `WnG_Tools` ma być równy Pełnemu Widokowi.** `DEFAULT_VIEW_CONFIG` powinien być pusty albo dezaktywowany. Automatyczne filtry można zostawić tylko jako jawnie opisane miejsce rozszerzenia.
3. **GeneratorNPC / NPCGenerator wymaga warstwy aliasów arkuszy i kolumn.** Nowszy `WrathAndGlory/GeneratorNPC` używa dokładnych nazw polskich arkuszy, np. `Bestiariusz`, `Bronie`, `Pancerze`, `Psionika`. `WnG_Tools/DataVault/SampleFiles/data.json` ma angielskie arkusze, np. `Bestiary`, `Special Enemy Bonuses`, `Mobs`, `Size Table`, `Species`, `Archetypes`, `Ascension Packages`, `Faction Bonuses`.
4. **Do przeniesienia są funkcje ukrywania rekordów `old`.** `WrathAndGlory` ma nowszy model ukrywania zdezaktualizowanych wpisów Bestiariusza w DataVault i GeneratorNPC. `WnG_Tools` nadal tego nie ma albo ma starszą wersję.
5. **Do przeniesienia są zmiany pojazdów z DataVault.** `WrathAndGlory` ma zestaw arkuszy pojazdów, przełącznik pojazdów, metadane pojazdów i reguły słów kluczowych dla pojazdów. `WnG_Tools` ich nie ma.
6. **Dokumentację trzeba aktualizować po angielsku jako pierwszą.** `WnG_Tools` już ma w wielu dokumentach układ EN -> PL; należy go zachować i uzupełnić o nowsze treści z `WrathAndGlory`, ale przetłumaczone i dostosowane do release.
7. **`Analizy/test.json` w `WrathAndGlory` nie mogło zostać użyte jako źródło danych.** Plik pobrany przez GitHub Contents API ma pustą zawartość. Analiza opiera się więc na kodzie, dokumentacji i placeholderach z `WnG_Tools/DataVault/SampleFiles`.

---

## 2. Źródła porównania

### Repozytoria

- `CuteLittleGoat/WrathAndGlory` — główna aplikacja produkcyjna, domyślnie polska.
- `CuteLittleGoat/WnG_Tools` — release/kopia publiczna, domyślnie angielska, bez prywatnych danych Firebase.

### Główne pliki porównane

#### DataVault

- `WrathAndGlory/DataVault/index.html`
- `WrathAndGlory/DataVault/app.js`
- `WrathAndGlory/DataVault/docs/README.md`
- `WrathAndGlory/Analizy/Rozbudowa_DataVault.md`
- `WrathAndGlory/Analizy/Bestiariusz_old.md`
- `WnG_Tools/DataVault/index.html`
- `WnG_Tools/DataVault/app.js`
- `WnG_Tools/DataVault/docs/README.md`
- `WnG_Tools/DataVault/SampleFiles/data.json`

#### Generator NPC

- `WrathAndGlory/GeneratorNPC/index.html`
- `WrathAndGlory/GeneratorNPC/docs/README.md`
- `WrathAndGlory/Analizy/nazwy_old.md`
- `WnG_Tools/NPCGenerator/index.html`
- `WnG_Tools/NPCGenerator/docs/README.md`

---

## 3. DataVault — różnice i wymagane poprawki

### 3.1. Język domyślny i przełącznik języka

`WrathAndGlory/DataVault` jest ustawiony pod polski runtime:

- `index.html` ma `html lang="pl"`.
- przełącznik języka jest ukryty klasą `language-switcher--hidden`.
- kolejność opcji to `pl`, potem `en`.
- `app.js` ustawia `currentLanguage = "pl"`.

`WnG_Tools/DataVault` jest ustawiony pod release angielski:

- `index.html` ma `html lang="en"`.
- przełącznik języka jest widoczny.
- kolejność opcji to `en`, potem `pl`.
- `app.js` ustawia `currentLanguage = "en"`.

**Rekomendacja:** zachować zachowanie `WnG_Tools`: English first, visible language switcher, `currentLanguage = "en"`. Przy przenoszeniu zmian z `WrathAndGlory` nie przywracać ukrytego przełącznika ani polskiego domyślnego języka.

---

### 3.2. Checkbox zdezaktualizowanych wpisów Bestiariusza

`WrathAndGlory/DataVault` ma nowszy adminowy checkbox:

```text
Czy wyświetlić zdezaktualizowane wpisy?
Show outdated entries?
```

W `WrathAndGlory/DataVault/index.html` checkbox znajduje się w panelu filtrów przed checkboxami tworzenia postaci / zasad walki / pojazdów. W `app.js` istnieją powiązane elementy:

- `toggleBestiaryOldGroup`,
- `toggleOldBestiaryEntries`,
- `showOldBestiaryEntries`,
- `isBestiarySheet(name)`,
- `shouldShowRowInCurrentSystemView(row, sheetName)`,
- `getSystemVisibleRows(sheetName)`,
- `pruneHiddenOldBestiarySelection()`.

`WnG_Tools/DataVault` ma helper `isOldStatusRow`, ale nie ma pełnego UI i logiki checkboxa w aktualnym kształcie.

**Do poprawy w `WnG_Tools`:**

1. Dodać checkbox admin-only w `DataVault/index.html`.
2. Dodać tłumaczenia EN/PL:

```js
toggleOldBestiaryEntries: "Show outdated entries?"
toggleOldBestiaryEntries: "Czy wyświetlić zdezaktualizowane wpisy?"
```

3. Dodać stan runtime, ale **nie zapisywać go w `sessionStorage`**. Checkbox ma wracać do bezpiecznego odznaczenia.
4. Filtrować tylko widok, nie modyfikować `DB.sheets.Bestiariusz` / `DB.sheets.Bestiary`.
5. W `WnG_Tools` funkcja musi rozpoznawać zarówno polskie, jak i angielskie nazwy:

```text
arkusz: Bestiariusz / Bestiary
kolumna statusu: Stan / State
wartość: old
```

6. Menu filtrów kolumnowych musi brać wartości z wierszy widocznych systemowo, żeby ukryte wpisy `old` nie przeciekały przez listy filtrów.

---

### 3.3. Pojazdy i arkusze pojazdów

`WrathAndGlory` ma nowszą rozbudowę DataVault o pojazdy. Analiza `WrathAndGlory/Analizy/Rozbudowa_DataVault.md` wskazuje siedem arkuszy pojazdów:

```text
Role W Pojeździe
Akcje Pojazdu
Stany Pojazdów
Cechy Pojazdów
Pojazdy
Bronie Pojazdów
Ekwipunek Pojazdów
```

W `WrathAndGlory/DataVault/app.js` są już elementy:

- `VEHICLE_SHEETS`,
- `VEHICLE_SHEET_KEYS`,
- `isVehicleSheet(name)`,
- `showVehicleTabs`,
- `toggleVehicleTabs`,
- klasy `tab--vehicle`,
- metadane `_meta.vehicleTraits`, `_meta.vehicleWeaponTraits`, `_meta.vehicleStates`,
- indeksy `vehicleTraitIndex`, `vehicleWeaponTraitIndex`, `vehicleStateIndex`.

`WnG_Tools/DataVault` nadal ma tylko checkboxy grup:

- tworzenie postaci,
- zasady walki.

Nie ma trzeciego checkboxa pojazdów ani grupy `VEHICLE_SHEETS`.

**Do poprawy w `WnG_Tools`:**

1. Dodać obsługę pojazdów z `WrathAndGlory`, ale przez mapowanie PL/EN.
2. Dodać angielskie odpowiedniki arkuszy, np.:

```text
Role W Pojeździe   -> Vehicle Roles
Akcje Pojazdu      -> Vehicle Actions
Stany Pojazdów     -> Vehicle Conditions
Cechy Pojazdów     -> Vehicle Traits
Pojazdy            -> Vehicles
Bronie Pojazdów    -> Vehicle Weapons
Ekwipunek Pojazdów -> Vehicle Wargear / Vehicle Equipment
```

3. Uzgodnić jedną nazwę dla `Ekwipunek Pojazdów`: w analizie `WrathAndGlory` pojawia się informacyjnie `Vehicle Wargear`, natomiast w `WnG_Tools` przykładowe dane częściej używają prostego `Equipment`. Rekomendacja: używać jednego wariantu w sample files, dokumentacji i mapowaniu.
4. Dodać `toggleVehicleTabs` w `DataVault/index.html`, `translations`, `els`, `uiState`, `loadSessionState()`, `initUI()` i listenerach.
5. Dodać style `tab--vehicle` i checkbox vehicle zgodnie z paletą stalowo-srebrną albo przenieść gotowe style z `WrathAndGlory`.

---

### 3.4. Widok Domyślny i Pełen Widok

W `WnG_Tools/DataVault/app.js` istnieje `DEFAULT_VIEW_CONFIG` z polskimi nazwami arkuszy i wartościami filtrów, np.:

```js
"Archetypy": { "Gatunek": ["Człowiek"] }
"Premie Frakcji": { "Frakcja": [...] }
"Ekwipunek": { "Typ": [...] }
"Pancerze": { "Typ": [...] }
"Bronie": { "Typ": [...] }
"Talenty": { "Typ": [...] }
```

To jest problem w release angielskim, ponieważ:

- sample files używają angielskich nazw arkuszy (`Bestiary`, `Archetypes`, `Faction Bonuses`, itd.),
- kolumny też są angielskie (`Name`, `Type`, `Keywords`, `Page`, itd.),
- filtry oparte na polskich nazwach nie zadziałają albo będą mylące,
- po zmianie języka danych automatyczne filtry mogą ukrywać dane w nieprzewidywalny sposób.

**Wymaganie użytkownika:** w `WnG_Tools` widok domyślny i pełny mają być tożsame: zawsze wszystko widoczne.

**Do poprawy w `WnG_Tools`:**

1. Ustawić `DEFAULT_VIEW_CONFIG` jako pusty obiekt:

```js
const DEFAULT_VIEW_CONFIG = {};
```

2. Albo zmienić `applyDefaultViewForSheet(sheetName)`, aby dla release robiła dokładnie to samo co `applyFullViewForSheet(sheetName)`.
3. Wyczyścić / podbić klucz sesji, np. z:

```js
const SESSION_VIEW_KEY = "datavault_session_view_v2";
```

na nowy, np.:

```js
const SESSION_VIEW_KEY = "datavault_session_view_v3_release";
```

Dzięki temu stare filtry zapisane w przeglądarce nie będą odtwarzane po wdrożeniu zmiany.

#### Komentarz, który powinien znaleźć się w kodzie

W `DataVault/app.js`, bezpośrednio przy `DEFAULT_VIEW_CONFIG`, dodać bardzo widoczny komentarz:

```js
// --- RELEASE DEFAULT VIEW CONFIGURATION / KONFIGURACJA WIDOKU DOMYŚLNEGO RELEASE ---
// WnG_Tools intentionally keeps Default View identical to Full View.
// This means: no automatic filters, no default hiding, all rows visible except system-level safety rules
// such as hidden technical columns and optional outdated Bestiary entries.
//
// To re-enable automatic filters for "Default View", add entries below using CANONICAL sheet/column keys,
// not raw localized labels. Then document the exact mapping in:
// - README.md or module README,
// - DataVault/docs/README.md,
// - DataVault/docs/Documentation.md.
//
// Example target shape after introducing aliases:
// DEFAULT_VIEW_CONFIG = {
//   archetypes: { species: ["Human"] },
//   weapons: { type: ["Bolt", "Las", "Plasma"] }
// };
//
// Do not add Polish sheet names here in the English release unless the data.json sheets are also Polish.
const DEFAULT_VIEW_CONFIG = {};
```

#### README / dokumentacja — wymagany opis

W dokumentacji `WnG_Tools` dopisać po angielsku, a potem po polsku:

```text
Default View in WnG_Tools release

In this release, Default View is intentionally identical to Full View. It does not apply automatic filters and does not hide categories by default. This prevents language-specific sheet or column names from breaking the initial view when DataVault uses English data files.

To restore automatic default filters, edit DEFAULT_VIEW_CONFIG in DataVault/app.js. Use canonical sheet and column keys, not raw localized labels, and update the alias mapping and this documentation at the same time.
```

Polska wersja:

```text
Widok Domyślny w wydaniu WnG_Tools

W tej wersji release Widok Domyślny jest celowo tożsamy z Pełnym Widokiem. Nie zakłada automatycznych filtrów i nie ukrywa kategorii domyślnie. Zapobiega to sytuacji, w której nazwy zakładek lub kolumn zależne od języka psują widok początkowy.

Aby przywrócić automatyczne filtry domyślne, edytuj DEFAULT_VIEW_CONFIG w DataVault/app.js. Używaj kanonicznych kluczy arkuszy i kolumn, a nie surowych etykiet językowych, i zaktualizuj jednocześnie mapowanie aliasów oraz dokumentację.
```

---

### 3.5. Nazwy arkuszy i kolumn — główne ryzyko release

`WrathAndGlory` zakłada, że nazwy arkuszy i kolumn w danych są polskie. To było celowe w produkcyjnej wersji PL.

`WnG_Tools` ma być release angielskim i jego przykładowe dane już używają angielskich nazw, np.:

```text
Notes
Bestiary
Special Enemy Bonuses
Mobs
Size Table
Species
Archetypes
Ascension Packages
Faction Bonuses
Faction Keywords
Special Faction Bonuses
Astartes Implants
```

Dlatego `WnG_Tools` potrzebuje jednej z dwóch strategii:

### Strategia A — angielskie dane jako kanon release

Kod używa angielskich nazw arkuszy i kolumn. Polski pozostaje wyłącznie językiem UI.

Plusy:

- proste dla publicznego wydania,
- zgodne z `SampleFiles`,
- czytelne dla użytkowników EN.

Minusy:

- trudniej przenosić kod 1:1 z `WrathAndGlory`,
- trzeba przetłumaczyć wszystkie stałe nazwy arkuszy i kolumn w logice.

### Strategia B — warstwa kanonicznych kluczy + aliasy PL/EN

Kod nie porównuje bezpośrednio `Bestiariusz` ani `Bestiary`, tylko używa klucza kanonicznego, np. `bestiary`.

Przykładowy model:

```js
const SHEET_ALIASES = {
  bestiary: ["Bestiary", "Bestiariusz"],
  weapons: ["Weapons", "Bronie"],
  armor: ["Armor", "Pancerze"],
  augmentations: ["Augmentations", "Augumentacje"],
  equipment: ["Equipment", "Ekwipunek"],
  talents: ["Talents", "Talenty"],
  psionics: ["Psionics", "Psionika"],
  prayers: ["Prayers", "Modlitwy"],
  notes: ["Notes", "Notatki"],
  mobs: ["Mobs", "Hordy"],
  specialEnemyBonuses: ["Special Enemy Bonuses", "Specjalne Bonusy Wrogów"],
  sizeTable: ["Size Table", "Tabela Rozmiarów"],
  species: ["Species", "Gatunki"],
  archetypes: ["Archetypes", "Archetypy"],
  ascensionPackages: ["Ascension Packages", "Pakiety Wyniesienia"],
  factionBonuses: ["Faction Bonuses", "Premie Frakcji"],
  factionKeywords: ["Faction Keywords", "Słowa Kluczowe Frakcji"],
  specialFactionBonuses: ["Special Faction Bonuses", "Specjalne Bonusy Frakcji"],
  astartesImplants: ["Astartes Implants", "Implanty Astartes"],
  vehicles: ["Vehicles", "Pojazdy"],
  vehicleWeapons: ["Vehicle Weapons", "Bronie Pojazdów"],
  vehicleEquipment: ["Vehicle Equipment", "Vehicle Wargear", "Ekwipunek Pojazdów"],
  vehicleRoles: ["Vehicle Roles", "Role W Pojeździe"],
  vehicleActions: ["Vehicle Actions", "Akcje Pojazdu"],
  vehicleConditions: ["Vehicle Conditions", "Stany Pojazdów"],
  vehicleTraits: ["Vehicle Traits", "Cechy Pojazdów"]
};
```

Analogicznie dla kolumn:

```js
const COLUMN_ALIASES = {
  id: ["ID", "LP", "Lp"],
  state: ["State", "Stan"],
  type: ["Type", "Typ", "Kind", "Rodzaj"],
  name: ["Name", "Nazwa"],
  description: ["Description", "Opis"],
  effect: ["Effect", "Efekt"],
  example: ["Example", "Przykład"],
  keywords: ["Keywords", "Słowa Kluczowe", "Słowo Kluczowe"],
  traits: ["Traits", "Cechy"],
  range: ["Range", "Zasięg"],
  damage: ["Damage", "Obrażenia"],
  dn: ["DN", "DK", "ST"],
  ap: ["AP", "PP"],
  rateOfFire: ["Rate of fire", "Szybkostrzelność"],
  armorValue: ["AV", "Armor Rating", "Wartość Pancerza", "WP"],
  source: ["Source", "Book", "Podręcznik"],
  page: ["Page", "Strona"]
};
```

**Rekomendacja:** strategia B. Jest bezpieczniejsza, bo pozwala uruchomić `WnG_Tools` na danych angielskich i nadal łatwo porównywać zmiany z polskim `WrathAndGlory`.

---

## 4. NPCGenerator / GeneratorNPC — różnice i wymagane poprawki

### 4.1. Nazwa i lokalizacja modułu

W `WrathAndGlory` moduł nazywa się:

```text
GeneratorNPC/
```

W `WnG_Tools` moduł nazywa się:

```text
NPCGenerator/
```

Przy przenoszeniu zmian trzeba ręcznie dostosować ścieżki w dokumentacji, importach i komunikatach. Nie należy tworzyć nowego folderu `GeneratorNPC` w `WnG_Tools`, chyba że repo ma zostać przebudowane strukturalnie.

---

### 4.2. Ładowanie danych: stara metoda w `WnG_Tools`, nowa metoda w `WrathAndGlory`

`WnG_Tools/NPCGenerator` ładuje kolekcje przez wyszukiwanie po słowach kluczowych:

```js
state.bestiary = sortByName(getCollection(data, ["besti", "bestiariusz"]));
state.armor = sortByTypeThenName(getCollection(data, ["pancerz", "armor"]));
state.weapons = sortByTypeThenName(getCollection(data, ["broń", "bron", "weapon"]));
```

Ta metoda jest elastyczna, ale niebezpieczna:

- może wybrać zły arkusz,
- może działać inaczej po dodaniu pojazdów,
- może ukrywać błędy danych,
- nie daje czytelnego komunikatu, którego arkusza brakuje.

`WrathAndGlory/GeneratorNPC` ma nowszy model:

```js
getRequiredCollection(data, "Bestiariusz")
getRequiredCollection(data, "Pancerze")
getRequiredCollection(data, "Bronie")
getRequiredCollection(data, "Augumentacje")
getRequiredCollection(data, "Ekwipunek")
getRequiredCollection(data, "Talenty")
getRequiredCollection(data, "Psionika")
getRequiredCollection(data, "Modlitwy")
```

Ten model jest bezpieczniejszy, ale wprost oparty na polskich nazwach arkuszy. W release angielskim złamie się na danych typu `Bestiary`, `Weapons`, `Armor`.

**Do poprawy w `WnG_Tools`:**

1. Zastąpić `getCollection(data, keywords)` deterministycznym resolverem z aliasami.
2. Nie używać surowych polskich nazw jako jedynej prawdy.
3. Błędy mają mówić, jakiego logicznego arkusza brakuje i jakie aliasy były szukane.

Przykładowy model docelowy:

```js
const REQUIRED_GENERATOR_SHEETS = {
  bestiary: ["Bestiary", "Bestiariusz"],
  armor: ["Armor", "Pancerze"],
  weapons: ["Weapons", "Bronie"],
  augmentations: ["Augmentations", "Augumentacje"],
  equipment: ["Equipment", "Ekwipunek"],
  talents: ["Talents", "Talenty"],
  psionics: ["Psionics", "Psionika"],
  prayers: ["Prayers", "Modlitwy"]
};
```

Przykładowa funkcja:

```js
const getRequiredCollectionByAliases = (db, canonicalKey) => {
  if (!db || typeof db !== "object" || !db.sheets || typeof db.sheets !== "object") {
    throw new Error("NPCGENERATOR_DATA_MISSING_SHEETS");
  }

  const aliases = REQUIRED_GENERATOR_SHEETS[canonicalKey] || [];
  const sheetName = aliases.find((name) => Object.prototype.hasOwnProperty.call(db.sheets, name));

  if (!sheetName) {
    throw new Error(`NPCGENERATOR_REQUIRED_SHEET_MISSING:${canonicalKey}:${aliases.join("|")}`);
  }

  const records = extractRecords(db.sheets[sheetName]);
  if (!records.length) {
    throw new Error(`NPCGENERATOR_REQUIRED_SHEET_EMPTY:${canonicalKey}:${sheetName}`);
  }

  return records;
};
```

---

### 4.3. Kolumny w NPCGenerator są nadal polskie

Nawet w `WnG_Tools/NPCGenerator`, który ma `html lang="en"` i `currentLanguage = "en"`, wiele elementów kodu nadal zakłada polskie nazwy kolumn:

```js
const weaponColumns = ["Nazwa", "Obrażenia", "DK", "PP", "Zasięg", "Szybkostrzelność", "Cechy", "Słowa Kluczowe", "Podręcznik", "Strona"];
const armorColumns = ["Nazwa", "WP", "Cechy", "Słowa Kluczowe", "Podręcznik", "Strona"];
const augmentationsColumns = ["Nazwa", "Efekt"];
const equipmentColumns = ["Nazwa", "Efekt"];
const talentsColumns = ["Nazwa", "Efekt"];
const prayersColumns = ["Nazwa", "Efekt"];
```

To będzie problem przy angielskim `data.json`, gdzie kolumny to np.:

```text
Name
Damage
DN
AP
Range
Rate of fire
Traits
Keywords
Source / Book
Page
Effect
```

**Do poprawy:**

1. Wprowadzić `COLUMN_ALIASES`.
2. `getRecordValue(record, label)` powinno przyjmować klucz kanoniczny albo listę aliasów.
3. Tabele w UI mogą wyświetlać etykiety z `translations`, ale pobieranie danych powinno iść przez aliasy.
4. Funkcje formatowania słów kluczowych i zasięgu muszą rozpoznawać `Keywords` / `Słowa Kluczowe` oraz `Range` / `Zasięg`.

---

### 4.4. Ukrywanie starych wpisów Bestiariusza w NPCGenerator

`WrathAndGlory/GeneratorNPC` ma nowszy checkbox:

```text
Czy wyświetlić zdezaktualizowane wpisy?
Show outdated entries?
```

Logika obejmuje:

- checkbox `#bestiary-show-old`,
- `state.showOldBestiaryRecords`,
- `refreshBestiaryOptions()`,
- `updateBestiarySelectOldClass(record)`,
- `updateBestiaryOldVisibility()`,
- obsługę ulubionych, które wskazują na stary wpis.

`WnG_Tools/NPCGenerator` nie ma tego checkboxa w `index.html`; w sekcji wyboru bazowego jest tylko select i notatki.

**Do poprawy:**

1. Przenieść UI checkboxa z `WrathAndGlory`, dostosowując tekst EN first.
2. Rozpoznawać status po kolumnach:

```text
State / Stan
```

3. Nie usuwać starych rekordów ze `state.bestiary`; filtrować tylko listę opcji.
4. Jeżeli użytkownik odznaczy checkbox przy wybranym starym rekordzie, wyczyścić wybór i podgląd.
5. Jeżeli ulubiony NPC wskazuje na stary rekord, przy wczytaniu ulubionego automatycznie pokazać stare rekordy albo wyświetlić jasny komunikat.

---

### 4.5. Komunikaty błędów struktury danych

`WrathAndGlory/GeneratorNPC` ma czytelne komunikaty dla błędów:

- brak kontenera arkuszy,
- brak wymaganego arkusza,
- pusty wymagany arkusz.

`WnG_Tools/NPCGenerator` nie ma pełnego odpowiednika tych komunikatów.

**Do poprawy:**

Dodać do `translations.en.messages` i `translations.pl.messages`:

```js
requiredSheetsMissingContainer: "DataVault data does not contain the sheet list required by NPCGenerator.",
requiredSheetMissing: "DataVault data is missing a required NPCGenerator sheet: {sheet}.",
requiredSheetEmpty: "A required NPCGenerator sheet is empty: {sheet}.",
```

PL:

```js
requiredSheetsMissingContainer: "Dane DataVault nie zawierają listy arkuszy wymaganej przez NPCGenerator.",
requiredSheetMissing: "W danych DataVault brakuje wymaganego arkusza NPCGenerator: {sheet}.",
requiredSheetEmpty: "Wymagany arkusz NPCGenerator jest pusty: {sheet}.",
```

W komunikacie `{sheet}` dla release warto pokazywać klucz kanoniczny i aliasy, np.:

```text
bestiary (accepted aliases: Bestiary, Bestiariusz)
```

---

### 4.6. Formatowanie odnośników do stron w NPCGenerator

W `DataVault` regex obsługuje zarówno polskie, jak i angielskie odnośniki:

```text
str.
str
strona
page
p.
```

W `GeneratorNPC` / `NPCGenerator` trzeba sprawdzić i ujednolicić analogicznie. Release angielski powinien wyróżniać co najmniej:

```text
(page 123)
(p. 123)
```

oraz nadal obsługiwać polskie:

```text
(str. 123)
(strona 123)
```

---

### 4.7. Ulubione — ryzyko indeksów

Obecny model ulubionych zapisuje m.in. indeksy wybranych rekordów. Po zmianie sortowania, ukrywania `old`, przejściu na angielskie sample files albo aktualizacji danych indeks może wskazywać inny rekord.

**Rekomendacja:** przy późniejszej implementacji zapisywać w ulubionych stabilne identyfikatory i nazwy, np.:

```js
selectedBestiaryId
selectedBestiaryName
selectedBestiaryIndex // tylko fallback
```

Analogicznie dla broni, pancerzy i innych modułów. W danych sample `ID` jest już obecne, więc warto go używać.

---

## 5. DataVault/SampleFiles — stan i zalecenia

`WnG_Tools/DataVault/SampleFiles/data.json` zawiera angielskie placeholdery. Przykładowe arkusze, które udało się potwierdzić:

```text
Notes
Bestiary
Special Enemy Bonuses
Mobs
Size Table
Species
Archetypes
Ascension Packages
Faction Bonuses
Faction Keywords
Special Faction Bonuses
Astartes Implants
```

W przykładowym `Bestiary` są angielskie kolumny, m.in.:

```text
ID
State
Type
Name
Threat
Keywords
S
T
A
I
Will
Int
Fell
Resilience (AR includer)
Armour Rating
Defence
Wounds
Shock
Skills
Bonuses
Abilities
Attacks
Mob Abilities
Mob Options
Conviction
Resolve
Speed
Size
Book
Page
```

**Ryzyka:**

1. Kod `NPCGenerator` nadal szuka wielu polskich kolumn, więc same angielskie sample files nie wystarczą.
2. Jeśli `SampleFiles` mają być wzorcowe, muszą zawierać wszystkie arkusze wymagane przez NPCGenerator.
3. Jeżeli do release trafią pojazdy, sample files muszą dostać także arkusze pojazdów.
4. `firebase-import.json` i `data.json` powinny być spójne z tym samym sample XLSX.
5. `_meta` powinno zawierać przykładowe `traits`, `states`, a po wdrożeniu pojazdów również `vehicleTraits`, `vehicleWeaponTraits`, `vehicleStates`.

**Do poprawy w sample files:**

- upewnić się, że `Repozytorium.xlsx`, `data.json` i `firebase-import.json` są generowane z tego samego źródła,
- dopisać minimalne rekordy dla wszystkich arkuszy używanych przez NPCGenerator,
- dopisać minimalne rekordy dla pojazdów, jeżeli przenoszona jest rozbudowa pojazdów,
- w dokumentacji opisać, że sample files są po angielsku i wymagają aliasów w kodzie.

---

## 6. Dokumentacja — różnice i zalecenia

### 6.1. DataVault docs

`WrathAndGlory/DataVault/docs/README.md` jest nowszy i znacznie bardziej szczegółowy. Opisuje m.in.:

- dane K.O.Z.A.,
- zakładki i filtrowanie,
- pojazdy,
- checkbox starych wpisów Bestiariusza,
- `Koszt IM`,
- Pełen Widok i Widok Domyślny,
- przełączniki grup zakładek.

`WnG_Tools/DataVault/docs/README.md` jest po angielsku jako pierwszy, co jest poprawne dla release, ale część treści jest starsza lub nie uwzględnia nowych decyzji.

**Do poprawy:**

1. Zachować układ EN first, PL second.
2. Przenieść treści z nowszego `WrathAndGlory`, ale przetłumaczyć i dostosować do release.
3. Dopisać rozdział o tym, że `Default View = Full View`.
4. Dopisać rozdział o tym, gdzie dodaje się automatyczne filtry domyślne.
5. Dopisać rozdział o aliasach nazw arkuszy i kolumn PL/EN.
6. Jeżeli pojazdy są przenoszone, dopisać opis checkboxa `Show tabs related to vehicles?`.
7. Jeżeli wpisy `old` są przenoszone, dopisać opis checkboxa `Show outdated entries?`.
8. Uporządkować wzmianki o Firebase: release nie może zawierać prywatnych połączeń ani sekretów. Dokumentacja może opisywać konfigurację własnego projektu, ale musi mówić jasno, że repo zawiera tylko placeholdery.

---

### 6.2. NPCGenerator docs

`WrathAndGlory/GeneratorNPC/docs/README.md` jest nowszy i opisuje m.in.:

- zależność od prywatnych danych DataVault,
- dokładne arkusze źródłowe,
- stare wpisy Bestiariusza,
- edycję statystyk,
- edycję umiejętności i słów kluczowych,
- moduły aktywne,
- ulubione.

`WnG_Tools/NPCGenerator/docs/README.md` jest EN first, ale krótszy i nie opisuje najważniejszego ryzyka release: arkusze i kolumny w danych są po angielsku, a generator musi używać aliasów.

**Do poprawy:**

1. Zachować nazwę folderu `NPCGenerator`, nie przepisywać ślepo `GeneratorNPC`.
2. EN first, potem PL.
3. Dodać sekcję:

```text
Required DataVault sheets
```

z listą kluczy logicznych i aliasów:

```text
bestiary: Bestiary / Bestiariusz
weapons: Weapons / Bronie
armor: Armor / Pancerze
augmentations: Augmentations / Augumentacje
equipment: Equipment / Ekwipunek
talents: Talents / Talenty
psionics: Psionics / Psionika
prayers: Prayers / Modlitwy
```

4. Dodać sekcję:

```text
Default View and filters
```

z informacją, że NPCGenerator nie powinien zależeć od filtrów DataVault; ładuje pełne wymagane kolekcje.
5. Dodać opis `Show outdated entries?`.
6. Zaktualizować sekcję Firebase: w release repo są placeholdery, a trwałe współdzielone ulubione wymagają własnej konfiguracji Firestore.

---

## 7. Miejsca szczególnie podatne na błąd językowy

Poniższe miejsca trzeba sprawdzić przy wdrożeniu:

### DataVault

- `KEYWORD_SHEETS_COMMA_NEUTRAL` — obecnie w `WnG_Tools` ma polskie nazwy arkuszy; po angielsku powinien działać na kluczach kanonicznych albo aliasach.
- `KEYWORD_SHEET_ALL_RED` — `Słowa Kluczowe` vs `Keywords`.
- `ADMIN_ONLY_SHEETS` — polskie nazwy admin-only vs angielskie sample.
- `CHARACTER_CREATION_SHEETS` — polskie nazwy vs `Species`, `Archetypes`, `Faction Bonuses`, itd.
- `COMBAT_RULES_SHEETS` — polskie nazwy vs angielskie odpowiedniki.
- `VEHICLE_SHEETS` — trzeba dodać i od razu zrobić aliasy PL/EN.
- `preferredStartSheet` — `Notatki` / `Bronie` nie zadziała na `Notes` / `Weapons` bez aliasów.
- `formatDataCellHTML` — rozpoznawanie `Słowa Kluczowe`, `Słowo Kluczowe`, `Zasięg`.
- `isHiddenColumn` — obecnie ukrywa `lp`, `stan`; dla EN trzeba rozważyć `id`, `state`. Uwaga: `ID` może być potrzebne jako stabilny identyfikator, ale niekoniecznie powinno być widoczne.

### NPCGenerator

- `data-sheet="Bestiariusz"`, `data-sheet="Bronie"`, `data-sheet="Pancerze"`, itd. w HTML.
- `weaponColumns`, `armorColumns`, `psionicsColumns` i inne listy kolumn.
- `getRecordValueByLabels(record, ["Stan", "stan"])` — dodać `State`.
- `getArmorWpValue` — `Wartość Pancerza` / `WP` vs `AV` / `Armor Rating`.
- `isKeywordColumn` — `słowa kluczowe` vs `keywords`.
- `isRangeColumn` — `zasięg` vs `range`.
- `buildTraitDescriptionLine` — pobiera `Cechy`; powinno pobierać `Traits` także.
- `buildWeaponEntry` — etykiety `Obrażenia`, `DK`, `PP`, `Zasięg`, `Szybkostrzelność`, `Cechy` powinny być kanoniczne.
- `buildModuleEntries` — `Nazwa` i inne kolumny powinny mieć aliasy.
- `openPrintableCard` — etykiety karty są tłumaczone, ale wartości wejściowe muszą być pobierane przez aliasy.

---

## 8. Proponowana kolejność wdrożenia

1. **Warstwa aliasów DataVault/NPCGenerator**
   - najpierw zdefiniować klucze kanoniczne arkuszy i kolumn,
   - potem przerobić funkcje wyszukujące arkusze i kolumny.

2. **Wyłączenie filtrów domyślnych w `WnG_Tools`**
   - `DEFAULT_VIEW_CONFIG = {}`,
   - `Default View = Full View`,
   - nowy komentarz w kodzie,
   - nowy opis w README/docs.

3. **NPCGenerator — deterministyczne kolekcje z aliasami**
   - zastąpić `getCollection(...keywords)` resolverem aliasów,
   - dodać błędy brakujących/pustych arkuszy,
   - podłączyć kolumny przez aliasy.

4. **Stare wpisy Bestiariusza**
   - przenieść checkbox i logikę do `NPCGenerator`,
   - przenieść checkbox i logikę do `DataVault`,
   - uwzględnić `State` / `Stan`.

5. **Pojazdy w DataVault**
   - przenieść `VEHICLE_SHEETS`, toggle, style, metadata,
   - dodać aliasy EN.

6. **SampleFiles**
   - zaktualizować `Repozytorium.xlsx`, `data.json`, `firebase-import.json`,
   - upewnić się, że przykłady pokrywają wymagane arkusze i kolumny.

7. **Dokumentacja EN first**
   - DataVault README / Documentation,
   - NPCGenerator README / Documentation,
   - ewentualny root README, jeśli zostanie dodany.

8. **Test manualny**
   - odpalenie DataVault w trybie user/admin,
   - przełączanie języka,
   - Full View / Default View,
   - filtrowanie i wyszukiwanie,
   - ukrywanie `old`,
   - pojazdy,
   - NPCGenerator na angielskich sample files,
   - generowanie karty,
   - ulubione lokalne i, opcjonalnie, Firestore placeholder.

---

## 9. Lista kontrolna dla późniejszego PR

### DataVault

- [ ] Zachowano `html lang="en"` w `WnG_Tools`.
- [ ] Zachowano widoczny przełącznik języka i kolejność `English`, `Polski`.
- [ ] `currentLanguage` domyślnie `en`.
- [ ] `DEFAULT_VIEW_CONFIG` wyłączony albo pusty.
- [ ] `Default View` działa tak samo jak `Full View`.
- [ ] W kodzie jest komentarz wyjaśniający, gdzie dopisać automatyczne filtry domyślne.
- [ ] Dokumentacja opisuje `Default View = Full View`.
- [ ] Dodano aliasy arkuszy PL/EN.
- [ ] Dodano aliasy kolumn PL/EN.
- [ ] `KEYWORD_SHEETS_COMMA_NEUTRAL` działa przez aliasy / klucze kanoniczne.
- [ ] `ADMIN_ONLY_SHEETS`, `CHARACTER_CREATION_SHEETS`, `COMBAT_RULES_SHEETS` działają przez aliasy / klucze kanoniczne.
- [ ] Dodano `VEHICLE_SHEETS` i `toggleVehicleTabs`, jeśli pojazdy wchodzą do release.
- [ ] Dodano obsługę `_meta.vehicleTraits`, `_meta.vehicleWeaponTraits`, `_meta.vehicleStates`, jeśli pojazdy wchodzą do release.
- [ ] Dodano checkbox `Show outdated entries?` dla Bestiary/Bestiariusz w trybie admina.
- [ ] `State = old` / `Stan = old` nie przecieka przez filtry przy wyłączonym checkboxie.

### NPCGenerator

- [ ] Nie zmieniono nazwy folderu `NPCGenerator` bez decyzji projektowej.
- [ ] Usunięto zależność od keywordowego `getCollection(...keywords)` albo ograniczono ją do fallbacku diagnostycznego.
- [ ] Dodano resolver wymaganych arkuszy z aliasami PL/EN.
- [ ] Dodano czytelne błędy: brak kontenera, brak arkusza, pusty arkusz.
- [ ] Wszystkie listy kolumn używają aliasów albo kluczy kanonicznych.
- [ ] `State` i `Stan` są rozpoznawane jako status rekordu.
- [ ] `Traits` i `Cechy` są rozpoznawane jako cechy.
- [ ] `Keywords` i `Słowa Kluczowe` są rozpoznawane jako słowa kluczowe.
- [ ] `Range` i `Zasięg` są rozpoznawane jako zasięg.
- [ ] Dodano checkbox `Show outdated entries?`.
- [ ] Stare wpisy są ukryte domyślnie i nie są usuwane ze źródłowej kolekcji.
- [ ] Ulubione nie opierają się wyłącznie na indeksach albo mają bezpieczny fallback.

### Dokumentacja

- [ ] EN jest pierwsze w dokumentach `WnG_Tools`.
- [ ] PL jest drugie.
- [ ] Opisano aliasy arkuszy i kolumn.
- [ ] Opisano `Default View = Full View`.
- [ ] Opisano miejsce dodawania automatycznych filtrów domyślnych.
- [ ] Opisano, że release nie zawiera prywatnych danych Firebase.
- [ ] Opisano, że Firebase/Firestore wymaga własnej konfiguracji administratora.
- [ ] Opisano sample files i ich rolę.

### SampleFiles

- [ ] `Repozytorium.xlsx`, `data.json`, `firebase-import.json` są spójne.
- [ ] Sample data ma angielskie arkusze zgodne z dokumentacją.
- [ ] Sample data zawiera wszystkie arkusze wymagane przez NPCGenerator.
- [ ] Sample data zawiera minimalne `_meta.traits` i `_meta.states`.
- [ ] Po wdrożeniu pojazdów sample data zawiera też `_meta.vehicleTraits`, `_meta.vehicleWeaponTraits`, `_meta.vehicleStates`.

---

## 10. Uwagi o `Analizy/test.json`

Użytkownik wskazał tymczasowy plik:

```text
WrathAndGlory/Analizy/test.json
```

Plik miał zawierać prawdziwe dane po polsku. Podczas analizy GitHub Contents API zwrócił pustą zawartość pliku. Dlatego nie wykorzystałem go jako podstawy porównania nazw arkuszy ani realnych rekordów.

Wnioski dotyczące nazw PL pochodzą z kodu `WrathAndGlory`, dokumentów w `Analizy` i dokumentacji modułów. Wnioski dotyczące nazw EN pochodzą z `WnG_Tools/DataVault/SampleFiles/data.json`.

---

## 11. Najkrótsza rekomendacja implementacyjna

Najbezpieczniejsza ścieżka dla `WnG_Tools`:

1. **Nie kopiować polskich stałych nazw arkuszy z `WrathAndGlory` jako jedynego źródła prawdy.**
2. **Dodać kanoniczne klucze + aliasy PL/EN.**
3. **Ustawić `Default View = Full View` i zostawić puste `DEFAULT_VIEW_CONFIG`.**
4. **Dodać bardzo widoczny komentarz w kodzie przy `DEFAULT_VIEW_CONFIG`.**
5. **Zaktualizować dokumentację EN first.**
6. **Dopiero potem przenosić funkcje nowszego DataVault i GeneratorNPC.**

---

## 12. Uzupełnienie analizy po komentarzach użytkownika

### 12.1. Sekcja 3.1 — język domyślny i przełącznik języka

Decyzja użytkownika potwierdza rekomendację z analizy.

W repozytorium `WnG_Tools` przełącznik języka musi być zawsze widoczny.

Oznacza to, że przy późniejszym wdrożeniu zmian z `WrathAndGlory` nie wolno przenieść zachowania produkcyjnego polegającego na ukryciu przełącznika języka klasą `language-switcher--hidden`.

W `WnG_Tools` należy zachować release'owy model:

- angielski jako domyślny język UI;
- polski jako druga dostępna wersja UI;
- przełącznik języka zawsze widoczny dla użytkownika.

Do sprawdzenia przy wdrożeniu:

- `DataVault/index.html`;
- `DataVault/app.js`;
- `NPCGenerator/index.html`;
- ewentualne inne moduły z przełącznikiem języka.

W kodzie i dokumentacji trzeba jasno zaznaczyć, że w `WnG_Tools` przełącznik języka jest elementem publicznego/release'owego interfejsu i nie powinien być ukrywany przy synchronizacji zmian z produkcyjnym `WrathAndGlory`.

---

### 12.2. Sekcja 3.3 — pojazdy i arkusze pojazdów

Doprecyzowanie użytkownika:

Istnieją dwie różne zakładki:

1. stara zakładka `Equipment`;
2. nowa zakładka `Vehicle Wargear`.

Nie należy ich scalać ani traktować jako tej samej zakładki.

#### `Equipment`

`Equipment` to istniejąca, zwykła zakładka ekwipunku.

Wymagane zachowanie:

- nie jest powiązana z checkboxem pojazdów;
- ma być widoczna zgodnie z ogólnymi zasadami DataVault;
- dane z niej mają być zaciągane w `NPCGenerator`;
- odpowiada logicznie polskiemu arkuszowi `Ekwipunek`, ale w release angielskim bazujemy na nazwie `Equipment`.

W mapowaniu dla `NPCGenerator` powinna być traktowana jako źródło zwykłego ekwipunku postaci/NPC.

Przykładowa logika aliasów:

- kanoniczny klucz: `equipment`;
- nazwy arkuszy: `Equipment`, `Ekwipunek`.

#### `Vehicle Wargear`

`Vehicle Wargear` to nowa zakładka dotycząca pojazdów.

Wymagane zachowanie:

- musi być powiązana z checkboxem pojazdów;
- w wersji polskiej checkbox nazywa się: `Czy wyświetlić zakładki dotyczące pojazdów?`;
- w wersji angielskiej można zachować lub dodać odpowiednik: `Show tabs related to vehicles?`;
- odpowiada logicznie polskiemu arkuszowi `Ekwipunek Pojazdów`.

W produkcyjnym JSON-ie po polsku istnieją osobne arkusze `Ekwipunek` i `Ekwipunek Pojazdów`, co potwierdza, że są to dwa różne źródła danych i nie powinny być obsługiwane tym samym przełącznikiem.

Rekomendowana nazwa kanoniczna dla release:

- `Vehicle Wargear`.

Dopuszczalny alias bezpieczeństwa:

- `Vehicle Equipment`.

Przykładowa logika aliasów:

- kanoniczny klucz: `vehicleWargear`;
- nazwy arkuszy: `Vehicle Wargear`, `Vehicle Equipment`, `Ekwipunek Pojazdów`.

W dokumentacji trzeba wyraźnie zaznaczyć:

Equipment and Vehicle Wargear are separate sheets.

Equipment is normal personal/NPC equipment and is used by NPCGenerator.

Vehicle Wargear is vehicle-related equipment and belongs to the vehicle tab group controlled by the vehicle tabs checkbox.

Polska wersja dokumentacji:

Equipment i Vehicle Wargear to osobne zakładki.

Equipment oznacza zwykły ekwipunek postaci/NPC i jest używany przez NPCGenerator.

Vehicle Wargear oznacza wyposażenie pojazdów i należy do grupy zakładek pojazdów sterowanej checkboxem `Czy wyświetlić zakładki dotyczące pojazdów?`.

---

### 12.3. Sekcja 3.5 — nazwy arkuszy i kolumn jako główne ryzyko release

Doprecyzowanie użytkownika:

Tłumaczymy tylko UI.

Zawartość pliku XLSX, a później JSON, tworzy użytkownik.

W `WnG_Tools` należy opierać się na języku angielskim i obecnie istniejących nazwach kolumn w istniejącym pliku release.

To oznacza, że moduły nie powinny zakładać, że sama zmiana języka UI automatycznie zmienia język nazw arkuszy lub kolumn w danych użytkownika.

Należy rozdzielić trzy warstwy:

1. język interfejsu użytkownika;
2. nazwy arkuszy w XLSX/JSON;
3. nazwy kolumn w XLSX/JSON.

Zmiana języka UI nie oznacza zmiany nazw arkuszy i kolumn.

#### Wniosek dla `WnG_Tools`

Dla release należy przyjąć, że podstawowym formatem danych są angielskie nazwy arkuszy i kolumn z obecnego przykładowego pliku.

Polskie nazwy mogą występować jako aliasy pomocnicze, szczególnie przy przenoszeniu danych z produkcyjnego `WrathAndGlory`, ale nie powinny być jedynym wymaganym formatem w `WnG_Tools`.

#### Ważna uwaga dokumentacyjna

Do dokumentacji trzeba dodać sekcję dla użytkowników, którzy chcą przygotować własną wersję językową danych, np. francuską albo niemiecką, i zmienić nazwy kolumn w XLSX/JSON.

Dokumentacja musi wyjaśniać:

- że UI można tłumaczyć niezależnie od danych;
- że zmiana nazw arkuszy lub kolumn wymaga aktualizacji mapowania w kodzie;
- gdzie znajdują się mapowania arkuszy;
- gdzie znajdują się mapowania kolumn;
- które mapowania są używane przez `NPCGenerator`;
- które mapowania są używane przez `DataVault`;
- które arkusze są wymagane przez `NPCGenerator`;
- które arkusze są opcjonalne;
- które arkusze należą do grupy pojazdów.

Przykładowy opis do dokumentacji:

If you want to translate the XLSX/JSON data structure itself, not only the UI, you must also update the sheet and column mappings in the code.

Changing the UI language does not automatically change the expected names of sheets and columns.

For example, if you rename the `Bestiary` sheet to a French or German equivalent, you must add that name to the sheet aliases used by `NPCGenerator` and `DataVault`.

If you rename columns such as `Name`, `Type`, `Keywords`, `Source` or `Page`, you must also update the column aliases used by the rendering, filtering and NPC generation logic.

Polska wersja dokumentacji:

Jeżeli chcesz przetłumaczyć nie tylko interfejs, ale również strukturę danych XLSX/JSON, musisz zaktualizować mapowania arkuszy i kolumn w kodzie.

Zmiana języka UI nie zmienia automatycznie oczekiwanych nazw arkuszy i kolumn.

Przykład: jeżeli zmienisz nazwę arkusza `Bestiary` na odpowiednik francuski albo niemiecki, musisz dodać tę nazwę do aliasów arkuszy używanych przez `NPCGenerator` i `DataVault`.

Jeżeli zmienisz nazwy kolumn takich jak `Name`, `Type`, `Keywords`, `Source` albo `Page`, musisz zaktualizować aliasy kolumn używane przez logikę wyświetlania, filtrowania i generowania NPC.

#### Konsekwencja dla implementacji

W kodzie warto wprowadzić jedno jawne miejsce dla mapowania arkuszy i kolumn, np. osobny blok konfiguracyjny lub pomocniczy moduł.

Przykładowa koncepcja, bez narzucania dokładnej implementacji:

- `SHEET_ALIASES` — aliasy arkuszy;
- `COLUMN_ALIASES` — aliasy kolumn;
- `REQUIRED_NPCGENERATOR_SHEETS` — arkusze wymagane przez NPCGenerator;
- `VEHICLE_SHEET_KEYS` — arkusze należące do grupy pojazdów;
- `KEYWORD_SHEETS_COMMA_NEUTRAL` — arkusze, w których przecinki w słowach kluczowych nie powinny rozbijać wartości.

---

### 12.4. Aktualizacja po załączeniu produkcyjnego JSON-a po polsku

Użytkownik załączył produkcyjny JSON z danymi po polsku.

Plik potwierdza, że produkcyjny `WrathAndGlory` korzysta z polskich nazw arkuszy i kolumn.

W załączonym JSON-ie występują m.in. następujące arkusze:

- `Notatki`;
- `Bestiariusz`;
- `Hordy`;
- `Specjalne Bonusy Wrogów`;
- `Tabela Rozmiarów`;
- `Gatunki`;
- `Archetypy`;
- `Pakiety Wyniesienia`;
- `Premie Frakcji`;
- `Słowa Kluczowe Frakcji`;
- `Specjalne Bonusy Frakcji`;
- `Implanty Astartes`;
- `Zakony Pierwszego Powołania`;
- `Cechy`;
- `Stany`;
- `Słowa Kluczowe`;
- `Talenty`;
- `Modlitwy`;
- `Psionika`;
- `Augumentacje`;
- `Ekwipunek`;
- `Pancerze`;
- `Bronie`;
- `Trafienia Krytyczne`;
- `Groza Osnowy`;
- `Skrót Zasad`;
- `Tryby Ognia`;
- `Kary do ST`;
- `Role W Pojeździe`;
- `Akcje Pojazdu`;
- `Stany Pojazdów`;
- `Cechy Pojazdów`;
- `Pojazdy`;
- `Bronie Pojazdów`;
- `Ekwipunek Pojazdów`.

Najważniejsze potwierdzone ryzyko:

`WnG_Tools` nie może bezpośrednio kopiować logiki wymagającej polskich nazw arkuszy i kolumn, jeżeli release ma bazować na angielskim sample file i angielskich nazwach danych.

Najważniejsze potwierdzone rozdzielenie:

- `Ekwipunek` odpowiada zwykłemu `Equipment`;
- `Ekwipunek Pojazdów` odpowiada `Vehicle Wargear`;
- tylko `Vehicle Wargear` / `Ekwipunek Pojazdów` należy do grupy arkuszy pojazdowych kontrolowanych checkboxem pojazdów.

---

### 12.5. Sekcja 4.6 — formatowanie odnośników do stron w NPCGenerator

Doprecyzowanie użytkownika:

Podobnie jak przy nazwach arkuszy i kolumn, do dokumentacji trzeba dodać instrukcję dotyczącą formatowania odwołań do stron w różnych językach.

Problem:

`NPCGenerator` formatuje lub rozpoznaje odwołania do podręczników i stron. Jeżeli dane użytkownika są w innym języku, mogą pojawić się różne warianty zapisu, np.:

- `Page`;
- `p.`;
- `pp.`;
- `Strona`;
- `str.`;
- `Seite`;
- `S.`;
- `page`;
- `pages`.

Dlatego nie należy traktować obecnego formatu jako uniwersalnego dla wszystkich języków.

#### Wymaganie dokumentacyjne

Dokumentacja powinna zawierać sekcję wyjaśniającą:

- jaki format odwołań do stron jest wspierany domyślnie;
- które kolumny są używane jako źródło informacji o podręczniku i stronie;
- gdzie w kodzie zmienić aliasy kolumn, jeżeli użytkownik zmienia nazwy `Source`, `Book`, `Page`, `Podręcznik`, `Strona` itd.;
- gdzie w kodzie zmienić regex lub funkcję formatującą, jeżeli użytkownik chce obsługiwać inne skróty językowe;
- że tłumaczenie UI nie zmienia automatycznie formatu danych wejściowych.

Przykładowy opis do dokumentacji:

NPCGenerator can display references to books and pages based on the source and page fields from the data file.

If you translate or rename these fields in your XLSX/JSON file, update the column aliases used by NPCGenerator.

If your language uses a different page abbreviation, such as `S.` in German or another local convention, update the page-reference formatting function or regular expression in the NPCGenerator code.

Polska wersja dokumentacji:

NPCGenerator może wyświetlać odwołania do podręczników i stron na podstawie pól źródła i strony z pliku danych.

Jeżeli tłumaczysz lub zmieniasz nazwy tych pól w XLSX/JSON, zaktualizuj aliasy kolumn używane przez NPCGenerator.

Jeżeli Twój język używa innego skrótu dla stron, np. niemieckiego `S.` albo innej lokalnej konwencji, zaktualizuj funkcję formatowania lub wyrażenie regularne odpowiedzialne za odwołania do stron w kodzie NPCGenerator.

#### Konsekwencja dla implementacji

Najlepiej, aby logika odwołań do stron nie była rozproszona w wielu miejscach kodu.

Rekomendowane jest wydzielenie jednej funkcji odpowiedzialnej za:

- pobranie nazwy podręcznika;
- pobranie numeru strony;
- rozpoznanie istniejącego odwołania w tekście;
- zbudowanie końcowego odnośnika wyświetlanego w UI.

W dokumentacji należy podać nazwę tej funkcji lub sekcji kodu po jej ustaleniu w implementacji.

---

### 12.6. Sekcja 10 — uwagi o `Analizy/test.json`

Po ponownym sprawdzeniu przez GitHub API plik `WrathAndGlory/Analizy/test.json` nadal zwraca pustą zawartość.

GitHub zwrócił jedynie metadane pliku:

- encoding: `utf-8`;
- SHA: `308b8f2b50285863c205dc1d28fd18779656b8c1`;
- content: puste.

Wniosek:

Na potrzeby tej analizy nie należy traktować `WrathAndGlory/Analizy/test.json` jako użytecznego źródła danych.

Jednocześnie użytkownik załączył do rozmowy produkcyjny JSON z danymi po polsku. Ten załączony plik powinien być traktowany jako właściwe źródło do dalszej weryfikacji struktury polskich danych produkcyjnych.

Jeżeli później `Analizy/test.json` w repozytorium ma pełnić funkcję przykładowych danych, trzeba go uzupełnić albo zastąpić właściwą zawartością.

---

### 12.7. Dodatkowa rekomendacja po komentarzach

Przy wdrożeniu zmian do `WnG_Tools` należy szczególnie pilnować, aby nie pomylić trzech niezależnych poziomów tłumaczenia:

1. tłumaczenie UI;
2. tłumaczenie nazw arkuszy;
3. tłumaczenie nazw kolumn i formatów tekstowych w danych.

Dla publicznego release najbezpieczniejszy model to:

- UI dwujęzyczne: English / Polski;
- przełącznik języka zawsze widoczny;
- angielskie nazwy arkuszy i kolumn jako domyślny format danych release;
- polskie nazwy jako aliasy kompatybilności z produkcyjnym `WrathAndGlory`;
- dokumentacja jasno opisująca, co użytkownik musi zmienić, jeżeli chce przygotować dane w kolejnym języku, np. francuskim albo niemieckim.

Najkrótszy wniosek implementacyjny:

Nie kopiować bezpośrednio produkcyjnych polskich nazw z `WrathAndGlory` jako jedynego źródła prawdy w `WnG_Tools`.

Zamiast tego wprowadzić jawne aliasy arkuszy, kolumn i formatów odwołań do stron, a w dokumentacji opisać, jak użytkownik może rozszerzyć te aliasy dla własnej wersji językowej danych.
Ta kolejność ogranicza ryzyko, że angielskie sample files albo przyszły angielski `data.json` będą ładować się częściowo, z błędnymi filtrami albo z pustymi listami w NPCGenerator.
