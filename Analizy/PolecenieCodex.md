# Polecenie dla agenta Codex — wdrożenie zmian Church of Steel Update

Pracujesz wyłącznie w repozytorium `CuteLittleGoat/WnG_Tools`.

Nie masz dostępu do repozytorium `WrathAndGlory` i nie wolno zakładać, że możesz z niego skopiować kod. Wszystkie wymagania wdrażaj na podstawie tego pliku oraz aktualnego kodu w `WnG_Tools`.

Celem jest przygotowanie release'owej wersji `WnG_Tools` po aktualizacjach opisanych w `Analizy/ChurchOfSteelUpdate.md`.

Najważniejsze zasady globalne:

1. Nie zmieniaj nazwy folderu `NPCGenerator` na `GeneratorNPC`.
2. `WnG_Tools` ma pozostać release'em z angielskim UI jako domyślnym.
3. Przełącznik języka ma być zawsze widoczny.
4. Tłumaczone jest UI, nie wymuszamy tłumaczenia danych użytkownika.
5. Domyślnym formatem danych release są angielskie nazwy arkuszy i kolumn.
6. Polskie nazwy arkuszy i kolumn mają działać jako aliasy kompatybilności.
7. `Equipment` i `Vehicle Wargear` to dwa różne arkusze.
8. `Equipment` jest zwykłym ekwipunkiem i ma być używany przez `NPCGenerator`.
9. `Vehicle Wargear` jest arkuszem pojazdowym i ma być sterowany checkboxem pojazdów w `DataVault`.
10. `Default View` w release ma być identyczny z `Full View`.
11. Nie dodawaj prywatnych danych Firebase, sekretów, haseł, tokenów ani prawdziwych danych produkcyjnych.
12. Po zmianach ręcznie sprawdź działanie na angielskich sample files.

---

## 1. Pliki do zmiany

Zmień następujące pliki:

- `DataVault/index.html`
- `DataVault/app.js`
- `DataVault/style.css`
- `DataVault/docs/README.md`
- `DataVault/docs/Documentation.md`
- `NPCGenerator/index.html`
- `NPCGenerator/docs/README.md`
- `NPCGenerator/docs/Documentation.md`
- `DataVault/SampleFiles/data.json`
- `DataVault/SampleFiles/firebase-import.json`, jeżeli istnieje i jest generowanym odpowiednikiem `data.json`

Nie twórz folderu `GeneratorNPC`.

---

## 2. `DataVault/index.html`

### 2.1. Przełącznik języka

W `DataVault/index.html` zachowaj:

```html
<html lang="en">
```

W sekcji `.language-switcher` przełącznik ma pozostać widoczny. Nie dodawaj klasy `language-switcher--hidden`.

Poprawny blok ma wyglądać tak:

```html
<div class="language-switcher">
  <select id="languageSelect" aria-label="Language version">
    <option value="en">English</option>
    <option value="pl">Polski</option>
  </select>
</div>
```

Jeżeli w pliku znajdziesz `aria-label="Wersja językowa"`, zmień na `aria-label="Language version"`.

### 2.2. Teksty startowe przycisków widoku

W bloku `.actionsGroup--view` zmień teksty startowe na angielskie. Po załadowaniu języka i tak będą aktualizowane przez `data-i18n`, ale wersja źródłowa HTML w release ma być EN-first.

Zmień:

```html
<button class="btn secondary" id="btnReset" title="Wyczyść filtry, sortowanie i zaznaczenia" data-i18n="fullViewButton" data-i18n-title="fullViewTitle">Pełen Widok</button>
<button class="btn secondary" id="btnDefaultView" title="Przywróć domyślne ukrycia danych" data-i18n="defaultViewButton" data-i18n-title="defaultViewTitle">Widok Domyślny</button>
```

na:

```html
<button class="btn secondary" id="btnReset" title="Clear filters, sorting and selections" data-i18n="fullViewButton" data-i18n-title="fullViewTitle">Full View</button>
<button class="btn secondary" id="btnDefaultView" title="Restore the release default view, identical to Full View" data-i18n="defaultViewButton" data-i18n-title="defaultViewTitle">Default View</button>
```

Zmień też notatkę:

```html
<span data-i18n="viewButtonsNote">Część danych jest domyślnie ukryta.</span>
```

na:

```html
<span data-i18n="viewButtonsNote">Default View is identical to Full View in this release.</span>
```

### 2.3. Checkbox zdezaktualizowanych wpisów Bestiariusza

W panelu filtrów, bezpośrednio po polu globalnego wyszukiwania i przed checkboxem `toggleCharacterTabs`, dodaj:

```html
<label class="checkboxRow checkboxRow--admin" id="toggleBestiaryOldGroup">
  <input type="checkbox" id="toggleOldBestiaryEntries" />
  <span class="checkboxLabel checkboxLabel--admin" data-i18n="toggleOldBestiaryEntries">Show outdated entries?</span>
</label>
```

Ten checkbox ma być widoczny tylko w trybie admina, czyli gdy URL zawiera `?admin=1`. W trybie gracza ma być ukryty przez logikę w `DataVault/app.js`.

### 2.4. Checkbox pojazdów

Bezpośrednio po checkboxie `toggleCombatTabs` dodaj:

```html
<label class="checkboxRow checkboxRow--vehicle">
  <input type="checkbox" id="toggleVehicleTabs" />
  <span class="checkboxLabel checkboxLabel--vehicle" data-i18n="toggleVehicleTabs">Show tabs related to vehicles?</span>
</label>
```

Ten checkbox kontroluje tylko arkusze pojazdów. Nie może ukrywać ani pokazywać zwykłego arkusza `Equipment`.

---

## 3. `DataVault/style.css`

### 3.1. Przełącznik języka

Możesz zostawić istniejącą klasę `.language-switcher--hidden` jako legacy helper, ale nie wolno jej używać w `DataVault/index.html` ani `NPCGenerator/index.html`.

### 3.2. Style checkboxa pojazdów i zakładek pojazdów

Po istniejących stylach `.checkboxRow--combat` dodaj:

```css
.checkboxRow--vehicle{
  color:#b8c7c7;
}
.checkboxRow--vehicle .checkboxLabel{
  color:#d8e4e4;
  opacity:1;
}
.checkboxRow--vehicle input{
  accent-color:#b8c7c7;
}
.checkboxRow--admin{
  color:var(--muted);
}
.checkboxRow--admin .checkboxLabel{
  color:var(--muted);
  opacity:1;
}
.checkboxRow--admin input{
  accent-color:var(--muted);
}
```

Po istniejących stylach `.tab.tab--combat` dodaj:

```css
.tab.tab--vehicle{
  color:#d8e4e4;
  border-color:rgba(184,199,199,.35);
  background:rgba(184,199,199,.06);
}
.tab.tab--vehicle.active{
  color:#ffffff;
  border-color:rgba(184,199,199,.55);
  box-shadow:0 0 0 2px rgba(184,199,199,.12);
}
```

Jeżeli w pliku istnieje już podobny zestaw stylów, nie dubluj go — ujednolić nazwę klas do `checkboxRow--vehicle`, `checkboxRow--admin`, `tab--vehicle`.

---

## 4. `DataVault/app.js`

