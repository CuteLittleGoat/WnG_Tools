# Documentation Standard

**Repository:** `WnG_Tools`  
**Created:** 2026-06-17  
**Status:** working standard for rewriting module documentation

This document defines the documentation standard for the `WnG_Tools` repository.

It applies primarily to these files in each module:

- `docs/README.md`
- `docs/Documentation.md`
- `config/FirebaseREADME.md`

It also applies to supporting module documentation files, including:

- `DataVault/docs/FormattingRules.md`

The goal is to make every module document consistent, complete, technically accurate, and usable by a user, developer, or maintenance agent without needing to infer missing setup steps from code.

---

## 1. General rules

1. All documentation must be written in English only.
2. Do not keep bilingual English/Polish document structures.
3. Do not place a Polish version below an English version.
4. Do not translate section by section.
5. Do not leave Polish user-facing instructions in the final documentation.
6. Legacy Polish file names, sheet names, column names, UI labels, or comments may be mentioned only when they are technically necessary to explain migration or compatibility.
7. Documentation must describe the current code and current release behavior.
8. Documentation must not be a changelog.
9. Documentation must not contain private Firebase values, passwords, service account keys, tokens, private emails, or project secrets.
10. Use placeholders for configuration values.
11. `README.md` is for users.
12. `Documentation.md` is for developers and maintenance agents.
13. `FirebaseREADME.md` is for people configuring Firebase.
14. Every module that uses Firebase must have its own `config/FirebaseREADME.md`.
15. If a module uses shared Firebase infrastructure, its own `FirebaseREADME.md` must still explain what is shared and which shared files or runtime paths it depends on.
16. If a module does not use Firebase, its `Documentation.md` must say so explicitly.
17. Documentation must explain fallback behavior, missing-data behavior, empty states, and error states.
18. Documentation must identify which sample files can be used for testing and setup.
19. Documentation must use the technical folder/module names exactly as they exist in the repository. For example, use `NPCGenerator` as the folder/module name.
20. When a document refers to a path, it must use the actual repository path.

---

## 2. Mandatory English-only language policy

The documentation target for this repository is English only.

Valid structure:

```markdown
# User guide — MODULE NAME

English content.
```

Invalid structure:

```markdown
# English section

English content.

---

# Polish section

Polish content.
```

Invalid structure:

```markdown
## English heading
English text.

## Translated heading
Translated text.
```

The final documentation may still mention legacy non-English data names when needed for migration. Such references must be clearly marked as legacy compatibility notes, not user instructions.

---

## 3. Standard `README.md`

`README.md` is the user guide. It must explain how to use the module in plain English.

It must not focus on implementation details unless the user needs them to operate the module.

### 3.1 Mandatory content for `README.md`

Each module `README.md` must include:

1. What the module is for.
2. How to open the module.
3. What the user sees after opening it.
4. The main user workflow.
5. Every major screen area.
6. Every visible button.
7. The result of clicking every visible button.
8. Input fields, selectors, checkboxes, toggles, tabs, filters, popups, modals, and dialogs.
9. User mode behavior.
10. Admin mode behavior, if the module has admin mode.
11. Admin-only actions, if they exist.
12. Data loading behavior.
13. Data saving behavior.
14. Import, export, reset, print, and generation behavior, if present.
15. Status messages.
16. Error messages.
17. Empty states.
18. Behavior when Firebase is not configured.
19. Behavior when Firebase is configured but data is missing.
20. Behavior when authentication fails.
21. Common problems and fixes.
22. Sample files used by the module.

### 3.2 Required `README.md` template

```markdown
# User guide — MODULE NAME

## What this module is for

Explain the module in plain English.

## How to open the module

Explain which file or URL to open.

## What you see after opening it

Describe the visible screen areas.

## Basic workflow

Describe the main user flow step by step.

## Buttons and actions

| Button / element | What it does |
| --- | --- |
| `Button name` | Describe the result of using it. |

## Fields, selectors, toggles, and filters

| Element | Meaning |
| --- | --- |
| `Element name` | Describe how it affects the module. |

## User mode

Describe normal user behavior.

## Admin mode

Describe admin behavior, or state that the module has no admin mode.

## Data loading, saving, import, and export

Describe how data is loaded, saved, generated, imported, exported, or reset.

## Sample files

List relevant sample files and explain what each one is for.

## Firebase behavior

Summarize whether the module uses Firebase and which Firebase setup document to read.

## Messages and errors

| Message | Meaning | What to do |
| --- | --- | --- |
| `Message text` | Meaning. | Recommended action. |

## Common problems

Describe the most common user problems and their fixes.
```

