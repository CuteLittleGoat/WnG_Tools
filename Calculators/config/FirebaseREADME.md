# Firebase setup — Calculators

This guide explains how to configure Firebase for the Calculators module.

Only the Character Creation tool uses Firebase, and only for save/load. XP Calculator does not need Firebase.

---

## Firebase services used

| Service | Used | Purpose |
| --- | --- | --- |
| Cloud Firestore | yes | Stores Character Creation save/load data. |
| Firebase Authentication | optional | Only needed if your Firestore rules require signed-in users. |
| Realtime Database | no | Not used by Calculators. |
| Storage | no | Not used by Calculators. |

---

## Required repository files

| File | Purpose |
| --- | --- |
| `Calculators/config/firebase-config.js` | Firebase Web SDK config for the module. |
| `Calculators/CharacterCreation.html` | Reads/writes character sheet data. |
| `Calculators/config/FirebaseREADME.md` | This setup guide. |

Do not commit passwords, private keys, service account files, tokens, or production secrets.

---

## Firestore path

Current document:

```text
character_builder/current
```

Structure:

```text
character_builder (collection)
└── current (document)
```

Firestore creates the collection and document automatically on the first successful write. You do not need to manually create them first.

The Firestore service itself must still be enabled manually in Firebase Console, and rules must allow the intended read/write access.

---

## Expected document shape

The saved document may contain fields such as:

```text
schemaVersion
updatedAt
xpPool
xpSpent
xpAvailable
attributes
skills
talents
formSnapshot
```

The exact payload should follow the current `CharacterCreation.html` implementation.

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
2. Enter an app nickname, for example `WnG Tools Calculators`.
3. Register the app.
4. Copy the `firebaseConfig` object.
5. Paste the public Web SDK values into `Calculators/config/firebase-config.js`.

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

`databaseURL` is not required because Calculators do not use Realtime Database.

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

A minimal authenticated-user rule may look like this:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /character_builder/current {
      allow read, write: if request.auth != null;
    }
  }
}
```

If the release copy uses unauthenticated local/private hosting, document that choice and restrict deployment access appropriately. Do not use open public write rules in a real public deployment.

---

## Step 5 — First write creates the document

After Firestore is enabled and rules are set:

1. Open `Calculators/CharacterCreation.html`.
2. Fill a small test sheet.
3. Use the save action.
4. Refresh the page.
5. Use the load action.
6. Open Firebase Console.
7. Open **Firestore Database**.
8. Verify that collection `character_builder` exists.
9. Verify that document `current` exists.

No Node.js initialization script is required for the normal release flow. The first successful app write can create the document.

---

## Common errors

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| Save/load does not work. | Firestore is missing, config is missing, or rules block access. | Configure Firestore and publish rules. |
| Permission denied. | Rules do not allow read/write for `character_builder/current`. | Update rules for the intended access model. |
| Document is missing. | No successful write has happened yet. | Save one test sheet from Character Creation. |
| Data does not persist across devices. | Local-only behavior or wrong Firebase project. | Check config and rules. |
| XP Calculator works but save/load fails. | XP Calculator is local; Character Creation Firebase is separate. | Configure Firestore for Character Creation. |

---

## Security notes

- Do not commit service account files.
- Do not commit private keys.
- Do not commit production tokens.
- Do not use open Firestore rules for public deployments.
- Calculators do not require Realtime Database.
- Calculators do not require Firebase Storage.
