# Firebase setup — Audio

This guide explains how to configure Firebase for the Audio module.

Audio uses Cloud Firestore to synchronize shared favorites, aliases, and main-view settings. It does not use Realtime Database or Firebase Storage in the release setup.

---

## Firebase services used

| Service | Used | Purpose |
| --- | --- | --- |
| Cloud Firestore | yes | Stores shared Audio settings at `audio/favorites`. |
| Firebase Authentication | optional | Only needed if your Firestore rules require signed-in users. |
| Realtime Database | no | Not used by Audio. |
| Storage | no | Not used by the release Audio module. |

---

## Required repository files

| File | Purpose |
| --- | --- |
| `Audio/config/firebase-config.js` | Firebase Web SDK config for Audio shared settings. |
| `Audio/index.html` | Reads/writes Firestore settings and renders Audio UI. |
| `Audio/AudioManifest.xlsx` | Source manifest for audio records. |

Do not commit passwords, private keys, service account files, tokens, or production secrets.

---

## Firestore path

Current document:

```text
audio/favorites
```

Structure:

```text
audio (collection)
└── favorites (document)
```

Firestore creates the `audio` collection and `favorites` document automatically on the first successful write. You do not need to manually create the document first.

The Firestore service itself must still be enabled manually in Firebase Console, and rules must allow the intended read/write access.

---

## Expected document shape

The `audio/favorites` document stores shared Audio settings.

Expected structure:

```text
audio (collection)
└── favorites (document)
    ├── updatedAt
    ├── aliases
    │   └── <itemId> -> <aliasText>
    ├── mainView
    │   └── itemIds
    └── favorites
        └── lists
            └── [0..n]
                ├── id
                ├── name
                ├── itemIds
                └── createdAt
```

---

## Step 1 — Create or open a Firebase project

1. Open Firebase Console.
2. Click **Add project** or open an existing project.
3. Enter the project name.
4. Continue through the project wizard.
5. Configure Analytics according to your group's needs.
6. Finish project creation.
7. Open the project overview.

---

## Step 2 — Add a Web App

1. In the Firebase project overview, click the Web icon (`</>`).
2. Enter an app nickname, for example `WnG Tools Audio`.
3. Register the app.
4. Copy the `firebaseConfig` object.
5. Paste the public Web SDK values into `Audio/config/firebase-config.js`.

Example shape:

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

`databaseURL` is not required for Audio because it does not use Realtime Database.

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

A minimal authenticated-user rule for Audio shared settings may look like this:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /audio/favorites {
      allow read, write: if request.auth != null;
    }
  }
}
```

If the release copy uses unauthenticated local/private hosting, document that choice and restrict deployment access appropriately. Do not use open public write rules in a real public deployment.

---

## Step 5 — First write creates the document

After Firestore is enabled and rules are set:

1. Open `Audio/index.html?admin=1`.
2. Load the manifest.
3. Create a test favorites list.
4. Add one sound to the list.
5. Refresh the page.
6. Verify that the list remains.
7. Open Firebase Console.
8. Open **Firestore Database**.
9. Verify that collection `audio` exists.
10. Verify that document `favorites` exists.

No Node.js initialization script is required for the normal release flow. The first successful app write can create the document.

---

## Local storage fallback

If Firestore is not configured or access is denied, Audio may store settings in local browser storage.

Fallback key:

```text
audio.settings
```

Fallback behavior:

- settings remain only in the current browser/device,
- settings are not shared between devices,
- clearing browser storage may remove them,
- the UI should show that shared persistence is unavailable.

---

## Copying Audio for another group

If another group uses the module:

1. Create or select a separate Firebase project, or use a clearly separate Firestore path.
2. Replace `Audio/config/firebase-config.js` with that group's Web SDK config.
3. Verify rules.
4. Open `Audio/index.html?admin=1`.
5. Load `AudioManifest.xlsx`.
6. Create a test list.
7. Refresh and confirm the list persists.

This prevents one group from overwriting another group's lists and aliases.

---

## Common errors

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| Favorites do not persist after refresh. | Firestore is missing, config is missing, or rules block writes. | Configure Firestore and publish rules. |
| Firestore permission denied. | Rules do not allow read/write for `audio/favorites`. | Update rules for the intended access model. |
| `audio` collection is missing. | No successful write has happened yet. | Create a test favorites list in admin mode. |
| Lists persist only locally. | Local storage fallback is active. | Fix Firestore config/rules. |
| Another group sees your lists. | Shared Firebase project/path. | Use a separate config or path. |
| Audio manifest loads but settings do not sync. | Manifest loading works locally, but Firestore setup is incomplete. | Check Firebase config and Firestore rules. |

---

## Security notes

- Do not commit service account files.
- Do not commit private keys.
- Do not commit production tokens.
- Do not use open Firestore rules for public deployments.
- Audio does not require Realtime Database.
- Audio does not require Firebase Storage.