---

## 4. Standard `Documentation.md`

`Documentation.md` is technical documentation. It must allow a developer or maintenance agent to understand, rebuild, and safely modify the module.

It must be detailed enough to explain the module without relying on hidden context from previous conversations.

### 4.1 Mandatory content for `Documentation.md`

Each module `Documentation.md` must include:

1. Module purpose.
2. Entry points.
3. Operating modes.
4. File structure.
5. Responsibility of each file.
6. Dependencies between files.
7. Dependencies between modules.
8. External libraries and SDKs.
9. HTML structure.
10. CSS structure.
11. Important CSS classes and IDs.
12. Application state.
13. JavaScript functions.
14. Event listeners.
15. Validation rules.
16. Algorithms and calculations.
17. Data import and export.
18. Runtime data structure.
19. Firebase integration, if used.
20. Fallback behavior.
21. Error handling.
22. Empty states.
23. Rebuild procedure.
24. Control tests.
25. Language/data-name dependency notes.
26. Exact update map for adding a new language version.
27. Exact update map for changing sheet or column names.

### 4.2 Required `Documentation.md` template

```markdown
# Technical documentation — MODULE NAME

## Module purpose

Describe what the module does technically.

## Entry points

| File | Role |
| --- | --- |
| `index.html` | Description. |

## Operating modes

Describe user mode, admin mode, demo mode, release mode, or any other mode used by the module.

## File structure

| File | Responsibility |
| --- | --- |
| `file.html` | Description. |

## Dependencies

Describe dependencies between files, modules, SDKs, and shared assets.

## Layout and styles

Describe the HTML layout, CSS architecture, visual system, responsive behavior, and key selectors.

## Application state

Describe state objects, their fields, and persistence.

## JavaScript functions

| Function | Role | Input | Output / effect |
| --- | --- | --- | --- |
| `functionName()` | Description. | Description. | Description. |

## Events and user actions

| Element | Event | Effect |
| --- | --- | --- |
| `#buttonId` | `click` | Description. |

## Validation and errors

Describe validation rules, readable errors, empty states, and recovery actions.

## Data, import, and export

Describe input files, generated files, runtime payloads, import paths, export behavior, and backup behavior.

## Firebase

Describe every Firebase service used by the module. If the module uses Firebase, point to the module's own `config/FirebaseREADME.md`.

## Language and data-name dependencies

Describe exactly which mechanisms depend on English sheet names, English column names, UI language, localized aliases, or release overrides.

## Adding a new language version

Describe every code area that must be updated when a new language is added.

## Changing sheet or column names

Describe every code area that must be updated when data names change.

## Fallbacks

Describe behavior without Firebase, without data, without permissions, without local files, or without optional browser features.

## Module rebuild procedure

Describe steps needed to recreate the module from scratch.

## Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Basic test | Steps. | Result. |
```

---

## 5. Standard `FirebaseREADME.md`

`FirebaseREADME.md` is the Firebase setup guide for a module.

Every module that uses Firebase must have its own `config/FirebaseREADME.md`.

The document must be practical and click-by-click. A person who has never configured the project before must be able to follow it.

### 5.1 Mandatory content for `FirebaseREADME.md`

Each module Firebase guide must include:

1. What the module uses Firebase for.
2. Whether Firebase is required or optional.
3. Which Firebase services are used.
4. Which repository configuration file must be edited.
5. Which configuration values must be copied from Firebase Console.
6. Which authentication method must be enabled.
7. Which database service must be created.
8. Which database path, collection, or document is used.
9. Whether the app creates paths or collections automatically on first write.
10. Which paths or collections do not need to be pre-created manually.
11. Which Firebase services must still be enabled manually before first write.
12. Exact import steps, if JSON import is used.
13. Exact security rules or rule templates.
14. Connection test.
15. Authentication test.
16. Read test.
17. Write test, if the module writes data.
18. Troubleshooting table.
19. Security warnings.

### 5.2 Required `FirebaseREADME.md` template

```markdown
# Firebase setup — MODULE NAME

