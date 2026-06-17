# Testy release — DataVault i NPCGenerator

Ten dokument opisuje możliwie pełny zestaw testów po zmianach związanych z Church of Steel Update, angielskim formatem danych release, aliasami PL jako legacy fallback oraz Firebase DEMO/PREVIEW.

## 1. Testy statyczne repozytorium

Wykonać lokalnie po sklonowaniu repozytorium:

```bash
node --check DataVault/app.js
node --check DataVault/xlsxCanonicalParser.js
node --check DataVault/release-admin-overrides.js
node --check shared/firebase-data-loader.js
python -m json.tool DataVault/SampleFiles/data.json > /tmp/datavault-data.json
python -m json.tool DataVault/SampleFiles/firebase-import.json > /tmp/datavault-firebase-import.json
```

Dla `NPCGenerator/index.html` wyodrębnić zawartość skryptu modułowego do pliku tymczasowego i wykonać `node --check` na tym pliku.

Przykład pomocniczy:

```bash
python - <<'PY'
from pathlib import Path
html = Path('NPCGenerator/index.html').read_text(encoding='utf-8')
start = html.index('<script type="module">') + len('<script type="module">')
end = html.rindex('</script>')
Path('/tmp/npcgenerator-module.mjs').write_text(html[start:end], encoding='utf-8')
PY
node --check /tmp/npcgenerator-module.mjs
```

## 2. Testy wyszukiwania niepożądanych konfiguracji

Obecne Firebase DEMO/PREVIEW jest zgodne z nowymi założeniami i nie jest blockerem release samo w sobie. Nadal trzeba sprawdzić, czy nie pojawiły się prywatne dane inne niż świadomie podpięty demo config.

```bash
rg -n "language-switcher--hidden" DataVault/index.html NPCGenerator/index.html
rg -n "GeneratorNPC" .
rg -n "Vehicle Equipment" DataVault NPCGenerator Analizy
rg -n "Vehicle Wargear" DataVault NPCGenerator Analizy
rg -n "Ekwipunek Pojazdów" DataVault NPCGenerator Analizy
rg -n "youhavebeenrickrolledbyme@gmail.com|rpg-dataslate-relay|databaseURL" shared DataSlate DataVault NPCGenerator Audio Calculators
```

Wynik ostatniego skanu należy interpretować zgodnie z aktualnym założeniem: Firebase DEMO/PREVIEW może istnieć, ale nie może prowadzić do prywatnych danych właściciela.

## 3. Testy sample data

Sprawdzić, czy `DataVault/SampleFiles/data.json` zawiera co najmniej następujące arkusze:

- `Bestiary`
- `Armor` lub `Armour`
- `Weapons`
- `Augmentations` lub `Augmentics`
- `Equipment`
- `Talents`
- `Psionics` lub `Psychic Powers`
- `Prayers`
- `Vehicle Roles`
- `Vehicle Actions`
- `Vehicle Conditions`
- `Vehicle Traits`
- `Vehicles`
- `Vehicle Weapons`
- `Vehicle Wargear`

Sprawdzić, czy `_meta` zawiera:

- `traits`
- `states`
- `vehicleTraits`
- `vehicleWeaponTraits`
- `vehicleStates`
- `sheetOrder`
- `columnOrder`

Przykład pomocniczy:

```bash
python - <<'PY'
import json
from pathlib import Path
p = Path('DataVault/SampleFiles/data.json')
data = json.loads(p.read_text(encoding='utf-8'))
sheets = data.get('sheets', {})
required_groups = {
    'bestiary': ['Bestiary'],
    'armor': ['Armor', 'Armour'],
    'weapons': ['Weapons'],
    'augmentations': ['Augmentations', 'Augmentics'],
    'equipment': ['Equipment'],
    'talents': ['Talents'],
    'psionics': ['Psionics', 'Psychic Powers'],
    'prayers': ['Prayers'],
    'vehicle_roles': ['Vehicle Roles'],
    'vehicle_actions': ['Vehicle Actions'],
    'vehicle_conditions': ['Vehicle Conditions', 'Vehicle States'],
    'vehicle_traits': ['Vehicle Traits'],
    'vehicles': ['Vehicles'],
    'vehicle_weapons': ['Vehicle Weapons'],
    'vehicle_wargear': ['Vehicle Wargear'],
}
missing = [name for name, aliases in required_groups.items() if not any(alias in sheets for alias in aliases)]
meta = data.get('_meta', {})
missing_meta = [key for key in ['traits','states','vehicleTraits','vehicleWeaponTraits','vehicleStates','sheetOrder','columnOrder'] if key not in meta]
print('missing sheets:', missing)
print('missing meta:', missing_meta)
raise SystemExit(1 if missing or missing_meta else 0)
PY
```

