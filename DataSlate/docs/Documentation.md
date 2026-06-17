# Technical documentation — DataSlate

DataSlate publishes GM-prepared messages to a player-facing screen. The GM panel writes the current display payload to Firestore, and the player screen listens for changes and renders the message immediately.

This document is English-only and describes the current release architecture.

---

## 1. Module purpose

DataSlate is responsible for:

- displaying narrative messages to players,
- letting the GM configure message text and visual style,
- synchronizing GM panel state to the player screen through Firestore,
- playing ping and message audio from local assets,
- rendering backgrounds, logos, text, fillers, shadow rectangles, flicker, and overlays,
- importing selectable asset data from an XLSX manifest into local JSON,
- supporting helper/test views for users who modify the module.

---

## 2. Entry points

| File | Role |
| --- | --- |
| `DataSlate/index.html` | Launcher for production and helper views. |
| `DataSlate/GM.html` | Production GM control panel. |
| `DataSlate/DataSlate.html` | Production player-facing display. |
| `DataSlate/GM_test.html` | Helper GM view for testing modifications. |
| `DataSlate/DataSlate_test.html` | Helper player view for testing modifications. |
| `DataSlate/GM_backup.html` | Reference backup for experiments. |
| `DataSlate/DataSlate_backup.html` | Reference backup for experiments. |

The `_test.html` and `_backup.html` files are intentionally distributed, but they are not the normal production route during play.

---

## 3. Main files and assets

| Path | Purpose |
| --- | --- |
| `DataSlate/config/firebase-config.js` | Firebase Web SDK config for Firestore communication. |
| `DataSlate/assets/data/data.json` | Local selectable DataSlate data snapshot. |
| `DataSlate/assets/data/DataSlate_manifest.xlsx` | Source workbook for updating selectable data. |
| `DataSlate/assets/backgrounds/` | Final background images displayed to players. |
| `DataSlate/assets/ramki/` | Technical blue-frame background variants used for safe text-area calculation. |
| `DataSlate/assets/logos/` | Logo assets. |
| `DataSlate/assets/audios/` | Message and ping audio assets. |
| `DataSlate/assets/data/NiebieskaRamka.md` | Blue-frame safe-area calculation instructions. |
| `DataSlate/assets/data/Mapowanie.xlsx` | Mapping workbook between final backgrounds and blue-frame files. |

---

## 4. Firestore communication

DataSlate uses Cloud Firestore for live communication between the GM panel and the player screen.

Current working document:

```text
dataslate/current
```

Model:

```text
dataslate (collection)
└── current (document)
```

The GM panel writes a full current-state payload. The player screen listens to the same document and rerenders when it changes.

Important implementation rule:

```text
The current document should be treated as a complete snapshot of the display state.
```

When publishing a message, the GM side should overwrite the current payload with the full state rather than relying on partial updates.

---

## 5. Firebase services

| Service | Used | Purpose |
| --- | --- | --- |
| Cloud Firestore | yes | Live GM-to-player synchronization. |
| Firebase Authentication | optional | Only needed if the deployment rules require authenticated users. |
| Realtime Database | no | Not used by DataSlate. |
| Storage | no | DataSlate uses local assets, not Firebase Storage. |

Firebase setup belongs in:

```text
DataSlate/config/FirebaseREADME.md
```

---

## 6. Payload structure

The GM panel publishes a payload describing the complete player-screen state.

Typical fields include:

```text
type
text
backgroundId
backgroundFile
logoId
logoFile
fillerId
fillerSet
fontId
fontPreset
messageAudioId
messageAudioFile
fillersEnabled
audioEnabled
showLogo
movingOverlay
flicker
prefixLines
suffixLines
fillerLineCount
fillerBandLines
messageColor
prefixColor
suffixColor
msgFontSize
prefixFontSize
suffixFontSize
pingUrl
nonce
ts
```

Expected `type` values include:

| Type | Meaning |
| --- | --- |
| `message` | Render a normal message. |
| `ping` | Play attention sound without changing message text. |
| `clear` | Clear visible message text. |

A `nonce` or timestamp-like field helps force listeners to react even when values are otherwise similar.

---

## 7. GM panel responsibilities

The GM panel is responsible for:

- loading local selectable data from `assets/data/data.json`,
- rendering selectors for backgrounds, logos, fonts, fillers, and audio,
- maintaining current UI state,
- previewing message content and background layout,
- publishing the current payload to Firestore,
- playing or triggering ping behavior,
- importing `DataSlate_manifest.xlsx` into refreshed local JSON,
- restoring default settings,
- handling missing assets and invalid selections.

---

## 8. Player screen responsibilities

The player screen is responsible for:

- subscribing to `dataslate/current`,
- reading the full current payload,
- applying background and visual settings,
- applying selected font and color values,
- rendering prefix, message, suffix, and filler layers,
- applying shadow rectangle / overlay / flicker settings,
- showing or hiding logos,
- playing audio if enabled and allowed by the browser,
- using safe fallback behavior when assets are missing.

---

## 9. Data import from XLSX

Source workbook:

```text
DataSlate/assets/data/DataSlate_manifest.xlsx
```

Generated data target:

```text
DataSlate/assets/data/data.json
```

Expected workflow:

1. Open the GM panel.
2. Use **Update data from XLSX**.
3. Select/read the DataSlate manifest workbook.
4. Generate refreshed JSON data.
5. Save or place the generated output as `assets/data/data.json`.
6. Reload the GM panel and verify options.