## What this module uses Firebase for

Describe the Firebase role in this module.

## Firebase services used

| Service | Used | Purpose |
| --- | --- | --- |
| Firebase Authentication | yes/no | Purpose. |
| Realtime Database | yes/no | Purpose. |
| Cloud Firestore | yes/no | Purpose. |
| Storage | yes/no | Purpose. |

## Required configuration files

| File | Purpose |
| --- | --- |
| `path/to/config.js` | Description. |

## Step 1 — Create or open a Firebase project

1. Open Firebase Console.
2. Click **Add project** or open an existing project.
3. Enter the project name.
4. Continue through the project wizard.
5. Configure Analytics according to the group's needs.
6. Finish project creation.

## Step 2 — Add a Web App

1. In the Firebase project overview, click the Web icon (`</>`).
2. Enter an app nickname.
3. Register the app.
4. Copy the `firebaseConfig` object.
5. Paste only the required public Web SDK values into the repository configuration file.
6. Do not paste passwords, private keys, service account files, or secrets.

## Step 3 — Configure Authentication

1. In Firebase Console, open **Build**.
2. Click **Authentication**.
3. Click **Get started** if Authentication has not been enabled yet.
4. Open the **Sign-in method** tab.
5. Select **Email/Password**.
6. Enable **Email/Password**.
7. Save the provider settings.
8. Open the **Users** tab.
9. Click **Add user**.
10. Enter the technical access email used by the app.
11. Enter the password used as the access password.
12. Save the user.
13. Store the password outside the repository.

## Step 4 — Configure the database service

Describe exact setup for Realtime Database or Firestore.

## Step 5 — Configure security rules

Provide the exact rules or a safe rules template.

## Step 6 — Import or create initial data

Describe exact import or first-write behavior.

## First write and automatic structure creation

Explain which paths, collections, or documents are created automatically when the app writes data, and which Firebase services still have to be enabled manually first.

## Connection test

Describe how to test connection.

## Authentication test

Describe how to test sign-in.

## Read test

Describe how to test reads.

## Write test

Describe how to test writes.