### 4.1. DOM refs w `els`

Na początku pliku w obiekcie `els` dodaj trzy pola:

```js
toggleOldBestiaryEntries: document.getElementById("toggleOldBestiaryEntries"),
toggleBestiaryOldGroup: document.getElementById("toggleBestiaryOldGroup"),
toggleVehicleTabs: document.getElementById("toggleVehicleTabs"),
```

Dodaj je obok istniejących `toggleCharacterTabs` i `toggleCombatTabs`.

### 4.2. Tłumaczenia `translations`

W `translations.pl.labels` dodaj lub zmień następujące klucze:

```js
viewButtonsNote: "Widok Domyślny jest taki sam jak Pełen Widok w tej wersji release.",
toggleOldBestiaryEntries: "Czy wyświetlić zdezaktualizowane wpisy?",
toggleVehicleTabs: "Czy wyświetlić zakładki dotyczące pojazdów?",
```

W `translations.en.labels` dodaj lub zmień następujące klucze:

```js
viewButtonsNote: "Default View is identical to Full View in this release.",
toggleOldBestiaryEntries: "Show outdated entries?",
toggleVehicleTabs: "Show tabs related to vehicles?",
```

W `translations.pl.titles` zmień `defaultView` na:

```js
defaultView: "Przywróć release'owy Widok Domyślny, taki sam jak Pełen Widok",
```

W `translations.en.titles` zmień `defaultView` na:

```js
defaultView: "Restore the release Default View, identical to Full View",
```

### 4.3. Stałe aliasów arkuszy i kolumn

Bezpośrednio po funkcji `canonKey(s)` dodaj poniższy blok. Jeżeli `canonKey` obecnie znajduje się niżej niż zbiory arkuszy, przenieś funkcję `canonKey` nad konfigurację arkuszy, tak aby można było używać jej w helperach.

```js
const SHEET_ALIASES = {
  notes: ["Notes", "Notatki"],
  bestiary: ["Bestiary", "Bestiariusz"],
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
  firstFoundingChapters: ["First Founding Chapters", "Zakony Pierwszego Powołania"],
  traits: ["Traits", "Cechy"],
  conditions: ["Conditions", "States", "Stany"],
  keywords: ["Keywords", "Słowa Kluczowe"],
  talents: ["Talents", "Talenty"],
  prayers: ["Prayers", "Modlitwy"],
  psionics: ["Psionics", "Psionika"],
  augmentations: ["Augmentations", "Augumentacje"],
  equipment: ["Equipment", "Ekwipunek"],
  armor: ["Armor", "Armour", "Pancerze"],
  weapons: ["Weapons", "Bronie"],
  criticalHits: ["Critical Hits", "Trafienia Krytyczne"],
  perilsOfTheWarp: ["Perils of the Warp", "Groza Osnowy"],
  rulesReference: ["Rules Reference", "Skrót Zasad"],
  fireModes: ["Fire Modes", "Tryby Ognia"],
  dnPenalties: ["DN Penalties", "Kary do ST"],
  vehicleRoles: ["Vehicle Roles", "Role W Pojeździe"],
  vehicleActions: ["Vehicle Actions", "Akcje Pojazdu"],
  vehicleConditions: ["Vehicle Conditions", "Vehicle States", "Stany Pojazdów"],
  vehicleTraits: ["Vehicle Traits", "Cechy Pojazdów"],
  vehicles: ["Vehicles", "Pojazdy"],
  vehicleWeapons: ["Vehicle Weapons", "Bronie Pojazdów"],
  vehicleWargear: ["Vehicle Wargear", "Vehicle Equipment", "Ekwipunek Pojazdów"],
};

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
  rateOfFire: ["Rate of fire", "Rate Of Fire", "Szybkostrzelność"],
  armorValue: ["AV", "AR", "Armor Rating", "Armour Rating", "Wartość Pancerza", "WP"],
  source: ["Source", "Book", "Podręcznik"],
  page: ["Page", "Strona"],
};

const getCanonicalSheetKey = (sheetName) => {
  const wanted = canonKey(sheetName);
  for (const [key, aliases] of Object.entries(SHEET_ALIASES)) {
    if (aliases.some((alias) => canonKey(alias) === wanted)) return key;
  }
  return wanted;
};

const sheetIsOneOf = (sheetName, canonicalKeys) => canonicalKeys.has(getCanonicalSheetKey(sheetName));

const getColumnAliases = (canonicalKey) => COLUMN_ALIASES[canonicalKey] || [canonicalKey];

const getRecordValueByColumnKey = (record, canonicalKey) => {
  if (!record || typeof record !== "object") return null;
  const aliases = getColumnAliases(canonicalKey).map((alias) => canonKey(alias));
  const actualKey = Object.keys(record).find((key) => aliases.includes(canonKey(key)));
  return actualKey ? record[actualKey] : null;
};

const columnIsOneOf = (columnName, canonicalKeys) => {
  const wanted = canonKey(columnName);
  return [...canonicalKeys].some((canonicalKey) => getColumnAliases(canonicalKey).some((alias) => canonKey(alias) === wanted));
};
```

### 4.4. Zastąp zbiory arkuszy oparte o polskie nazwy

Znajdź obecny blok zaczynający się od:

```js
const KEYWORD_SHEETS_COMMA_NEUTRAL = new Set([
```

Usuń obecne zbiory `KEYWORD_SHEETS_COMMA_NEUTRAL`, `KEYWORD_SHEET_ALL_RED`, `ADMIN_ONLY_SHEETS`, `CHARACTER_CREATION_SHEETS`, `COMBAT_RULES_SHEETS`, `CHARACTER_CREATION_SHEET_KEYS`, `COMBAT_RULES_SHEET_KEYS`.

Wstaw w ich miejsce:

```js
const KEYWORD_SHEET_KEYS_COMMA_NEUTRAL = new Set([
  "bestiary",
  "archetypes",
  "psionics",
  "augmentations",
  "equipment",
  "armor",
  "weapons",
  "ascensionPackages",
  "vehicles",
  "vehicleWeapons",
  "vehicleWargear",
]);
const KEYWORD_SHEET_ALL_RED_KEY = "keywords";
const ADMIN_ONLY_SHEET_KEYS = new Set([
  "bestiary",
  "criticalHits",
  "perilsOfTheWarp",
  "mobs",
  "specialEnemyBonuses",
  "notes",
]);
const CHARACTER_CREATION_SHEET_KEYS = new Set([
  "sizeTable",
  "species",
  "archetypes",
  "factionBonuses",
  "factionKeywords",
  "ascensionPackages",
  "specialFactionBonuses",
  "astartesImplants",
  "firstFoundingChapters",
]);
const COMBAT_RULES_SHEET_KEYS = new Set([
  "criticalHits",
  "perilsOfTheWarp",
  "rulesReference",
  "fireModes",
  "dnPenalties",
]);
const VEHICLE_SHEET_KEYS = new Set([
  "vehicleRoles",
  "vehicleActions",
  "vehicleConditions",
  "vehicleTraits",
  "vehicles",
  "vehicleWeapons",
  "vehicleWargear",
]);
```

Następnie zmień funkcje:

