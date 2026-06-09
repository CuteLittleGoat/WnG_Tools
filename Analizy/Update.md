# Update — 2026-06-09 — Audio Loop and NPCGenerator editable Keywords

## Original full user prompt

```text
Pracujesz w repozytorium:

CuteLittleGoat/WnG_Tools

Cel:
Wdrożyć w WnG_Tools analogiczne zmiany z materiałów eksportowych znajdujących się w folderze Analizy/, ale NIE aplikować patcha 1:1.

Materiały wejściowe:
- Analizy/analiza-audio-opcja-loop.md
- Analizy/analiza-generatornpc-edycja-slow-kluczowych-i-jasniejsze-przyciski-edytuj.md
- Analizy/patch-audio-loop-generatornpc.patch
- Analizy/lista-plikow-audio-loop-generatornpc.md
- Analizy/notatka-transfer-do-WnG_Tools.md

Najważniejsze ustalenia:
1. Patch NIE nadaje się do bezpośredniego zastosowania.
2. W WnG_Tools nie ma pliku DetaleLayout.md.
3. Nie wolno tworzyć ani modyfikować DetaleLayout.md.
4. W patchu ścieżki modułu NPC mają postać GeneratorNPC/..., ale w WnG_Tools właściwy katalog to NPCGenerator/...
5. WnG_Tools ma domyślny język UI ustawiony na angielski. UI ma pozostać English-first.
6. Nie wolno przenosić prywatnych danych, sekretów, tokenów, haseł, produkcyjnych konfiguracji Firebase, plików importu danych, XLSX ani JSON.
7. Nie modyfikuj DataVault/style.css; jest tylko źródłem referencyjnego koloru var(--code).

Pliki, które wolno modyfikować:
- Audio/index.html
- Audio/docs/README.md
- Audio/docs/Documentation.md
- NPCGenerator/index.html
- NPCGenerator/style.css
- NPCGenerator/docs/README.md
- NPCGenerator/docs/Documentation.md

Pliki/ścieżki, które trzeba pominąć:
- DetaleLayout.md
- GeneratorNPC/index.html
- GeneratorNPC/style.css
- GeneratorNPC/docs/README.md
- GeneratorNPC/docs/Documentation.md
- DataVault/style.css
- wszystkie pliki konfiguracji Firebase, chyba że zadanie zostanie później wyraźnie rozszerzone
- wszystkie pliki danych/importu: XLSX, JSON, firebase-import.json, data.json itp.

Zakres Audio:
1. Dodaj przycisk Loop tylko w prawdziwym widoku użytkownika bez ?admin=1.
2. Nie renderuj Loop w panelu admina ani w adminowym podglądzie.
3. Loop ma:
   - uruchamiać dźwięk od razu,
   - po zakończeniu pliku startować kolejne odtworzenie,
   - przy wielu wariantach losować kolejny wariant i unikać natychmiastowej powtórki, jeśli istnieje inny wariant,
   - po ponownym kliknięciu zatrzymywać aktualny dźwięk i wyłączać czerwony stan.
4. Nie używaj audio.loop = true, bo to powtarzałoby ten sam plik.
5. Użyj aria-pressed i klasy is-looping dla stanu aktywnego.
6. Dodaj label buttonLoop do obu słowników tłumaczeń, ale domyślny język ma pozostać en.
7. Nie wprowadzaj twardych polskich alertów. Zachowaj aktualny mechanizm:
   translations[currentLanguage].labels.playbackError
8. Upewnij się, że kolejne iteracje Loop respektują aktualną wartość suwaka głośności.

Zakres NPCGenerator:
1. Przenieś logikę z patcha GeneratorNPC/... do istniejących plików NPCGenerator/...
2. Rozszerz state.bestiaryOverrides o:
   - keywords
   - keywordsEditing
3. Dodaj obsługę edytowalnego pola Słowa Kluczowe/Keywords analogicznie do Umiejętności/Skills.
4. Obecny kod WnG_Tools nadal używa polskich kluczy danych, np. Umiejętności i Słowa Kluczowe. Nie tłumacz wewnętrznych kluczy danych na angielski bez sprawdzenia aktualnego schematu.
5. UI ma korzystać z istniejących tłumaczeń:
   - EN: Edit / Save / Skills / Keywords
   - PL: Edytuj / Zapisz / Umiejętności / Słowa Kluczowe
6. Po zapisie edytowanych słów kluczowych podgląd bazowy ma nadal przechodzić przez istniejący formatter, żeby słowa pozostały czerwone, a przecinki neutralne.
7. Wygenerowana karta do druku ma pozostać czarno-biała.
8. W NPCGenerator/style.css dodaj klasę:
   .editable-text-button
   z jasnym kolorem i obramowaniem var(--code), zgodnie z patchem. Nie zmieniaj globalnie wszystkich .btn.secondary.

Dokumentacja:
1. Aktualizuj dokumentację ręcznie.
2. Zachowaj strukturę English-first w WnG_Tools.
3. W angielskich sekcjach nie zostawiaj polskich etykiet typu Odtwórz, Zatrzymaj, Edytuj, Zapisz, Słowa Kluczowe, Umiejętności, chyba że tekst wyraźnie opisuje polską wersję językową.
4. Jeżeli dokument ma sekcję PL, zaktualizuj także ją.
5. Nie przenoś fragmentów dotyczących DetaleLayout.md.

Dokładny log prac zapisz jako Analizy/Update.md
```

## Scope of work

