# Technical documentation — DataVault

DataVault is the browser-based data repository used by `WnG_Tools`. It loads private release data from Firebase Realtime Database, renders searchable/filterable tables, supports admin-side data generation from `Repository_EN.xlsx`, and exposes formatted records to related modules such as `NPCGenerator`.

This document is English-only and describes the current release architecture.

---

## 1. Module purpose

DataVault provides a table browser for Wrath & Glory reference data.

It is responsible for:

- loading private DataVault data after authentication,
- rendering workbook sheets as tabs and tables,
- supporting global search and per-column filters,
- preserving sheet and column order from generated metadata,
- rendering special text formatting from generated markers,
- rendering trait tags and state/trait tooltips,
- hiding/showing sheet groups such as character creation, combat, vehicles, and outdated bestiary entries,
- generating `data.json` and root-ready `firebase-import.json` in admin mode,
- providing a stable data source for `NPCGenerator` through the shared Firebase runtime.

---

## 2. Entry points

| File / URL | Role |
| --- | --- |
| `DataVault/index.html` | Standard user entry point. |
| `DataVault/index.html?admin=1` | Admin entry point with data generation controls. |
| `DataVault/app.js` | Main UI, rendering, filtering, table state, Firebase loading, and admin logic. |
| `DataVault/release-admin-overrides.js` | Official release override for EN-first XLSX/JSON generation and runtime trait tooltip compatibility. |
| `DataVault/column-layout.css` | English DataVault column layout rules mapped to current EN sheet/column names. |
| `DataVault/xlsxCanonicalParser.js` | Browser-side XLSX parser used by the admin generation flow. |
| `DataVault/build_json.py` | Python reference generator for `data.json`. |
| `../shared/firebase-config.js` | Shared Firebase public Web SDK config and technical access email. |
| `../shared/firebase-data-loader.js` | Shared authentication and Realtime Database loader. |

---

## 3. Operating modes

### 3.1 User mode

User mode is opened through:

```text
DataVault/index.html
```

It is intended for browsing and searching the private data repository during play.

User mode hides admin-only maintenance controls.

### 3.2 Admin mode

Admin mode is opened through:

```text
DataVault/index.html?admin=1
```

Admin mode exposes the data-generation workflow. The administrator can choose a local `Repository_EN.xlsx` workbook and generate:

- `data.json`,
- `firebase-import.json`.

The generated `firebase-import.json` must be imported into Firebase Realtime Database from the database root (`/`).

### 3.3 DEMO mode

The DEMO release uses this access password:

```text
000000
```

This value is a DEMO password only. It must be documented for release testing, but it must not be treated as a production password.

---

## 4. File structure and responsibilities

| File | Responsibility |
| --- | --- |
| `DataVault/index.html` | Defines the access gate, header, controls, filters, tab container, table wrapper, popover, comparison modal, filter menu, and script/style includes. |
| `DataVault/style.css` | Main DataVault visual system: dark theme, layout, panels, tables, popovers, modal, tags, clamp state, and responsive behavior. |
| `DataVault/column-layout.css` | Release-specific table column sizing and wrapping rules for English sheet/column names. |
| `DataVault/app.js` | Main application logic: translations, state, Firebase sign-in, data loading, sheet rendering, filters, view modes, tag rendering, tooltips, comparison, admin generation status. |
| `DataVault/release-admin-overrides.js` | Official EN-first release override for generation and runtime compatibility. See section 13. |
| `DataVault/xlsxCanonicalParser.js` | Reads workbook internals and rich text so browser generation can preserve formatting markers. |
| `DataVault/build_json.py` | CLI/reference generation path. Converts `Repository_EN.xlsx` to `data.json`. |
| `DataVault/SampleFiles/Repository_EN.xlsx` | Current canonical release workbook sample. |
| `DataVault/SampleFiles/data.json` | Backup/helper generated JSON sample. |
| `DataVault/SampleFiles/firebase-import.json` | Root-ready Firebase Realtime Database import sample. |
| `DataVault/docs/README.md` | User guide. |
| `DataVault/docs/FormattingRules.md` | Formatting rules guide. |
| `DataVault/config/FirebaseREADME.md` | Firebase setup guide for this module. |

