# User guide — Main

Main is the launcher for the whole WnG Tools application. It lets you open the other modules from one screen.

This is a user-facing guide. Technical details belong in `Main/docs/Documentation.md` if that file exists or is added later.

---

## How to open

Open:

```text
Main/index.html
```

For extended mode, append:

```text
?admin=1
```

---

## Standard mode

Standard mode shows:

- application logo,
- grid of core module buttons,
- external buttons where configured.

---

## Admin mode

Admin mode is opened with:

```text
Main/index.html?admin=1
```

Admin mode may show additional module buttons such as:

- NameGenerator,
- NPCGenerator,
- Audio.

Where supported, links may open extended or admin-capable module entry points.

---

## Buttons

| Button | Purpose |
| --- | --- |
| DataSlate | Opens the message display module. |
| DataVault | Opens the data browser. |
| NameGenerator | Opens the naming tool. |
| NPCGenerator | Opens the NPC card builder. |
| Audio | Opens the sound effects module. |
| Images | Opens an external image folder or channel. |
| VTT | Opens an external VTT room. |
| Calculators | Opens calculator tools. |
| DiceRoller | Opens the dice tool. |

---

## Session workflow suggestion

1. Keep Main open as the control center.
2. Open modules as needed.
3. Return to Main when switching tools.
4. Use admin mode only when you need tools hidden from standard mode.

---

## External links

The **VTT** and **Images** buttons open external links.

When copying the app for another group or server, update these placeholders:

```text
INSERT_YOUR_VTT_LINK
INSERT_YOUR_IMAGE_FOLDER_OR_CHANNEL_LINK
```

Current helper file:

```text
Main/ZmienneHiperlacza.md
```

After changing external links:

1. Refresh `Main/index.html`.
2. Click **VTT**.
3. Click **Images**.
4. Confirm that both open the correct destinations.

---

## Copying Main for another group

When copying Main:

1. Set group-specific VTT and Images links.
2. Verify all module links in `Main/index.html`.
3. Refresh the page.
4. Click every button once.
5. Confirm navigation works correctly.

---

## Firebase behavior

Main does not use Firebase directly.

Some modules opened from Main use Firebase, but their setup belongs in their own module folders.

Examples:

- `DataVault/config/FirebaseREADME.md`,
- `NPCGenerator/config/FirebaseREADME.md`,
- `Audio/config/FirebaseREADME.md`,
- `DataSlate/config/FirebaseREADME.md`,
- `Calculators/config/FirebaseREADME.md`.

---

## Adding another language version

If another UI language is added, update and test:

- visible button labels,
- static descriptions,
- external-link instructions,
- admin-mode labels,
- module names,
- documentation.

---

## Common problems

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| VTT opens the wrong place. | Placeholder link was not replaced. | Update `Main/ZmienneHiperlacza.md`. |
| Images opens the wrong place. | Placeholder link was not replaced. | Update `Main/ZmienneHiperlacza.md`. |
| A module button fails. | Folder path changed after copying. | Update the link in `Main/index.html`. |
| Admin buttons are missing. | Page was opened without `?admin=1`. | Open `Main/index.html?admin=1`. |
