# User guide — DataSlate

DataSlate shows narrative messages to players on a dedicated display. The GM controls message text, visual style, logo, sound, and effects from a separate GM panel.

This is a user-facing guide. Technical details belong in `DataSlate/docs/Documentation.md`. Firebase setup belongs in `DataSlate/config/FirebaseREADME.md`.

---

## What DataSlate is for

DataSlate is designed for table play where the GM wants to send atmospheric messages, alerts, transmissions, or screen effects to the players.

The module uses two screens:

| Screen | Entry point | Purpose |
| --- | --- | --- |
| Player screen | `DataSlate/DataSlate.html` | Display shown to players. |
| GM screen | `DataSlate/GM.html` | Control panel used by the GM. |

Best setup: keep both pages open at the same time, either on separate devices or on a dual-monitor setup.

---

## Supporting test and backup files

These files are intentionally available:

```text
DataSlate/GM_test.html
DataSlate/DataSlate_test.html
DataSlate/GM_backup.html
DataSlate/DataSlate_backup.html
```

They are helper tools for testing and experiments. They are not the main entry points for regular sessions.

---

## Quick start

1. Open `DataSlate/DataSlate.html` on the player screen.
2. Open `DataSlate/GM.html` on the GM device.
3. In the GM panel, choose **Background** and **Logo**.
4. Choose **Font** and optional **Message audio**.
5. Configure toggles such as **Logo**, **Shadow rectangle**, **Flicker**, **Fillers**, and **Audio**.
6. Enter text in **Message content**.
7. Click **Send**.
8. Check the player screen. The message should appear immediately.

---

## Main GM panel actions

| Button / element | What it does |
| --- | --- |
| **Send** | Publishes the current message and settings to the player screen. |
| **Ping** | Plays the attention sound without changing message text. Uses `DataSlate/assets/audios/ping/Ping.mp3`. |
| **Clear message** | Clears the message input field only. |
| **Restore defaults** | Resets panel settings to default values. |
| **Update data from XLSX** | Reads the DataSlate manifest workbook and generates refreshed JSON data. |
| Preview mode: **Content** | Shows the text-layer preview. |
| Preview mode: **Background** | Shows a background-only preview. |

After a data refresh, generated data is saved to:

```text
DataSlate/assets/data/data.json
```

---

## Common settings

The GM commonly adjusts:

- background image,
- logo image,
- logo color,
- message font,
- message audio,
- message text color and size,
- prefix/suffix text color and size,
- filler line count,
- prefix/suffix area height,
- shadow rectangle,
- flicker,
- audio toggle.

In filler data, line separators are newline and pipe `|`. Semicolon stays inside the text and does not split one entry into multiple elements.

---

## Logo color

The GM panel includes a **Logo color** panel directly below **Logo**.

Behavior:

- the default logo color is gold: `#d4af37`,
- the panel includes a HEX field, picker, and preset chips,
- when **Logo** is disabled, the logo color controls become inactive,
- preset chips affect only logo color,
- preset chips do not change the shared Prefix/Suffix color,
- changes appear immediately in GM preview,
- changes appear on the player screen after sending,
- available logo presets include black: `#000000`,
- decorative logos render as PNG masks without a text-image fallback.

---

## DataSlate data

DataSlate data is stored in:

```text
DataSlate/assets/data/data.json
```

It includes backgrounds, logos, fonts, audio entries, and other selectable assets.

The default GM-panel logo is:

```text
Aquila
```

with ID:

```text
3
```

and file path:

```text
DataSlate/assets/logos/Aquila.png
```

---

## In-session workflow

1. Prepare a visual style for the scene.
2. Send shorter messages more often instead of one very long block.
3. Use **Ping** when you need immediate player attention.
4. Use audio sparingly for impact.
5. If the layout becomes messy after experiments, click **Restore defaults**.
6. Test a scene style on the actual player display before using it in an important scene.

---

## Firebase behavior

DataSlate requires Firebase because the GM panel and player screen exchange live state through Firestore.

DataSlate uses:

| Firebase service | Purpose |
| --- | --- |
| Cloud Firestore | Live GM-to-player screen synchronization. |
| Firebase Authentication | Not required unless your group adds rules that require it. |
| Realtime Database | Not used by DataSlate. |
| Storage | Not used by DataSlate. |

Firebase setup instructions belong in:

```text
DataSlate/config/FirebaseREADME.md
```

Each group should use its own Firebase project or its own clearly separated Firestore document paths to avoid mixing messages between groups.

---

## Background maintenance files

DataSlate includes helper files for the blue-frame workflow.

Important paths:

```text
DataSlate/assets/ramki/
DataSlate/assets/data/NiebieskaRamka.md
DataSlate/assets/data/Mapowanie.xlsx
```

Purpose:

- `assets/ramki/` contains blue-frame versions of backgrounds.
- `assets/data/Mapowanie.xlsx` maps blue-frame files to regular background files.
- `assets/data/NiebieskaRamka.md` explains how the safe text rectangle is calculated from the blue frame.

These files are maintenance helpers for people adding or correcting backgrounds. They are not required during normal play.

The `.md` file must be English-only. The `Mapowanie.xlsx` mapping workbook may stay as it is.

---

## Common problems

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| No message appears on the player screen. | GM and player pages are not connected to the same Firestore path or one page is stale. | Refresh both pages and send again. Check Firebase config. |
| Ping does not play. | Audio toggle, browser autoplay policy, or system volume. | Enable audio, interact with the page once, and check volume. |
| Player screen looks different on projector/mobile. | Screen size, scaling, or background choice. | Test on the final display and use shorter text. |
| Logo color does not change. | Logo disabled or controls inactive. | Enable Logo and send again. |
| Data options are missing. | `assets/data/data.json` is stale or not generated. | Use **Update data from XLSX** and verify generated JSON. |
| Messages appear in another group's display. | Shared Firebase config/path. | Use a separate Firebase project or separate Firestore paths. |

---

## Adding another language version

If another UI language is added, update and test:

- visible static labels,
- GM panel buttons,
- player-screen messages,
- preview labels,
- status/error messages,
- Firebase setup documentation,
- asset manifest labels if they are displayed,
- test and backup pages if they are still maintained.

---

## Related documentation

| File | Purpose |
| --- | --- |
| `DataSlate/docs/Documentation.md` | Technical architecture and maintenance guide. |
| `DataSlate/config/FirebaseREADME.md` | Firebase setup guide. |
| `DataSlate/assets/data/NiebieskaRamka.md` | Blue-frame maintenance instructions. |
| `docs-standard.md` | Repository documentation standard. |
