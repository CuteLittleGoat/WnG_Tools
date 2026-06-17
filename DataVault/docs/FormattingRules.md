# Formatting rules — DataVault

This document describes DataVault text formatting, marker handling, keyword rendering, range rendering, trait tags, and related display rules.

For broader architecture, data loading, filtering, column layout, and Firebase behavior, see:

```text
DataVault/docs/Documentation.md
```

---

## 1. Purpose

DataVault renders values from the release data object generated from `Repository_EN.xlsx`.

The formatter must preserve important source formatting from the workbook and apply additional semantic formatting based on the current sheet and column.

The current release is English-first. This document uses the current English sheet and column names.

---

## 2. Formatting pipeline

Formatting order matters.

1. Text is read from `Repository_EN.xlsx`.
2. Rich text styles are converted into inline markers during JSON generation.
3. The app parses inline markers such as `{{RED}}`, `{{B}}`, `{{I}}`, and `{{S}}`.
4. Page references are detected and wrapped.
5. Sheet/column-specific semantic rules are applied.
6. Trait values may become clickable tag elements.
7. Table presentation rules such as clamp, wrapping, and column widths are applied.

---

## 3. Inline markers

Supported inline markers:

| Marker | Meaning | CSS role |
| --- | --- | --- |
| `{{RED}}...{{/RED}}` | Red text | `.inline-red` |
| `{{B}}...{{/B}}` | Bold text | `.inline-bold` |
| `{{I}}...{{/I}}` | Italic text | `.inline-italic` |
| `{{S}}...{{/S}}` | Strikethrough text | `.inline-strike` |

Rules:

- Markers may be nested.
- Combined styles are allowed.
- Combined styles add multiple classes to the same rendered segment.
- Marker order must be preserved.
- Badly balanced markers should not crash the UI; they should degrade to readable text where possible.

Example:

```text
{{RED}}{{B}}Important keyword{{/B}}{{/RED}}
```

Expected effect: bold red text.

---

## 4. XLSX source formatting

The current source workbook is:

```text
Repository_EN.xlsx
```

The generator reads workbook text and formatting.

Expected conversion:

| XLSX formatting | Generated marker |
| --- | --- |
| red font | `{{RED}}...{{/RED}}` |
| bold font | `{{B}}...{{/B}}` |
| italic font | `{{I}}...{{/I}}` |
| strikethrough font | `{{S}}...{{/S}}` |

The browser-side parser and `build_json.py` should preserve rich text runs where possible. If an entire cell uses a recognized style and does not contain styled runs, the whole value may be wrapped in the matching marker.

Line breaks from the workbook should remain line breaks in the generated value.

---

## 5. Page references

DataVault highlights page/source references inside parentheses when a supported page token appears.

Supported page tokens currently include:

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

Examples:

```text
(page 123)
(p. 45)
(pages 44-46)
(str. 12)
```

Rendered references use the `.ref` class.

This behavior is multilingual because older data and compatibility paths may still contain non-English references.

---

## 6. Helper lines

A helper line matching this pattern is rendered as a lighter reference line:

```text
*[number] text
```

Example:

```text
*[1] This is a helper note.
```

Expected CSS class:

```text
.caretref
```

The marker itself remains visible.

---

## 7. Keyword rendering

Keyword rendering is semantic. It depends on the sheet and column.

### 7.1 `Keywords` sheet

In the `Keywords` sheet, the `Name` column may be treated as a keyword label and rendered red.

### 7.2 `Keywords` column in record sheets

For many record sheets, the `Keywords` column is rendered with red keyword text while commas remain visually neutral.

Current keyword comma-neutral sheets include canonical keys for sheets such as:

```text
Bestiary
Archetypes
Psychic Powers
Augmentics
Equipment
Armour
Weapons
Ascension Packages
Vehicles
Vehicle Weapons
Vehicle Wargear
```

Important dependency: the code resolves this behavior through canonical sheet keys and aliases. Changing sheet names requires updating the relevant alias maps.

