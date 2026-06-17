# User guide — Calculators

The Calculators module contains utility tools for character development and character creation.

This is a user-facing guide. Technical details belong in `Calculators/docs/Documentation.md`. Firebase setup belongs in `Calculators/config/FirebaseREADME.md` when Character Creation save/load is used.

---

## What this module includes

| Tool | Purpose |
| --- | --- |
| XP Calculator | Quick progression cost counting. |
| Character Creation | Full character building panel. |

The landing page also includes a small easter egg button.

---

## How to open

Open:

```text
Calculators/index.html
```

Then choose:

- **XP Calculator**,
- **Character Creation**.

---

## XP Calculator workflow

1. Open the XP Calculator.
2. Set language in the top-right corner if needed.
3. Enter current and target values for attributes and skills.
4. Read row costs and the total cost.
5. Use **Reset values** to clear editable fields.
6. Use **Main Page** to return to the launcher.

Polish interface labels may use **PD**. English interface labels use **XP**.

---

## Character Creation workflow

1. Open Character Creation.
2. Set the point pool. The default is 155.
3. Fill attribute values.
4. Fill skills.
5. Add extra costs such as talents, archetype costs, or powers.
6. Review warning messages.
7. Use **Instruction / Manual** to open the help PDF.
8. Use **Maximum attribute values** to check species limits.
9. Use **Reset** to restore defaults.

The talents section contains 20 entries arranged as 2 columns × 10 rows: name and cost.

---

## Character Creation warnings

The module can warn about:

- point pool exceeded,
- Tree of Learning rule issues.

Species limit tables are reference-only and do not auto-fill fields.

---

## Character save/load and Firebase

Character Creation can use Firebase Firestore for cross-device save/load.

If Firebase is not configured, save/load may not be shared between devices.

Firebase setup belongs in:

```text
Calculators/config/FirebaseREADME.md
```

---

## Secret button

The landing page includes a small easter egg.

Behavior:

1. Click **Secret button!**.
2. An overlay animation opens.
3. Close it with:
   - **Close** button,
   - background click,
   - `Escape` key.

---

## Copying the module for a new group

When copying the module:

1. Configure `Calculators/config/firebase-config.js` if Character Creation save/load should be shared.
2. Verify the **Main Page** link in `CharacterCreation.html`.
3. Save a test character.
4. Load the test character again.

---

## Adding another language version

If another UI language is added, update and test:

- translation dictionaries,
- language selector options,
- static text not controlled by translations,
- XP/PD labels,
- warning messages,
- PDF/manual links,
- save/load messages,
- user and Firebase documentation.

---

## Common problems

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| Character does not save across devices. | Firebase is not configured or Firestore rules block access. | Configure Firestore and verify rules. |
| XP labels look wrong. | Language switch not applied or label mapping is incomplete. | Switch language and check XP/PD labels. |
| Species limits do not fill values. | They are reference-only. | Enter values manually. |
| Main Page button goes to the wrong place. | App was copied to another path. | Update the hyperlink. |
| Manual button does not open help. | PDF path is wrong or file is missing. | Verify manual file path. |
