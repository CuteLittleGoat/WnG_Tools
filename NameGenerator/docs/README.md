# User guide — NameGenerator

NameGenerator creates setting-style names from selectable categories and options.

This is a user-facing guide. Technical details belong in `NameGenerator/docs/Documentation.md` if that file exists or is added later.

---

## How to open

Open:

```text
NameGenerator/index.html
```

The interface starts in English. Polish may remain available through the language selector.

---

## How to use

1. Open `NameGenerator/index.html`.
2. In **Category**, choose the group you want.
3. In **Option**, choose a style or variant.
4. Optionally enter **Seed** for repeatable output.
5. Set the number of results in **Count**.
6. Click **Generate**.
7. Click **Copy result** to copy the list.

---

## Fields and actions

| Element | Meaning |
| --- | --- |
| **Category** | Main generator group. |
| **Option** | Sub-style, faction, variant, or dataset option. |
| **Seed** | Optional repeatability input. |
| **Count** | Number of generated results. |
| **Generate** | Creates the result list. |
| **Copy result** | Copies generated names to the clipboard. |
| Language selector | Changes the interface language where supported. |

---

## Interface language and generated results

The interface starts in English.

Generated results may still use the existing source dictionaries. This means individual results may retain their current wording even when the interface is English.

Translating generated results is a separate dictionary task, not only a UI translation task.

---

## Firebase behavior

NameGenerator does not use Firebase.

It does not require:

- Firebase Authentication,
- Realtime Database,
- Firestore,
- Firebase Storage.

---

## Adding another language version

If another UI language is added, update and test:

- translation dictionary entries,
- language selector options,
- static text not controlled by translations,
- category labels,
- option labels,
- placeholder text,
- status messages,
- copy confirmation messages,
- documentation.

If generated results are translated later, update the generator dictionaries and test every category/option combination separately.

---

## Common problems

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| Results are not in the selected interface language. | Generated results use existing source dictionaries. | Treat result translation as a separate dictionary task. |
| Same seed does not produce expected result. | Category, option, or generator logic changed. | Use the same category, option, seed, and count. |
| Copy result does not work. | Browser clipboard permission or focus issue. | Try again after interacting with the page, or copy manually. |
| Main Page navigation is wrong after copying the app. | Folder path changed. | Update the Main Page link if present. |
