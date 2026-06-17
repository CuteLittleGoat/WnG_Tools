# Technical documentation — NameGenerator

NameGenerator is a static browser generator for names, titles, units, ships, machines, and operation-style labels. It has no backend dependency and does not use Firebase.

This document is English-only and describes the current release architecture.

---

## 1. Module purpose

NameGenerator is responsible for:

- presenting selectable generator categories,
- presenting options for the selected category,
- accepting an optional seed,
- accepting a result count,
- generating a list of results,
- copying results to the clipboard,
- supporting UI language switching,
- preserving repeatable output when the same seed/category/option/count combination is used.

Generated results use existing source dictionaries. Translating generated results is a separate dictionary task.

---

## 2. File structure

| File | Role |
| --- | --- |
| `NameGenerator/index.html` | UI structure and result container. |
| `NameGenerator/style.css` | Visual layout, panel, inputs, buttons, result area. |
| `NameGenerator/script.js` | Dictionaries, random generator logic, UI events, clipboard handling, and translations. |
| `NameGenerator/docs/README.md` | User guide. |
| `NameGenerator/docs/Documentation.md` | This technical guide. |
| `NameGenerator/docs/Logika.md` | Additional generator logic/segment notes if maintained. |

---

## 3. No backend / no Firebase

NameGenerator is fully local.

It does not use:

- Firebase Authentication,
- Realtime Database,
- Cloud Firestore,
- Firebase Storage,
- a backend API.

---

## 4. HTML structure

Important UI elements:

| Element | Purpose |
| --- | --- |
| `#languageSelect` | Interface language selector. |
| `#cat` | Category selector. |
| `#opt` | Option selector depending on category. |
| `#seed` | Optional repeatability input. |
| `#count` | Number of generated results. |
| `#gen` | Generate button. |
| `#copy` | Copy result button. |
| `#modePill` | Shows generation mode/status. |
| `#res` | Result output block. |

---

## 5. RNG and repeatability

The generator uses deterministic behavior when a seed is provided and browser randomness when no seed is provided.

Important mechanisms:

| Mechanism | Role |
| --- | --- |
| Seed hashing | Converts the seed text into a numeric state. |
| Seeded RNG | Produces repeatable values from the same seed. |
| Browser random fallback | Used when the seed is empty. |
| Pick helpers | Select elements from arrays. |
| Cleanup helpers | Normalize generated result text. |

When seed mode is used, the same category, option, seed, and count should produce repeatable output unless dictionary or generator logic changes.

---

## 6. Data model

Generator data is stored in JavaScript dictionaries and category definitions.

A category should define:

```text
key
name / display label
options
```

An option should define:

```text
key
name / display label
generator function
```

When adding or renaming categories/options, update:

- category data,
- option data,
- UI translations,
- user documentation,
- technical documentation,
- control tests.

---

## 7. Generated results and interface language

The interface language and generated result language are separate concerns.

The interface starts in English and may support switching to Polish.

Generated results come from the existing dictionaries and may retain their source-language wording. To fully translate generated results, update the dictionaries and generator rules, not only the UI labels.

---

## 8. Clipboard behavior

The **Copy result** button copies the current result block to the clipboard.

Expected behavior:

- when results exist, copy the rendered list,
- show a short status/confirmation,
- provide fallback behavior if the browser blocks clipboard access,
- do not modify the generated result text itself.

---

## 9. Count limits

The result count should be limited to the range supported by the UI and code.

Current expected range:

```text
1..20
```

If the count range changes, update:

- HTML input attributes,
- JavaScript validation,
- user guide,
- technical documentation,
- control tests.

---

## 10. Language support

When adding another UI language, update:

- `translations`,
- language selector options,
- labels,
- placeholders,
- button text,
- status text,
- category and option display labels,
- copy confirmation/fallback text,
- documentation.

Test language switching after generation and before generation.

---

## 11. What to update when generator data changes

When adding or changing generator dictionaries:

1. Update dictionary data in `script.js`.
2. Update the relevant generator function.
3. Update category/option definitions if needed.
4. Test seeded repeatability.
5. Test random mode.
6. Test output cleanup.
7. Update `docs/Logika.md` if maintained.
8. Update `docs/README.md` and this file.

---

## 12. Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Open module | Open `NameGenerator/index.html`. | UI appears. |
| Basic generation | Select category/option and generate. | Result list appears. |
| Count limit | Enter count below/above allowed range. | Count is corrected or limited. |
| Seed repeatability | Use same category, option, seed, and count twice. | Results match. |
| Random mode | Clear seed and generate twice. | Results may differ. |
| Category change | Change category. | Options update. |
| Copy result | Generate and copy. | Result text is copied or fallback appears. |
| Language switch | Switch EN/PL/EN. | UI labels update. |
| Result dictionaries | Switch interface language. | Generated results remain based on current dictionaries. |

---

## 13. Rebuild checklist

To rebuild NameGenerator:

1. Restore `NameGenerator/index.html`.
2. Restore `NameGenerator/style.css`.
3. Restore `NameGenerator/script.js`.
4. Preserve element IDs used by JavaScript.
5. Preserve category and option keys.
6. Preserve dictionary shapes.
7. Test seeded and unseeded generation.
8. Test copy behavior.
9. Test language switching.
10. Test responsive layout.

---

## 14. Known release notes

- NameGenerator is fully client-side.
- NameGenerator does not use Firebase.
- UI language and generated-result language are separate.
- Generated result translation is a future dictionary task, not only a UI task.