The data import should update selectable backgrounds, logos, fonts, audio, and other manifest-driven lists without manual JSON editing.

---

## 10. Blue-frame maintenance workflow

DataSlate includes technical background variants with visible blue frames.

Important paths:

```text
DataSlate/assets/ramki/
DataSlate/assets/data/NiebieskaRamka.md
DataSlate/assets/data/Mapowanie.xlsx
```

Purpose:

- `assets/backgrounds/` contains final backgrounds displayed to players.
- `assets/ramki/` contains matching technical images with blue rectangles/frames.
- `Mapowanie.xlsx` maps each blue-frame image to the matching final background.
- `NiebieskaRamka.md` explains how to calculate a normalized safe text rectangle.

The blue-frame files are not final player backgrounds. They are maintenance/reference files used to calculate the safe area where message text should appear.

When adding a background:

1. Add the final background to `DataSlate/assets/backgrounds/`.
2. Add the matching blue-frame technical image to `DataSlate/assets/ramki/`.
3. Update `DataSlate/assets/data/Mapowanie.xlsx`.
4. Calculate the normalized content rectangle according to `DataSlate/assets/data/NiebieskaRamka.md`.
5. Update the code/data structure that maps the background ID to the content rectangle.
6. Verify that the GM payload background ID matches the same background entry.
7. Test on the player screen.

The `.md` instruction file must be English-only. The `.xlsx` mapping workbook may remain as currently structured.

---

## 11. Logo color behavior

The GM panel includes a Logo color control.

Expected behavior:

- default color is gold `#d4af37`,
- HEX input and color picker control the same value,
- preset chips update the logo color only,
- black preset `#000000` is available,
- disabling Logo disables or visually mutes logo color controls,
- the GM preview updates immediately,
- the player screen updates after sending the payload,
- decorative logos render as PNG masks without text-image fallback.

---

## 12. Audio behavior

DataSlate audio uses local files.

Important behavior:

- Ping uses `DataSlate/assets/audios/ping/Ping.mp3`.
- Message audio uses the selected message audio file from local assets/data.
- Browsers may block audio until the user interacts with the page.
- The Audio toggle controls whether message audio should play.
- The player screen should degrade gracefully if audio cannot play.

---

## 13. Styling and layout

The player screen renders:

- full-screen background image,
- optional frame/overlay layers,
- optional logo,
- prefix lines,
- message text,
- suffix lines,
- filler lines,
- optional shadow rectangle,
- flicker/moving effects where enabled.

The GM preview should help validate readability before publication.

When changing layout:

1. Test on the target projector/display.
2. Test narrow/mobile dimensions.
3. Test long and short messages.
4. Test backgrounds with different safe text rectangles.
5. Test with logo enabled and disabled.
6. Test with fillers enabled and disabled.

---

## 14. Adding another language version

If DataSlate receives another UI language, update:

- GM panel labels,
- player-screen static text,
- status messages,
- error messages,
- button labels,
- preview mode labels,
- Firebase setup guide,
- user documentation,
- test/backup pages if they remain user-visible.

If manifest data contains display labels, update the manifest/import logic as well.

---

## 15. Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Firestore sync | Open GM and player screens, send a message. | Player screen updates immediately. |
| Clear message | Send text, then clear. | Player screen clears message text. |
| Ping | Click Ping. | Ping sound plays if browser audio policy allows it. |
| Background selection | Select different backgrounds and send. | Player screen changes background. |
| Logo selection | Enable logo, select logo/color, send. | Player screen shows selected logo/color. |
| Logo disabled | Disable logo and send. | Player screen hides logo. |
| Fillers | Enable fillers and send. | Filler lines render around the message. |
| Audio toggle | Enable/disable audio and send audio message. | Audio behavior follows toggle/browser policy. |
| Restore defaults | Change many controls, restore defaults, send. | GM panel and player output return to default style. |
| Data import | Update data from XLSX and reload. | New selectable options appear. |
| Blue-frame safe area | Add/test a background with calculated rectangle. | Text appears inside the intended safe area. |
| Test views | Use `GM_test.html` and `DataSlate_test.html`. | Helper pair can test modifications without changing production flow. |

---

## 16. Rebuild checklist

To rebuild or copy DataSlate:

1. Keep production files: `index.html`, `GM.html`, `DataSlate.html`.
2. Keep helper/reference files if users need them: `GM_test.html`, `DataSlate_test.html`, `GM_backup.html`, `DataSlate_backup.html`.
3. Keep local assets under `assets/`.
4. Keep `assets/data/data.json`.
5. Keep `assets/data/DataSlate_manifest.xlsx` if data import is required.
6. Keep blue-frame maintenance files if background maintenance is required.
7. Configure `DataSlate/config/firebase-config.js`.
8. Enable Firestore.
9. Verify rules for the intended group.
10. Open GM and player screens.
11. Send a test message.
12. Test ping, audio, background, logo, fillers, and clear behavior.

---

## 17. Known release notes

- DataSlate uses Firestore, not Realtime Database.
- DataSlate uses local assets, not Firebase Storage.
- The blue-frame files are maintenance helpers, not player-facing backgrounds.
- `Mapowanie.xlsx` may remain in its current structure.
- `NiebieskaRamka.md` must be English-only.
- Each group should use isolated Firebase configuration to avoid cross-group message leaks.
