# Technical documentation — NPCGenerator

NPCGenerator builds printable NPC/enemy cards from the private DataVault runtime. It is a browser-only module that loads source data through the shared Firebase data loader, lets users compose an NPC from selected records, optionally stores Favorites in Firestore, and generates a card in a new browser tab.

This document is English-only and describes the current release architecture.

---

## 1. Module purpose

NPCGenerator is responsible for:

- loading private source data from the shared DataVault runtime,
- building internal collections for Bestiary, Armor, Weapons, Augmentations, Equipment, Talents, Psionics, and Prayers,
- allowing users to select and edit a base Bestiary record,
- allowing users to add optional module sections,
- supporting outdated Bestiary entries through a toggle,
- rendering preview tables,
- rendering trait tags and optional trait descriptions,
- saving/loading Favorites through Firestore when configured,
- falling back to local storage when Firestore is unavailable,
- generating a printable NPC card in a new browser tab.

---

## 2. Entry points and files

| File | Role |
| --- | --- |
| `NPCGenerator/index.html` | Main HTML and JavaScript module. Contains the access gate, UI structure, translations, state, data loading, collection builders, Favorites logic, rendering, and card generation. |
| `NPCGenerator/style.css` | Module styling, layout, controls, tables, Favorites, old-entry styling, clamp behavior, and generated card styles. |
| `NPCGenerator/config/firebase-config.js` | Module Firebase config for Favorites when Firestore is used. |
| `NPCGenerator/docs/README.md` | User guide. |
| `NPCGenerator/docs/Documentation.md` | This technical guide. |
| `NPCGenerator/config/FirebaseREADME.md` | Firebase setup guide for NPCGenerator. |
| `../shared/firebase-config.js` | Shared private DataVault Firebase config. |
| `../shared/firebase-data-loader.js` | Shared access gate, Authentication, and Realtime Database loader for DataVault runtime. |
| `../shared/access-gate.css` | Shared access gate styles plus NPCGenerator layout overflow fix. |

---

## 3. Data source architecture

NPCGenerator does not use a public local `DataVault/data.json` file as its primary runtime source.

Current runtime flow:

1. `NPCGenerator/index.html` loads `../shared/firebase-config.js`.
2. It loads `../shared/firebase-data-loader.js`.
3. The shared loader initializes the named private-data Firebase app.
4. The K.O.Z.A. access gate signs in through Firebase Authentication.
5. The shared loader reads Realtime Database path:

```text
datavault/live
```

6. If the object is a `datavault-firebase-import-v1` wrapper, the loader parses `dataJson`.
7. NPCGenerator receives a data object containing `sheets`.
8. NPCGenerator builds internal collections from the required sheets.

The DEMO access password is:

```text
000000
```

This is a DEMO value only.

---

## 4. Required DataVault sheets

NPCGenerator loads sheets by logical aliases. The release format is English-first.

| Internal collection | Current release sheet names / aliases |
| --- | --- |
| `state.bestiary` | `Bestiary` / legacy `Bestiariusz` |
| `state.armor` | `Armor` / `Armour` / legacy `Pancerze` |
| `state.weapons` | `Weapons` / legacy `Bronie` |
| `state.augmentations` | `Augmentations` / `Augmentics` / legacy `Augumentacje` |
| `state.equipment` | `Equipment` / legacy `Ekwipunek` |
| `state.talents` | `Talents` / legacy `Talenty` |
| `state.psionics` | `Psionics` / `Psychic Powers` / legacy `Psionika` |
| `state.prayers` | `Prayers` / legacy `Modlitwy` |

`Equipment` means normal personal/NPC equipment. `Vehicle Wargear` is not used as the normal NPC equipment collection.

---

## 5. Required column aliases

NPCGenerator field access depends on canonical column aliases from the shared runtime and module code.

Important logical fields:

```text
id
state
type
kind
name
threat
keywords
skills
bonuses
abilities
attacks
armorValue
traits
range
damage
dn
ap
rateOfFire
source
page
effect
requirements
activation
duration
targets
boost
```

Current English release columns include:

```text
ID
State
Type
Kind
Name
Threat
Keywords
Skills
Bonuses
Abilities
Attacks
Armour Rating
Traits
Range
Damage
ED
AP
Salvo
Book
Page
Effect
Requirements
Activation
Duration
Multi Target
Boost
```

Changing column names requires updates in DataVault and NPCGenerator. See section 18.

---

## 6. Main UI structure

### 6.1 Access gate

The access gate is shared with DataVault and uses K.O.Z.A. wording.

Important elements:

```text
#accessGate
#accessForm
#accessPassword
#accessError
```

The shared loader provides readable access errors.

### 6.2 Top bar

Important elements:

```text
#languageSelect
#reset-page
#generate-card
```

### 6.3 Sidebar

Sidebar panels:

| Panel | Important elements |
| --- | --- |
| Data source | `#data-status` |
| Base selection | `#bestiary`, `#bestiary-show-old`, `#bestiary-notes` |
| Active modules | `[data-module-toggle]` checkboxes |
| Favorites | `#favorites-status`, `#favorites-alias`, `#favorites-add`, `#favorites-refresh`, `#favorites-list` |

### 6.4 Workspace

Workspace tables:

```text
#bestiary-table-body
#weapon-table-body
#armor-table-body
#augmentations-table-body
#equipment-table-body
#talents-table-body
#psionics-table-body
#prayers-table-body
```

Each module section has a selector and preview table.

---

## 7. Application state

The main state object stores:

```text
bestiary
armor
weapons
augmentations
equipment
talents
psionics
prayers
selectedBestiaryIndex
showOldBestiaryRecords
bestiaryOverrides
expandedCells
favorites
```

Important state behavior:

- `showOldBestiaryRecords` controls whether `State = old` records are visible.
- `selectedBestiaryIndex` points to the original index in `state.bestiary`.
- `bestiaryOverrides` stores edited base values.
- `expandedCells` stores clamp expansion state.
- Favorites may be Firestore-backed or local-only.

---

## 8. Outdated Bestiary entries

Outdated entries are Bestiary records where:

```text
State = old
```

Legacy compatibility may also recognize old Polish `Stan` through canonical field access.

Important functions/mechanisms:

| Mechanism | Role |
| --- | --- |
| `isOldBestiaryRecord(record)` | Checks whether the record is outdated. |
| `getVisibleBestiaryRecords()` | Returns all Bestiary records or hides old ones depending on the toggle. |
| `shouldGrayBestiaryKey(key, record)` | Applies old-entry styling to selected key/value rows. |
| `updateBestiarySelectOldClass(record)` | Adds/removes old-entry styling on the Bestiary selector. |
| `updateBestiaryOldVisibility()` | Refreshes visible options when the toggle changes. |
| Reset handler | Turns old-entry visibility off and clears old-entry styling. |

Old-entry styling is defined in `NPCGenerator/style.css`, including:

```text
.bestiary-option-old
.bestiary-select-old
.bestiary-show-old-toggle
#bestiary-show-old
```

---

## 9. Rendering empty table messages

Empty preview messages are stored in the translation dictionary.

English message keys include:

```text
emptyBestiary
emptyWeapon
emptyArmor
emptyAugmentations
emptyEquipment
emptyTalents
emptyPsionics
emptyPrayers
```

Rendering functions use `translations[currentLanguage].messages.*`, not hardcoded Polish strings.

Examples:

```text
Select a bestiary record.
Select a weapon to view its parameters.
Select armor to view its parameters.
Select a psionic power to view its parameters.
```

If a new module table is added, add its empty-state text to every supported language.

---

## 10. Base preview editing

The Bestiary preview renders key/value rows.

Editable behavior:

| Field type | Mechanism |
| --- | --- |
| Numeric values | Render as numeric inputs where supported. |
| Skills | Editable text row with Edit/Save. |
| Keywords | Editable text row with Edit/Save. |
| Blocked armor/mental values | Render as non-editable when the selected record blocks editing. |
| Long text values | Render through clamp cells. |

The generated card uses the current override values when present.

---

## 11. Clamp behavior

Long table cells may become expandable clamp cells.