```js
function isCharacterCreationSheet(name){
  return CHARACTER_CREATION_SHEET_KEYS.has(canonKey(name));
}

function isCombatRulesSheet(name){
  return COMBAT_RULES_SHEET_KEYS.has(canonKey(name));
}
```

na:

```js
function isCharacterCreationSheet(name){
  return sheetIsOneOf(name, CHARACTER_CREATION_SHEET_KEYS);
}

function isCombatRulesSheet(name){
  return sheetIsOneOf(name, COMBAT_RULES_SHEET_KEYS);
}

function isVehicleSheet(name){
  return sheetIsOneOf(name, VEHICLE_SHEET_KEYS);
}

function isBestiarySheet(name){
  return getCanonicalSheetKey(name) === "bestiary";
}
```

### 4.5. Widok domyślny ma być identyczny z pełnym

Znajdź:

```js
const SESSION_VIEW_KEY = "datavault_session_view_v2";
const DEFAULT_VIEW_CONFIG = {
```

Usuń cały obecny obiekt `DEFAULT_VIEW_CONFIG` z polskimi filtrami i zastąp go dokładnie tym blokiem:

```js
const SESSION_VIEW_KEY = "datavault_session_view_v3_release";

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

Zmień funkcję `createSheetViewState` tak, aby nie ustawiała domyślnego sortowania. Ma wyglądać tak:

```js
function createSheetViewState(sheetName = null){
  void sheetName;
  return {
    sort: null,
    global: "",
    filtersText: {},
    filtersSet: {},
    selected: new Set(),
    expandedCells: new Set(),
  };
}
```

Zmień funkcję `applyDefaultViewForSheet(sheetName)` na:

```js
function applyDefaultViewForSheet(sheetName){
  applyFullViewForSheet(sheetName);
}
```

### 4.6. Stan UI

Zmień:

```js
const uiState = {
  showCharacterTabs: false,
  showCombatTabs: false
};
```

na:

```js
const uiState = {
  showCharacterTabs: false,
  showCombatTabs: false,
  showVehicleTabs: false,
  showOldBestiaryEntries: false,
};
```

`showOldBestiaryEntries` nie powinno być utrwalane w `sessionStorage`. W `saveSessionState()` zapisz tylko:

```js
toggles: {
  showCharacterTabs: uiState.showCharacterTabs,
  showCombatTabs: uiState.showCombatTabs,
  showVehicleTabs: uiState.showVehicleTabs,
},
```

Nie zapisuj `showOldBestiaryEntries`.

W `loadSessionState()` odczytaj tylko:

```js
uiState.showCharacterTabs = Boolean(parsed.toggles.showCharacterTabs);
uiState.showCombatTabs = Boolean(parsed.toggles.showCombatTabs);
uiState.showVehicleTabs = Boolean(parsed.toggles.showVehicleTabs);
uiState.showOldBestiaryEntries = false;
```

### 4.7. Ukrywanie wpisów `old` w Bestiary/Bestiariusz

Zmień funkcję `isOldStatusRow(row)`. Obecnie rozpoznaje tylko kolumnę `Stan`. Ma rozpoznawać `State` i `Stan` przez aliasy:

```js
function isOldStatusRow(row){
  const value = stripMarkers(String(getRecordValueByColumnKey(row, "state") ?? "")).trim().toLowerCase();
  return value === STATUS_OLD_VALUE;
}
```

Dodaj funkcje:

```js
function shouldShowRowInCurrentSystemView(row, sheetName){
  if (isBestiarySheet(sheetName) && !uiState.showOldBestiaryEntries && isOldStatusRow(row)) {
    return false;
  }
  return true;
}

function getSystemVisibleRows(sheetName){
  return (DB?.sheets?.[sheetName] || []).filter((row) => shouldShowRowInCurrentSystemView(row, sheetName));
}

function pruneHiddenOldBestiarySelection(){
  if (!isBestiarySheet(currentSheet)) return;
  if (uiState.showOldBestiaryEntries) return;
  const visibleIds = new Set(getSystemVisibleRows(currentSheet).map((row) => row.__id));
  for (const selectedId of [...view.selected]) {
    if (!visibleIds.has(selectedId)) view.selected.delete(selectedId);
  }
}
```

Następnie użyj `getSystemVisibleRows` zamiast surowego `DB.sheets[currentSheet]` w miejscach związanych z widokiem i filtrami:

- w `uniqueValuesForColumn(col)` użyj `const rows = getSystemVisibleRows(currentSheet);`;
- w `renderBody()` użyj `const rowsAll = getSystemVisibleRows(currentSheet);`;
- w `openFilterMenu(col, anchorBtn)` wartości filtrów mają pochodzić z `uniqueValuesForColumn(col)`, czyli po tej zmianie automatycznie nie będą widzieć ukrytych `old`;
- w `loadSessionState()` przy walidacji zapisanych filtrów użyj `const rows = getSystemVisibleRows(sheetName);`.

W `renderBody()` przed filtrowaniem dodaj:

```js
pruneHiddenOldBestiarySelection();
```

### 4.8. `isHiddenColumn`

Zmień:

```js
const HIDDEN_COLUMNS = new Set(["lp", "stan"]);
```

na:

```js
const HIDDEN_COLUMNS = new Set(["lp", "id", "stan", "state"]);
```

Uwaga: `ID` i `State` są używane technicznie, ale nie muszą być pokazywane w tabeli.

### 4.9. Formatowanie słów kluczowych i zasięgu

W `formatDataCellHTML(row, col, sheetName = currentSheet)` zastąp warunki oparte na polskich nazwach arkuszy/kolumn wersją opartą o aliasy:

```js
function formatDataCellHTML(row, col, sheetName = currentSheet){
  const sheetKey = getCanonicalSheetKey(sheetName);
  const isNameColumn = columnIsOneOf(col, new Set(["name"]));
  const isKeywordsColumn = columnIsOneOf(col, new Set(["keywords"]));
  const isRangeColumn = columnIsOneOf(col, new Set(["range"]));
  const isKeywordName = sheetKey === KEYWORD_SHEET_ALL_RED_KEY && isNameColumn;
  const isKeywordCommaNeutral = KEYWORD_SHEET_KEYS_COMMA_NEUTRAL.has(sheetKey) && isKeywordsColumn;
  const isAscensionPackageKeyword = sheetKey === "ascensionPackages" && isKeywordsColumn;
  const isFactionKeyword = sheetKey === "factionKeywords" && isKeywordsColumn;

  if (isKeywordName){
    return formatKeywordHTML(row, col);
  }
  if (isFactionKeyword){
    return formatFactionKeywordHTML(row[col]);
  }
  if (isAscensionPackageKeyword){
    return getFormattedCellHTML(row, col);
  }
  if (isKeywordCommaNeutral){
    return formatKeywordHTML(row, col, {commasNeutral:true});
  }
  if (isRangeColumn){
    return formatRangeHTML(row[col]);
  }
  return getFormattedCellHTML(row, col);
}
```

W `getFormattedCellHTML(row, col)` zmień warunek:

```js
if (col === "Zasięg") html = formatRangeHTML(row[col]);
```

na:

```js
if (columnIsOneOf(col, new Set(["range"]))) html = formatRangeHTML(row[col]);
```

### 4.10. Grupowanie i widoczność arkuszy w `initUI()`

W `initUI()` zmień:

```js
const baseVisible = ADMIN_MODE ? available : available.filter(name => !ADMIN_ONLY_SHEETS.has(name));
```

na:

```js
const baseVisible = ADMIN_MODE ? available : available.filter(name => !sheetIsOneOf(name, ADMIN_ONLY_SHEET_KEYS));
```

Po filtrowaniu combat dodaj filtrowanie pojazdów:

```js
visibleSheets = uiState.showVehicleTabs
  ? visibleSheets
  : visibleSheets.filter(name => !isVehicleSheet(name));
