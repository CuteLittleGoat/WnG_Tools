# Technical documentation — Main

Main is the static launcher for WnG Tools. It contains visible module cards, user/admin mode behavior, external links, and small browser-maintenance logic.

This document is English-only and describes the current release architecture.

---

## 1. Module purpose

Main is responsible for:

- presenting module navigation buttons,
- showing the standard user launcher view,
- showing additional admin links when `?admin=1` is present,
- loading external VTT and Images links from a helper file,
- preserving relative links to local modules,
- cleaning stale browser-maintenance state where implemented.

Main does not use Firebase directly.

---

## 2. Files

| File | Role |
| --- | --- |
| `Main/index.html` | Complete launcher implementation with embedded CSS/JS. |
| `Main/ZmienneHiperlacza.md` | External link helper file for VTT and Images. |
| `Main/wrath-glory-logo-warhammer.png` | Visible branding image. |
| `Main/docs/README.md` | User guide. |
| `Main/docs/Documentation.md` | This technical guide. |

Repository-level files such as `manifest.webmanifest` or `service-worker.js` may exist, but Main itself is a static launcher page.

---

## 3. User and admin modes

### User mode

Open:

```text
Main/index.html
```

User mode shows the standard module buttons.

### Admin mode

Open:

```text
Main/index.html?admin=1
```

Admin mode may show additional links, for example:

- NameGenerator,
- NPCGenerator,
- Audio,
- admin-capable module entry points.

Admin mode is controlled by the query string.

---

## 4. Link configuration

External links are configured through:

```text
Main/ZmienneHiperlacza.md
```

Expected placeholders:

```text
INSERT_YOUR_VTT_LINK
INSERT_YOUR_IMAGE_FOLDER_OR_CHANNEL_LINK
```

Expected public keys include:

```text
Map
Images
```

Legacy compatibility may also recognize older labels if the parser still supports them.

No private group links should be committed to the public repository.

---

## 5. Runtime behavior

Main should:

1. Read whether `admin=1` is present.
2. Show or remove admin-only elements.
3. Configure DataVault link appropriately for user/admin mode.
4. Load external VTT/Images links from the helper file.
5. Apply those links to the relevant buttons.
6. Let local module buttons navigate through relative paths.

---

## 6. Styling

Main uses the shared dark terminal visual style:

- dark background,
- black panel,
- green text,
- green borders,
- glow effect,
- responsive grid of buttons,
- monospace font stack.

The logo should declare width and height when possible to reduce layout shift.

---

## 7. Firebase behavior

Main does not use Firebase directly.

Firebase setup belongs to the modules that need it, for example:

```text
DataVault/config/FirebaseREADME.md
NPCGenerator/config/FirebaseREADME.md
Audio/config/FirebaseREADME.md
DataSlate/config/FirebaseREADME.md
Calculators/config/FirebaseREADME.md
```

---

## 8. Copying Main for another deployment

When copying Main:

1. Replace external VTT and Images placeholders.
2. Verify every local module link.
3. Verify every admin-only link.
4. Test with and without `?admin=1`.
5. Click every visible button once.
6. Confirm external links open the intended destinations.

---

## 9. Language support

If another language version is added, update:

- visible module labels,
- static descriptions,
- external-link instructions,
- admin-only notes,
- documentation.

If the page has no language selector, static text must be updated directly or a language mechanism must be added intentionally.

---

## 10. Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| User view | Open `Main/index.html`. | Standard module buttons appear. |
| Admin view | Open `Main/index.html?admin=1`. | Admin-only buttons appear. |
| VTT link | Click VTT. | Configured external destination opens. |
| Images link | Click Images. | Configured external destination opens. |
| DataVault link | Open with and without admin mode. | Correct DataVault route is used. |
| Local modules | Click each local module button. | Correct module opens. |
| Mobile layout | Test narrow viewport. | Button grid remains usable. |

---

## 11. Rebuild checklist

1. Restore `Main/index.html`.
2. Restore logo asset.
3. Restore `ZmienneHiperlacza.md`.
4. Verify user/admin mode logic.
5. Verify local module paths.
6. Replace external placeholders for deployment.
7. Test all buttons.
8. Test narrow viewport.

---

## 12. Known release notes

- Main is a static frontend launcher.
- Main does not use Firebase directly.
- External links must be configured per group or deployment.
- Admin mode is controlled by `?admin=1`.
