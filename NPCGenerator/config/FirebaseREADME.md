# 🇵🇱 Instrukcja Firebase dla modułu `NPCGenerator` (PL)

## Cel
Dokument zawiera pełny skrypt Node.js tworzący strukturę Firestore używaną przez ulubione profile NPC.

## 1) Konfiguracja `config/firebase-config.js`
Utwórz własny projekt Firebase i bazę Firestore dla grupy. Skopiuj wartości web config z Firebase Console i zastąp nimi angielskie placeholdery w `NPCGenerator/config/firebase-config.js` jako `window.firebaseConfig`. Nie zapisuj haseł, tokenów ani plików kont usługowych w repozytorium.

Ten plik obsługuje Firestore ulubionych NPC. Dane DataVault używane przez `NPCGenerator` są konfigurowane osobno we wspólnym pliku `shared/firebase-config.js`.

## 2) Struktura Firestore (drzewko + typy)
```text
generatorNpc (kolekcja)
└── favorites (dokument)
    ├── updatedAt (timestamp serwera Firestore)
    └── favorites (tablica obiektów)
        └── [0..n] (obiekt)
            ├── id (string)
            ├── alias (string)
            ├── createdAt (number, timestamp z Date.now())
            └── payload (mapa / obiekt)
                ├── selectedBestiaryIndex (number)
                ├── bestiaryName (string)
                ├── bestiaryOverrides (mapa / obiekt)
                │   ├── numeric (mapa wartości nadpisanych)
                │   └── skills (string albo null)
                ├── notes (string)
                ├── modules (mapa / obiekt)
                │   ├── weaponIds (tablica numberów)
                │   ├── armorIds (tablica numberów)
                │   ├── augmentationsIds (tablica numberów)
                │   ├── equipmentIds (tablica numberów)
                │   ├── talentsIds (tablica numberów)
                │   ├── psionicsIds (tablica numberów)
                │   └── prayersIds (tablica numberów)
                └── toggles (mapa / obiekt)
                    ├── moduleVisibility (mapa booleanów)
                    ├── traitDescriptions (mapa booleanów)
                    └── fullDetails (mapa booleanów)
```

## 3) Pełny skrypt Node.js (do skopiowania)
Zapisz jako `NPCGenerator/config/init-firestore-structure.js`:

```js
const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("[ERR] Ustaw GOOGLE_APPLICATION_CREDENTIALS na ścieżkę do klucza konta serwisowego.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

const payload = {
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  favorites: []
};

async function main() {
  await db.collection("generatorNpc").doc("favorites").set(payload, { merge: true });
  console.log("[OK] Utworzono / zaktualizowano dokument generatorNpc/favorites");
}

main().catch((err) => {
  console.error("[ERR] Błąd inicjalizacji:", err);
  process.exit(1);
});
```

## 4) Uruchomienie
```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/pełna/ścieżka/do/service-account.json"
node NPCGenerator/config/init-firestore-structure.js
```

---

# 🇬🇧 Firebase guide for `NPCGenerator` module (EN)

## Purpose
This file provides a full Node.js script that creates the Firestore structure for NPC favorites.

## 1) `config/firebase-config.js`
Create your own Firebase project and Firestore database for the group. Copy Firebase Web config values and replace the English placeholders in `NPCGenerator/config/firebase-config.js` as `window.firebaseConfig`. Do not store passwords, tokens, or service-account files in the repository.

This file configures NPC favorites Firestore. DataVault data used by `NPCGenerator` is configured separately in the shared `shared/firebase-config.js` file.

## 2) Firestore structure (tree + types)
```text
generatorNpc (collection)
└── favorites (document)
    ├── updatedAt (Firestore server timestamp)
    └── favorites (array of objects)
        └── [0..n] (object)
            ├── id (string)
            ├── alias (string)
            ├── createdAt (number, Date.now() timestamp)
            └── payload (map/object)
                ├── selectedBestiaryIndex (number)
                ├── bestiaryName (string)
                ├── bestiaryOverrides (map/object)
                │   ├── numeric (map of overridden values)
                │   └── skills (string or null)
                ├── notes (string)
                ├── modules (map/object)
                │   ├── weaponIds (array of numbers)
                │   ├── armorIds (array of numbers)
                │   ├── augmentationsIds (array of numbers)
                │   ├── equipmentIds (array of numbers)
                │   ├── talentsIds (array of numbers)
                │   ├── psionicsIds (array of numbers)
                │   └── prayersIds (array of numbers)
                └── toggles (map/object)
                    ├── moduleVisibility (map of booleans)
                    ├── traitDescriptions (map of booleans)
                    └── fullDetails (map of booleans)
```

## 3) Full Node.js script (copy-paste)
Save as `NPCGenerator/config/init-firestore-structure.js`:

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
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  favorites: []
};

async function main() {
  await db.collection("generatorNpc").doc("favorites").set(payload, { merge: true });
  console.log("[OK] Created / updated generatorNpc/favorites");
}

main().catch((err) => {
  console.error("[ERR] Initialization failed:", err);
  process.exit(1);
});
```

## 4) Run
```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS="/full/path/to/service-account.json"
node NPCGenerator/config/init-firestore-structure.js
```