---

## 5. Runtime data flow

The release runtime does not primarily read `data.json` from the public folder. It loads private data from Firebase.

Runtime flow:

1. `index.html` loads shared Firebase config and shared data loader.
2. The access gate asks for the Access Litany password.
3. The shared loader signs in to Firebase Authentication.
4. The shared loader reads Realtime Database path:

```text
datavault/live
```

5. The loader expects the wrapper schema:

```text
datavault-firebase-import-v1
```

6. The wrapper stores the actual DataVault object as a JSON string in `dataJson`.
7. DataVault parses the data object and renders `sheets`.
8. DataVault uses `_meta` when available for sheet order, column order, traits, states, vehicle traits, vehicle weapon traits, and vehicle states.

Expected Firebase wrapper shape:

```json
{
  "schemaVersion": "datavault-firebase-import-v1",
  "createdAt": "2026-...",
  "source": "Repository_EN.xlsx",
  "dataJson": "{...stringified DataVault JSON...}"
}
```

Expected parsed data shape:

```json
{
  "sheets": {
    "Bestiary": [],
    "Weapons": [],
    "Traits": []
  },
  "_meta": {
    "sheetOrder": [],
    "columnOrder": {},
    "traits": {},
    "states": {},
    "vehicleTraits": {},
    "vehicleWeaponTraits": {},
    "vehicleStates": {}
  }
}
```

---

## 6. Firebase dependencies

DataVault uses these Firebase services:

| Service | Purpose |
| --- | --- |
| Firebase Authentication | Access gate sign-in with the technical user email and password. |
| Realtime Database | Private DataVault payload at `/datavault/live`. |

Firebase setup instructions must be maintained in:

```text
DataVault/config/FirebaseREADME.md
```

The documentation must clearly distinguish two facts:

1. Realtime Database child nodes such as `datavault` and `live` are created when JSON is imported or written to that path.
2. The Firebase project, Web App, Authentication provider, Realtime Database instance, database URL, and rules must still be configured manually first.

---

## 7. Current sample data standard

The current required release workbook is:

```text
Repository_EN.xlsx
```

Sample files are located in:

```text
DataVault/SampleFiles
```

| File | Role |
| --- | --- |
| `Repository_EN.xlsx` | Canonical English release workbook structure. |
| `data.json` | Backup/helper generated data object. |
| `firebase-import.json` | Root-ready Realtime Database import file that places data under `/datavault/live`. |

`Repozytorium.xlsx` is a legacy Polish name. It may remain in old comments, old UI strings, or compatibility code, but it is not the current release file name.

---

## 8. Current workbook sheets

The current English release sample uses these sheet names:

```text
Notes
Bestiary
Special Enemy Bonuses
Mobs
Size Table
Species
Archetypes
Ascension Packages
Faction Backgrounds
Faction Keywords
Special Faction Bonuses
Astartes Implants
First Founding Chapters
Traits
Conditions
Keywords
Talents
Prayers
Psychic Powers
Augmentics
Equipment
Armour
Weapons
Critical Hits
Warp Perils
Quick Reference Guide
Fire Modes
DN Penalties
Vehicle Roles
Vehicle Actions
Vehicle Conditions
Vehicle Traits
Vehicles
Vehicle Weapons
Vehicle Wargear
Vehicle Damage
Vehicle Explosions
```

These names are not only labels. They are used by code paths that map sheet behavior, tab groups, tooltip metadata, and release generation.

---

## 9. Important column names

Common canonical English columns include:

```text
ID
State
Type
Kind
Name
Description
Effect
Example
Keywords
Traits
Range
Damage
ED
AP
Salvo
Book
Page
Cost
Availability
Cost (IM)
```

Important Bestiary columns include:

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

Important weapon and vehicle weapon columns include:

```text
ID
Kind
Type
Name
Damage
ED
AP
Range 1
Range 2
Range 3
Salvo
Trait 1
Trait 2
Trait 3
Trait 4
Trait 5
Trait 6
Trait 7
Cost
Availability
Keywords
Cost (IM)
Book
Page
```

The generated release data may merge numbered columns into canonical fields:

| Numbered source columns | Generated field |
| --- | --- |
| `Range 1`, `Range 2`, `Range 3` | `Range` |
| `Trait 1`, `Trait 2`, ..., `Trait N` | `Traits` |

---

## 10. Language and data-name dependencies

DataVault is English-first in the release format.

Several mechanisms depend on sheet and column names:

| Mechanism | Dependency |
| --- | --- |
| Sheet tab grouping | Canonical sheet keys from `SHEET_ALIASES`. |
| Character creation tabs | `CHARACTER_CREATION_SHEET_KEYS`. |
| Combat rules tabs | `COMBAT_RULES_SHEET_KEYS`. |
| Vehicle tabs | `VEHICLE_SHEET_KEYS`. |
| Outdated Bestiary rows | `State` / legacy `Stan` and value `old`. |
| Hidden columns | `ID`, `LP`, `Lp`, `State`, `Stan`. |
| Keyword rendering | Sheet key and `Keywords` column. |
| Trait tag rendering | `Traits` / legacy `Cechy` column. |
| Tooltip lookup | `_meta.traits`, `_meta.states`, `_meta.vehicleTraits`, `_meta.vehicleWeaponTraits`, `_meta.vehicleStates`, and generated indexes. |
| Column layout | CSS selectors using `[data-sheet="..."]` and `[data-col="..."]`. |
| Full View / Default View | Stored view state, filters, and any future default filter config tied to sheet/column names. |
| NPCGenerator | Shared runtime data and canonical alias maps. |

Changing sheet names or column names requires coordinated updates. A UI translation alone is not enough.

---

## 11. Alias maps that must be maintained

Alias-aware logic exists in multiple files.

### 11.1 `DataVault/app.js`

Important structures:

```text
SHEET_ALIASES
COLUMN_ALIASES
CHARACTER_CREATION_SHEET_KEYS
COMBAT_RULES_SHEET_KEYS
VEHICLE_SHEET_KEYS
KEYWORD_SHEET_KEYS_COMMA_NEUTRAL
```

These structures let the runtime recognize English release names and selected legacy Polish names.

### 11.2 `DataVault/release-admin-overrides.js`

Important structures:

```text
SHEET_ALIASES
COLUMN_ALIASES
RANGE_NUMBERED_RE
TRAIT_NUMBERED_RE
TRAIT_PARAMETER_RE
```

This file handles admin generation and runtime tooltip compatibility.

### 11.3 `DataVault/build_json.py`

Important structures:

```text
SHEET_ALIASES
COLUMN_ALIASES
RANGE_NUMBERED_RE
TRAIT_NUMBERED_RE
```

This is the Python/reference generation path.

### 11.4 `shared/firebase-data-loader.js`

Important structures:

```text
RECORD_ALIAS_GROUPS
normalizeReleaseData()
```

This affects how shared private data is normalized for dependent modules such as `NPCGenerator`.

### 11.5 `NPCGenerator/index.html`

NPCGenerator extracts data from the same runtime payload. Any sheet/column rename can affect its collection builders, selectors, old-entry filtering, table rendering, and generated cards.

---

## 12. What to update when sheet or column names change

When changing a worksheet name or column name, update all relevant items in this order:

1. `DataVault/SampleFiles/Repository_EN.xlsx`.
2. `DataVault/app.js`:
   - `SHEET_ALIASES`,
   - `COLUMN_ALIASES`,
   - sheet group sets,
   - hidden column logic,
   - keyword rules,
   - trait/state tooltip detection,
   - default view config if it is re-enabled.
3. `DataVault/release-admin-overrides.js`:
   - sheet aliases,
   - column aliases,
   - numbered range/trait regexes,
   - metadata collection logic.
4. `DataVault/build_json.py`:
   - same aliases and merge regexes as the browser release override.