## 4. Testy DataVault — start i język

1. Otworzyć `DataVault/index.html`.
2. Potwierdzić, że dokument startuje po angielsku.
3. Potwierdzić, że przełącznik języka jest widoczny.
4. Przełączyć `English` → `Polski` → `English`.
5. Sprawdzić, czy etykiety przycisków, checkboxów i komunikatów zmieniają język.
6. Sprawdzić, że nie występuje klasa `language-switcher--hidden` w aktywnym HTML.

## 5. Testy DataVault — Default View i Full View

1. Załadować dane sample/demo.
2. Kliknąć `Default View`.
3. Kliknąć `Full View`.
4. Porównać liczbę widocznych wierszy i filtrów.
5. Oczekiwany wynik: `Default View` jest identyczny z `Full View`, poza regułami systemowymi takimi jak ukrycie starych wpisów Bestiary, jeżeli checkbox nie jest aktywny.

## 6. Testy DataVault — stare wpisy Bestiary

W trybie gracza:

1. Otworzyć `DataVault/index.html` bez `?admin=1`.
2. Sprawdzić, że checkbox `Show outdated entries?` nie jest widoczny.
3. Otworzyć arkusz `Bestiary`, jeżeli jest dostępny.
4. Sprawdzić, że rekordy `State = old` / `Stan = old` nie są widoczne.

W trybie admina:

1. Otworzyć `DataVault/index.html?admin=1`.
2. Sprawdzić, że checkbox `Show outdated entries?` jest widoczny.
3. Wejść w `Bestiary` / `Bestiariusz`.
4. Przy wyłączonym checkboxie rekordy `old` są ukryte.
5. Po włączeniu checkboxa rekordy `old` są widoczne.
6. Po wyłączeniu checkboxa zaznaczenia ukrytych rekordów są czyszczone.

## 7. Testy DataVault — zakładki pojazdów

1. Otworzyć `DataVault/index.html`.
2. Sprawdzić, że `Vehicle Wargear` nie jest widoczne przy wyłączonym checkboxie pojazdów.
3. Włączyć `Show tabs related to vehicles?`.
4. Sprawdzić, że pojawiają się arkusze:
   - `Vehicle Roles`
   - `Vehicle Actions`
   - `Vehicle Conditions`
   - `Vehicle Traits`
   - `Vehicles`
   - `Vehicle Weapons`
   - `Vehicle Wargear`
5. Sprawdzić, że `Equipment` pozostaje zwykłą zakładką i nie jest sterowany checkboxem pojazdów.
6. Wyłączyć checkbox pojazdów i potwierdzić, że ukrywa tylko arkusze pojazdowe.

## 8. Testy DataVault — generowanie z XLSX EN-first

Przygotować testowy XLSX z angielskimi arkuszami i kolumnami:

- `Traits` z kolumnami `ID`, `Type`, `Name`, `Description`;
- `Conditions` z kolumnami `ID`, `Type`, `Name`, `Description`;
- `Weapons` z kolumnami `ID`, `Type`, `Name`, `Damage`, `AP`, `Range 1`, `Range 2`, `Range 3`, `Trait 1`, `Trait 2`, `Keywords`, `Book`, `Page`;
- `Armor` albo `Armour` z kolumnami `ID`, `Type`, `Name`, `AV`, `Trait 1`, `Trait 2`, `Keywords`, `Book`, `Page`;
- `Vehicle Traits`, `Vehicle Weapons`, `Vehicle Wargear`.

Test:

1. Otworzyć `DataVault/index.html?admin=1`.
2. Kliknąć `Generate data files`.
3. Wybrać przygotowany XLSX.
4. Sprawdzić, że pobierają się `data.json` oraz `firebase-import.json`.
5. Sprawdzić w `data.json`, że:
   - `Trait 1`, `Trait 2` zostały scalone do `Traits`;
   - `Range 1`, `Range 2`, `Range 3` zostały scalone do `Range`;
   - `_meta.traits` zawiera wpisy z `Traits`;
   - `_meta.states` zawiera wpisy z `Conditions`;
   - `_meta.vehicleTraits`, `_meta.vehicleWeaponTraits`, `_meta.vehicleStates` istnieją.
