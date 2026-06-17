# User guide — DataVault

DataVault is a searchable Wrath & Glory data browser. It presents rules, references, bestiary records, equipment, weapons, armor, talents, psychic powers, vehicle data, and other repository sheets in one interface.

This is a user-facing guide. Technical implementation details belong in `DataVault/docs/Documentation.md`. Firebase setup details belong in `DataVault/config/FirebaseREADME.md`.

---

## How to open DataVault

Open one of these files or URLs:

| Mode | Entry point | Purpose |
| --- | --- | --- |
| Standard user mode | `DataVault/index.html` | Normal table browsing and searching. |
| Admin mode | `DataVault/index.html?admin=1` | Adds maintenance tools, including data file generation. |

The release version is English-first. The interface starts in English, and Polish may remain available in the language selector where the code still supports it.

---

## DEMO access password

The DEMO data password is:

```text
000000
```

This password is only for the DEMO release data gate. Do not use it as a production password. A real group should configure its own Firebase project, technical user, and private access password.

---

## What you see after opening DataVault

The screen contains these main areas:

| Area | What it does |
| --- | --- |
| Header | Shows the DataVault title, language selector, and navigation actions. |
| Access gate | Asks for the Access Litany before private data is loaded. |
| Tabs | Switch between sheets such as Bestiary, Weapons, Armour, Traits, Vehicle Traits, and other data groups. |
| Global search | Searches inside the current visible table. |
| Column filters | Narrow the current table by column values. |
| Data table | Shows records from the currently selected sheet. |
| Comparison area | Shows selected records side by side when comparison is used. |
| Admin controls | Available only in admin mode. Used for maintenance actions such as generating JSON files. |

The DataVault header icon uses a fixed icon slot so the page layout does not jump while assets load.

---

## Basic workflow

1. Open DataVault.
2. Enter the DEMO password `000000`, or the password configured for your own Firebase project.
3. Wait for the private data status message.
4. Select a tab.
5. Use global search to find a term across the current sheet.
6. Use column filters to narrow the results.
7. Select records when you want to compare them.
8. Use **Compare selected** to inspect selected records side by side.
9. Use **Full View** to clear the current table view.

---

## Buttons and actions

| Button / element | What it does |
| --- | --- |
| **Begin Rite** | Sends the Access Litany password to Firebase Authentication and unlocks data loading if sign-in succeeds. |
| **Main Page** | Returns to the application launcher. If the module is copied elsewhere, this link may need to be updated. |
| **Full View** | Clears the current search/filter/sort view and returns the table to the broadest available visible state. |
| **Default View** | Applies the release default view preset. In the DEMO release this is not a production default-filter system and may be identical to **Full View**. |
| **Compare selected** | Opens a side-by-side comparison of selected table rows. |
| **Generate data files** | Admin-only. Lets the administrator choose `Repository_EN.xlsx` and generates `data.json` plus `firebase-import.json`. |
| Language selector | Changes available UI labels between supported interface languages. It does not change the required workbook column names. |

---

## Full View and Default View

### Full View

**Full View** is the safe reset action for browsing. It is meant to remove the current search/filter/sort state and show the full available table content for the current system mode.

Use it when:

- filters hide records you expected to see,
- global search is still active,
- sorting or table state makes the current sheet confusing,
- you want to return to a broad browsing state.

### Default View

**Default View** is intended to restore a configured default preset for a sheet.

In this DEMO release, the default preset automation is not a production-ready filtering system. It depends on exact worksheet names, exact column names, and language/data aliases. Because the release data format is English-first, older presets created for another data-language structure may not work correctly. For that reason the DEMO Default View may be disabled, empty, or effectively the same as Full View.

When a group later wants a real Default View, the administrator/developer must configure it against the current English sheet and column names from `Repository_EN.xlsx`.

---

## Searching and filtering

Use global search for quick text lookup inside the selected sheet.

Use column filters when you want to narrow data by a specific column such as `Name`, `Type`, `Keywords`, `Book`, `Page`, `Traits`, or other sheet-specific fields.

Active filters are visually marked. If the table looks incomplete, clear filters or use **Full View**.

---

## Table display behavior

DataVault tables use release-specific column layout rules.

Important behavior:

- narrow numeric columns are centered where appropriate,
- long description/effect columns are given more horizontal space,
- page/source columns have compact layouts,
- wide tables can scroll horizontally,
- long text may be clamped and expanded in the table,
- some values such as page references and trait tags receive special formatting.

Detailed formatting rules belong in:

```text
DataVault/docs/FormattingRules.md
```

Technical column-width, wrapping, clamp, and tooltip dependencies belong in:

```text
DataVault/docs/Documentation.md
```

---

## User mode and admin mode

| Mode | Behavior |
| --- | --- |
| User mode | Normal browsing mode for table lookup during play. |
| Admin mode | Adds maintenance actions, especially data file generation from the sample workbook structure. |

The default opening tab may differ between user mode and admin mode.

---

## Data source

The release runtime data source is Firebase Realtime Database.

DataVault loads private data through the shared Firebase loader from:

```text
/datavault/live
```

The shared loader expects the DataVault Firebase wrapper at that path. The wrapper contains:

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Expected release schema marker, currently `datavault-firebase-import-v1`. |
| `createdAt` | Generation timestamp. |
| `source` | Source workbook name, currently `Repository_EN.xlsx`. |
| `dataJson` | Stringified JSON data object with `sheets` and metadata. |

The public `data.json` file is a backup/helper artifact. It is useful for inspection and recovery, but the release private runtime loads from Firebase.

---

## Sample files

Sample files are located in:

```text
DataVault/SampleFiles
```