## Common errors

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| Symptom. | Cause. | Fix. |
```

---

## 6. Firebase standard for DataVault

DataVault uses Firebase as the private runtime data source.

Its documentation must state:

1. DataVault uses Firebase Authentication for the access gate.
2. DataVault uses Realtime Database for the private runtime payload.
3. The shared loader reads from `datavault/live`.
4. The expected wrapper schema is `datavault-firebase-import-v1`.
5. The wrapper contains `schemaVersion`, `createdAt`, `source`, and `dataJson`.
6. `dataJson` is a JSON string containing the parsed DataVault data object.
7. The parsed object must contain `sheets`.
8. The parsed object should contain `_meta` with sheet order, column order, traits, states, vehicle traits, vehicle weapon traits, and vehicle states when available.
9. The runtime payload is imported from `firebase-import.json`.
10. The import file is root-ready.
11. The import must be performed from the root of Realtime Database (`/`).
12. The import must not be performed while the console is already inside `/datavault/live`.
13. Importing from the wrong location creates the invalid nested path `/datavault/live/datavault/live`.

### 6.1 DataVault Firebase Console setup

DataVault `config/FirebaseREADME.md` must include these exact setup sections.

#### Create or open project

1. Open Firebase Console.
2. Create a new project or open the group's existing project.
3. Add a Web App.
4. Copy the public Web SDK config values.
5. Fill the DataVault/shared Firebase config file used by the release.
6. Set the configured technical access email in the appropriate shared config variable.
7. Do not commit private passwords or service account credentials.

#### Enable Authentication

1. In Firebase Console, open **Build**.
2. Click **Authentication**.
3. Click **Get started** if needed.
4. Open **Sign-in method**.
5. Click **Email/Password**.
6. Enable the provider.
7. Save changes.
8. Open **Users**.
9. Click **Add user**.
10. Enter the technical access email.
11. Enter the access password.
12. Save the user.

#### Create Realtime Database

1. In Firebase Console, open **Build**.
2. Click **Realtime Database**.
3. Click **Create Database**.
4. Select the database location.
5. Continue.
6. Start in locked/production mode unless a temporary setup mode is explicitly required.
7. Click **Enable**.
8. Copy the database URL.
9. Put the database URL into the Firebase config used by DataVault.

#### Set Realtime Database rules

The DataVault guide must include a safe rules example similar to this:

```json
{
  "rules": {
    "datavault": {
      "live": {
        ".read": "auth != null",
        ".write": false
      }
    }
  }
}
```

If a different write policy is needed, the documentation must explain why.

#### Import `firebase-import.json`

1. Open **Realtime Database**.
2. Open the **Data** tab.
3. Click the root of the database (`/`).
4. Open the three-dot menu for database data actions.
5. Choose **Import JSON**.
6. Select `firebase-import.json`.
7. Confirm the import.
8. Verify that the database now contains `/datavault/live`.
9. Open `/datavault/live`.
10. Verify that it contains `schemaVersion`, `createdAt`, `source`, and `dataJson`.

#### Automatic path creation in Realtime Database

The guide must explain that Realtime Database child nodes are created when data is imported or written to a path. The administrator does not need to manually create empty `datavault` or `live` nodes before importing the root-ready JSON.

However, the Realtime Database service itself must be created in Firebase Console first, the app must contain a valid `databaseURL`, Authentication must be enabled, and read rules must allow the signed-in technical user to read the configured path.

---

## 7. Firebase standard for NPCGenerator

NPCGenerator uses Firebase in two separate ways:

1. It uses the shared DataVault Firebase runtime to load source data after authentication.
2. It may use Cloud Firestore to store shared Favorites.

Its documentation must not hide this split.

### 7.1 NPCGenerator dependency on DataVault runtime

NPCGenerator documentation must state:

1. NPCGenerator does not own the main rules/bestiary dataset.
2. NPCGenerator loads its source collections through the shared Firebase data loader.
3. The shared loader authenticates against the configured Firebase project.
4. The shared loader reads Realtime Database path `datavault/live`.
5. Therefore NPCGenerator requires the DataVault Firebase runtime to be configured before the generator can load live data.
6. The module must explain the relationship between `NPCGenerator/config/firebase-config.js`, `../shared/firebase-config.js`, and `../shared/firebase-data-loader.js`.

### 7.2 NPCGenerator Favorites in Firestore

If shared Favorites are enabled, NPCGenerator `config/FirebaseREADME.md` must include Firestore setup.

The guide must state:

1. Favorites use Cloud Firestore.
2. The technical path is `generatorNpc/favorites`.
3. The app writes to a document at that path.
4. Firestore creates the document automatically when `setDoc` writes it for the first time.
5. The administrator does not need to manually create the `generatorNpc` collection or the `favorites` document before the first successful write.
6. The Firestore service itself must still be created/enabled in Firebase Console first.
7. Firestore rules must allow the intended users to read and write the Favorites document.
8. If Firestore is unavailable or not configured, the module must document the fallback behavior, such as local browser storage.

### 7.3 NPCGenerator Firestore setup steps

NPCGenerator `FirebaseREADME.md` must include these steps:

1. Open Firebase Console.
2. Open the project used for NPCGenerator Favorites.
3. In **Build**, click **Firestore Database**.
4. Click **Create database**.
5. Select production mode unless a temporary setup mode is explicitly documented.
6. Select the region.
7. Click **Enable**.
8. Open the **Rules** tab.
9. Add rules that match the intended access model.
10. Publish the rules.
11. Open NPCGenerator.
12. Configure one NPC setup.
13. Add it to Favorites.
14. Return to Firebase Console.
15. Open **Firestore Database**.
16. Verify that collection `generatorNpc` exists.
17. Verify that document `favorites` exists.
18. Refresh NPCGenerator and verify that Favorites load again.

A minimal authenticated-user rules example may look like this:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /generatorNpc/favorites {
      allow read, write: if request.auth != null;
    }
  }
}
```