6. Sprawdzić `firebase-import.json`, czy `datavault.live.dataJson` jest stringiem JSON i po parsowaniu odpowiada `data.json`.

## 9. Testy DataVault — fallback PL

Przygotować testowy XLSX z polskimi arkuszami i kolumnami legacy:

- `Cechy`, `Stany`, `Bronie`, `Pancerze`, `Cechy Pojazdów`, `Bronie Pojazdów`, `Ekwipunek Pojazdów`.

Test:

1. Wygenerować `data.json` w adminie.
2. Sprawdzić, że `Cecha 1`, `Cecha 2` scalają się do `Cechy` albo `Traits`, zależnie od danych wejściowych.
3. Sprawdzić, że `Zasięg 1`, `Zasięg 2`, `Zasięg 3` scalają się do jednego pola z wartościami rozdzielonymi ukośnikami.
4. Sprawdzić, że `_meta.traits` i `_meta.states` są uzupełnione.

## 10. Testy NPCGenerator — start i język

1. Otworzyć `NPCGenerator/index.html`.
2. Sprawdzić, że dokument startuje jako `html lang="en"`.
3. Sprawdzić, że przełącznik języka jest widoczny.
4. Przełączyć `English` → `Polski` → `English`.
5. Sprawdzić, że checkbox starych wpisów Bestiary zmienia tekst:
   - EN: `Show outdated entries?`
   - PL: `Czy wyświetlić zdezaktualizowane wpisy?`

## 11. Testy NPCGenerator — wymagane arkusze

Na poprawnym sample/demo data:

1. Zalogować się do Firebase DEMO/PREVIEW.
2. Sprawdzić status ładowania.
3. Oczekiwany komunikat: dane załadowane, liczby rekordów dla `Bestiary`, `Armor`, `Weapons`, `Augmentations`, `Equipment`, `Talents`, `Psionics`, `Prayers`.
4. Sprawdzić, że `Equipment` ładuje zwykły arkusz `Equipment` / `Ekwipunek`.
5. Sprawdzić, że `Vehicle Wargear` nie pojawia się jako zwykły ekwipunek NPC.

Na celowo uszkodzonych danych:

1. Usunąć jeden wymagany arkusz, np. `Weapons`.
2. Załadować dane.
3. Oczekiwany wynik: czytelny komunikat o brakującym arkuszu z listą aliasów.
4. Przywrócić arkusz, ale zostawić go pustym.
5. Oczekiwany wynik: czytelny komunikat o pustym wymaganym arkuszu.

## 12. Testy NPCGenerator — stare wpisy Bestiary

1. W danych testowych mieć co najmniej jeden rekord `State = old` i jeden aktywny rekord.
2. Otworzyć `NPCGenerator`.
3. Przy wyłączonym checkboxie stary rekord nie jest dostępny na liście.
4. Włączyć checkbox `Show outdated entries?`.
5. Stary rekord pojawia się na liście.
6. Wybrać stary rekord, wygenerować kartę.
7. Wyłączyć checkbox i sprawdzić, czy wybór zostaje wyczyszczony albo nie pozwala na wygenerowanie ukrytego rekordu.

## 13. Testy NPCGenerator — angielskie kolumny karty

Użyć rekordu Bestiary z angielskimi kolumnami:

- `Name`
- `Threat`
- `Keywords`
- `S`, `T`, `A`, `I`, `Will`, `Int`, `Fell`
- `Resilience`
- `AV` albo `Armour Rating`
- `Defence`
- `Wounds`
- `Shock`
- `Skills`
- `Bonuses`
- `Abilities`
- `Attacks`
- `Mob Abilities`
- `Mob Options`
- `Resolve`
- `Courage`
- `Speed`
- `Size`

Oczekiwany wynik:

1. Karta ma nazwę NPC.
2. Poziomy zagrożenia są uzupełnione.
3. Słowa kluczowe są widoczne.
4. Statystyki `T`, `A`, `Will`, `Fell` trafiają odpowiednio do pól zastępczych.
5. `AV` / `Armour Rating` trafia do pancerza.
6. `Defence` trafia do obrony.
7. `Wounds` trafia do żywotności.
8. `Shock` trafia do odporności psychicznej.
9. `Skills`, `Bonuses`, `Abilities`, `Attacks`, `Mob Abilities`, `Mob Options` trafiają do sekcji karty.

## 14. Testy NPCGenerator — pancerz i broń z angielskich danych

