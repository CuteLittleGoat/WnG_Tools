# User guide — NPCGenerator

NPCGenerator helps you build enemy and NPC cards from the private DataVault runtime. You select a base Bestiary record, optionally modify values, choose weapons, armor, and extra modules, then generate a ready-to-use card.

This is a user-facing guide. Technical details belong in `NPCGenerator/docs/Documentation.md`. Firebase setup belongs in `NPCGenerator/config/FirebaseREADME.md`.

---

## How to open NPCGenerator

Open:

```text
NPCGenerator/index.html
```

The release version starts in English. Polish may remain available through the language selector where the module still supports it.

---

## DEMO access password

NPCGenerator uses the same private DataVault access gate as DataVault.

The DEMO data password is:

```text
000000
```

This is only the DEMO password. A real group should configure its own Firebase project and its own access details.

---

## Data source

NPCGenerator does not contain its own full rules repository. It loads source collections from the private DataVault runtime after authorization.

The shared runtime path is:

```text
/datavault/live
```

DataVault Firebase setup must work before NPCGenerator can load live private data.

---

## What you see after opening it

| Area | Purpose |
| --- | --- |
| Data source | Shows whether private DataVault data has been loaded. |
| Base selection | Lets you choose the Bestiary base record. |
| Show outdated entries? | Reveals or hides Bestiary records marked as outdated. |
| Record notes | Optional notes added to the generated card. |
| Active modules | Enables or disables card sections such as Weapons, Armor, Augmentations, Equipment, Talents, Psionics, and Prayers. |
| Favorites | Saves and reloads NPC setups. Uses Firestore when configured, otherwise may fall back to local browser storage. |
| Base preview | Shows the selected base record and editable values. |
| Module selection tables | Let you choose equipment, powers, talents, prayers, and other add-ons. |
| Generate card | Opens the final card in a new browser tab. |

---

## Basic workflow

1. Open `NPCGenerator/index.html`.
2. Enter the DEMO password `000000`, or the access password configured for your Firebase project.
3. Wait for **Data source** to confirm that private data has loaded.
4. In **Base selection**, choose a Bestiary record.
5. Optionally write **Record notes**.
6. In **Base preview**, adjust editable values.
7. In **Active modules**, enable the card sections you want.
8. Select items in active module tables.
9. Click **Generate card**.
10. Review the generated card in the new browser tab.

---

## Base selection

The Bestiary dropdown uses the `Bestiary` sheet from the DataVault runtime.

Outdated Bestiary behavior:

- records with `State = old` are hidden by default,
- **Show outdated entries?** reveals them,
- outdated entries are visually styled differently,
- selecting an outdated entry also marks the Bestiary selector with old-entry styling,
- **Reset** hides outdated entries again.

Legacy data may still use the older `Stan` field, but the release format is English-first and uses `State`.

---

## Base preview and editing

After a Bestiary record is selected, the **Base preview** table shows key/value pairs from that record.

| Field type | Behavior |
| --- | --- |
| Numeric combat/stat values | Can be edited directly where supported. |
| Skills | Can be switched into text-edit mode with **Edit**, then stored with **Save**. |
| Keywords | Can be switched into text-edit mode with **Edit**, then stored with **Save**. |
| Long text cells | May be clamped; click to expand or collapse. |
| Trait tags | May show tooltips when metadata is available. |

---

## Active modules

Use **Active modules** to choose which sections appear on the final card.

Available module sections include:

| Module | Purpose |
| --- | --- |
| Weapons | Adds selected attacks and weapon traits. |
| Armor | Adds or overrides armor-related values and traits. |
| Augmentations | Adds selected augmentations. |
| Equipment | Adds selected equipment. |
| Talents | Adds selected talents. |
| Psionics | Adds selected psychic powers. |
| Prayers | Adds selected prayers. |

Empty preview messages are English in the release, for example:

```text
Select a weapon to view its parameters.
Select armor to view its parameters.
Select a psionic power to view its parameters.
```

---

## Trait descriptions

Weapons and armor can include optional trait descriptions.

| Checkbox | Effect |
| --- | --- |
| Include trait descriptions? | Adds trait descriptions where metadata exists. |
| Include full description? | Adds full text for modules such as talents, equipment, augmentations, psionics, or prayers. |

Trait descriptions depend on DataVault metadata generated from sheets such as:

```text
Traits
Vehicle Traits
```

If a trait description is missing, regenerate and re-import DataVault data from `Repository_EN.xlsx`.

---

## Favorites

Favorites let you save configured NPC setups.

Workflow:

1. Configure the NPC.
2. Optionally enter an **Alias**.
3. Click **Add to favorites**.
4. Use **Load** to restore a saved setup.
5. Use **Remove** to delete a saved setup.
6. Use **Refresh** to reload the list.

Favorites behavior:

| Firebase / Firestore state | Behavior |
| --- | --- |
| Firestore configured and accessible | Favorites are shared and persistent. |
| Firestore missing or blocked | The module may use local browser storage fallback. |
| Local storage only | Favorites are stored only in the current browser/device. |

---

## Generate card

