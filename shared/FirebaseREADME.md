# 🇵🇱 Instrukcja Firebase dla folderu `shared/` (PL)

## Cel
Ten dokument dotyczy wyłącznie wspólnego źródła prywatnych danych DataVault używanego przez moduły korzystające z `shared/firebase-data-loader.js`. Nie opisuje Firestore dla ulubionych NPCGenerator ani Firestore dla modułu Audio.

Ten plik zawiera pełny skrypt Node.js tworzący strukturę **Realtime Database** wymaganą przez wspólny loader danych (`shared/firebase-data-loader.js`). Loader runtime nadal czyta `DATA_PATH = "datavault/live"`.

## 1) Konfiguracja `shared/firebase-config.js`
Utwórz własny projekt Firebase dla grupy i zastąp angielskie placeholdery w tym pliku własnymi wartościami:
- `window.WG_FIREBASE_CONFIG` (web config Firebase),
- `window.WG_DATA_ACCESS_EMAIL` (email użytkownika technicznego z Firebase Authentication).

`DataVault` i `NPCGenerator` używają tej wspólnej konfiguracji do odczytu danych przez `shared/firebase-data-loader.js`. Nie zapisuj hasła użytkownika technicznego w repozytorium — użytkownik wpisuje je podczas logowania w aplikacji.

## 2) Struktura Realtime Database (drzewko + typy)
```text
root
└── datavault (obiekt)
    └── live (obiekt)
        ├── schemaVersion (string) = "datavault-firebase-import-v1"
        ├── createdAt (string, ISO datetime)
        ├── source (string)
        └── dataJson (string, pełny JSON zapisany jako tekst)
```

## 3) Root-ready import z DataVault
`DataVault` generuje `firebase-import.json` jako plik root-ready, czyli przeznaczony do importu z poziomu root Firebase Realtime Database (`/`). Plik ma zewnętrzne drzewo `datavault.live`, a właściwy payload znajduje się pod `/datavault/live` i zawiera `schemaVersion`, `createdAt`, `source` oraz `dataJson`.

Poprawny import:
1. Otwórz Firebase Realtime Database.
2. Przejdź do root bazy (`/`).
3. Zaimportuj `firebase-import.json`.
4. Sprawdź, że powstało `/datavault/live`.
5. Nie importuj tego pliku będąc już w `/datavault/live`.

`dataJson` pozostaje stringiem JSON, a `schemaVersion` payloadu pozostaje `datavault-firebase-import-v1`. `data.json` z DataVault jest backupem / artefaktem pomocniczym. Jeśli zaimportujesz nowy root-ready plik bezpośrednio do `/datavault/live`, powstanie błędne podwójne zagnieżdżenie `/datavault/live/datavault/live`.

## 4) Pełny skrypt Node.js (do skopiowania)
Zapisz jako `shared/init-rtdb-datavault-live.js`:

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Ustaw GOOGLE_APPLICATION_CREDENTIALS na ścieżkę do pliku JSON konta serwisowego.");
  process.exit(1);
}

