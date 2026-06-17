# Technical documentation — Calculators

Calculators is a browser-only module with a launcher, an XP tool, and a character sheet tool.

This document is English-only.

---

## Files

| File | Role |
| --- | --- |
| `Calculators/index.html` | Launcher page. |
| `Calculators/XPCalculator.html` | XP cost tool. |
| `Calculators/CharacterCreation.html` | Character sheet tool. |
| `Calculators/kalkulatorxp.css` | Shared styles. |
| `Calculators/config/firebase-config.js` | Optional Firestore config for sheet saving. |
| `Calculators/config/FirebaseREADME.md` | Firebase setup guide. |
| `Calculators/HowToUse/en.pdf` | English help file. |
| `Calculators/HowToUse/pl.pdf` | Polish help file. |

---

## XP tool

`XPCalculator.html` calculates progression cost from current and target values.

It supports:

- automatic row totals,
- total cost display,
- reset action,
- language switching,
- Main Page navigation.

English labels use `XP`. Polish labels may use `PD`.

---

## Sheet tool

`CharacterCreation.html` is the larger sheet calculator.

It supports:

- point pool tracking,
- attribute fields,
- skill fields,
- extra cost fields,
- talent cost rows,
- rule warnings,
- reference maximum values,
- PDF help links,
- reset action,
- optional Firestore save/load.

---

## Firebase

The XP tool does not need Firebase.

The sheet tool can use Cloud Firestore for save/load when configured.

The module does not use Realtime Database or Firebase Storage.

Setup belongs in:

```text
Calculators/config/FirebaseREADME.md
```

---

## Navigation

Calculator pages include a Main Page button. If the module is moved to another path, update the link target.

---

## Language support

When adding a language, update:

- translation dictionaries,
- language selector options,
- static labels,
- warnings,
- PDF links,
- save/load messages,
- documentation.

---

## Control tests

| Test | Expected result |
| --- | --- |
| Open launcher | Links to both tools are visible. |
| XP calculation | Row and total costs update. |
| XP reset | Values reset. |
| Open sheet tool | Default values appear. |
| Reference table | Maximum values table opens. |
| Warnings | Rule warnings appear when needed. |
| Help PDF | Manual opens. |
| Firestore save/load | Saved data can be loaded again when Firebase is configured. |
| Language switch | Labels update. |
| Main Page | Navigation returns to launcher. |

---

## Rebuild checklist

1. Restore the launcher.
2. Restore both tool pages.
3. Restore shared CSS.
4. Restore image assets.
5. Restore help PDFs.
6. Restore or replace Firebase config.
7. Test both tools.
8. Test language switching.
9. Test navigation.