Important behavior:

- clamp state is stored in `state.expandedCells`,
- collapsed cells use localized hint text `clampExpand`,
- expanded cells use localized hint text `clampCollapse`,
- clicking a clampable cell toggles the state,
- the cell `title` matches the current hint.

The current English hints are:

```text
Click to expand
Click to collapse
```

---

## 12. Module preview tables

Current column definitions:

```text
weaponColumns = [name, damage, dn, ap, range, rateOfFire, traits, keywords, source, page]
armorColumns = [name, armorValue, traits, keywords, source, page]
augmentationsColumns = [name, effect]
equipmentColumns = [name, effect]
talentsColumns = [name, effect]
psionicsColumns = [name, dn, activation, duration, range, targets, effect, boost]
prayersColumns = [name, effect]
```

Column labels come from `COLUMN_LABEL_KEYS` and the current language dictionary.

Changing a canonical column key requires updating:

- field accessors,
- table column arrays,
- `COLUMN_LABEL_KEYS`,
- translations,
- DataVault alias maps,
- shared Firebase data loader aliases.

---

## 13. Trait descriptions and popovers

Trait description behavior depends on DataVault metadata.

Important metadata objects from DataVault:

```text
_meta.traits
_meta.vehicleTraits
_meta.vehicleWeaponTraits
_meta.traitIndex
_meta.vehicleTraitIndex
_meta.vehicleWeaponTraitIndex
```

NPCGenerator can include trait descriptions for selected weapons/armor when the relevant checkbox is enabled.

If trait descriptions are missing:

1. Confirm the trait exists in DataVault `Traits` or `Vehicle Traits`.
2. Regenerate DataVault JSON from `Repository_EN.xlsx`.
3. Import the updated `firebase-import.json` into Firebase.
4. Reload NPCGenerator.

---

## 14. Favorites architecture

Favorites are separate from the main DataVault runtime.

Primary path when Firestore is configured:

```text
generatorNpc/favorites
```

Fallback path:

```text
localStorage key: generatorNpcFavorites
```

Behavior:

| State | Behavior |
| --- | --- |
| Firestore available | Favorites are loaded from and saved to Firestore. |
| Firestore unavailable | Module falls back to local storage. |
| Firestore rules block access | User sees a readable fallback/error status and local storage is used if possible. |

Firestore document creation can happen on the first successful write. The Firestore service itself must still be enabled first in Firebase Console.

---

## 15. Firebase dependencies

NPCGenerator uses Firebase in two ways:

| Firebase service | Purpose |
| --- | --- |
| Firebase Authentication | Shared DataVault access gate. |
| Realtime Database | Shared DataVault runtime data at `/datavault/live`. |
| Cloud Firestore | Optional shared Favorites storage. |

Firebase setup must be documented in:

```text
NPCGenerator/config/FirebaseREADME.md
```

Because source data comes from DataVault, DataVault setup also matters:

```text
DataVault/config/FirebaseREADME.md
```

---

## 16. Layout and overflow behavior

NPCGenerator uses a sidebar/workspace layout.

A release overflow fix exists in `shared/access-gate.css`:

```css
.layout:has(#bestiary) {
  grid-template-columns: 360px minmax(0, 1fr);
  width: 100%;
  max-width: 100%;
}
.layout:has(#bestiary) .workspace { min-width: 0; }
.layout:has(#bestiary) .card { min-width: 0; max-width: 100%; }
```

Purpose:

- the right grid column can shrink,
- wide module tables scroll locally inside cards,
- the full page should not be pushed sideways by wide tables.

Test this after table/header changes.

---

## 17. Generated card behavior

The generated card opens in a new browser tab.

Important behavior:

- base Bestiary data is combined with user overrides,
- selected modules add sections to the card,
- optional notes are included,
- Level columns 1-5 are always shown,
- Threat symbols fill columns from left to right,
- trait descriptions and full descriptions are included only when enabled,
- generated card language depends on the current UI language.

When adding new language support, test the generated card separately from the on-screen UI.

---

## 18. What to update when sheet or column names change

Changing DataVault sheet/column names can break NPCGenerator.