if (!process.env.FIREBASE_DATABASE_URL) {
  console.error("[ERR] Ustaw FIREBASE_DATABASE_URL, np. https://twoj-projekt-default-rtdb.europe-west1.firebasedatabase.app");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

const payload = {
  schemaVersion: "datavault-firebase-import-v1",
  createdAt: new Date().toISOString(),
  source: "node-bootstrap",
  dataJson: JSON.stringify({
    meta: {
      note: "Wstaw tutaj docelowe dane DataVault jako JSON."
    }
  })
};

async function main() {
  await db.ref("datavault/live").set(payload);
  console.log("[OK] Utworzono / zaktualizowano ścieżkę datavault/live w Realtime Database");
}

main().catch((err) => {
  console.error("[ERR] Błąd inicjalizacji:", err);
  process.exit(1);
});
```

## 5) Uruchomienie skryptu
```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/pełna/ścieżka/do/service-account.json"
export FIREBASE_DATABASE_URL="https://twoj-projekt-default-rtdb.REGION.firebasedatabase.app"
node shared/init-rtdb-datavault-live.js
```

## 6) Ważne uwagi zgodności
- `dataJson` musi być **stringiem JSON**, nie surowym obiektem.
- `schemaVersion` musi mieć wartość `datavault-firebase-import-v1`.
- Jeśli używasz eksportu z DataVault, standardowo importuj cały root-ready `firebase-import.json` z poziomu root bazy (`/`). Nie wklejaj całego root-ready eksportu jako wartość `dataJson`; `dataJson` to wewnętrzny string payloadu pod `/datavault/live`.

---

# 🇬🇧 Firebase guide for `shared/` folder (EN)

## Purpose
This document applies only to the shared private DataVault data source used by modules that rely on `shared/firebase-data-loader.js`. It does not describe NPCGenerator favorites Firestore or Audio module Firestore.

This file includes a full Node.js script that creates the **Realtime Database** structure required by the shared data loader. The runtime loader still reads `DATA_PATH = "datavault/live"`.

## 1) `shared/firebase-config.js`
Create your own Firebase project for the group and replace the English placeholders in this file with your own values:
- `window.WG_FIREBASE_CONFIG` (Firebase web config),
- `window.WG_DATA_ACCESS_EMAIL` (technical user email from Firebase Authentication).

`DataVault` and `NPCGenerator` use this shared config to read data through `shared/firebase-data-loader.js`. Do not store the technical user's password in the repository — the user enters it when signing in through the app.

## 2) Realtime Database structure (tree + field types)
```text
root
└── datavault (object)
    └── live (object)
        ├── schemaVersion (string) = "datavault-firebase-import-v1"
        ├── createdAt (string, ISO datetime)
        ├── source (string)
        └── dataJson (string, full JSON serialized as text)
```

## 3) Root-ready import from DataVault
`DataVault` generates `firebase-import.json` as a root-ready file, meaning it is meant to be imported from the Firebase Realtime Database root (`/`). The file has the outer `datavault.live` tree, and the actual payload lands under `/datavault/live` with `schemaVersion`, `createdAt`, `source`, and `dataJson`.

Correct import:
1. Open Firebase Realtime Database.
2. Go to the database root (`/`).
3. Import `firebase-import.json`.
4. Verify that `/datavault/live` exists.
5. Do not import this file while already inside `/datavault/live`.

`dataJson` remains a JSON string, and the payload `schemaVersion` remains `datavault-firebase-import-v1`. DataVault `data.json` is a backup / helper artifact. If you import the new root-ready file directly into `/datavault/live`, it creates the invalid nested path `/datavault/live/datavault/live`.

## 4) Full Node.js script (copy-paste)
Save as `shared/init-rtdb-datavault-live.js`:

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.");
  process.exit(1);
}

if (!process.env.FIREBASE_DATABASE_URL) {
  console.error("[ERR] Set FIREBASE_DATABASE_URL, e.g. https://your-project-default-rtdb.europe-west1.firebasedatabase.app");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

const payload = {
  schemaVersion: "datavault-firebase-import-v1",
  createdAt: new Date().toISOString(),
  source: "node-bootstrap",
  dataJson: JSON.stringify({
    meta: { note: "Put the final DataVault JSON payload here." }
  })
};

async function main() {
  await db.ref("datavault/live").set(payload);
  console.log("[OK] Created / updated datavault/live in Realtime Database");
}

main().catch((err) => {
  console.error("[ERR] Initialization failed:", err);
  process.exit(1);
});
```

## 5) How to run
```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/full/path/to/service-account.json"
export FIREBASE_DATABASE_URL="https://your-project-default-rtdb.REGION.firebasedatabase.app"
node shared/init-rtdb-datavault-live.js
```

## 6) Compatibility notes
- `dataJson` must be a **JSON string**, not a raw object.
- `schemaVersion` must be `datavault-firebase-import-v1`.
- If you use DataVault export, normally import the whole root-ready `firebase-import.json` from the database root (`/`). Do not paste the whole root-ready export as the `dataJson` value; `dataJson` is the inner payload string under `/datavault/live`.