5. `DataVault/column-layout.css`:
   - every `[data-sheet="..."]` selector,
   - every `[data-col="..."]` selector,
   - global column rules such as `Book`, `Page`, `Name`, `Type`, `Description`, `Keywords`, `Traits`, `Range`.
6. `DataVault/docs/FormattingRules.md`.
7. `DataVault/docs/Documentation.md`.
8. `DataVault/docs/README.md`.
9. `shared/firebase-data-loader.js` alias groups if dependent modules consume the renamed fields.
10. `NPCGenerator/index.html` data extraction and table rendering.
11. Regenerate `data.json` and `firebase-import.json`.
12. Import the new `firebase-import.json` into Firebase Realtime Database from root (`/`).
13. Run the control tests listed in this document.

---

## 13. Official release override: `release-admin-overrides.js`

`DataVault/release-admin-overrides.js` is the official release override for the current EN-first release flow.

### 13.1 Why it exists

The original application was created with Polish data names and Polish workbook assumptions. The public release uses English workbook sheet and column names. The override bridges that difference without turning `app.js` into a release-only migration file.

It keeps release-specific data-language policy in one dedicated place.

### 13.2 What it does

The file currently:

- installs release-specific admin generation behavior,
- treats English sheet/column names as canonical,
- keeps Polish names as legacy fallback aliases,
- normalizes sheet identity through `SHEET_ALIASES`,
- normalizes column identity through `COLUMN_ALIASES`,
- merges `Range 1..3` into `Range` for weapons and vehicle weapons,
- merges `Trait 1..N` into `Traits` for armor, weapons, vehicles, and vehicle weapons,
- strips private/internal `__` fields where needed,
- builds extended metadata:
  - `traits`,
  - `states`,
  - `vehicleTraits`,
  - `vehicleWeaponTraits`,
  - `vehicleStates`,
- folds vehicle trait dictionaries into `traitIndex`,
- builds `stateIndex`, `vehicleTraitIndex`, `vehicleWeaponTraitIndex`, and `vehicleStateIndex`,
- maps parameterized trait references such as `Mounted (Large)` / `Mounted (Duży)` to a template such as `Mounted (X)` when available,
- patches runtime trait rendering so a `Traits` column is treated like legacy `Cechy`,
- makes trait values clickable tags,
- sends clicked trait tags to the existing trait popover mechanism,
- generates `data.json`,
- generates root-ready `firebase-import.json`,
- wraps Firebase import under:

```json
{
  "datavault": {
    "live": {
      "schemaVersion": "datavault-firebase-import-v1",
      "createdAt": "...",
      "source": "Repository_EN.xlsx",
      "dataJson": "..."
    }
  }
}
```

### 13.3 What it must not do

Do not use `release-admin-overrides.js` to:

- store private Firebase configuration,
- store passwords,
- translate UI labels,
- replace `FormattingRules.md`,
- hide incompatible workbook changes,
- bypass required updates in `app.js`, `build_json.py`, `shared/firebase-data-loader.js`, or `NPCGenerator`.

### 13.4 Maintenance warning

If a new data language is added, or if worksheet/column names change, update `release-admin-overrides.js` together with the main DataVault alias maps, the shared Firebase data loader aliases, NPCGenerator data extraction, `FormattingRules.md`, `column-layout.css`, and the sample workbook.

---

## 14. Python generator: `build_json.py`

`DataVault/build_json.py` is the reference CLI generator.

Current behavior:

- default input: `Repository_EN.xlsx`,
- default output: `data.json`,
- English sheet/column names are canonical,
- Polish sheet/column names remain legacy fallback aliases,
- rich text from XLSX is converted to inline markers,
- numbered `Range` and `Trait` columns are merged,
- `_meta.sheetOrder` and `_meta.columnOrder` are created from the workbook,
- tooltip metadata is generated for traits, states, vehicle traits, vehicle weapon traits, and vehicle states.

Default command:

```bash
python build_json.py
```

Explicit command:

```bash
python build_json.py Repository_EN.xlsx data.json
```

