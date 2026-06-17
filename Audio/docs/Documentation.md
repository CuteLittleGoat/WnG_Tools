# Technical documentation — Audio

Audio is a browser-based soundboard module. It has a normal user playback view and an admin view enabled with `?admin=1`. It loads sound metadata from `AudioManifest.xlsx`, renders sound tiles, manages aliases and lists, and can synchronize shared settings through Firestore.

This document is English-only and describes the current release architecture.

---

## 1. Module purpose

Audio is responsible for:

- loading the release sound manifest,
- rendering sound tiles,
- playing and stopping sounds,
- supporting loop playback in user mode,
- providing per-sound volume sliders,
- filtering by tags in admin mode,
- searching sounds in admin mode,
- managing aliases,
- creating and ordering favorites lists,
- managing the main view order,
- saving shared settings through Firestore when configured,
- falling back to local browser storage when Firebase is unavailable.

---

## 2. Entry points and files

| File | Role |
| --- | --- |
| `Audio/index.html` | Main single-page Audio module. User mode by default, admin mode with `?admin=1`. |
| `Audio/AudioManifest.xlsx` | Production release sound manifest. |
| `Audio/config/firebase-config.js` | Firebase Web SDK config for shared settings. |
| `Audio/config/FirebaseREADME.md` | Firebase setup guide. |
| `Audio/docs/README.md` | User guide. |
| `Audio/docs/Documentation.md` | This technical guide. |

---

## 3. Operating modes

### User mode

Open:

```text
Audio/index.html
```

User mode provides playback, loop buttons, volume sliders, the main view, and favorites-list navigation.

### Admin mode

Open:

```text
Audio/index.html?admin=1
```

Admin mode provides manifest loading, tag filters, search, alias editing, favorites list management, item ordering, main view management, and persistence status.

Loop controls are intended for user mode, not for the admin management panel.

---

## 4. Manifest data

The release manifest file is:

```text
Audio/AudioManifest.xlsx
```

Important columns:

```text
NazwaSampla
NazwaPliku
LinkDoFolderu
```

Each manifest row becomes a sound record. Keep the filename and column structure stable unless the parser and documentation are updated together.

---

## 5. Sound tile behavior

A sound tile may display:

- sound name,
- tag or folder hint,
- alias in parentheses,
- file metadata in admin mode,
- play/stop control,
- loop control in user mode,
- volume slider.

Important behavior:

- clicking the sound name toggles playback,
- several sounds may be active at the same time,
- active playback changes the visual state of the tile,
- volume is controlled per tile,
- loop mode starts the selected sound and schedules the next iteration when the current one ends,
- grouped variants may be randomized between loop iterations.

---

## 6. Firebase and persistence

Audio can store shared settings through Firestore.

Expected Firestore path:

```text
audio/favorites
```

The stored document should contain areas such as:

```text
favorites
mainView
aliases
```

Fallback storage:

```text
localStorage key: audio.settings
```

If Firebase is not configured or cannot be accessed, the module should use local browser storage and show that shared persistence is unavailable.

Firebase setup belongs in:

```text
Audio/config/FirebaseREADME.md
```

---

## 7. State model

Important state areas:

| State area | Purpose |
| --- | --- |
| Manifest records | All sounds parsed from `AudioManifest.xlsx`. |
| Filter state | Admin tag filters and search text. |
| Favorites | Named user-created lists. |
| Main view | Ordered list of sounds shown in the main user view. |
| Aliases | Custom labels keyed by sound item. |
| Playback map | Active audio elements and loop state. |
| Firebase status | Whether shared state is available. |

Alias synchronization is important: aliases must be applied after manifest load and after every Firebase/local state refresh.

---

## 8. Admin tag filtering

Admin tag filtering affects only the admin sound list.

Expected behavior:

- tag tree can be collapsed or expanded,
- tag filter popup supports searching tags,
- selected tags narrow the visible admin list,
- filters do not alter source manifest data,
- filters do not change the main view or favorites definitions unless the admin explicitly edits them.

---

## 9. Favorites and main view

| Feature | Purpose |
| --- | --- |
| Main view | Default ordered set of sounds for user mode. |
| Favorites list | Named custom list. |
| Alias | Optional alternate label for one sound. |

Admin mode must support creating, renaming, deleting, ordering, and editing lists and aliases.

---

## 10. External dependencies

Audio may use:

| Dependency | Purpose |
| --- | --- |
| SheetJS / XLSX | Browser-side parsing of `AudioManifest.xlsx`. |
| Firebase Web SDK | Firestore persistence. |
| Font assets | UI typography depending on release setup. |

The module must degrade clearly when Firebase is missing.

---

## 11. Language support

The release starts in English. Polish may remain available in the language selector.

When adding another language, update:

- translation dictionary entries,
- language selector options,
- admin labels,
- user view labels,
- status messages,
- confirmation dialogs,
- Firebase fallback messages,
- user documentation,
- technical documentation.

Test language switching in both user mode and admin mode.

---

## 12. What to update when manifest columns change

If manifest column names change, update:

1. manifest parsing logic in `Audio/index.html`,
2. `Audio/docs/README.md`,
3. this technical documentation,
4. validation and status messages,
5. test manifest data.

Keep `AudioManifest.xlsx` as the expected filename unless code and docs are updated together.

---

## 13. Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| User open | Open `Audio/index.html`. | User playback view appears. |
| Admin open | Open `Audio/index.html?admin=1`. | Admin controls appear. |
| Manifest load | Load `AudioManifest.xlsx`. | Sound records render. |
| Playback | Click a sound. | Sound starts, then stops when clicked again. |
| Multi-playback | Start several sounds. | More than one sound can be active. |
| Loop | Click Loop in user mode. | Loop starts, and a second click stops it. |
| Volume | Move tile slider during playback. | Volume changes for that sound. |
| Alias | Set alias in admin mode. | Alias appears in user and admin views. |
| Clear aliases | Use clear actions. | Aliases are removed as expected. |
| Favorites | Create a list and add sounds. | List appears in user navigation. |
| Reorder | Move lists/items. | Order changes and persists. |
| Firebase persistence | Configure Firestore, create list, refresh. | List persists. |
| Local fallback | Remove Firebase config, create list, refresh same browser. | Local storage fallback works. |
| Language switch | Switch EN/PL/EN. | UI labels update correctly. |

---

## 14. Rebuild checklist

To rebuild or copy Audio:

1. Keep `Audio/index.html`.
2. Keep `Audio/AudioManifest.xlsx` with the expected structure.
3. Keep or replace `Audio/config/firebase-config.js`.
4. Keep documentation files.
5. Configure Firestore if shared lists are required.
6. Test user mode.
7. Test admin mode.
8. Load the manifest.
9. Test playback, loop, volume, aliases, favorites, and persistence.
10. Test language switching.

---

## 15. Known release notes

- Audio uses Firestore for shared state.
- Audio does not use Realtime Database.
- Audio does not use Firebase Storage in the release setup.
- Without Firebase, state is local to the current browser/device.
- `AudioManifest.xlsx` is the current expected manifest filename.
