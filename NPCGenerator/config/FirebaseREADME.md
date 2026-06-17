# Firebase setup — NPCGenerator

This guide explains how to configure Firebase for NPCGenerator.

NPCGenerator uses Firebase in two separate ways:

1. It uses the shared DataVault Firebase runtime to load source data from Realtime Database.
2. It may use Cloud Firestore to store shared Favorites.

The DEMO data password is:

```text
000000
```

Use this only for the DEMO setup. A real group should configure its own Firebase project and access details.

---

## Firebase services used

| Service | Used | Purpose |
| --- | --- | --- |
| Firebase Authentication | yes | Required by the shared DataVault access gate. |
| Realtime Database | yes | Required for source data loaded from `/datavault/live`. |
| Cloud Firestore | yes, for shared Favorites | Stores the shared Favorites document at `generatorNpc/favorites`. |
| Storage | no | Not used by NPCGenerator. |

---

## Required repository files

| File | Purpose |
| --- | --- |
| `shared/firebase-config.js` | Shared DataVault Firebase config and technical access email. |
| `shared/firebase-data-loader.js` | Shared loader for Authentication and Realtime Database data. |
| `NPCGenerator/config/firebase-config.js` | Module Firebase config for Firestore Favorites. |
| `DataVault/config/FirebaseREADME.md` | DataVault Firebase setup guide. |

Do not commit passwords, private keys, service account files, tokens, or production secrets.

---

## Part A — Configure DataVault runtime first

NPCGenerator depends on DataVault runtime data. Before Favorites are tested, make sure DataVault is configured and working.

Required DataVault runtime path:

```text
/datavault/live
```

Required setup is described in:

```text
DataVault/config/FirebaseREADME.md
```

Minimum DataVault requirements:

1. Firebase project exists.
2. Web App config exists.
3. Firebase Authentication is enabled.
4. Email/Password provider is enabled.
5. A technical access user exists.
6. Realtime Database is enabled.
7. `databaseURL` is present in the shared config.
8. `firebase-import.json` has been imported from Realtime Database root (`/`).
9. `/datavault/live` contains `schemaVersion`, `createdAt`, `source`, and `dataJson`.
10. DataVault opens and loads private data.

NPCGenerator cannot load its source collections until this works.

---

## Part B — Configure NPCGenerator Favorites

Favorites use Cloud Firestore.

Technical path:

```text
generatorNpc/favorites
```

This means:

- `generatorNpc` is the Firestore collection,
- `favorites` is the document,
- the document stores the shared Favorites payload.

Firestore creates the collection and document automatically on the first successful `setDoc` write. You do not need to manually create an empty `generatorNpc` collection or `favorites` document first.

However, the Firestore service itself must be enabled manually in Firebase Console, and rules must allow the intended read/write access.

---

## Step 1 — Open or create the Firebase project

1. Open Firebase Console.
2. Open the same project used by the group, or create a new project.
3. Add a Web App if one does not already exist.
4. Copy the public Web SDK config values.

The same Firebase project may be used for DataVault runtime and NPCGenerator Favorites, but the configuration must still be clear in both modules.

---

## Step 2 — Configure `NPCGenerator/config/firebase-config.js`

Open:

```text
NPCGenerator/config/firebase-config.js
```

The file should expose the Web SDK config for Favorites, for example:

```js
window.firebaseConfig = {
  apiKey: "INSERT_YOUR_API_KEY",
  authDomain: "INSERT_YOUR_AUTH_DOMAIN",
  projectId: "INSERT_YOUR_PROJECT_ID",
  storageBucket: "INSERT_YOUR_STORAGE_BUCKET",
  messagingSenderId: "INSERT_YOUR_MESSAGING_SENDER_ID",
  appId: "INSERT_YOUR_APP_ID",
};
```

This config is used for Firestore Favorites.

The main DataVault runtime is configured separately through:

```text
shared/firebase-config.js
```

---

## Step 3 — Enable Cloud Firestore

1. In Firebase Console, open **Build**.
2. Click **Firestore Database**.
3. Click **Create database**.
4. Choose production mode unless you are deliberately creating a temporary demo environment.
5. Select the region.
6. Click **Enable**.
7. Wait until Firestore is ready.

---

## Step 4 — Configure Firestore rules