After generating `data.json`, the admin/browser generation path must still be used or matched to produce root-ready `firebase-import.json` for Firebase import.

---

## 15. Column layout: `column-layout.css`

`DataVault/column-layout.css` is a dedicated CSS layer for English DataVault table layouts.

It was copied from the Polish DataVault column-width rules and remapped to English sheet/column names.

It controls:

- first column width,
- common columns such as `Book`, `Page`, `Name`, `Type`, `Kind`, `Description`, `Keywords`, `XP Cost`, `Cost`, `Availability`, `Cost (IM)`,
- Bestiary stats and long text fields,
- Mobs descriptions and examples,
- Size Table examples,
- Species abilities,
- Archetype abilities and equipment,
- Ascension Package story/equipment columns,
- Faction and Talent/Prayer/Psychic Power text columns,
- Psychic Power `ST`, `Activation`, `Duration`, `Range`, `Multi Target`,
- Augmentics/Equipment/Critical Hits effect columns,
- Weapons and Armour `Range`, `Traits`, damage and armor columns,
- Quick Reference Guide and Fire Modes columns,
- DN Penalties fixed layout,
- Vehicle Roles, Vehicle Traits, Vehicles, Vehicle Weapons, and Vehicle Wargear columns.

This file depends directly on exact `data-sheet` and `data-col` values. When sheet or column names change, this file must be updated.

---

## 16. Table rendering and state

Main state structures:

| Structure | Purpose |
| --- | --- |
| `DB` | Normalized DataVault data object with `sheets` and `_meta`. |
| `currentSheet` | Currently selected sheet name. |
| `uiState` | Visibility toggles for character, combat, vehicle, and old bestiary entries. |
| `viewBySheet` | Stored per-sheet view state. |
| `view` | Active view state for current sheet. |
| `SESSION_VIEW_KEY` | Session storage key for view state. |

A sheet view state contains:

```text
sort
global
filtersText
filtersSet
selected
expandedCells
```

Session storage keeps sheet views, tab visibility toggles, and language. It does not persist the old-bestiary toggle.

---

## 17. Full View and Default View

### 17.1 Full View

`applyFullViewForSheet(sheetName)` resets the sheet view:

- `sort` becomes `null`,
- `global` becomes empty,
- `filtersText` becomes `{}`,
- `filtersSet` becomes `{}`,
- `selected` becomes `[]`,
- `expandedCells` becomes `[]`.

### 17.2 Default View

`applyDefaultViewForSheet(sheetName)` currently calls `applyFullViewForSheet(sheetName)`.

`DEFAULT_VIEW_CONFIG` is intentionally empty in the release:

```js
const DEFAULT_VIEW_CONFIG = {};
```

This means Default View is identical to Full View in the DEMO release.

### 17.3 Re-enabling real Default View filters

To make Default View apply a real filter preset later:

1. Use canonical sheet and column keys, not visible localized labels.
2. Fill `DEFAULT_VIEW_CONFIG` with current release sheet/column names.
3. Verify that `getDefaultConfigForSheet()` resolves the intended sheet.
4. Verify that column filters map to existing values in the current data.
5. Update this document and the user README.
6. Test after switching UI language.

---

## 18. Sheet visibility groups

DataVault has release sheet groups controlled by checkboxes.

| Group | Key set | UI control |
| --- | --- | --- |
| Character creation | `CHARACTER_CREATION_SHEET_KEYS` | `#toggleCharacterTabs` |
| Combat rules | `COMBAT_RULES_SHEET_KEYS` | `#toggleCombatTabs` |
| Vehicles | `VEHICLE_SHEET_KEYS` | `#toggleVehicleTabs` |
| Outdated Bestiary entries | Bestiary `State = old` | `#toggleOldBestiaryEntries` |

Admin-only sheets are controlled through `ADMIN_ONLY_SHEET_KEYS`.

