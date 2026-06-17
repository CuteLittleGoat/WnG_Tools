# Firebase setup — DataVault

This guide explains how to configure Firebase for the DataVault module.

DataVault uses Firebase for private data access. The DEMO release can be unlocked with the DEMO password `000000`, but a real deployment must use its own Firebase project, technical user, and private password.

---

## Firebase services used

| Service | Used | Purpose |
| --- | --- | --- |
| Firebase Authentication | yes | Signs in the technical access user through the K.O.Z.A. access gate. |
| Realtime Database | yes | Stores the private DataVault runtime payload under `/datavault/live`. |
| Cloud Firestore | no | Not used by DataVault itself. NPCGenerator may use Firestore for Favorites. |
| Storage | no | Not used by DataVault. |

---

## Required repository files

| File | Purpose |
| --- | --- |
| `shared/firebase-config.js` | Shared Firebase Web SDK config and technical access email used by private data modules. |
| `shared/firebase-data-loader.js` | Shared Authentication and Realtime Database loader. |
| `DataVault/release-admin-overrides.js` | Generates the root-ready `firebase-import.json` payload for `/datavault/live`. |
| `DataVault/SampleFiles/Repository_EN.xlsx` | Current English workbook sample structure. |
| `DataVault/SampleFiles/firebase-import.json` | Example import file for Realtime Database. |

Do not commit passwords, private keys, service account files, tokens, or production secrets.

---

## DEMO access password

The DEMO password is:

```text
000000
```

Use this only for the DEMO setup. In a real Firebase project, create your own technical user and password.

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
2. Enter an app nickname, for example `WnG Tools DataVault`.
3. Register the app.
4. Firebase shows a `firebaseConfig` object.
5. Copy only the public Web SDK values needed by the app.
6. Paste them into the shared config file used by the release.

Required values normally include:

```js
apiKey: "...",
authDomain: "...",
databaseURL: "...",
projectId: "...",
storageBucket: "...",
messagingSenderId: "...",
appId: "..."
```

For DataVault, `databaseURL` is required because the module reads Realtime Database.

Do not paste service account JSON, private keys, passwords, or tokens into the repository.

---

## Step 3 — Configure shared Firebase config

Open:

```text
shared/firebase-config.js
```

The file must define the public Firebase Web SDK config and the technical access email expected by the shared loader.

Use placeholders or your own Firebase values, for example:

```js
window.WG_FIREBASE_CONFIG = {
  apiKey: "INSERT_YOUR_API_KEY",
  authDomain: "INSERT_YOUR_AUTH_DOMAIN",
  databaseURL: "INSERT_YOUR_DATABASE_URL",
  projectId: "INSERT_YOUR_PROJECT_ID",
  storageBucket: "INSERT_YOUR_STORAGE_BUCKET",
  messagingSenderId: "INSERT_YOUR_MESSAGING_SENDER_ID",
  appId: "INSERT_YOUR_APP_ID",
};

window.WG_DATA_ACCESS_EMAIL = "INSERT_YOUR_TECHNICAL_USER_EMAIL";
```

The technical email is not the password. The password is entered by the user in the access gate and is passed to Firebase Authentication.

---

## Step 4 — Enable Firebase Authentication

1. In Firebase Console, open **Build**.
2. Click **Authentication**.
3. Click **Get started** if Authentication has not been enabled yet.
4. Open the **Sign-in method** tab.
5. Click **Email/Password**.
6. Enable **Email/Password**.
7. Save the provider settings.
8. Open the **Users** tab.
9. Click **Add user**.
10. Enter the technical access email used in `window.WG_DATA_ACCESS_EMAIL`.
11. Enter the private access password.
12. For the DEMO setup, the password is `000000`.
13. Save the user.
14. Store production passwords outside the repository.

---

## Step 5 — Create Realtime Database

1. In Firebase Console, open **Build**.
2. Click **Realtime Database**.
3. Click **Create Database**.
4. Select the database location.
5. Continue.
6. Start in locked/production mode unless you are deliberately creating a temporary demo environment.
7. Click **Enable**.
8. Copy the database URL.
9. Paste the database URL into `databaseURL` in `shared/firebase-config.js`.

Realtime Database must exist before DataVault can read `/datavault/live`.

---

## Step 6 — Configure Realtime Database rules

A safe minimal authenticated-read rule for DataVault looks like this:

```json
{
  "rules": {
    "datavault": {
      "live": {
        ".read": "auth != null",
        ".write": false
      }
    }
  }
}
```

This allows signed-in users to read `/datavault/live` and blocks client writes to that path.

If your group wants browser-side write/import automation, document the exact write policy separately and restrict it carefully. Do not use public write rules for production data.

---

## Step 7 — Generate data files

