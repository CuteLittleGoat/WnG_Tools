# Technical documentation — Calculators

Calculators is a static browser module for character planning. It contains a launcher, an XP Calculator, and a Character Creation sheet. Character Creation can use Firestore for save/load when Firebase is configured.

This document is English-only and describes the current release architecture.

---

## 1. Module purpose

Calculators is responsible for:

- launching calculator tools,
- calculating XP progression costs,
- supporting character creation calculations,
- showing species maximum attribute values,
- opening user manuals,
- validating point budgets and rules,
- saving/loading character creation data when Firestore is configured,
- supporting interface language switching.

---

## 2. Files

| File | Role |
| --- | --- |
| `Calculators/index.html` | Launcher with links to XP Calculator and Character Creation. |
| `Calculators/XPCalculator.html` | XP progression calculator. |
| `Calculators/CharacterCreation.html` | Full character creation sheet. |
| `Calculators/kalkulatorxp.css` | Shared visual system for calculator pages. |
| `Calculators/config/firebase-config.js` | Firebase Web SDK config for Character Creation save/load. |
| `Calculators/config/FirebaseREADME.md` | Firebase setup guide. |
| `Calculators/docs/README.md` | User guide. |
| `Calculators/docs/Documentation.md` | This technical guide. |
| `Calculators/HowToUse/en.pdf` | English manual PDF. |
| `Calculators/HowToUse/pl.pdf` | Polish manual PDF. |

Assets include:

```text
Koza.gif
Modal_Icon.png
Skull.png
```

---

## 3. Launcher

`Calculators/index.html` provides navigation to:

```text
XPCalculator.html
CharacterCreation.html
```

It also contains a landing-page extra interaction shown as an overlay.

Expected overlay behavior:

- open by clicking the landing-page extra button,
- close with the visible close button,
- close by clicking the overlay background,
- close with the Escape key.

The launcher should remain usable without Firebase.

---

## 4. XP Calculator

`XPCalculator.html` calculates progression costs.

Important behavior:

- user enters current and target values,
- row costs update automatically,
- total cost updates automatically,
- reset clears editable fields,
- language switching updates XP/PD labels,
- Main Page navigation returns to the launcher.

English uses:

```text
XP
```

Polish may use:

```text
PD
```

where the UI still supports Polish.

---

## 5. Character Creation

`CharacterCreation.html` provides a full character building sheet.

Important behavior:

- default point pool is 155,
- attributes and skills contribute to cost calculations,
- extra costs include talents, archetype costs, and powers,
- talents section contains 20 entries in two columns of ten rows,
- warnings show point budget and Tree of Learning issues,
- manual button opens the PDF guide,
- maximum attribute values button opens reference limits,
- reset restores defaults,
- save/load can use Firestore when configured.

---

## 6. Attribute and species reference behavior

The Character Creation sheet supports eight attributes:

```text
Strength
Toughness
Agility
Initiative
Willpower
Intellect
Fellowship
Speed
```

`Speed` is part of the form, reset, and cost recalculation.

The maximum attribute values table is reference-only. It presents species limits but does not auto-fill the character sheet.

---

## 7. Manual PDFs

The module opens local PDF files from:

```text
Calculators/HowToUse/
```

Current files:

```text
en.pdf
pl.pdf
```

When adding another interface language, add or map the matching manual file if the UI provides language-specific manual links.

---

## 8. Firebase behavior

Only Character Creation uses Firebase, and only for save/load.

| Firebase service | Purpose |
| --- | --- |
| Cloud Firestore | Stores saved character data. |
| Firebase Authentication | Optional, depending on rules. |
| Realtime Database | Not used by Calculators. |
| Storage | Not used by Calculators. |

Setup belongs in:

```text
Calculators/config/FirebaseREADME.md
```

If Firebase is not configured, local calculations still work, but cross-device save/load is unavailable.

---

## 9. Expected save/load model

The exact payload should follow the current `CharacterCreation.html` implementation.

The Firestore setup guide describes the expected document path:

```text
character_builder/current
```

Expected high-level payload areas may include:

```text
schemaVersion
updatedAt
xpPool
xpSpent
xpAvailable
attributes
skills
talents
formSnapshot
```

If the save/load format changes, update:

1. `CharacterCreation.html`,
2. `Calculators/config/FirebaseREADME.md`,
3. `Calculators/docs/README.md`,
4. this document,
5. any migration notes if existing saved data may be incompatible.

---

## 10. UI language support

When adding another language, update:

- translation dictionaries,
- language selector options,
- static text not controlled by translations,
- XP/PD labels,
- warnings,
- PDF/manual links,
- species maximum table labels,
- save/load messages,
- user and Firebase documentation.

Test all calculator pages after switching language.

---

## 11. Styling

The module uses the shared dark terminal visual style:

- black panels,
- green text and borders,
- monospace font stack,
- responsive panels,
- modal overlays,
- highlighted values and warnings.

Shared CSS lives in:

```text
Calculators/kalkulatorxp.css
```

When changing shared CSS, test both `XPCalculator.html` and `CharacterCreation.html`.

---

## 12. Main Page navigation

Calculator pages include a **Main Page** button.

If the module is copied to another folder or server, update the link target so it returns to the correct launcher.

---

## 13. What to update when Character Creation fields change

When adding, removing, or renaming fields in `CharacterCreation.html`, update:

1. form markup,
2. calculation logic,
3. reset/default logic,
4. warning logic,
5. save payload,
6. load payload,
7. Firestore documentation,
8. user documentation,
9. control tests.

This is especially important for attributes, skills, extra costs, talents, and fields saved in `formSnapshot`.

---

## 14. What to update when XP rules change

When progression cost rules change, update:

1. XP cost tables/dictionaries,
2. row calculation logic,
3. total calculation logic,
4. reset/default behavior if affected,
5. visible labels/help text,
6. user documentation,
7. control tests.

The XP Calculator should still work without Firebase.

---

## 15. Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Launcher | Open `Calculators/index.html`. | Links to both tools appear. |
| Landing overlay | Trigger the extra landing-page interaction. | Overlay opens and closes correctly. |
| XP calculation | Enter current/target values. | Row cost and total update. |
| XP reset | Click reset. | Editable values clear or return to defaults. |
| Character defaults | Open Character Creation. | Default pool and defaults appear. |
| Speed field | Edit Speed and recalculate. | Value is included in calculations. |
| Species max table | Open maximum attribute values. | Reference table appears. |
| Budget warning | Exceed point pool. | Warning appears. |
| Tree of Learning | Enter values that violate the rule. | Warning appears. |
| Manual | Click Instruction / Manual. | Correct PDF opens. |
| Save/load | Configure Firestore and save a test character. | Character can be loaded again. |
| Missing Firebase | Open Character Creation without Firebase config. | Local calculations still work; save/load reports missing config or unavailable persistence. |
| Language switch | Switch EN/PL/EN. | Labels and messages update. |
| Navigation | Click Main Page. | Correct launcher opens. |
| Narrow viewport | Test on a narrow screen. | Layout remains usable. |

---

## 16. Rebuild checklist

To rebuild or copy Calculators:

1. Restore `index.html`, `XPCalculator.html`, and `CharacterCreation.html`.
2. Restore `kalkulatorxp.css`.
3. Restore image assets.
4. Restore manual PDFs.
5. Restore or replace `config/firebase-config.js`.
6. Configure Firestore if save/load is required.
7. Test XP calculation.
8. Test Character Creation calculation.
9. Test warnings.
10. Test save/load.
11. Test language switching.
12. Test Main Page navigation.
13. Test responsive layout.

---

## 17. Known release notes

- XP Calculator is local and does not require Firebase.
- Character Creation can use Firestore for save/load.
- Calculators do not use Realtime Database.
- Calculators do not use Firebase Storage.
- Manual PDFs are local files.
- The maximum attribute table is reference-only.