`Vehicle Damage` and `Vehicle Explosions` are vehicle sheets that are admin-only: outside admin mode they are hidden completely, and in admin mode they appear only when the vehicle checkbox (`#toggleVehicleTabs`) is enabled. Their `ID` column is a technical ordering column: it remains available in the row data, is hidden in the rendered table like other ID columns, and is used by the default ascending sort.

Important outdated Bestiary behavior:

- `State` and legacy `Stan` are hidden columns,
- rows with `State = old` are hidden unless the toggle is enabled,
- filter menu values should be based on currently system-visible rows,
- old-entry visibility is not stored permanently.

---

## 19. Formatting pipeline

The formatting pipeline starts in the workbook and ends in rendered HTML.

Current marker model:

| Source formatting | Marker | Rendered behavior |
| --- | --- | --- |
| red text | `{{RED}}...{{/RED}}` | red-styled text |
| bold | `{{B}}...{{/B}}` | bold text |
| italic | `{{I}}...{{/I}}` | italic text |
| strikethrough | `{{S}}...{{/S}}` | struck text |

Page reference detection currently accepts multilingual variants such as:

```text
str
str.
strona
page
pages
p.
pp.
s.
seite
```

The detailed authoring rules belong in:

```text
DataVault/docs/FormattingRules.md
```

---

## 20. Trait and state tooltips

Tooltips depend on generated metadata.

Important metadata objects:

```text
_meta.traits
_meta.states
_meta.vehicleTraits
_meta.vehicleWeaponTraits
_meta.vehicleStates
_meta.traitIndex
_meta.stateIndex
_meta.vehicleTraitIndex
_meta.vehicleWeaponTraitIndex
_meta.vehicleStateIndex
```

Current lookup behavior:

- regular trait descriptions come from the `Traits` sheet,
- state descriptions come from `Conditions` / `States`,
- vehicle condition descriptions come from `Vehicle Conditions` / `Vehicle States`,
- vehicle trait descriptions come from `Vehicle Traits`,
- vehicle weapon trait descriptions are derived from `Vehicle Traits` rows whose type marks a weapon trait,
- vehicle trait dictionaries are folded into `traitIndex` so existing tooltip code can find demo entries such as `Shield` and `Mounted`,
- parameterized references such as `Mounted (Large)` can resolve through `Mounted (X)` if the template exists.

If a trait tag is visible but the tooltip is missing, check:

1. The value in the rendered `Traits` column.
2. The exact trait name in `Traits` or `Vehicle Traits`.
3. Whether the generated metadata contains the expected description.
4. Whether `data.json` and `firebase-import.json` were regenerated after workbook changes.
5. Whether the latest `firebase-import.json` was imported into Firebase.

---

## 21. Admin data generation workflow

Admin generation path:

1. Open `DataVault/index.html?admin=1`.
2. Sign in through the access gate.
3. Click **Generate data files**.
4. Select `Repository_EN.xlsx`.
5. The browser parser reads workbook sheets and styles.
6. `release-admin-overrides.js` normalizes release data and builds metadata.
7. The browser downloads:
   - `data.json`,
   - `firebase-import.json`.
8. Import `firebase-import.json` into Realtime Database from root (`/`).
9. Reload DataVault and confirm data loads from Firebase.

The generated Firebase import file must place payload under:

```text
/datavault/live
```

Do not import it while already inside `/datavault/live`.

---

## 22. Required documentation links

Every DataVault documentation set must include:

| File | Status / purpose |
| --- | --- |
| `DataVault/docs/README.md` | User guide. |
| `DataVault/docs/Documentation.md` | This technical guide. |
| `DataVault/docs/FormattingRules.md` | Formatting and marker rules. |
| `DataVault/config/FirebaseREADME.md` | Firebase setup guide. |
| `docs-standard.md` | Repository documentation standard. |

---

## 23. Adding a new language version

Adding a UI language requires more than translating labels.

Update all of these areas:

1. `translations` in `DataVault/app.js`.
2. `<select id="languageSelect">` options in `DataVault/index.html`.
3. Static text in HTML not controlled by `data-i18n`.
4. Error/status messages.
5. Empty states.
6. Tooltip labels.
7. Page-reference patterns if the new language uses different abbreviations.
8. `SHEET_ALIASES` in `DataVault/app.js`.
9. `COLUMN_ALIASES` in `DataVault/app.js`.
10. `SHEET_ALIASES` in `DataVault/release-admin-overrides.js`.
11. `COLUMN_ALIASES` in `DataVault/release-admin-overrides.js`.
12. `SHEET_ALIASES` and `COLUMN_ALIASES` in `DataVault/build_json.py`.
13. `DataVault/column-layout.css` selectors.
14. `shared/firebase-data-loader.js` alias groups.
15. `NPCGenerator` data extraction and UI labels if it consumes the same data.
16. `Repository_EN.xlsx` or the new sample workbook.
17. `data.json` and `firebase-import.json` generation.
18. User and technical documentation.

---

## 24. Control tests

Run these tests after documentation-related or data-language-related changes.

| Test | Steps | Expected result |
| --- | --- | --- |
| DEMO sign-in | Open DataVault and enter `000000`. | Access gate closes and private data loading starts. |
| Firebase load | Load the module after importing `firebase-import.json`. | Status reports private data loaded. |
| Sheet order | Open several tabs. | Sheet order follows `_meta.sheetOrder` where available. |
| Column order | Open Bestiary, Weapons, Vehicle Weapons. | Columns follow `_meta.columnOrder` where available. |
| Full View | Apply search/filter/sort, then click Full View. | Search/filter/sort/selection/expanded cells reset. |
| Default View | Click Default View. | In DEMO it behaves like Full View. |
| Old Bestiary toggle | Toggle outdated entries. | Rows with `State = old` appear/disappear as expected. |
| Vehicle tabs | Toggle vehicle tabs. | Vehicle-related sheets appear/disappear. |
| Character tabs | Toggle character creation tabs. | Character-creation sheets appear/disappear. |
| Combat tabs | Toggle combat rules tabs. | Combat sheets appear/disappear. |
| Column layout | Open Bestiary, Weapons, Psychic Powers, Vehicles, Vehicle Weapons. | Column widths and wrapping match `column-layout.css`. |
| Trait tooltip | Click a standard trait tag such as `Parry`. | Tooltip shows the trait description if metadata exists. |
| Vehicle trait tooltip | Click a vehicle/vehicle weapon trait such as `Shield` or `Mounted`. | Tooltip resolves through vehicle trait metadata or `traitIndex`. |
| Parameterized trait | Click a trait such as `Mounted (Large)` if present. | Tooltip resolves through `Mounted (X)` if the template exists. |
| Regenerated import | Generate files from `Repository_EN.xlsx` and import root-ready JSON. | `/datavault/live` contains the updated wrapper. |
| NPCGenerator dependency | Open NPCGenerator after DataVault import. | NPCGenerator loads source collections from the same runtime. |

---

## 25. Known release notes

- The release is English-first, but selected legacy Polish aliases remain for compatibility.
- Some older UI strings or comments may still mention `Repozytorium.xlsx`; the current release workbook name is `Repository_EN.xlsx`.
- Default View is intentionally identical to Full View in the DEMO release.
- `column-layout.css` is tied to English `data-sheet` and `data-col` names.
- Tooltip metadata depends on regenerated JSON. Changing workbook data without regenerating/importing JSON can leave tooltips stale.

---

## 26. Rebuild procedure

To rebuild DataVault release data from the sample workbook:

1. Prepare `Repository_EN.xlsx` using the current sheet and column structure.
2. Open DataVault in admin mode.
3. Unlock the DEMO gate with `000000` or the configured private password.
4. Generate `data.json` and `firebase-import.json`.
5. Keep `data.json` as a backup/helper artifact.
6. Import `firebase-import.json` into Firebase Realtime Database from root (`/`).
7. Reload DataVault.
8. Run the control tests.
9. Open NPCGenerator and confirm it still loads data.

For CLI comparison, run:

```bash
cd DataVault
python build_json.py Repository_EN.xlsx data.json
```

Compare the generated structure and metadata with the browser-generated result.