DataVault release data starts from the English workbook:

```text
Repository_EN.xlsx
```

Admin generation workflow:

1. Open `DataVault/index.html?admin=1`.
2. Unlock the access gate.
3. Click **Generate data files**.
4. Select your local `Repository_EN.xlsx` workbook.
5. The module downloads:
   - `data.json`,
   - `firebase-import.json`.
6. Keep `data.json` as a backup/helper file.
7. Use `firebase-import.json` for Realtime Database import.

The generated `firebase-import.json` has this root-ready shape:

```json
{
  "datavault": {
    "live": {
      "schemaVersion": "datavault-firebase-import-v1",
      "createdAt": "...",
      "source": "Repository_EN.xlsx",
      "dataJson": "..."
    }
  }
}
```

---

## Step 8 — Import `firebase-import.json`

1. Open Firebase Console.
2. Open the correct project.
3. Open **Realtime Database**.
4. Open the **Data** tab.
5. Select the database root (`/`).
6. Open the database data actions menu.
7. Choose **Import JSON**.
8. Select `firebase-import.json`.
9. Confirm the import.
10. Verify that the database now contains:

```text
/datavault/live
```

11. Open `/datavault/live`.
12. Verify that it contains:

```text
schemaVersion
createdAt
source
dataJson
```

Do not import `firebase-import.json` while already inside `/datavault/live`, because that creates the wrong nested path:

```text
/datavault/live/datavault/live
```

---

## Automatic path creation

Realtime Database does not use Firestore-style collections. It stores a JSON tree.

When you import `firebase-import.json` from the database root, Firebase creates the needed child nodes automatically:

```text
datavault
└── live
```

You do not need to manually create empty `datavault` or `live` nodes before import.

However, these things are not automatic and must exist first:

- Firebase project,
- Web App config,
- Firebase Authentication,
- Email/Password provider,
- technical user,
- Realtime Database service,
- valid `databaseURL`,
- rules allowing authenticated read access.

---

## Step 9 — Test DataVault connection

1. Open `DataVault/index.html`.
2. Enter the DEMO password `000000` or your configured private password.
3. Click **Begin Rite**.
4. Confirm that the access gate closes.
5. Confirm that the status says private data was loaded.
6. Open several tabs.
7. Check that tables contain data.
8. Click a trait tag if present.
9. Confirm that the tooltip can resolve the trait description when metadata exists.

---

## Step 10 — Test import freshness

After replacing Firebase data:

1. Regenerate `data.json` and `firebase-import.json` from the current `Repository_EN.xlsx`.
2. Import `firebase-import.json` from Realtime Database root (`/`).
3. Reload DataVault.
4. Open `Bestiary`, `Weapons`, `Armour`, `Traits`, `Vehicle Traits`, and `Vehicle Weapons`.
5. Confirm that updated records are visible.
6. Confirm that tooltips work for sample traits such as `Parry`, `Shield`, or `Mounted` if those definitions are present in the data.
7. Open NPCGenerator and confirm that it can load the same private data runtime.

---

## Common errors

| Symptom | Possible cause | Fix |
| --- | --- | --- |
| Password is rejected. | Wrong password, missing technical user, or Email/Password provider disabled. | In DEMO use `000000`. In production verify the technical user and provider. |
| Sign-in succeeds but data does not load. | Realtime Database missing, bad `databaseURL`, missing `/datavault/live`, or rules block reads. | Verify the database URL, import path, and rules. |
| `DATA_NOT_FOUND` or missing data error. | `/datavault/live` does not exist or was imported into the wrong path. | Import `firebase-import.json` from root (`/`). |
| Permission denied. | Rules do not allow authenticated read. | Use authenticated-read rules for `/datavault/live`. |
| Invalid Firebase config. | Missing `apiKey`, `authDomain`, `databaseURL`, or `projectId`. | Copy the correct Web App config values. |
| Data appears under `/datavault/live/datavault/live`. | JSON was imported while already inside `/datavault/live`. | Delete the bad nested branch and re-import from root. |
| Tooltips do not resolve after workbook edits. | JSON metadata is stale or missing trait definitions. | Regenerate files from `Repository_EN.xlsx`, import the new `firebase-import.json`, and verify `_meta`. |
| NPCGenerator cannot load data. | Shared DataVault runtime is missing or inaccessible. | Fix DataVault Firebase runtime first, then reload NPCGenerator. |

---

## Security notes

- Do not commit real passwords.
- Do not commit service account files.
- Do not commit private keys.
- Do not use public write rules for private data.
- The DEMO password `000000` is public demo information only.
- A real group should change the password and protect its Firebase project.
- The public Web SDK config is not a service account secret, but it must still point to the correct project and must not be confused with private credentials.