Click **Generate card** to create the final NPC card.

The generated card opens in a new browser tab.

The top card row always shows Level columns:

```text
Level 1 | Level 2 | Level 3 | Level 4 | Level 5
```

The **Threat** row fills those columns from left to right based on the selected Bestiary entry.

| Threat value | Result |
| --- | --- |
| `PPPPP` | All five level columns are filled. |
| `?` | Only the first column is filled. |

---

## Reset behavior

**Reset** clears the current setup.

It also:

- clears the selected Bestiary record,
- clears selected weapons, armor, augmentations, equipment, talents, psionics, and prayers,
- clears old-entry Bestiary visibility,
- removes old-entry select styling,
- returns editable base-preview values to default behavior.

---

## Required DataVault sheets

NPCGenerator loads required DataVault sheets by logical aliases. The release format is English-first.

| Logical sheet | Current release sheet names / aliases |
| --- | --- |
| `bestiary` | `Bestiary` / legacy `Bestiariusz` |
| `armor` | `Armor` / `Armour` / legacy `Pancerze` |
| `weapons` | `Weapons` / legacy `Bronie` |
| `augmentations` | `Augmentations` / `Augmentics` / legacy `Augumentacje` |
| `equipment` | `Equipment` / legacy `Ekwipunek` |
| `talents` | `Talents` / legacy `Talenty` |
| `psionics` | `Psionics` / `Psychic Powers` / legacy `Psionika` |
| `prayers` | `Prayers` / legacy `Modlitwy` |

`Equipment` is normal personal/NPC equipment and is used by NPCGenerator. `Vehicle Wargear` is not loaded as normal NPC equipment.

---

## Sample files

NPCGenerator depends on DataVault sample/runtime data.

Sample files are located in:

```text
DataVault/SampleFiles
```

| File | Purpose |
| --- | --- |
| `Repository_EN.xlsx` | Current English workbook structure used to build DataVault runtime data. |
| `data.json` | Backup/helper data generated from the workbook. |
| `firebase-import.json` | Root-ready Realtime Database import file used to publish DataVault runtime data under `/datavault/live`. |

After editing `Repository_EN.xlsx`, regenerate and import `firebase-import.json` before testing NPCGenerator.

---

## Firebase behavior

NPCGenerator uses Firebase in two ways:

1. It uses shared DataVault Authentication and Realtime Database runtime data.
2. It may use Firestore for shared Favorites.

The module-local Firebase setup guide is:

```text
NPCGenerator/config/FirebaseREADME.md
```

DataVault's Firebase setup guide is:

```text
DataVault/config/FirebaseREADME.md
```

Both matter because NPCGenerator depends on DataVault runtime data and may also use its own Firestore Favorites configuration.

---

## Adding another language version

Adding a UI language is not enough. NPCGenerator consumes DataVault data whose sheet and column names are part of the runtime contract.

When adding another language, update and test:

- translation dictionaries,
- language selector options,
- static text not controlled by translations,
- empty table messages,
- generated card text,
- Favorites messages,
- DataVault sheet aliases,
- DataVault column aliases,
- shared Firebase data loader aliases,
- NPCGenerator collection builders and field accessors,
- `Repository_EN.xlsx` or the new workbook standard,
- regenerated `data.json` and `firebase-import.json`.

---

## Common problems

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| Access password is rejected. | Wrong password or Firebase Authentication is not configured. | In DEMO use `000000`; in a real setup verify the Firebase technical user. |
| Data source does not load. | DataVault Firebase runtime is missing or inaccessible. | Configure/import DataVault data first. |
| Bestiary dropdown is empty. | Required Bestiary sheet is missing or has no rows. | Verify `Bestiary` in `Repository_EN.xlsx`, regenerate, and re-import Firebase data. |
| Old records are missing. | **Show outdated entries?** is disabled. | Enable the checkbox. |
| Old record styling looks different. | The selected record has `State = old`. | This is expected old-entry styling. |
| Armor cannot be selected for a base record. | The selected Bestiary record blocks armor override. | Select another base record or use built-in armor values. |
| Favorites do not persist across devices. | Firestore is missing, blocked by rules, or not configured. | Configure Firestore according to `NPCGenerator/config/FirebaseREADME.md`. |
| Favorites persist only locally. | The module fell back to browser storage. | Configure Firestore for shared favorites. |
| Trait descriptions are missing. | DataVault metadata is missing or stale. | Regenerate DataVault JSON and import the latest `firebase-import.json`. |
| Some text still appears in the wrong language. | A hardcoded string is not connected to translations. | Update `translations`, static HTML, and generated card text. |

---

## Related documentation

| File | Purpose |
| --- | --- |
| `NPCGenerator/docs/Documentation.md` | Technical architecture and maintenance guide. |
| `NPCGenerator/config/FirebaseREADME.md` | Firebase setup for NPCGenerator and Favorites. |
| `DataVault/docs/Documentation.md` | DataVault runtime and data contract documentation. |
| `DataVault/config/FirebaseREADME.md` | DataVault Firebase setup. |
| `docs-standard.md` | Repository documentation standard. |
