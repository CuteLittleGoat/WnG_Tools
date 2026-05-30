# 🇵🇱 Instrukcja Firebase dla modułu `Audio` (PL)

## Cel
Ten plik zawiera kompletny, gotowy do skopiowania skrypt Node.js, który tworzy wymagany dokument Firestore dla modułu `Audio`.

## 1) Konfiguracja Firebase Web (`config/firebase-config.js`)
1. Wejdź do Firebase Console → **Project settings** → **Your apps** → aplikacja Web (`</>`).
2. Skopiuj wartości `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
3. Zastąp angielskie placeholdery w `Audio/config/firebase-config.js` własnymi wartościami jako `window.firebaseConfig`.

Utwórz własny projekt Firebase i bazę Firestore dla grupy. Nie zapisuj haseł, tokenów ani plików kont usługowych w repozytorium. Audio używa Firestore do synchronizacji ulubionych i ustawień.

## 2) Struktura Firestore (drzewko + typy pól)
```text
audio (kolekcja)
└── favorites (dokument)
    ├── updatedAt (string, ISO datetime)
    ├── aliases (mapa / obiekt)
    │   └── <itemId> (string) -> <aliasText> (string)
    ├── mainView (mapa / obiekt)
    │   └── itemIds (tablica stringów)
    │       └── [0..n] (string)
    └── favorites (mapa / obiekt)
        └── lists (tablica obiektów)
            └── [0..n] (obiekt)
                ├── id (string)
                ├── name (string)
                ├── itemIds (tablica stringów)
                │   └── [0..n] (string)
                └── createdAt (string, ISO datetime)
```

## 3) Pełny skrypt Node.js (do skopiowania)
Zapisz poniższy kod jako np. `Audio/config/init-firestore-structure.js`:

```js
/**
 * Audio Firestore initializer
 * Tworzy dokument: audio/favorites
 */

const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Ustaw GOOGLE_APPLICATION_CREDENTIALS na ścieżkę do klucza konta serwisowego JSON.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

const payload = {
  updatedAt: new Date().toISOString(),
  aliases: {},
  mainView: {
    itemIds: []
  },
  favorites: {
    lists: []
  }
};

async function main() {
  const ref = db.collection("audio").doc("favorites");
  await ref.set(payload, { merge: true });
  console.log("[OK] Utworzono / zaktualizowano dokument audio/favorites");
}

main().catch((err) => {
  console.error("[ERR] Błąd inicjalizacji:", err);
  process.exit(1);
});
```

## 4) Jak uruchomić skrypt
1. Przejdź do katalogu repozytorium.
2. Zainstaluj zależność:
   ```bash
   npm i firebase-admin
   ```
3. Ustaw zmienną środowiskową (podaj własną ścieżkę):
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/pełna/ścieżka/do/service-account.json"
   ```
4. Uruchom:
   ```bash
   node Audio/config/init-firestore-structure.js
   ```
5. Otwórz Firestore i sprawdź dokument `audio/favorites`.

---

# 🇬🇧 Firebase guide for `Audio` module (EN)

## Purpose
This file includes a full copy-paste Node.js script that creates the required Firestore document for `Audio`.

## 1) Firebase Web config (`config/firebase-config.js`)
1. Open Firebase Console → **Project settings** → **Your apps** → Web app (`</>`).
2. Copy `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
3. Replace the English placeholders in `Audio/config/firebase-config.js` with your own values as `window.firebaseConfig`.

Create your own Firebase project and Firestore database for the group. Do not store passwords, tokens, or service-account files in the repository. Audio uses Firestore to synchronize favorites and settings.

## 2) Firestore structure (tree + field types)
```text
audio (collection)
└── favorites (document)
    ├── updatedAt (string, ISO datetime)
    ├── aliases (map / object)
    │   └── <itemId> (string) -> <aliasText> (string)
    ├── mainView (map / object)
    │   └── itemIds (array of strings)
    │       └── [0..n] (string)
    └── favorites (map / object)
        └── lists (array of objects)
            └── [0..n] (object)
                ├── id (string)
                ├── name (string)
                ├── itemIds (array of strings)
                │   └── [0..n] (string)
                └── createdAt (string, ISO datetime)
```

## 3) Full Node.js script (copy-paste)
Save as `Audio/config/init-firestore-structure.js`:

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

const payload = {
  updatedAt: new Date().toISOString(),
  aliases: {},
  mainView: { itemIds: [] },
  favorites: { lists: [] }
};

async function main() {
  const ref = db.collection("audio").doc("favorites");
  await ref.set(payload, { merge: true });
  console.log("[OK] Created / updated audio/favorites");
}

main().catch((err) => {
  console.error("[ERR] Initialization failed:", err);
  process.exit(1);
});
```

## 4) How to run
```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/full/path/to/service-account.json"
node Audio/config/init-firestore-structure.js
```
Then verify `audio/favorites` in Firestore.