- Read the release instructions and the provided export materials in `Analizy/`.
- Implemented the Audio loop feature manually in the current `Audio/index.html` structure instead of applying the patch directly.
- Implemented editable Keywords in the current `NPCGenerator/` files instead of using old `GeneratorNPC/` paths.
- Updated English-first user and technical documentation for Audio and NPCGenerator.
- Did not create or modify `DetaleLayout.md`.
- Did not modify Firebase configuration files, `DataVault/style.css`, XLSX files, JSON data files, or import files.

## Findings and conclusions

- The patch content was useful as a behavioral reference, but path and documentation differences required manual transfer.
- `Audio/index.html` already uses English as the default language and existing translated playback errors. The new Loop code preserves those mechanisms.
- `NPCGenerator/index.html` still uses Polish data keys such as `Umiejętności` and `Słowa Kluczowe`; the implementation keeps those internal keys and uses existing UI translations for labels/buttons.
- The base preview for edited Keywords still uses `createClampCell(...)`, so existing keyword formatting remains in the preview.
- The printable NPC card uses the edited Keywords value but remains in the existing black-and-white print rendering path.

## Decisions and requirements applied

- Loop is rendered only in the normal user view when `ADMIN_MODE` is false.
- Loop is not rendered in the admin panel or the admin preview of the user views.
- Loop does not use `audio.loop = true`; it creates a new playback iteration after `ended`.
- Active Loop state uses both `aria-pressed="true"` and `.is-looping`.
- Audio playback errors continue to use `translations[currentLanguage].labels.playbackError`.
- Editable Keywords reuse the generalized editable text row logic, while numeric/stat editing remains unchanged.
- `.editable-text-button` is a dedicated class; `.btn.secondary` was not changed globally.

## Changed files

| File | Change summary |
| --- | --- |
| `Audio/index.html` | Added Loop button styling, translations, loop playback state, random non-immediate-repeat variant selection, user-only Loop rendering, and Loop click handlers. |
| `Audio/docs/README.md` | Updated EN and PL user instructions for Loop behavior and admin exclusion. |
| `Audio/docs/Documentation.md` | Updated technical playback/rendering/style notes for Loop. |
| `NPCGenerator/index.html` | Added `keywords`/`keywordsEditing` overrides, generalized editable text rows, keyword serialization/deserialization/reset, and printable-card keyword override support. |
| `NPCGenerator/style.css` | Added `.editable-text-button` with bright `var(--code)` color and border. |
| `NPCGenerator/docs/README.md` | Updated EN and PL user instructions for editing Skills and Keywords. |
| `NPCGenerator/docs/Documentation.md` | Updated technical notes for editable text fields, Keywords overrides, serialization, reset, preview formatting, print behavior, and CSS. |
| `Analizy/Update.md` | Added this detailed task log. |
| `Analizy/Release.md` | Added release-project journal entry for this task. |

## Code change details

### `Audio/index.html`

- Added `.loop-btn.is-looping` and `.loop-btn[aria-pressed="true"]` CSS so the active Loop button is visibly red and semantically tied to `aria-pressed`.
- Added `buttonLoop: "Loop"` to both PL and EN translation dictionaries while leaving the default language unchanged.
- Changed variant selection to accept `previousUrl` and avoid immediate repeats when multiple variants exist.
- Extended active player entries with `item`, `loop`, and `lastUrl`.
- Updated `startPlayback(...)` to support loop options, preserve current slider-based volume on every new iteration, and restart after `ended` only when `loop` remains true.
- Added `toggleLoop(...)` to start Loop immediately, convert existing one-shot playback to Loop mode, or stop an active Loop on the next click.
- Rendered the Loop button only when `ADMIN_MODE` is false in `renderUserMainView()` and `renderUserFavorites()`.
- Added click handling for Loop buttons in user main and user favorites views.

### `NPCGenerator/index.html`

- Added `keywords` and `keywordsEditing` to `state.bestiaryOverrides`.
- Serialized/deserialized `keywords` for favorites while resetting editing flags on load.
- Reset keyword overrides and editing state in `resetBestiaryOverrides()`.
- Added `EDITABLE_KEYWORDS_KEY = normalizeKey("Słowa Kluczowe")` while preserving current Polish data keys.
- Replaced the skills-only row renderer with `EDITABLE_TEXT_FIELDS` and `createEditableTextRow(...)` for both Skills and Keywords.
- Kept the saved preview routed through `createClampCell(...)`, preserving existing keyword coloring and comma behavior.
- Used `bestiaryOverrides.keywords` in `buildPrintableCardHTML(...)` when present.

### `NPCGenerator/style.css`

- Added `.editable-text-button` with `border-color: var(--code)`, `color: var(--code)`, and `opacity: 1`.
- Did not change `.btn.secondary` globally.

## Tests

- PASS — `node --check /tmp/Audio.mjs` after extracting the module script from `Audio/index.html`.
- PASS — `node --check /tmp/NPCGenerator.mjs` after extracting the module script from `NPCGenerator/index.html`.
- PASS — `git status --short` showed only allowed implementation/documentation files plus required analysis logs.
- PASS — `rg -n "audio\.loop\s*=" Audio/index.html || true` returned no native `audio.loop = true` usage.
- PASS — `rg -n "DetaleLayout|GeneratorNPC/|DataVault/style.css" ... || true` returned no forbidden transfer references in the modified target files.
- PASS — custom Python check confirmed the checked English README sections do not contain the listed Polish UI labels.

## Risks and next steps

- Browser-level audio behavior, Web Audio gain behavior, and actual XLSX manifest loading still require manual testing in a browser with representative audio URLs.
- Firestore synchronization was not modified or tested live; Firebase files were intentionally left untouched.
- Existing documentation still contains some historical Polish technical sections outside the changed English user sections; this task only updated the relevant feature documentation manually and did not perform a full documentation rewrite.