```

W pętli tworzącej przyciski zakładek, po obsłudze `tab--combat`, dodaj:

```js
if (isVehicleSheet(name)){
  b.classList.add("tab--vehicle");
}
```

Zastąp:

```js
const preferredStartSheet = ADMIN_MODE ? "Notatki" : "Bronie";
```

kodem:

```js
const firstAvailableSheetByKeys = (keys) => available.find((name) => keys.includes(getCanonicalSheetKey(name)));
const preferredStartSheet = ADMIN_MODE
  ? firstAvailableSheetByKeys(["notes", "bestiary"])
  : firstAvailableSheetByKeys(["weapons", "bestiary", "notes"]);
```

Po ustawieniu checkboxów `toggleCharacterTabs` i `toggleCombatTabs` dodaj:

```js
if (els.toggleVehicleTabs){
  els.toggleVehicleTabs.checked = uiState.showVehicleTabs;
}
if (els.toggleOldBestiaryEntries){
  els.toggleOldBestiaryEntries.checked = uiState.showOldBestiaryEntries;
}
if (els.toggleBestiaryOldGroup){
  els.toggleBestiaryOldGroup.hidden = !ADMIN_MODE;
}
```

### 4.11. Listenery checkboxów

Na końcu pliku, obok listenerów `toggleCharacterTabs` i `toggleCombatTabs`, dodaj:

```js
if (els.toggleVehicleTabs){
  els.toggleVehicleTabs.addEventListener("change", ()=>{
    uiState.showVehicleTabs = els.toggleVehicleTabs.checked;
    initUI();
    saveSessionState();
  });
  uiState.showVehicleTabs = els.toggleVehicleTabs.checked;
}

if (els.toggleOldBestiaryEntries){
  els.toggleOldBestiaryEntries.addEventListener("change", ()=>{
    uiState.showOldBestiaryEntries = Boolean(els.toggleOldBestiaryEntries.checked && ADMIN_MODE);
    if (!uiState.showOldBestiaryEntries) pruneHiddenOldBestiarySelection();
    if (currentSheet && isBestiarySheet(currentSheet)) {
      buildTableSkeleton();
      renderBody();
    }
  });
  uiState.showOldBestiaryEntries = false;
  els.toggleOldBestiaryEntries.checked = false;
}
```

### 4.12. Metadane pojazdów w `buildDataJsonFromSheets`

W `buildDataJsonFromSheets(rawSheets, opts = {})` dodaj obsługę metadanych pojazdów.

Na początku funkcji, obok `traits` i `states`, dodaj:

```js
const vehicleTraits = {};
const vehicleWeaponTraits = {};
const vehicleStates = {};
```

W pętli `for (const [name, rows] of Object.entries(rawSheets))` dodaj rozpoznawanie arkuszy po kluczu kanonicznym:

```js
const sheetKey = getCanonicalSheetKey(name);
```

Zmień warunki `if (name === "Cechy")` i `if (name === "Stany")`, aby działały po aliasach:

```js
if (sheetKey === "traits") {
  for (const row of rows){
    const traitName = norm(getRecordValueByColumnKey(row, "name"));
    const desc = String(getRecordValueByColumnKey(row, "description") ?? getRecordValueByColumnKey(row, "effect") ?? "").trim();
    if (traitName && desc) traits[traitName] = desc;
  }
}
if (sheetKey === "conditions") {
  for (const row of rows){
    const stateName = norm(getRecordValueByColumnKey(row, "name"));
    const desc = String(getRecordValueByColumnKey(row, "description") ?? getRecordValueByColumnKey(row, "effect") ?? "").trim();
    if (stateName && desc) states[stateName] = desc;
  }
}
if (sheetKey === "vehicleTraits") {
  for (const row of rows){
    const traitName = norm(getRecordValueByColumnKey(row, "name"));
    const desc = String(getRecordValueByColumnKey(row, "description") ?? getRecordValueByColumnKey(row, "effect") ?? "").trim();
    if (traitName && desc) vehicleTraits[traitName] = desc;
  }
}
if (sheetKey === "vehicleConditions") {
  for (const row of rows){
    const stateName = norm(getRecordValueByColumnKey(row, "name"));
    const desc = String(getRecordValueByColumnKey(row, "description") ?? getRecordValueByColumnKey(row, "effect") ?? "").trim();
    if (stateName && desc) vehicleStates[stateName] = desc;
  }
}
```

Jeżeli istnieje osobny arkusz cech broni pojazdów, obsłuż go przez `vehicleWeaponTraits`. Jeżeli nie istnieje, ustaw `vehicleWeaponTraits` jako pusty obiekt.

Zmień końcowy return funkcji tak, aby `_meta` zawierało:

```js
return {
  sheets,
  _meta: {
    traits,
    states,
    vehicleTraits,
    vehicleWeaponTraits,
    vehicleStates,
    sheetOrder: resolvedSheetOrder,
    columnOrder: resolvedColumnOrder,
  },
};
```

### 4.13. Metadane pojazdów w `normaliseDB`

W `normaliseDB(data)` upewnij się, że `_meta` zawsze zawiera:

```js
traits
states
vehicleTraits
vehicleWeaponTraits
vehicleStates
traitIndex
stateIndex
vehicleTraitIndex
vehicleWeaponTraitIndex
vehicleStateIndex
sheetOrder
columnOrder
```

Indeksy buduj tak samo jak `traitIndex` i `stateIndex`, używając `canonKey`.

---

## 5. `NPCGenerator/index.html`

### 5.1. Przełącznik języka

Zachowaj:

```html
<html lang="en">
```

Przełącznik języka ma być widoczny. Nie dodawaj `language-switcher--hidden`.

W sekcji `.language-switcher` ustaw:

```html
<select id="languageSelect" aria-label="Language version">
```

### 5.2. Checkbox `Show outdated entries?`

W sekcji `Base selection`, bezpośrednio po polu `<select id="bestiary">...</select>` i przed polem `bestiary-notes`, dodaj:

```html
<label class="checkbox checkbox-inline bestiary-old-toggle">
  <input type="checkbox" id="bestiary-show-old" />
  <span data-i18n="bestiaryShowOldToggle">Show outdated entries?</span>
