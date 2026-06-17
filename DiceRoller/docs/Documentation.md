# Technical documentation — DiceRoller

DiceRoller is a client-side Wrath & Glory dice-test simulator. It has no backend dependency and does not use Firebase.

This document is English-only and describes the current release architecture.

---

## 1. Module purpose

DiceRoller is responsible for:

- reading three numeric inputs,
- validating the inputs,
- rolling d6 values,
- separating normal dice and Wrath dice,
- calculating icons and exalted icons,
- determining success or failure,
- detecting Wrath Complication and Wrath Critical,
- calculating possible shifts,
- rendering individual dice results,
- rendering a result summary,
- supporting language switching.

---

## 2. File structure

| File | Role |
| --- | --- |
| `DiceRoller/index.html` | View structure, form inputs, action buttons, result containers, language selector, Main Page link. |
| `DiceRoller/style.css` | Layout, dark terminal theme, dice visuals, responsive behavior, result states. |
| `DiceRoller/script.js` | Validation, dice rolling, scoring, rendering, reset, and translation logic. |
| `DiceRoller/docs/README.md` | User guide. |
| `DiceRoller/docs/Documentation.md` | This technical guide. |

---

## 3. No backend / no Firebase

DiceRoller is fully local.

It does not use:

- Firebase Authentication,
- Realtime Database,
- Cloud Firestore,
- Firebase Storage,
- a backend API,
- local database files.

The module can be reconstructed from its frontend files.

---

## 4. HTML structure

Important elements:

| Element | Purpose |
| --- | --- |
| `main.app` | Main module container. |
| `.language-switcher` | Language selector and Main Page navigation. |
| `header.app__header` | Title and subtitle. |
| `section.panel` | Numeric inputs and roll button. |
| `section.results` | Dice container and summary panel. |
| `#difficulty` | Difficulty Number input. |
| `#pool` | Dice Pool input. |
| `#wrath` | Number of Wrath Dice input. |

All numeric inputs are validated in JavaScript.

---

## 5. Input validation

Numeric fields are limited to:

```text
1..99
```

Relational rule:

```text
wrath <= pool
```

If Wrath Dice is greater than Dice Pool, the module must correct or reject the value according to current UI behavior.

Default values:

```text
difficulty = 3
pool = 2
wrath = 1
```

---

## 6. Dice algorithm

Roll flow:

1. Read and validate `difficulty`, `pool`, and `wrath`.
2. Create `pool` dice elements.
3. Mark the first `wrath` dice as Wrath dice.
4. Start roll animation.
5. Generate a random value from 1 to 6 for each die.
6. Score each die:

```text
1-3 => 0 icons
4-5 => 1 icon
6   => 2 icons
```

7. Sum icons.
8. Determine success:

```text
totalIcons >= difficulty
```

9. Calculate possible shift:

```text
margin = totalIcons - difficulty
possibleShift = min(numberOfSixes, floor(margin / 2))
```

Possible shift must not be below zero.

---

## 7. Wrath dice logic

Wrath dice use separate red visual styling.

Current result flags:

| Flag | Rule |
| --- | --- |
| Wrath Complication | At least one Wrath die rolled 1. |
| Wrath Critical | All Wrath dice rolled 6. |

If there are no Wrath dice, Wrath-specific messages should not be shown.

---

## 8. Styling and visuals

The module uses a dark terminal style consistent with the rest of `WnG_Tools`.

Important visual rules:

- dark green/black background,
- green text and borders,
- monospace font stack,
- responsive panel layout,
- normal dice are light with dark pips,
- Wrath dice are red with light pips,
- dice animation hides pips and shows a question mark while rolling.

Important dice classes:

```text
.die
.face-1
.face-2
.face-3
.face-4
.face-5
.face-6
```

---

## 9. JavaScript responsibility map

Important function responsibilities:

| Function / mechanism | Responsibility |
| --- | --- |
| `clampValue()` | Keep numeric values inside the accepted range. |
| `sanitizeField()` | Normalize one input field. |
| `syncPoolAndWrath()` | Enforce `wrath <= pool`. |
| `createDieElement()` | Build the DOM structure for one die. |
| `setDieFace()` | Apply the visible face class. |
| `rollDie()` | Generate a random result from 1 to 6. |
| `scoreValue()` | Convert a die result into icons. |
| `buildSummary()` | Render the result summary. |
| `resetState()` | Reset form and result panel. |
| `updateLanguage()` | Apply UI translations and reset state. |
| `handleRoll()` | Orchestrate validation, animation, rolling, scoring, and rendering. |

Function names should be kept synchronized with the actual `script.js` implementation.

---

## 10. Language support

The module supports language switching.

Changing language should:

- update labels,
- update result text,
- update validation messages,
- set document language,
- reset the current result state.

When adding another language, update:

- translation dictionary,
- language selector options,
- static HTML text,
- summary labels,
- validation messages,
- user documentation,
- technical documentation.

---

## 11. Main Page navigation

The Main Page button points to:

```text
../Main/index.html
```

If the folder structure or hosting path changes, update the link.

---

## 12. Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Default roll | Use DN 3, Pool 2, Wrath 1 and roll. | No console errors; result renders. |
| Input clamp | Enter values below 1 or above 99. | Values are corrected or rejected according to UI behavior. |
| Wrath limit | Set Pool 2 and Wrath 5. | Wrath is corrected or blocked so it does not exceed Pool. |
| Success calculation | Force or inspect rolls where icons meet DN. | Result shows Success. |
| Failure calculation | Force or inspect rolls where icons are below DN. | Result shows Failure. |
| Wrath Complication | Wrath die result includes 1. | Complication message appears. |
| Wrath Critical | All Wrath dice are 6. | Critical message appears. |
| Shift | Extra successes and sixes exist. | Possible Shift is calculated correctly. |
| Reset | Change language or reset state. | Result panel returns to default. |
| Mobile layout | Test below 600 px width. | UI remains readable. |
| Main Page | Click Main Page. | Navigation returns to launcher. |

---

## 13. Rebuild checklist

To rebuild the module:

1. Restore `DiceRoller/index.html`.
2. Restore `DiceRoller/style.css`.
3. Restore `DiceRoller/script.js`.
4. Preserve the input IDs used by JavaScript.
5. Preserve the dice result container and summary container.
6. Preserve language selector and Main Page navigation.
7. Re-test validation, rolls, Wrath logic, shift logic, reset, language switching, and responsive layout.

---

## 14. Known release notes

- DiceRoller is fully client-side.
- It does not use Firebase.
- It does not persist roll history.
- Language switching resets the current result.
- The Main Page link must be checked after copying the module to a new path.