A minimal authenticated-user rule for the Favorites document may look like this:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /generatorNpc/favorites {
      allow read, write: if request.auth != null;
    }
  }
}
```

This assumes the app is authenticated before Favorites are used.

If your Favorites app configuration does not share Authentication state with the private-data session, adjust the rules and app setup accordingly. Do not use open public write rules for a real deployment.

---

## Step 5 — First write creates the structure

After Firestore is enabled and rules are published:

1. Open `NPCGenerator/index.html`.
2. Unlock the data gate with the DEMO password `000000` or your configured access password.
3. Select a Bestiary record.
4. Configure any modules you want.
5. Enter an optional Favorites alias.
6. Click **Add to favorites**.
7. Open Firebase Console.
8. Open **Firestore Database**.
9. Verify that collection `generatorNpc` exists.
10. Verify that document `favorites` exists.

You do not need a separate Node.js initialization script for the normal release flow. The first successful app write can create the document.

---

## Favorites document shape

The Firestore document is expected to store a shared Favorites list.

Expected structure:

```text
generatorNpc (collection)
└── favorites (document)
    ├── updatedAt
    └── favorites
        └── [0..n]
            ├── id
            ├── alias
            ├── createdAt
            └── payload
                ├── selectedBestiaryIndex
                ├── bestiaryName
                ├── bestiaryOverrides
                ├── notes
                ├── modules
                └── toggles
```

Important payload areas:

| Field | Meaning |
| --- | --- |
| `selectedBestiaryIndex` | Index of the selected Bestiary record. |
| `bestiaryName` | Human-readable selected Bestiary name. |
| `bestiaryOverrides` | Edited numeric/text values. |
| `notes` | User notes. |
| `modules` | Selected weapon, armor, augmentations, equipment, talents, psionics, and prayers IDs. |
| `toggles` | Module visibility and description toggles. |

---

## Local storage fallback

If Firestore is not configured or access is denied, NPCGenerator may use local storage.

Fallback key:

```text
generatorNpcFavorites
```

Fallback behavior:

- Favorites remain only in the current browser/device.
- Favorites are not shared between devices.
- Clearing browser storage may remove them.

The UI should display an appropriate status message when Firestore is unavailable and local fallback is active.

---

## Connection tests

### Test 1 — DataVault runtime

1. Open DataVault.
2. Unlock it with `000000` or the configured access password.
3. Confirm that data loads.
4. Open NPCGenerator.
5. Unlock it.
6. Confirm that the Bestiary dropdown is populated.

Expected result: NPCGenerator loads source collections from DataVault runtime.

### Test 2 — Firestore Favorites

1. Open NPCGenerator.
2. Select a Bestiary record.
3. Enter a Favorites alias.
4. Click **Add to favorites**.
5. Refresh the page.
6. Click **Refresh** in Favorites.
7. Verify that the Favorite is still present.
8. Check Firebase Console for `generatorNpc/favorites`.

Expected result: Favorite persists through Firestore.

### Test 3 — Local fallback

1. Temporarily remove or disable Firestore config.
2. Open NPCGenerator.
3. Save a Favorite.
4. Refresh the same browser.

Expected result: Favorite remains locally, but it is not shared to other browsers/devices.

---

## Common errors

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| NPCGenerator loads but Bestiary is empty. | DataVault runtime is missing or required sheets are missing. | Fix DataVault Firebase import and verify `/datavault/live`. |
| Access password is rejected. | Authentication setup is missing or the password is wrong. | In DEMO use `000000`; otherwise verify the configured Firebase user. |
| Favorites are local only. | Firestore is missing, config is missing, or rules block access. | Configure Firestore and publish rules. |
| Firestore permission denied. | Rules do not allow the current user to read/write `generatorNpc/favorites`. | Update rules to match the intended authenticated access model. |
| `generatorNpc` collection is missing. | No successful write has happened yet. | Save one Favorite after Firestore is enabled and rules allow writes. |
| Favorites disappear on another device. | Local storage fallback is active instead of Firestore. | Fix Firestore config/rules. |
| DataVault works but Favorites fail. | Realtime Database setup is correct, but Firestore setup is missing. | Configure Firestore separately for NPCGenerator. |

---

## Security notes

- The DEMO password `000000` is public demo information only.
- Do not use public write rules for real Favorites.
- Do not commit real passwords.
- Do not commit service account files.
- Do not commit private keys.
- Do not commit production tokens.
- Use the Firebase Console and rules to restrict access to the intended group.