If the module does not authenticate Firestore writes separately, the documentation must not claim that these rules are sufficient. It must describe the actual release configuration and fallback behavior.

---

## 8. DataVault sample file standard

DataVault and NPCGenerator documentation must both state that example files are located in:

```text
DataVault/SampleFiles
```

The sample file section must describe these files:

| File | Required description |
| --- | --- |
| `Repository_EN.xlsx` | Example workbook with the correct English worksheet and column layout. It is intended for administrators who want to fill in their own data while preserving the required structure. |
| `firebase-import.json` | File prepared for import into Firebase Realtime Database from the database root (`/`). It creates or replaces the payload under `/datavault/live`. |
| `data.json` | Backup/helper data file generated from the workbook. It is useful for inspection, validation, comparison, and recovery, but it is not the primary private runtime source in the release Firebase flow. |

The current required workbook name is:

```text
Repository_EN.xlsx
```

Documentation must not describe `Repozytorium.xlsx` as the current required release file name. It may mention the old name only as a legacy migration note when necessary.

---

## 9. Current `Repository_EN.xlsx` structure

The documentation must rely on the English worksheet and column names from `Repository_EN.xlsx`.

The current sample workbook uses these worksheet names:

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

Documentation must describe key columns using English names. The most important columns include:

```text
ID
State
Type
Kind
Name
Threat
Keywords
Description
Effect
Example
Book
Page
XP Cost
Requirements
Range
Damage
ED
AP
Salvo
Traits
Trait 1
Trait 2
Trait 3
Trait 4
Trait 5
Trait 6
Trait 7
Armour Rating
Defence
Resilience
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
Cost
Availability
Cost (IM)
Activation
Duration
Multi Target
Boost
```

When module documentation lists required columns, it should list only the columns relevant to the module or feature being described, but it must use the exact English column names.

---

## 10. Strict dependency on English data names

DataVault and NPCGenerator strictly depend on English worksheet names and English column names in the release data format.

Documentation must clearly state:

1. `Repository_EN.xlsx` is the canonical release workbook structure.
2. English sheet names are the canonical release sheet names.
3. English column names are the canonical release column names.
4. The UI may have translations, but the data structure is not language-independent.
5. If sheet or column names are changed, multiple mechanisms must be updated.
6. If a new data language is added, the application mechanisms must be updated, not only the visible UI labels.

### 10.1 Required update map for adding a new language version

Every relevant `Documentation.md` must describe the exact update map for adding another language version.

The update map must include at least:

1. UI translation dictionaries.
2. Language selector options.
3. Static text not controlled by dictionaries.
4. Error messages.
5. Empty states.
6. Button labels.
7. Tooltip text.
8. Printable/exported output text.
9. Sheet alias maps.
10. Column alias maps.
11. Canonical sheet key resolution.
12. Canonical column key resolution.
13. Data loader aliases.
14. NPCGenerator field extraction logic.
15. DataVault filtering logic.
16. DataVault Full View and Default View behavior.
17. Formatting rules tied to sheet or column names.
18. Page-reference detection patterns.
19. Sample workbook file names.
20. Sample workbook sheet names.
21. Sample workbook column names.
22. Generated `data.json` structure.
23. Generated `firebase-import.json` structure.
24. Firebase runtime validation.
25. Control tests for each supported language.

The documentation must explicitly warn that adding a UI translation alone is not enough.

---

## 11. DataVault Full View and Default View documentation standard

DataVault has two view-control buttons:

- `Full View`
- `Default View`

Documentation must describe them precisely.

### 11.1 Full View

`Full View` must be documented as the action that returns the data table to the broadest visible data state available in the current system mode.

The documentation must specify whether it clears or resets:

1. Global search text.
2. Per-column text filters.
3. Per-column list filters.
4. Sorting.
5. Row selections.
6. Expanded/collapsed cell state.
7. Sheet-specific view memory.
8. Session storage view state.
9. Optional visibility toggles.
10. Hidden system rows, if any.