</label>
```

Checkbox ma być domyślnie odznaczony.

### 5.3. Stałe DOM

W skrypcie modułu, obok:

```js
const bestiarySelect = document.querySelector("#bestiary");
```

dodaj:

```js
const bestiaryShowOldToggle = document.querySelector("#bestiary-show-old");
```

### 5.4. Tłumaczenia

W `translations.pl.labels` dodaj:

```js
bestiaryShowOldToggle: "Czy wyświetlić zdezaktualizowane wpisy?",
```

W `translations.en.labels` dodaj:

```js
bestiaryShowOldToggle: "Show outdated entries?",
```

W `translations.pl.messages` dodaj:

```js
requiredSheetsMissingContainer: "Dane DataVault nie zawierają listy arkuszy wymaganej przez NPCGenerator.",
requiredSheetMissing: "W danych DataVault brakuje wymaganego arkusza NPCGenerator: {sheet}.",
requiredSheetEmpty: "Wymagany arkusz NPCGenerator jest pusty: {sheet}.",
oldBestiaryHiddenSelection: "Wybrany rekord jest zdezaktualizowany i został ukryty. Włącz opcję wyświetlania zdezaktualizowanych wpisów, aby go ponownie wybrać.",
```

W `translations.en.messages` dodaj:

```js
requiredSheetsMissingContainer: "DataVault data does not contain the sheet list required by NPCGenerator.",
requiredSheetMissing: "DataVault data is missing a required NPCGenerator sheet: {sheet}.",
requiredSheetEmpty: "A required NPCGenerator sheet is empty: {sheet}.",
oldBestiaryHiddenSelection: "The selected record is outdated and has been hidden. Enable outdated entries to select it again.",
```

### 5.5. Stan generatora

W obiekcie `state` dodaj:

```js
showOldBestiaryRecords: false,
```

### 5.6. Aliasowanie arkuszy i kolumn

W skrypcie `NPCGenerator/index.html`, po helperach `normalizeText` / `normalizeKey` albo przed pierwszym użyciem kolekcji, dodaj:

```js
const REQUIRED_NPCGENERATOR_SHEETS = {
  bestiary: ["Bestiary", "Bestiariusz"],
  armor: ["Armor", "Armour", "Pancerze"],
  weapons: ["Weapons", "Bronie"],
  augmentations: ["Augmentations", "Augumentacje"],
  equipment: ["Equipment", "Ekwipunek"],
  talents: ["Talents", "Talenty"],
  psionics: ["Psionics", "Psionika"],
  prayers: ["Prayers", "Modlitwy"],
};

const COLUMN_ALIASES = {
  id: ["ID", "LP", "Lp"],
  state: ["State", "Stan"],
  type: ["Type", "Typ", "Kind", "Rodzaj"],
  name: ["Name", "Nazwa"],
  threat: ["Threat", "Zagrożenie"],
  keywords: ["Keywords", "Słowa Kluczowe", "Słowo Kluczowe"],
  resilience: ["Resilience", "Resistance", "Odporność (w tym WP)", "Obrona (w tym WP)"],
  armorValue: ["AV", "AR", "Armor Rating", "Armour Rating", "Wartość Pancerza", "WP"],
  defense: ["Defense", "Defence", "Obrona"],
  wounds: ["Wounds", "Vitality", "Żywotność"],
  shock: ["Shock", "Mental Resistance", "Odporność Psychiczna", "Odporność psychiczna"],
  skills: ["Skills", "Umiejętności"],
  bonuses: ["Bonuses", "Premie"],
  abilities: ["Abilities", "Zdolności"],
  attacks: ["Attacks", "Attack", "Atak"],
  mobAbilities: ["Mob Abilities", "Horde Abilities", "Zdolności Hordy"],
  mobOptions: ["Mob Options", "Horde Options", "Opcje Hordy"],
  resolve: ["Resolve", "Upór"],
  courage: ["Courage", "Odwaga"],
  speed: ["Speed", "Szybkość"],
  size: ["Size", "Rozmiar"],
  damage: ["Damage", "Obrażenia"],
  dn: ["DN", "DK", "ST"],
  ap: ["AP", "PP"],
  range: ["Range", "Zasięg"],
  rateOfFire: ["Rate of fire", "Rate Of Fire", "Szybkostrzelność"],
  traits: ["Traits", "Cechy"],
  source: ["Source", "Book", "Podręcznik"],
  page: ["Page", "Strona"],
  effect: ["Effect", "Efekt"],
  activation: ["Activation", "Aktywacja"],
  duration: ["Duration", "Czas trwania"],
  targets: ["Targets", "Wiele Celów"],
  boost: ["Boost", "Wzmocnienie"],
};

const getRecordValueByCanonical = (record, canonicalKey) =>
  getRecordValueByLabels(record, COLUMN_ALIASES[canonicalKey] || [canonicalKey]);

const getSheetByAliases = (db, aliases) => {
  if (!db || typeof db !== "object" || !db.sheets || typeof db.sheets !== "object") return null;
  const entries = Object.entries(db.sheets);
  for (const alias of aliases) {
    const wanted = normalizeKey(alias);
    const match = entries.find(([sheetName]) => normalizeKey(sheetName) === wanted);
    if (match) return { sheetName: match[0], records: extractRecords(match[1]) };
  }
  return null;
};

const getRequiredCollectionByAliases = (db, canonicalKey) => {
  if (!db || typeof db !== "object" || !db.sheets || typeof db.sheets !== "object") {
    throw new Error("NPCGENERATOR_DATA_MISSING_SHEETS");
  }
  const aliases = REQUIRED_NPCGENERATOR_SHEETS[canonicalKey] || [];
  const resolved = getSheetByAliases(db, aliases);
  if (!resolved) {
    throw new Error(`NPCGENERATOR_REQUIRED_SHEET_MISSING:${canonicalKey}:${aliases.join("|")}`);
  }
  if (!resolved.records.length) {
    throw new Error(`NPCGENERATOR_REQUIRED_SHEET_EMPTY:${canonicalKey}:${resolved.sheetName}`);
  }
  return resolved.records;
};
```

Nie usuwaj starej funkcji `getCollection` od razu, jeżeli inne fragmenty jeszcze jej używają, ale `loadPrivateGeneratorData()` ma używać nowego deterministycznego resolvera.

### 5.7. Ładowanie danych w `loadPrivateGeneratorData()`

W funkcji `loadPrivateGeneratorData()` zastąp linie:

```js
state.bestiary = sortByName(getCollection(data, ["besti", "bestiariusz"]));
state.armor = sortByTypeThenName(getCollection(data, ["pancerz", "armor"]));
state.weapons = sortByTypeThenName(getCollection(data, ["broń", "bron", "weapon"]));
state.augmentations = sortByTypeThenName(getCollection(data, ["augument", "augment", "modyfikac"]));
state.equipment = sortByTypeThenName(getCollection(data, ["ekwipunek", "equipment"]));
state.talents = sortByName(getCollection(data, ["talent"]));
state.psionics = sortByTypeThenName(getCollection(data, ["psion", "psionik"]), { typeDescending: true });
state.prayers = sortByName(getCollection(data, ["modlitw", "prayer"]));
```

na:

```js
state.bestiary = sortByName(getRequiredCollectionByAliases(data, "bestiary"));
state.armor = sortByTypeThenName(getRequiredCollectionByAliases(data, "armor"));
state.weapons = sortByTypeThenName(getRequiredCollectionByAliases(data, "weapons"));
state.augmentations = sortByTypeThenName(getRequiredCollectionByAliases(data, "augmentations"));
state.equipment = sortByTypeThenName(getRequiredCollectionByAliases(data, "equipment"));
state.talents = sortByName(getRequiredCollectionByAliases(data, "talents"));
state.psionics = sortByTypeThenName(getRequiredCollectionByAliases(data, "psionics"), { typeDescending: true });
state.prayers = sortByName(getRequiredCollectionByAliases(data, "prayers"));
```

Ważne: `equipment` ma używać wyłącznie logicznego arkusza `Equipment` / `Ekwipunek`. Nie wolno tu zaciągać `Vehicle Wargear` / `Ekwipunek Pojazdów`.

### 5.8. Obsługa błędów arkuszy

W miejscu, w którym łapane są błędy ładowania danych, rozpoznaj błędy:

- `NPCGENERATOR_DATA_MISSING_SHEETS`
- `NPCGENERATOR_REQUIRED_SHEET_MISSING:{canonicalKey}:{aliases}`
- `NPCGENERATOR_REQUIRED_SHEET_EMPTY:{canonicalKey}:{sheetName}`

Dodaj helper:

```js
const getReadableGeneratorDataError = (error) => {
  const message = String(error?.message || error || "");
  const t = translations[currentLanguage].messages;
  if (message === "NPCGENERATOR_DATA_MISSING_SHEETS" || message === "GENERATORNPC_DATA_MISSING_SHEETS") {
    return t.requiredSheetsMissingContainer;
  }
  if (message.startsWith("NPCGENERATOR_REQUIRED_SHEET_MISSING:")) {
    const [, key, aliases] = message.split(":");
    return formatText(t.requiredSheetMissing, {
      sheet: `${key} (accepted aliases: ${(aliases || "").split("|").join(", ")})`,
    });
  }
  if (message.startsWith("NPCGENERATOR_REQUIRED_SHEET_EMPTY:")) {
    const [, key, sheetName] = message.split(":");
    return formatText(t.requiredSheetEmpty, { sheet: `${key} (${sheetName})` });
  }
  return t.statusPrivateDataError;
};
```

W `startPrivateDataFlow()` i submit handlerze access gate użyj tego helpera jako fallbacku dla błędów danych.

### 5.9. Ukrywanie starych wpisów w `NPCGenerator`

Zmień:

```js
const isOldBestiaryRecord = (record) =>
  normalizeText(getRecordValueByLabels(record, ["Stan", "stan"])).toLowerCase() === "old";