| File | Purpose |
| --- | --- |
| `Repository_EN.xlsx` | Example workbook with the current English worksheet and column layout. Copy this structure when preparing your own data. |
| `data.json` | Backup/helper JSON generated from the workbook. Useful for inspection, comparison, and recovery. |
| `firebase-import.json` | Root-ready Firebase Realtime Database import file. Import it from the database root (`/`) to place the payload under `/datavault/live`. |

The current required release workbook name is:

```text
Repository_EN.xlsx
```

Do not use the old Polish workbook name as the current release file name.

---

## Generating data files in admin mode

Use **Generate data files** when the data source workbook has been updated.

Workflow:

1. Open `DataVault/index.html?admin=1`.
2. Unlock the data gate.
3. Click **Generate data files**.
4. Select a local `Repository_EN.xlsx` file.
5. DataVault generates:
   - `data.json`,
   - `firebase-import.json`.
6. Keep `data.json` as a backup/helper file.
7. Import `firebase-import.json` into Firebase Realtime Database from the root path (`/`).
8. Verify that `/datavault/live` exists after import.

Do not import `firebase-import.json` while already inside `/datavault/live`, because that creates the wrong nested path:

```text
/datavault/live/datavault/live
```

---

## Firebase behavior

DataVault uses Firebase for private data access.

| Firebase service | Role |
| --- | --- |
| Firebase Authentication | Signs in the technical access user through the password gate. |
| Realtime Database | Stores the private DataVault runtime payload under `/datavault/live`. |

DataVault and NPCGenerator use the same private data sign-in session through the shared Firebase loader. Signing in once may unlock the other module in the same browser session.

Full setup instructions belong in:

```text
DataVault/config/FirebaseREADME.md
```

The public DEMO can use password `000000`. A real deployment must use its own Firebase project and own password.

---

## Firebase import summary

To update DEMO/private data after generating a fresh `firebase-import.json`:

1. Open Firebase Console.
2. Open the correct project.
3. Open **Realtime Database**.
4. Open the **Data** tab.
5. Select the database root (`/`).
6. Use **Import JSON**.
7. Select `firebase-import.json`.
8. Confirm import.
9. Verify that `/datavault/live` contains `schemaVersion`, `createdAt`, `source`, and `dataJson`.

Realtime Database creates child nodes when JSON is imported or written. You do not need to manually create empty `datavault` or `live` nodes first. The Realtime Database service itself must still be created and enabled in Firebase Console, and the Firebase config must contain the correct `databaseURL`.

---

## English workbook names are required

The release format is English-first.

DataVault currently expects the English workbook structure from `Repository_EN.xlsx`. The most important rule is that worksheet and column names are not merely visual labels. Several mechanisms depend on them, including:

- sheet detection,
- column filtering,
- table rendering,
- trait tag rendering,
- tooltip lookup,
- generated metadata,
- Full View / Default View behavior,
- NPCGenerator data loading.

Changing sheet names or column names requires code and documentation updates. Do not rename workbook sheets or columns unless you also update the alias maps and dependent mechanisms described in `DataVault/docs/Documentation.md`.

---

## Current English workbook structure

The current sample workbook includes sheets such as:

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
```

Common important columns include:

```text
ID
State
Type
Kind
Name
Description
Effect
Keywords
Traits
Range
Book
Page
```

Sheet-specific columns are documented in the technical documentation and in the sample workbook itself.

---

## K.O.Z.A. access window

The private-data gate uses K.O.Z.A. / Machine Spirit wording:

| Element | DEMO wording |
| --- | --- |
| Title | `Access to K.O.Z.A. classified data` |
| Description | Explains that the data is sealed by Machine Spirit protocols. |
| Password label | `Access Litany` |
| Button | `Begin Rite` |
| DEMO password | `000000` |

The password field is not a general application password field. It signs into the configured Firebase technical user.

---

## Adding another language version

Adding interface translations is not enough.

If another language version is added, the developer must review and update:

- UI translation dictionaries,
- language selector options,
- static text not controlled by translations,
- sheet aliases,
- column aliases,
- formatting rules,
- tooltip metadata generation,
- Full View / Default View presets,
- sample workbook structure,
- generated JSON files,
- NPCGenerator data extraction.

The release data format remains English-first until these mechanisms are explicitly updated.

---

## Common problems

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| The password is rejected. | Wrong password or Firebase Authentication is not configured. | For DEMO use `000000`. For a real deployment, check the technical Firebase user and password. |
| Data does not load after sign-in. | Realtime Database is missing, `/datavault/live` is missing, rules block access, or config lacks `databaseURL`. | Check `DataVault/config/FirebaseREADME.md` and verify `/datavault/live`. |
| Tables are empty. | Data was not imported, required sheets are missing, or filters are active. | Import `firebase-import.json` from root and use **Full View**. |
| Some expected records are hidden. | Search, filters, system view, or outdated-row visibility rules are active. | Clear filters or use **Full View**. |
| Default View does not apply useful filters. | DEMO release does not include a production default-filter preset. | Treat **Default View** as limited in DEMO; configure a release-specific preset later. |
| Tooltips or trait tags do not resolve. | Trait names, sheet names, column names, or generated metadata do not match. | Regenerate JSON from `Repository_EN.xlsx` and verify aliases/metadata in technical documentation. |
| Generated Firebase data appears under a nested path. | `firebase-import.json` was imported while already inside `/datavault/live`. | Re-import from the Realtime Database root (`/`). |

---

## Related documentation

| File | Purpose |
| --- | --- |
| `DataVault/docs/Documentation.md` | Technical architecture and maintenance guide. |
| `DataVault/docs/FormattingRules.md` | Text formatting, marker, keyword, range, trait, and page-reference rules. |
| `DataVault/config/FirebaseREADME.md` | Firebase setup guide for DataVault. |
| `docs-standard.md` | Repository-wide documentation standard. |