Update all relevant places:

1. `DataVault/SampleFiles/Repository_EN.xlsx`.
2. `DataVault/app.js` sheet and column alias maps.
3. `DataVault/release-admin-overrides.js` sheet and column alias maps.
4. `DataVault/build_json.py` sheet and column alias maps.
5. `shared/firebase-data-loader.js` alias groups.
6. `NPCGenerator/index.html` sheet resolution / collection builders.
7. `NPCGenerator/index.html` field accessors.
8. `NPCGenerator/index.html` table column arrays.
9. `NPCGenerator/index.html` generated card mapping.
10. `NPCGenerator/docs/README.md`.
11. `NPCGenerator/docs/Documentation.md`.
12. `NPCGenerator/config/FirebaseREADME.md` if Firebase data assumptions change.
13. Regenerate DataVault `data.json` and `firebase-import.json`.
14. Import the updated `firebase-import.json` into Firebase.
15. Run the control tests.

---

## 19. Adding a new language version

Adding a UI language requires more than adding labels.

Update:

- language selector options,
- `translations.labels`,
- `translations.messages`,
- `translations.card`,
- `translations.cardSections`,
- placeholder text,
- empty table messages,
- clamp hints,
- Favorites messages,
- generated card text,
- static HTML not covered by `data-i18n`,
- DataVault sheet/column aliases if the data language changes,
- shared loader alias groups,
- documentation.

Then test:

1. access gate,
2. data source status,
3. Base selection,
4. each module selector,
5. empty table messages,
6. Favorites,
7. generated card,
8. reset behavior.

---

## 20. Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| DEMO sign-in | Open NPCGenerator and enter `000000`. | Data source starts loading from private DataVault runtime. |
| Data load | Use a configured Firebase project with `/datavault/live`. | Required collections are populated. |
| Missing sheet | Remove or rename a required sheet in test data. | Module reports or behaves with a clear missing-data state. |
| Bestiary selection | Select a Bestiary record. | Base preview renders key/value rows. |
| Outdated toggle | Enable **Show outdated entries?**. | `State = old` records appear and are styled as old. |
| Reset old toggle | Enable old entries, select one, click Reset. | Old visibility is cleared and selector styling resets. |
| Empty messages | Open module tables with no selection. | Empty messages are in the selected UI language. |
| Weapon selection | Select one or more weapons. | Weapon table renders canonical fields. |
| Armor selection | Select armor when allowed. | Armor table renders canonical fields. |
| Trait descriptions | Enable trait descriptions for weapons/armor. | Trait descriptions appear when metadata exists. |
| Favorites Firestore | Configure Firestore and save a favorite. | Favorite persists after refresh. |
| Favorites fallback | Disable Firestore config and save a favorite. | Local storage fallback is used. |
| Horizontal overflow | Open on a narrow viewport with wide tables. | Workspace/card scroll locally instead of forcing page overflow. |
| Generated card | Generate a card. | New tab opens with selected data and correct language text. |

---

## 21. Rebuild checklist

When rebuilding or copying NPCGenerator:

1. Keep `NPCGenerator/index.html` and `NPCGenerator/style.css` together.
2. Keep `../shared/firebase-config.js` and `../shared/firebase-data-loader.js` available.
3. Configure DataVault Firebase runtime first.
4. Configure NPCGenerator Firestore Favorites if shared Favorites are needed.
5. Verify `Repository_EN.xlsx` data has been generated and imported into Firebase.
6. Open NPCGenerator and test data load.
7. Test every selector.
8. Test old Bestiary entries.
9. Test Favorites.
10. Generate a card.
11. Test on narrow viewport for overflow.
12. Run language switching if more than one UI language remains available.

---

## 22. Known release notes

- NPCGenerator is English-first in the public release.
- The module still carries legacy Polish aliases for compatibility with older DataVault data.
- Source data is owned by DataVault and loaded from `/datavault/live`.
- Firestore Favorites are separate from the DataVault runtime.
- The DEMO data password is `000000`.
- Changing sheet or column names requires coordinated updates across DataVault, the shared loader, and NPCGenerator.