```

na:

```js
const isOldBestiaryRecord = (record) =>
  normalizeText(getRecordValueByCanonical(record, "state")).toLowerCase() === "old";
```

Dodaj:

```js
const getVisibleBestiaryRecords = () =>
  state.showOldBestiaryRecords ? state.bestiary : state.bestiary.filter((record) => !isOldBestiaryRecord(record));
```

Zmień `setSelectOptions` dla bestiariusza tak, aby option value przechowywało indeks z pełnego `state.bestiary`, ale lista opcji była budowana z widocznych rekordów.

Dodaj funkcję:

```js
const refreshBestiaryOptions = () => {
  const previousValue = bestiarySelect.value;
  const visibleRecords = getVisibleBestiaryRecords();
  bestiarySelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = translations[currentLanguage].messages.selectBestiary;
  bestiarySelect.append(placeholder);

  visibleRecords.forEach((record) => {
    const originalIndex = state.bestiary.indexOf(record);
    const option = document.createElement("option");
    option.value = String(originalIndex);
    option.textContent = getRecordName(record, originalIndex);
    if (isOldBestiaryRecord(record)) option.classList.add("bestiary-option-old");
    bestiarySelect.append(option);
  });

  if (previousValue && Array.from(bestiarySelect.options).some((option) => option.value === previousValue)) {
    bestiarySelect.value = previousValue;
  } else {
    bestiarySelect.value = "";
    state.selectedBestiaryIndex = null;
    resetBestiaryOverrides();
    renderBestiaryTable(null);
  }
};
```

W `loadPrivateGeneratorData()` zamień:

```js
setSelectOptions(bestiarySelect, state.bestiary, translations[currentLanguage].messages.selectBestiary);
```

na:

```js
refreshBestiaryOptions();
```

Dodaj listener:

```js
if (bestiaryShowOldToggle) {
  bestiaryShowOldToggle.addEventListener("change", () => {
    state.showOldBestiaryRecords = bestiaryShowOldToggle.checked;
    refreshBestiaryOptions();
  });
}
```

### 5.10. Kolumny tabel i pobieranie wartości przez aliasy

Zmień tablice kolumn z polskich etykiet na klucze kanoniczne.

Zmień:

```js
const weaponColumns = ["Nazwa", "Obrażenia", "DK", "PP", "Zasięg", "Szybkostrzelność", "Cechy", "Słowa Kluczowe", "Podręcznik", "Strona"];
const armorColumns = ["Nazwa", "WP", "Cechy", "Słowa Kluczowe", "Podręcznik", "Strona"];
const augmentationsColumns = ["Nazwa", "Efekt"];
const equipmentColumns = ["Nazwa", "Efekt"];
const talentsColumns = ["Nazwa", "Efekt"];
const psionicsColumns = ["Nazwa", "ST", "Aktywacja", "Czas trwania", "Zasięg", "Wiele Celów", "Efekt", "Wzmocnienie"];
const prayersColumns = ["Nazwa", "Efekt"];
```

na:

```js
const weaponColumns = ["name", "damage", "dn", "ap", "range", "rateOfFire", "traits", "keywords", "source", "page"];
const armorColumns = ["name", "armorValue", "traits", "keywords", "source", "page"];
const augmentationsColumns = ["name", "effect"];
const equipmentColumns = ["name", "effect"];
const talentsColumns = ["name", "effect"];
const psionicsColumns = ["name", "dn", "activation", "duration", "range", "targets", "effect", "boost"];
const prayersColumns = ["name", "effect"];
```

Dodaj helper etykiet:

```js
const COLUMN_LABEL_KEYS = {
  name: "weaponHeaderName",
  damage: "weaponHeaderDamage",
  dn: "weaponHeaderDn",
  ap: "weaponHeaderAp",
  range: "weaponHeaderRange",
  rateOfFire: "weaponHeaderRate",
  traits: "weaponHeaderTraits",
  keywords: "weaponHeaderKeywords",
  source: "weaponHeaderBook",
  page: "weaponHeaderPage",
  armorValue: "armorHeaderWp",
  effect: "augmentationsHeaderEffect",
  activation: "psionicsHeaderActivation",
  duration: "psionicsHeaderDuration",
  targets: "psionicsHeaderTargets",
  boost: "psionicsHeaderBoost",
};

