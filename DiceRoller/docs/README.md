# User guide — DiceRoller

DiceRoller resolves Wrath & Glory dice tests and immediately shows outcome details.

This is a user-facing guide. Technical details belong in `DiceRoller/docs/Documentation.md` if that file exists or is added later.

---

## How to open

Open:

```text
DiceRoller/index.html
```

In the top-right corner, you can choose the interface language and return to the module launcher with **Main Page**.

---

## How to roll

1. Set **Difficulty Number** — the required number of successes.
2. Set **Dice Pool** — the total number of dice.
3. Set **Number of Wrath Dice** — the number of red wrath dice.
4. Click **Roll the dice!**.
5. Wait for the animation to finish.
6. Read the summary panel.

---

## Result labels

| Result label | Meaning |
| --- | --- |
| **Success / Failure** | Whether the test passed. |
| **Wrath Complication** | A negative twist from the wrath die. |
| **Wrath Critical** | A strong positive wrath effect. |
| **Possible Shift** | Extra successes beyond the required target. |
| **Dice list** | Detailed per-die results. |

---

## Input limits

| Field | Limit |
| --- | --- |
| Difficulty Number | 1 to 99 |
| Dice Pool | 1 to 99 |
| Number of Wrath Dice | 1 to 99, but cannot exceed Dice Pool |

---

## Helpful tips

- Set all values before rolling.
- Switch language before rolling, because language switching resets the current result.
- Default start values are DN 3, Pool 2, Wrath 1.

---

## Firebase behavior

DiceRoller does not use Firebase.

It is a local browser module. It does not require:

- Firebase Authentication,
- Realtime Database,
- Firestore,
- Firebase Storage.

---

## Important when copying the module

The **Main Page** button uses a hyperlink to the Main module. If the app is moved to another server or folder, update this link so return navigation still works.

---

## Adding another language version

If another UI language is added, update and test:

- translation dictionary entries,
- language selector options,
- static text not controlled by translations,
- result labels,
- error messages,
- input validation messages,
- this guide.

---

## Common problems

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| Wrath dice value is rejected. | Wrath dice count is greater than dice pool. | Lower wrath dice or increase dice pool. |
| Result disappears after switching language. | Language switching refreshes current result state. | Choose language before rolling. |
| Main Page button goes to the wrong place. | App was copied to another folder/server. | Update the Main Page link. |
| Roll button does nothing. | Invalid numeric input. | Check all fields are within limits. |