1. Wybrać rekord Bestiary.
2. Wybrać pancerz z kolumną `AV`.
3. Wygenerować kartę.
4. Sprawdzić, czy wartość pancerza aktualizuje odporność/pancerz na karcie.
5. Wybrać broń z kolumnami `Damage`, `DN`, `AP`, `Range`, `Rate of fire`, `Traits`.
6. Sprawdzić, czy broń pojawia się w sekcji ataku.
7. Włączyć opis cech broni.
8. Sprawdzić, czy opisy cech są pobierane z `_meta.traits`.

## 15. Testy NPCGenerator — formatowanie tekstu i stron

Sprawdzić teksty zawierające:

- `(page 123)`
- `(pages 123-124)`
- `(p. 123)`
- `(pp. 123-124)`
- `(str. 123)`
- `(strona 123)`
- `(S. 123)`
- `(Seite 123)`

Oczekiwany wynik: odwołania do stron są wyróżniane jako referencje.

Sprawdzić słowa kluczowe:

- `IMPERIUM`
- `{{RED}}IMPERIUM{{/RED}}`
- `IMPERIUM, ADEPTUS ASTARTES`

Oczekiwany wynik: słowa kluczowe nie tracą markerów formatowania, a dane bez markerów w NPCGenerator są wzbogacane tak, aby wyróżnienie było widoczne.

## 16. Testy ulubionych NPCGenerator

1. Wybrać aktywny rekord Bestiary.
2. Dodać do ulubionych.
3. Odświeżyć stronę.
4. Wczytać ulubiony rekord.
5. Sprawdzić, że działa identyfikacja po stabilnym ID/nazwie, a nie wyłącznie po indeksie.
6. Dodać do ulubionych rekord `old` przy włączonym checkboxie.
7. Odświeżyć stronę.
8. Wczytać ulubiony rekord `old`.
9. Oczekiwany wynik: checkbox starych wpisów włącza się automatycznie albo rekord jest możliwy do odtworzenia bez błędu.

## 17. Testy Firebase DEMO/PREVIEW

1. Otworzyć DataVault i NPCGenerator na hostowanym środowisku.
2. Sprawdzić, że konfiguracja DEMO/PREVIEW ładuje się z `shared/firebase-config.js`.
3. Sprawdzić, że brak hasła daje czytelny komunikat.
4. Sprawdzić, że błędne hasło daje czytelny komunikat.
5. Sprawdzić, że poprawne hasło DEMO/PREVIEW loguje i ładuje dane demonstracyjne.
6. Sprawdzić, że dane nie zawierają prywatnych rekordów kampanii ani prywatnych materiałów właściciela.
7. Sprawdzić, że dokumentacja nadal wyjaśnia, gdzie podmienić Firebase na własny projekt grupy.

## 18. Testy regresji modułów pobocznych

1. `Main/index.html`:
   - linki do DataVault, DataSlate, NPCGenerator, Name Generator, Audio, Calculators i Dice Roller działają;
   - tryb bez `?admin=1` ukrywa elementy admin-only;
   - tryb `?admin=1` pokazuje elementy admin-only.
2. `NameGenerator`:
   - startuje;
   - przełącznik języka jest widoczny;
   - generator nadal generuje nazwy.
3. `DataSlate`:
   - config DEMO/PREVIEW nie powoduje błędów składni;
   - moduł zachowuje się zgodnie z aktualną dokumentacją release.

## 19. Kryteria akceptacji

Zmiany można uznać za gotowe, jeżeli:

1. Brak błędów składni w zmienionych plikach JS.
2. Sample JSON i firebase-import JSON są poprawne składniowo.
3. DataVault działa na angielskich nazwach arkuszy i kolumn.
4. Polskie nazwy działają jako legacy fallback.
5. `Equipment` i `Vehicle Wargear` są rozdzielone.
6. `Vehicle Wargear` jest sterowane checkboxem pojazdów.
7. `Equipment` nie jest sterowane checkboxem pojazdów.
8. NPCGenerator nie ładuje `Vehicle Wargear` jako zwykłego ekwipunku.
9. Stare wpisy Bestiary są ukrywane/pokazywane checkboxem.
10. Checkbox starych wpisów w NPCGenerator tłumaczy się EN/PL.
11. Karta NPC działa na angielskich kolumnach `Defence`, `Wounds`, `AV`, `Keywords`, `Skills` itd.
12. Firebase DEMO/PREVIEW działa jako publiczne demo i nie jest traktowane jako blocker release.