const getColumnDisplayLabel = (canonicalKey) => {
  const labelKey = COLUMN_LABEL_KEYS[canonicalKey];
  return labelKey && translations[currentLanguage].labels[labelKey]
    ? translations[currentLanguage].labels[labelKey]
    : canonicalKey;
};
```

W `renderOrderedTable()` zmień logikę tak, aby:

- `columns` zawierało klucze kanoniczne;
- do pobierania wartości używało `getRecordValueByCanonical(record, canonicalKey)`;
- do etykiety wyświetlanej w trybie pełnych szczegółów używało `getColumnDisplayLabel(canonicalKey)`.

W szczególności zmień:

```js
if (label.toLowerCase().includes("cechy")) {
  row.append(renderTraitsCell(getRecordValue(record, label), columnClass));
  return;
}
const valueString = toDisplayString(getRecordValue(record, label));
row.append(createClampCell(sheetName, index, label, valueString, columnClass));
```

na:

```js
if (label === "traits") {
  row.append(renderTraitsCell(getRecordValueByCanonical(record, label), columnClass));
  return;
}
const valueString = toDisplayString(getRecordValueByCanonical(record, label));
row.append(createClampCell(sheetName, index, label, valueString, columnClass));
```

W `buildModuleEntries()` zmień:

```js
const name = toDisplayString(getRecordValue(record, "Nazwa"));
```

na:

```js
const name = toDisplayString(getRecordValueByCanonical(record, "name"));
```

oraz w szczegółach zmień pobieranie wartości i etykiety:

```js
const rawValue = getRecordValueByCanonical(record, column);
const label = getColumnDisplayLabel(column);
return hasMeaningfulValue(value) ? `${label}: ${value}` : null;
```

### 5.11. Funkcje karty NPC muszą używać aliasów

W całym `NPCGenerator/index.html` zastąp pobieranie danych po surowych polskich nazwach na `getRecordValueByCanonical`.

Najważniejsze zamiany:

- `getRecordValue(record, "Nazwa")` -> `getRecordValueByCanonical(record, "name")`
- `getRecordValue(record, "Słowa Kluczowe")` -> `getRecordValueByCanonical(record, "keywords")`
- `getRecordValue(record, "Zagrożenie")` -> `getRecordValueByCanonical(record, "threat")`
- `getRecordValue(record, "Umiejętności")` -> `getRecordValueByCanonical(record, "skills")`
- `getRecordValue(record, "Premie")` -> `getRecordValueByCanonical(record, "bonuses")`
- `getRecordValue(record, "Zdolności")` -> `getRecordValueByCanonical(record, "abilities")`
- `getRecordValue(record, "Atak")` -> `getRecordValueByCanonical(record, "attacks")`
- `getRecordValue(record, "Zdolności Hordy")` -> `getRecordValueByCanonical(record, "mobAbilities")`
- `getRecordValue(record, "Opcje Hordy")` -> `getRecordValueByCanonical(record, "mobOptions")`
- `getRecordValue(record, "Upór")` -> `getRecordValueByCanonical(record, "resolve")`
- `getRecordValue(record, "Odwaga")` -> `getRecordValueByCanonical(record, "courage")`
- `getRecordValue(record, "Szybkość")` -> `getRecordValueByCanonical(record, "speed")`
- `getRecordValue(record, "Rozmiar")` -> `getRecordValueByCanonical(record, "size")`
- `getRecordValueByLabels(record, ["Wartość Pancerza", "WP"])` -> `getRecordValueByCanonical(record, "armorValue")`
- `getRecordValueByLabels(record, ["Odporność (w tym WP)", "Obrona (w tym WP)"])` -> `getRecordValueByCanonical(record, "resilience")`
- `getRecordValueByLabels(record, ["Odporność Psychiczna", "Odporność psychiczna"])` -> `getRecordValueByCanonical(record, "shock")`

Statystyki `S`, `Wt`, `Zr`, `I`, `SW`, `Int`, `Ogd` mogą pozostać pobierane po swoich skrótach, ale dodaj fallbacki EN, jeżeli sample files ich używają inaczej, np. `T`, `A`, `Will`, `Fell`.

### 5.12. Odwołania do stron

W `formatInlineHTML` znajdź regex rozpoznający odwołania do stron w nawiasach.

Ustaw go tak, aby obsługiwał co najmniej:

- `str.`
- `str`
- `strona`
- `page`
- `pages`
- `p.`
- `pp.`
- `s.`
- `seite`

Użyj:

```js
const PAGE_REF_PATTERN = /\(([^)]*(?:\bstr\.?\b|\bstrona\b|\bpage\b|\bpages\b|\bp\.\b|\bpp\.\b|\bs\.\b|\bseite\b)[^)]*)\)/ig;
```

Następnie w `formatInlineHTML` używaj `PAGE_REF_PATTERN`, nie lokalnego regexa bez nazwy. W dokumentacji podaj tę nazwę jako miejsce rozszerzania formatów stron.

### 5.13. Ulubione — stabilne identyfikatory

Dodaj helper:

```js
const getRecordStableId = (record, index) =>
  normalizeText(getRecordValueByCanonical(record, "id")) || normalizeText(getRecordValueByCanonical(record, "name")) || String(index);
```

W `buildFavoritePayload()` dodaj pola:

```js
selectedBestiaryId: getRecordStableId(state.bestiary[selectedIndex], selectedIndex),
selectedBestiaryName: getRecordName(state.bestiary[selectedIndex], selectedIndex),
```

Zachowaj `selectedBestiaryIndex` jako fallback, ale nie traktuj go jako jedynego źródła prawdy.

W `applyFavorite(favorite)` wybieraj rekord w kolejności:

1. po `selectedBestiaryId`, przez `getRecordStableId(record, index)`;
2. po `selectedBestiaryName` albo `bestiaryName`;
3. dopiero potem po `selectedBestiaryIndex`.

Jeżeli ulubiony wskazuje na rekord `old`, automatycznie ustaw:

```js
state.showOldBestiaryRecords = true;
bestiaryShowOldToggle.checked = true;
refreshBestiaryOptions();
```

---

## 6. Dokumentacja

### 6.1. `DataVault/docs/README.md` i `DataVault/docs/Documentation.md`

Zachowaj układ EN first, PL second.

Dodaj angielską sekcję:

```markdown
## Release Default View

In `WnG_Tools`, Default View is intentionally identical to Full View.

It does not apply automatic filters and does not hide categories by default. This prevents language-specific sheet or column names from breaking the initial view when DataVault uses English data files.

To restore automatic default filters, edit `DEFAULT_VIEW_CONFIG` in `DataVault/app.js`. Use canonical sheet and column keys, not raw localized labels. Update `SHEET_ALIASES`, `COLUMN_ALIASES` and this documentation at the same time.
```

Dodaj polską sekcję:

```markdown
## Widok Domyślny w release

W `WnG_Tools` Widok Domyślny jest celowo tożsamy z Pełnym Widokiem.

Nie zakłada automatycznych filtrów i nie ukrywa kategorii domyślnie. Zapobiega to sytuacji, w której nazwy arkuszy lub kolumn zależne od języka psują widok początkowy.

Aby przywrócić automatyczne filtry domyślne, edytuj `DEFAULT_VIEW_CONFIG` w `DataVault/app.js`. Używaj kanonicznych kluczy arkuszy i kolumn, a nie surowych etykiet językowych. Zaktualizuj jednocześnie `SHEET_ALIASES`, `COLUMN_ALIASES` i dokumentację.
```

Dodaj angielską sekcję:

```markdown
## Sheet and column aliases

The UI language and the XLSX/JSON data language are separate.

Changing the UI language does not automatically change the expected names of sheets and columns. The release data format is English by default, but the code also supports Polish aliases for compatibility.

If you want to translate the XLSX/JSON data structure itself, for example to French or German, update these places in code:

- `DataVault/app.js` → `SHEET_ALIASES`
- `DataVault/app.js` → `COLUMN_ALIASES`
- `NPCGenerator/index.html` → `REQUIRED_NPCGENERATOR_SHEETS`
- `NPCGenerator/index.html` → `COLUMN_ALIASES`
- `NPCGenerator/index.html` → `PAGE_REF_PATTERN`

Do not rename `Equipment` to `Vehicle Wargear`. These are separate sheets. `Equipment` is used by NPCGenerator. `Vehicle Wargear` belongs to the vehicle tab group controlled by `Show tabs related to vehicles?`.
```

Dodaj polską sekcję z tą samą treścią po polsku:

```markdown
## Aliasy arkuszy i kolumn

Język UI i język danych XLSX/JSON są od siebie niezależne.

Zmiana języka UI nie zmienia automatycznie oczekiwanych nazw arkuszy i kolumn. Domyślnym formatem danych release jest angielski, ale kod obsługuje też polskie aliasy kompatybilności.

Jeżeli chcesz przetłumaczyć samą strukturę XLSX/JSON, np. na francuski albo niemiecki, zaktualizuj w kodzie:

- `DataVault/app.js` → `SHEET_ALIASES`
- `DataVault/app.js` → `COLUMN_ALIASES`
- `NPCGenerator/index.html` → `REQUIRED_NPCGENERATOR_SHEETS`
- `NPCGenerator/index.html` → `COLUMN_ALIASES`
- `NPCGenerator/index.html` → `PAGE_REF_PATTERN`

Nie zmieniaj `Equipment` na `Vehicle Wargear`. To osobne arkusze. `Equipment` jest używany przez NPCGenerator. `Vehicle Wargear` należy do grupy zakładek pojazdów sterowanej checkboxem `Show tabs related to vehicles?`.
```

### 6.2. `NPCGenerator/docs/README.md` i `NPCGenerator/docs/Documentation.md`

Dodaj angielską sekcję:

```markdown
## Required DataVault sheets

`NPCGenerator` loads required DataVault sheets by logical aliases, not by fuzzy keyword search.

Required logical sheets:

- `bestiary`: `Bestiary` / `Bestiariusz`
- `armor`: `Armor` / `Armour` / `Pancerze`
- `weapons`: `Weapons` / `Bronie`
- `augmentations`: `Augmentations` / `Augumentacje`
- `equipment`: `Equipment` / `Ekwipunek`
- `talents`: `Talents` / `Talenty`
- `psionics`: `Psionics` / `Psionika`
- `prayers`: `Prayers` / `Modlitwy`

`Equipment` is normal personal/NPC equipment and is used by NPCGenerator. `Vehicle Wargear` is not loaded by NPCGenerator.
```

Dodaj angielską sekcję:

```markdown
## Page references and localized data

`NPCGenerator` can highlight page references in text. The supported page-reference pattern is configured in `NPCGenerator/index.html` as `PAGE_REF_PATTERN`.

Default supported forms include `page`, `pages`, `p.`, `pp.`, `str.`, `strona`, `S.` and `Seite`.

If your data file uses another language or another page abbreviation, update `PAGE_REF_PATTERN` and the source/page column aliases in `COLUMN_ALIASES`.
```

Dodaj polskie odpowiedniki tych sekcji po angielskich sekcjach.

---

## 7. `DataVault/SampleFiles/data.json`

Zaktualizuj sample data tak, aby zawierało minimalne angielskie arkusze wymagane przez `NPCGenerator`:

- `Bestiary`
- `Armor`
- `Weapons`
- `Augmentations`
- `Equipment`
- `Talents`
- `Psionics`
- `Prayers`

Jeżeli któryś z tych arkuszy nie istnieje, dodaj go z co najmniej jednym placeholderowym rekordem.

Dodaj także minimalne arkusze pojazdów:

- `Vehicle Roles`
- `Vehicle Actions`
- `Vehicle Conditions`
- `Vehicle Traits`
- `Vehicles`
- `Vehicle Weapons`
- `Vehicle Wargear`

Nie nazywaj arkusza pojazdowego `Equipment`. Użyj dokładnie `Vehicle Wargear`.

W `_meta` upewnij się, że istnieją:

```json
"traits": {},
"states": {},
"vehicleTraits": {},
"vehicleWeaponTraits": {},
"vehicleStates": {}
```

Jeżeli `firebase-import.json` jest wygenerowanym wrapperem tego samego sample data, zaktualizuj jego `dataJson`, aby odpowiadał nowemu `data.json`.

---

## 8. Testy manualne po wdrożeniu

Po zmianach wykonaj ręcznie lub przez prosty lokalny test przeglądarkowy:

1. `DataVault/index.html` startuje z `html lang="en"`.
2. Przełącznik języka jest widoczny.
3. Przełączenie EN → PL → EN działa.
4. `Default View` pokazuje to samo co `Full View`.
5. `DEFAULT_VIEW_CONFIG` jest pusty.
6. Checkbox `Show outdated entries?` jest widoczny tylko w trybie admina.
7. `State = old` i `Stan = old` są ukryte, gdy checkbox jest wyłączony.
8. Ukryte `old` nie pojawiają się w menu filtrów.
9. Checkbox `Show tabs related to vehicles?` pokazuje i ukrywa tylko arkusze pojazdów.
10. `Equipment` nie jest ukrywane przez checkbox pojazdów.
11. `Vehicle Wargear` jest ukrywane/pokazywane przez checkbox pojazdów.
12. `NPCGenerator` ładuje angielskie arkusze z sample data.
13. `NPCGenerator` nadal obsługuje polskie aliasy arkuszy.
14. `NPCGenerator` ładuje `Equipment`, ale nie ładuje `Vehicle Wargear` jako zwykłego ekwipunku.
15. `NPCGenerator` rozpoznaje `State` i `Stan` jako status rekordu.
16. Checkbox `Show outdated entries?` w `NPCGenerator` ukrywa/pokazuje stare wpisy bez usuwania ich z danych.
17. Karta NPC generuje się na danych z angielskimi kolumnami.
18. Odwołania do stron typu `(page 123)`, `(p. 123)`, `(str. 123)`, `(S. 123)` są wyróżniane.
19. Ulubione zapisują stabilny identyfikator rekordu, a indeks jest tylko fallbackiem.
20. Brak wymaganego arkusza daje czytelny komunikat błędu z aliasami.

---

## 9. Zakaz zmian nieobjętych zadaniem

Nie zmieniaj:

- nazwy repozytorium;
- nazwy folderu `NPCGenerator`;
- mechanizmu `shared/firebase-data-loader.js`, chyba że jest to absolutnie konieczne do naprawy importu;
- prywatnych konfiguracji Firebase;
- ikon, grafik i assetów;
- routingu strony głównej, poza ewentualnym zachowaniem istniejących linków.

Nie dodawaj prawdziwych danych produkcyjnych do `SampleFiles`.

---

## 10. Oczekiwany wynik PR / commita

Po zakończeniu zmian przygotuj krótkie podsumowanie:

- co zmieniono w `DataVault`;
- co zmieniono w `NPCGenerator`;
- co zmieniono w dokumentacji;
- co zmieniono w sample files;
- jakie testy wykonano;
- czy zostały jakieś świadome ograniczenia.