### 7.3 Comma rendering

In comma-neutral keyword rendering, the comma character should be wrapped so it can use the base text color instead of keyword red.

Expected class:

```text
.keyword-comma
```

---

## 8. Faction keyword rendering

The `Faction Keywords` sheet has special behavior.

Relevant columns:

```text
Faction
Keywords
Description
Effect
```

Special tokenization may treat some separator words or placeholder tokens differently from ordinary keyword text.

Legacy Polish compatibility may still recognize older tokens such as `lub` or special bracketed placeholders. If new English-only faction keyword rules are added later, update both this document and the code path that renders faction keyword cells.

---

## 9. Range rendering

The current release workbook may use numbered range columns such as:

```text
Range 1
Range 2
Range 3
```

Generation merges them into:

```text
Range
```

The merged value uses `/` as a separator.

The slash separator may receive the CSS class:

```text
.slash
```

This lets the slash use a lighter/neutral visual treatment.

Important dependency: if range columns are renamed, update:

- `DataVault/release-admin-overrides.js`,
- `DataVault/build_json.py`,
- `DataVault/column-layout.css`,
- `DataVault/docs/Documentation.md`,
- this file.

---

## 10. Trait rendering

The current release workbook may use numbered trait columns such as:

```text
Trait 1
Trait 2
Trait 3
Trait 4
Trait 5
Trait 6
Trait 7
```

Generation merges them into:

```text
Traits
```

The merged value uses semicolon-separated trait references.

Example:

```text
Parry; Shield; Mounted (Large)
```

In DataVault, values in a `Traits` column can become clickable tag elements.

The runtime release override treats `Traits` like the older `Cechy` column so the existing tooltip system can still resolve trait descriptions.

---

## 11. Trait tooltip metadata

Trait tags depend on generated metadata.

Important metadata objects:

```text
_meta.traits
_meta.vehicleTraits
_meta.vehicleWeaponTraits
_meta.traitIndex
_meta.vehicleTraitIndex
_meta.vehicleWeaponTraitIndex
```

Current tooltip sources:

| Source sheet | Metadata target |
| --- | --- |
| `Traits` | `_meta.traits` |
| `Vehicle Traits` | `_meta.vehicleTraits` |
| selected weapon-trait rows from `Vehicle Traits` | `_meta.vehicleWeaponTraits` |

`release-admin-overrides.js` folds vehicle trait dictionaries into `traitIndex` so the existing tooltip code can resolve vehicle-related entries such as `Shield` and `Mounted`.

Parameterized values such as `Mounted (Large)` may resolve through a template trait such as:

```text
Mounted (X)
```

If tooltips do not appear after workbook edits, regenerate `data.json` and `firebase-import.json` from the current `Repository_EN.xlsx`, then import the fresh `firebase-import.json` into Firebase.

---

## 12. State and condition metadata

State/condition tooltips depend on generated metadata.

Relevant sheets:

```text
Conditions
Vehicle Conditions
```

Legacy aliases may include:

```text
States
Vehicle States
```

Generated metadata:

```text
_meta.states
_meta.vehicleStates
_meta.stateIndex
_meta.vehicleStateIndex
```

Changing these sheet names requires updates in alias maps and generation logic.

---

## 13. Clamp and multiline rendering

Long table cells may be clamped.

Important presentation behavior:

- Long content can be visually limited to a fixed number of lines.
- Clamp does not remove the underlying data.
- Clicking an expandable cell toggles expanded/collapsed state.
- The hint text is localized through the translation messages.
- Expanded/collapsed state belongs to the current table view state.

Expected classes may include:

```text
is-clampable
is-clamped
is-expanded
clampHint
```

The exact width, wrapping, and max-height behavior is handled by `style.css` and `column-layout.css`.

---

## 14. Outdated rows

Bestiary rows with:

```text
State = old
```

are treated as outdated entries.

Important rules:

- The `State` column is hidden from normal display.
- Outdated rows may be hidden by default.
- The old-entry toggle can reveal them.
- Old rows may receive muted styling.
- Some old-entry keys may be styled differently in dependent modules such as `NPCGenerator`.

Legacy Polish compatibility may still recognize:

```text
Stan = old
```

---

## 15. CSS classes used by formatting

Important CSS classes include:

```text
.inline-red
.inline-bold
.inline-italic
.inline-strike
.keyword-red
.keyword-comma
.ref
.caretref
.slash
.tag
.clampHint
.is-clampable
.is-clamped
.is-expanded
.row-old
```

Column sizing and wrapping are defined separately in:

```text
DataVault/column-layout.css
```

---

## 16. Column layout dependencies

`DataVault/column-layout.css` uses selectors such as:

```css
table[data-sheet="Bestiary"] th[data-col="Threat"]
table[data-sheet="Weapons"] td[data-col^="Range "]
table[data-sheet="Vehicle Weapons"] td[data-col^="Trait "]
```

This means formatting and layout are tied to exact current English sheet and column names.

If a sheet or column name changes, update `column-layout.css` together with formatter and alias maps.

---

## 17. Checklist for preparing `Repository_EN.xlsx`

1. Keep the current English sheet names.
2. Keep the current English column names.
3. Use real XLSX font styling for red, bold, italic, and strikethrough text.
4. Use `Range 1`, `Range 2`, `Range 3` for split weapon/vehicle-weapon range values.
5. Use `Trait 1`, `Trait 2`, ..., `Trait N` for split armor/weapon/vehicle trait values.
6. Put trait definitions in `Traits`.
7. Put vehicle trait definitions in `Vehicle Traits`.
8. Put condition definitions in `Conditions`.
9. Put vehicle condition definitions in `Vehicle Conditions`.
10. Use page references such as `(page 123)` or `(p. 123)` where page highlighting is desired.
11. Use semantically stable names for traits, because tooltip lookup depends on text matching.
12. After editing the workbook, regenerate `data.json` and `firebase-import.json`.
13. Import the fresh `firebase-import.json` into Firebase from root (`/`).
14. Test visible tables and tooltips.

---

## 18. What to update when names change

If any sheet or column name changes, update:

1. `Repository_EN.xlsx`.
2. `DataVault/app.js` alias maps and formatting logic.
3. `DataVault/release-admin-overrides.js` alias maps and merge regexes.
4. `DataVault/build_json.py` alias maps and merge regexes.
5. `DataVault/column-layout.css` selectors.
6. `shared/firebase-data-loader.js` alias groups if dependent modules use the field.
7. `NPCGenerator/index.html` collection builders and field accessors if it consumes the field.
8. `DataVault/docs/Documentation.md`.
9. `DataVault/docs/README.md`.
10. This document.

Then regenerate and re-import Firebase data.

---

## 19. Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Rich text | Add red, bold, italic, and strikethrough text in `Repository_EN.xlsx`, regenerate JSON, import, reload. | The styles render in DataVault. |
| Page reference | Add `(page 123)` to a description. | The reference is highlighted with `.ref`. |
| Keywords | Add comma-separated `Keywords`. | Keywords render red while commas remain neutral where applicable. |
| Range merge | Fill `Range 1`, `Range 2`, `Range 3`. | Generated data contains merged `Range`. |
| Trait merge | Fill numbered trait columns. | Generated data contains merged `Traits`. |
| Trait tooltip | Add a trait reference that exists in `Traits`. | Clicking the tag shows the tooltip. |
| Vehicle trait tooltip | Add a vehicle trait reference that exists in `Vehicle Traits`. | Clicking the tag shows the tooltip. |
| Parameterized trait | Add `Mounted (Large)` and define `Mounted (X)`. | Tooltip resolves through the template. |
| Column layout | Open sheets with long descriptions and many columns. | Widths/wrapping follow `column-layout.css`. |
