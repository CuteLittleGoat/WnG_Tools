# 🇵🇱 Instrukcja Firebase dla folderu `shared/` (PL)

## Cel
Ten dokument dotyczy wspólnego źródła prywatnych danych DataVault używanego przez moduły korzystające z `shared/firebase-data-loader.js`, przede wszystkim `DataVault` i `NPCGenerator`.

Wersja DEMO/PREVIEW repozytorium `WnG_Tools` jest podpięta do tego samego projektu Firebase, którego używa `rpg-dataslate-relay`.

## Aktualna konfiguracja DEMO/PREVIEW

`shared/firebase-config.js` ładuje web config Firebase z:

```text
https://cutelittlegoat.github.io/rpg-dataslate-relay/DataSlate/config/firebase-config.js
```

i dopina do niego Realtime Database:

```text
https://rpg-dataslate-relay-default-rtdb.europe-west1.firebasedatabase.app/
```

Dostęp do prywatnych danych DataVault/NPCGenerator używa Firebase Authentication:

```text
Email: youhavebeenrickrolledbyme@gmail.com
Hasło DEMO: 000000
User UID: 9BRwtAfnjMYvE4GINnUmLJ0Z8Tm2
```

To jest świadomie publiczna konfiguracja pokazowa. Nie używać jej do prawdziwych prywatnych danych.

## Struktura Realtime Database

Loader runtime nadal czyta:

```text
datavault/live
```

Oczekiwana struktura:

```text
root
└── datavault
    └── live
        ├── schemaVersion = "datavault-firebase-import-v1"
        ├── createdAt
        ├── source
        └── dataJson
```

`dataJson` musi być stringiem JSON, nie surowym obiektem.

## Import danych DataVault

`DataVault` generuje `firebase-import.json` jako plik root-ready. Poprawny import:

1. Otwórz Firebase Realtime Database.
2. Przejdź do root bazy (`/`).
3. Zaimportuj `firebase-import.json`.
4. Sprawdź, że powstało `/datavault/live`.
5. Nie importuj tego pliku będąc już w `/datavault/live`, bo utworzy błędną ścieżkę `/datavault/live/datavault/live`.

## Reguły RTDB dla aktualnego demo

Obecne demo może działać z regułami wymagającymi zalogowanego użytkownika:

```json
{
  "rules": {
    "datavault": {
      "live": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

Bardziej restrykcyjna wersja dla obecnego technicznego użytkownika:

```json
{
  "rules": {
    "datavault": {
      "live": {
        ".read": "auth != null && auth.uid === '9BRwtAfnjMYvE4GINnUmLJ0Z8Tm2'",
        ".write": "auth != null && auth.uid === '9BRwtAfnjMYvE4GINnUmLJ0Z8Tm2'"
      }
    }
  }
}
```

## Uwagi zgodności

- `schemaVersion` musi mieć wartość `datavault-firebase-import-v1`.
- `DataVault` i `NPCGenerator` używają tej samej nazwanej aplikacji prywatnych danych: `wg-private-data`.
- Zalogowanie w jednym module odblokowuje drugi moduł w tej samej sesji przeglądarki.
- Moduły Firestore korzystające z `window.firebaseConfig` pobierają konfigurację z tego samego źródła preview.

---

# 🇬🇧 Firebase guide for `shared/` folder (EN)

## Purpose
This document covers the shared private DataVault data source used by modules that rely on `shared/firebase-data-loader.js`, mainly `DataVault` and `NPCGenerator`.

The DEMO/PREVIEW version of `WnG_Tools` is connected to the same Firebase project used by `rpg-dataslate-relay`.

## Current DEMO/PREVIEW configuration

`shared/firebase-config.js` loads the Firebase web config from:

```text
https://cutelittlegoat.github.io/rpg-dataslate-relay/DataSlate/config/firebase-config.js
```

and adds this Realtime Database URL:

```text
https://rpg-dataslate-relay-default-rtdb.europe-west1.firebasedatabase.app/
```

Private DataVault/NPCGenerator access uses Firebase Authentication:

```text
Email: youhavebeenrickrolledbyme@gmail.com
DEMO password: 000000
User UID: 9BRwtAfnjMYvE4GINnUmLJ0Z8Tm2
```

This is intentionally public preview configuration. Do not use it for real private data.

## Realtime Database structure

The runtime loader still reads:

```text
datavault/live
```

Expected structure:

```text
root
└── datavault
    └── live
        ├── schemaVersion = "datavault-firebase-import-v1"
        ├── createdAt
        ├── source
        └── dataJson
```

`dataJson` must be a JSON string, not a raw object.

## DataVault import

`DataVault` generates `firebase-import.json` as a root-ready file. Correct import:

1. Open Firebase Realtime Database.
2. Go to the database root (`/`).
3. Import `firebase-import.json`.
4. Verify that `/datavault/live` exists.
5. Do not import this file while already inside `/datavault/live`; that creates the wrong nested path `/datavault/live/datavault/live`.

## RTDB rules for the current demo

The current demo works with rules that require an authenticated user:

```json
{
  "rules": {
    "datavault": {
      "live": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

A stricter version for the current technical user:

```json
{
  "rules": {
    "datavault": {
      "live": {
        ".read": "auth != null && auth.uid === '9BRwtAfnjMYvE4GINnUmLJ0Z8Tm2'",
        ".write": "auth != null && auth.uid === '9BRwtAfnjMYvE4GINnUmLJ0Z8Tm2'"
      }
    }
  }
}
```

## Compatibility notes

- `schemaVersion` must be `datavault-firebase-import-v1`.
- `DataVault` and `NPCGenerator` use the same named private-data app: `wg-private-data`.
- Signing in through one module unlocks the other module in the same browser session.
- Firestore modules that use `window.firebaseConfig` load the same preview Firebase configuration.
