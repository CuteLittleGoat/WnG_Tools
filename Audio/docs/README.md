# User guide — Audio

The Audio module lets you quickly play sound effects during sessions. It supports a normal playback view and an extended admin view for managing sound lists, aliases, favorites, and ordering.

This is a user-facing guide. Technical details belong in `Audio/docs/Documentation.md`. Firebase setup belongs in `Audio/config/FirebaseREADME.md`.

---

## How to open the module

| Mode | Entry point | Purpose |
| --- | --- | --- |
| User playback mode | `Audio/index.html` | Play sounds and loops during a session. |
| Admin mode | `Audio/index.html?admin=1` | Manage manifest data, aliases, favorites lists, and ordering. |

The release starts in English. Polish may remain available in the language selector where the module still supports it.

---

## What you see in user mode

User mode shows:

- a sound grid with playable SFX tiles,
- a navigation panel with main view and favorites lists,
- per-sound volume sliders,
- loop controls,
- sound names, tags, and optional aliases.

---

## How to play sounds

1. Open `Audio/index.html`.
2. In navigation, click **Main view** or a selected favorites list.
3. Click a sound name to start playback.
4. Click the same sound again to stop it.
5. Click **Loop** to start that sound in loop mode.
6. Click the red active **Loop** button again to stop loop mode.
7. Use the tile volume slider to adjust that sound.
8. Multiple sounds can play at the same time.

Loop behavior:

- if a sound has grouped variants, each new loop iteration may pick a random variant,
- the same URL is avoided twice in a row when another option exists,
- loop playback reads the current slider volume on later iterations.

---

## Sound tile elements

| Element | Meaning |
| --- | --- |
| Sound name | Main play/stop button. |
| Tag below name | Source group/folder hint. |
| Alias in parentheses | Extra custom label if one is set. |
| Loop | Loop switch. Normal green means off; red means active. |
| Volume slider | Per-sound volume control. |

---

## Production manifest

The tracked production manifest is:

```text
Audio/AudioManifest.xlsx
```

It is a neutral public manifest included with the release package. Its example records use neutral URLs and can be replaced with your own sound links without changing the workbook structure.

---

## Admin mode workflow

Open:

```text
Audio/index.html?admin=1
```

Typical workflow:

1. Click **Load manifest** to load the SFX database.
2. Use tag filters to narrow visible sounds.
3. Use search to find a sound by name fragment.
4. Click **New favorites list** to create a list.
5. On a sound tile, choose a destination list.
6. Click **Add to list**.
7. Reorder lists if needed.
8. Rename lists if needed.
9. Reorder items inside a list.
10. Test playback before the session.

---

## Special admin actions

| Button / element | What it does |
| --- | --- |
| **Clear all aliases** | Removes all aliases at once after confirmation. |
| **Play / Stop** | Quick preview from the admin panel. |
| **Clear** | Clears one sound alias. |
| **Loop** | Not displayed in admin mode; loop is available in normal user view. |

---

## Firebase behavior

Audio uses Firestore for shared lists and settings.

| Firebase service | Purpose |
| --- | --- |
| Cloud Firestore | Shared favorites/lists/settings across devices. |
| Firebase Authentication | Optional, depending on your rules. |
| Realtime Database | Not used by Audio. |
| Storage | Not used by the release Audio module. |

Without Firebase, settings and lists are local to one device/browser.

Setup instructions belong in:

```text
Audio/config/FirebaseREADME.md
```

---

## Copying the module for a new group

Before first use in another group:

1. Configure that group's Firebase project if shared lists are needed.
2. Replace `Audio/config/firebase-config.js` with that group's Web SDK config.
3. Open `Audio/index.html?admin=1`.
4. Verify that Firebase status points to the intended project.
5. Create a test list.
6. Refresh the page and verify the list persists.

Separate configurations prevent groups from overwriting one another's lists and views.

---

## Session best practices

- Prepare one main list and a few scene-based lists before play.
- Use aliases for sounds with unclear filenames.
- Pre-check key sound volumes before the session starts.
- Use **Loop** for ambient backgrounds.
- Use one-shot playback for short effects.
- Avoid changing manifest structure during a live session.

---

## Adding another language version

If another UI language is added, update and test:

- translation dictionaries,
- language selector options,
- static text not controlled by translations,
- admin labels and messages,
- user playback labels and messages,
- confirmation dialogs,
- error/status messages,
- documentation.

---

## Common problems

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| Sound does not play. | Browser audio policy, missing URL, invalid link, or muted system audio. | Interact with the page, check volume, and verify the sound URL. |
| Loop does not stop. | Active loop button not clicked or sound still finishing current iteration. | Click the red Loop button and wait for current playback to stop. |
| Favorites list disappears after refresh. | Firebase is not configured or local storage was cleared. | Configure Firestore and test persistence. |
| Another group sees your lists. | Shared Firebase project/path. | Use a separate Firebase config. |
| Manifest does not load. | `AudioManifest.xlsx` missing or malformed. | Verify the manifest file and workbook structure. |
| Aliases are missing. | Local/Firebase state was reset. | Restore from backup or recreate aliases. |

---

## Related documentation

| File | Purpose |
| --- | --- |
| `Audio/docs/Documentation.md` | Technical architecture and maintenance guide. |
| `Audio/config/FirebaseREADME.md` | Firebase setup guide. |
| `docs-standard.md` | Repository documentation standard. |