If a system-level visibility rule is not cleared by Full View, the documentation must say so.

### 11.2 Default View

`Default View` must be documented as the action that applies the release's intended default filter/sort preset.

The documentation must specify exactly:

1. Which tabs are affected.
2. Which columns are filtered.
3. Which values are selected or removed.
4. Which sort is applied.
5. Which search text is cleared.
6. Which selections are cleared.
7. Which expanded/collapsed state is reset.
8. Which admin/user mode differences exist.

### 11.3 Language dependency and DEMO limitation

The documentation must clearly state that Default View and any automated preset filtering depend on matching worksheet names, column names, and configured data-language aliases.

In the DEMO version, this automation does not work as a production default-filter system because the original application was created around a different data-language structure and the release demo uses English-first data. The DEMO documentation must say this openly.

The DEMO guide must not pretend that language-dependent presets are fully functional if they are disabled, empty, or equivalent to Full View in the current release.

---

## 12. DataVault formatting rules document

The formatting rules document must be named:

```text
DataVault/docs/FormattingRules.md
```

The old non-English filename must be treated as legacy and must not be used as the current documentation path.

`FormattingRules.md` must be written in English only.

It must refer to the current English workbook and current English sheet/column names.

### 12.1 Required content for `FormattingRules.md`

The document must describe:

1. Purpose of the formatting document.
2. Relationship to `DataVault/docs/Documentation.md`.
3. Formatting pipeline order.
4. Inline markers.
5. Marker nesting.
6. Conversion from rich text in `Repository_EN.xlsx` to inline markers.
7. Red text behavior.
8. Bold behavior.
9. Italic behavior.
10. Strikethrough behavior.
11. Page-reference detection.
12. Special helper lines.
13. Keyword rendering.
14. Faction keyword rendering.
15. Range separator rendering.
16. Trait and range numbered column merging, where relevant.
17. Clamp and multiline rendering.
18. Outdated row styling.
19. CSS classes used by formatting.
20. Checklist for preparing `Repository_EN.xlsx`.

### 12.2 Required English formatting terminology

Use English names such as:

```text
Keywords
Faction Keywords
Range
Traits
Bestiary
Archetypes
Psychic Powers
Augmentics
Equipment
Armour
Weapons
Ascension Packages
Vehicle Traits
Vehicle Weapons
```

Do not write formatting instructions around old non-English sheet or column names except in a short legacy compatibility note.

---

## 13. `release-admin-overrides.js` documentation standard

DataVault contains:

```text
DataVault/release-admin-overrides.js
```

`Documentation.md` must describe this file in detail.

It must be described as the official release override for the current English-first release flow.

### 13.1 Why the file exists

The documentation must explain:

1. The original application was created with a different data-language structure in mind.
2. The current release standard uses English workbook sheet and column names.
3. The override exists to bridge the original application assumptions with the English-first release data format.
4. The override keeps release-specific generation logic separate from the main `app.js` file.
5. This separation makes the release data policy easier to audit and change.

### 13.2 What the file does

`Documentation.md` must explain that `release-admin-overrides.js`:

1. Installs a release-specific handler for the admin data generation button.
2. Uses the browser XLSX parser to read the selected workbook.
3. Treats English sheet and column names as the canonical release format.
4. Keeps legacy aliases only as compatibility fallbacks.
5. Normalizes sheet identity through sheet alias groups.
6. Normalizes column identity through column alias groups.
7. Merges numbered range columns into one release field when applicable.
8. Merges numbered trait columns into one release field when applicable.
9. Builds DataVault `_meta` maps.
10. Builds trait description maps.
11. Builds state description maps.
12. Builds vehicle trait maps.
13. Builds vehicle weapon trait maps.
14. Builds vehicle state maps.
15. Preserves sheet order when available.
16. Preserves column order when available.
17. Generates `data.json`.
18. Generates root-ready `firebase-import.json`.
19. Wraps the runtime payload under `datavault/live`.
20. Sets `schemaVersion` to `datavault-firebase-import-v1`.
21. Stores the actual DataVault object as a JSON string in `dataJson`.

### 13.3 What the file must not be used for

The documentation must state that `release-admin-overrides.js` must not be used to:

1. Translate UI labels.
2. Translate user-facing messages.
3. Store private Firebase configuration.
4. Store passwords.
5. Replace `FormattingRules.md`.
6. Replace `Documentation.md`.
7. Hide incompatible data-language changes.

### 13.4 Required maintenance warning

The documentation must include this warning:

```text
If a new data language is added, or if worksheet/column names change, update `release-admin-overrides.js` together with the main DataVault alias maps, the shared Firebase data loader aliases, NPCGenerator data extraction, `FormattingRules.md`, and the sample workbook.
```

---

## 14. Data files and Firebase import standard

Documentation must distinguish between these files:

| File | Role |
| --- | --- |
| `Repository_EN.xlsx` | Source workbook with the correct English worksheet and column structure. Administrators copy this structure and fill in their own records. |
| `data.json` | Backup/helper artifact generated from the workbook. It is useful for validation and recovery. |
| `firebase-import.json` | Root-ready Firebase Realtime Database import file. It should be imported from `/` and creates the payload under `/datavault/live`. |

Documentation must never describe `data.json` as the primary private runtime source if the release module loads from Firebase Realtime Database.

Documentation must explain that `firebase-import.json` is the correct file to import into Firebase.

---

## 15. Documentation update order for this repository

After this standard is created, documentation should be corrected module by module.

Recommended order:

1. Update DataVault user documentation: `DataVault/docs/README.md`.
2. Update DataVault technical documentation: `DataVault/docs/Documentation.md`.
3. Create or update DataVault Firebase documentation: `DataVault/config/FirebaseREADME.md`.
4. Rename and rewrite the formatting rules document as `DataVault/docs/FormattingRules.md`.
5. Remove or replace the legacy formatting rules filename after the new document is accepted.
6. Update NPCGenerator user documentation: `NPCGenerator/docs/README.md`.
7. Update NPCGenerator technical documentation: `NPCGenerator/docs/Documentation.md`.
8. Create or update NPCGenerator Firebase documentation: `NPCGenerator/config/FirebaseREADME.md`.
9. Review shared Firebase configuration documentation if a shared docs file exists or is created later.
10. Review remaining module documentation and remove bilingual structures.
11. Verify that every Firebase-using module has a module-local `config/FirebaseREADME.md`.

---

## 16. Pre-approval checklist

Before accepting a documentation update, check:

- [ ] The document is English-only.
- [ ] The document describes the current code.
- [ ] The document is not a changelog.
- [ ] The document uses the actual repository paths.
- [ ] The document uses `Repository_EN.xlsx` as the current workbook name.
- [ ] The document points to `DataVault/SampleFiles` for sample files where relevant.
- [ ] The document distinguishes `Repository_EN.xlsx`, `data.json`, and `firebase-import.json`.
- [ ] The document uses English sheet and column names.
- [ ] The document explains strict English data-name dependencies.
- [ ] The document explains what must change when adding another language version.
- [ ] The document explains what must change when sheet or column names change.
- [ ] The document explains Firebase setup click by click, if the module uses Firebase.
- [ ] The document explains automatic Firebase path/document creation on first write or import where relevant.
- [ ] The document does not claim that Firebase services are created automatically.
- [ ] The document does not contain private Firebase values.
- [ ] The document explains fallback behavior.
- [ ] The document explains empty states and error states.
- [ ] The document includes control tests.
- [ ] DataVault documentation explains Full View and Default View behavior.
- [ ] DataVault documentation explains the DEMO limitation of language-dependent view presets.
- [ ] DataVault documentation describes `release-admin-overrides.js` as the official release override.
- [ ] DataVault formatting documentation uses `DataVault/docs/FormattingRules.md`.
- [ ] NPCGenerator documentation explains its dependency on DataVault runtime data.
- [ ] NPCGenerator documentation explains Favorites storage and Firestore fallback behavior.

---

## 17. Scope note

This file is a documentation standard. It does not replace module documentation.

Each module must still have its own complete user guide, technical documentation, and Firebase setup guide when Firebase is used.

This standard must be treated as the source of truth when rewriting documentation in `WnG_Tools`.
