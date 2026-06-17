// Release-only DataVault overrides for EN-first XLSX/JSON data and runtime trait tooltips.
//
// This file intentionally lives outside app.js so future updates can clearly see the release-specific
// data-language policy in one place.
//
// DATA LANGUAGE EXTENSION POINT / MIEJSCE ROZSZERZENIA JĘZYKA DANYCH:
// - WnG_Tools is EN-first. English sheet and column names are the canonical release format.
// - Polish names are kept only as legacy fallback aliases.
// - To add another data language, add sheet aliases in SHEET_ALIASES and column aliases in COLUMN_ALIASES.
// - If the new language has numbered trait/range columns, update TRAIT_NUMBERED_RE and RANGE_NUMBERED_RE.
// - UI translations stay in app.js; this file concerns XLSX/JSON data structure and release runtime compatibility.
(function installReleaseDataVaultOverrides(){
  const btn = document.getElementById("btnUpdateData");

  const norm = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const trimText = (value) => String(value ?? "").trim();
  const canonKey = (value) => norm(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+\(/g, "(");

  const SHEET_ALIASES = {
    notes: ["Notes", "Notatki"],
    bestiary: ["Bestiary", "Bestiariusz"],
    mobs: ["Mobs", "Hordy"],
    specialEnemyBonuses: ["Special Enemy Bonuses", "Specjalne Bonusy Wrogów"],
    sizeTable: ["Size Table", "Tabela Rozmiarów"],
    species: ["Species", "Gatunki"],
    archetypes: ["Archetypes", "Archetypy"],
    ascensionPackages: ["Ascension Packages", "Pakiety Wyniesienia"],
    factionBonuses: ["Faction Bonuses", "Premie Frakcji"],
    factionKeywords: ["Faction Keywords", "Słowa Kluczowe Frakcji"],
    specialFactionBonuses: ["Special Faction Bonuses", "Specjalne Bonusy Frakcji"],
    astartesImplants: ["Astartes Implants", "Implanty Astartes"],
    firstFoundingChapters: ["First Founding Chapters", "Zakony Pierwszego Powołania"],
    traits: ["Traits", "Cechy"],
    conditions: ["Conditions", "States", "Stany"],
    keywords: ["Keywords", "Słowa Kluczowe"],
    talents: ["Talents", "Talenty"],
    prayers: ["Prayers", "Modlitwy"],
    psionics: ["Psionics", "Psychic Powers", "Psionika"],
    augmentations: ["Augmentations", "Augmentics", "Augumentacje"],
    equipment: ["Equipment", "Ekwipunek"],
    armor: ["Armor", "Armour", "Pancerze"],
    weapons: ["Weapons", "Bronie"],
    criticalHits: ["Critical Hits", "Trafienia Krytyczne"],
    perilsOfTheWarp: ["Perils of the Warp", "Warp Perils", "Groza Osnowy"],
    rulesReference: ["Rules Reference", "Quick Reference Guide", "Skrót Zasad"],
    fireModes: ["Fire Modes", "Tryby Ognia"],
    dnPenalties: ["DN Penalties", "Kary do ST"],
    vehicleRoles: ["Vehicle Roles", "Role W Pojeździe"],
    vehicleActions: ["Vehicle Actions", "Akcje Pojazdu"],
    vehicleConditions: ["Vehicle Conditions", "Vehicle States", "Stany Pojazdów"],
    vehicleTraits: ["Vehicle Traits", "Cechy Pojazdów"],
    vehicles: ["Vehicles", "Pojazdy"],
    vehicleWeapons: ["Vehicle Weapons", "Bronie Pojazdów"],
    vehicleWargear: ["Vehicle Wargear", "Vehicle Equipment", "Ekwipunek Pojazdów"],
  };

  const COLUMN_ALIASES = {
    id: ["ID", "LP", "Lp"],
    state: ["State", "Stan"],
    type: ["Type", "Typ", "Kind", "Rodzaj"],
    name: ["Name", "Nazwa"],
    description: ["Description", "Opis"],
    effect: ["Effect", "Efekt"],
    example: ["Example", "Przykład"],
    keywords: ["Keywords", "Słowa Kluczowe", "Słowo Kluczowe"],
    traits: ["Traits", "Cechy"],
    range: ["Range", "Zasięg"],
    damage: ["Damage", "Obrażenia"],
    dn: ["DN", "DK", "ST"],
    ap: ["AP", "PP"],
    rateOfFire: ["Rate of fire", "Rate Of Fire", "Szybkostrzelność", "Salvo"],
    armorValue: ["AV", "AR", "Armor Rating", "Armour Rating", "Wartość Pancerza", "WP"],
    source: ["Source", "Book", "Podręcznik"],
    page: ["Page", "Strona"],
  };

  const RANGE_NUMBERED_RE = /^(range|zasi[eę]g)\s*([0-9]+)$/i;
  const TRAIT_NUMBERED_RE = /^(trait|cecha)\s*([0-9]+)$/i;
  const TRAIT_PARAMETER_RE = /^(.*?)(\s*)\(([^)]+)\)\s*$/;

  const getCanonicalSheetKey = (sheetName) => {
    const wanted = canonKey(sheetName);
    for (const [key, aliases] of Object.entries(SHEET_ALIASES)) {
      if (aliases.some((alias) => canonKey(alias) === wanted)) return key;
    }
    return wanted;
  };

  const getColumnAliases = (canonicalColumnKey) => COLUMN_ALIASES[canonicalColumnKey] || [canonicalColumnKey];

  const columnIs = (columnName, canonicalColumnKey) => {
    const wanted = canonKey(columnName);
    return getColumnAliases(canonicalColumnKey).some((alias) => canonKey(alias) === wanted);
  };

  const getRecordValue = (record, canonicalColumnKey) => {
    const aliases = getColumnAliases(canonicalColumnKey);
    const keys = Object.keys(record || {});
    const match = keys.find((key) => aliases.some((alias) => canonKey(alias) === canonKey(key)));
    return match ? record[match] : "";
  };

  const firstExistingColumnName = (record, aliases) => {
    const keys = Object.keys(record || {});
    return keys.find((key) => aliases.some((alias) => canonKey(alias) === canonKey(key))) || null;
  };

  const preferredSyntheticName = (record, canonicalColumnKey) => {
    const aliases = getColumnAliases(canonicalColumnKey);
    const existing = firstExistingColumnName(record, aliases);
    if (existing) return existing;
    return aliases[0];
  };

  const splitTraitList = (value) => String(value ?? "")
    .split(";")
    .map((part) => norm(part))
    .filter((part) => part && part !== "-");

  const mergeNumberedColumns = (row, regex, canonicalColumnKey, joiner) => {
    const entries = Object.keys(row)
      .map((key) => {
        const match = norm(key).match(regex);
        return match ? { key, index: Number(match[2]) } : null;
      })
      .filter(Boolean)
      .sort((left, right) => left.index - right.index);

    if (!entries.length) return row;

    const out = { ...row };
    const preferred = preferredSyntheticName(row, canonicalColumnKey);
    const values = entries.map(({ key }) => norm(row[key])).filter((value) => value && value !== "-");

    for (const { key } of entries) delete out[key];
    out[preferred] = values.length ? values.join(joiner) : "-";
    return out;
  };

  const stripPrivateFields = (row) => {
    const clean = {};
    for (const [key, value] of Object.entries(row || {})) {
      if (key === "__id") {
        clean.__id = value;
        continue;
      }
      if (key.startsWith("__")) continue;
      clean[key] = value;
    }
    return clean;
  };

  const normaliseRowsForSheet = (sheetName, rows) => {
    const sheetKey = getCanonicalSheetKey(sheetName);
    const shouldMergeTraits = new Set(["armor", "weapons", "vehicles", "vehicleWeapons"]);
    const shouldMergeRange = new Set(["weapons", "vehicleWeapons"]);

    return (rows || []).map((row) => {
      let out = stripPrivateFields(row);
      if (shouldMergeRange.has(sheetKey)) out = mergeNumberedColumns(out, RANGE_NUMBERED_RE, "range", " / ");
      if (shouldMergeTraits.has(sheetKey)) out = mergeNumberedColumns(out, TRAIT_NUMBERED_RE, "traits", "; ");
      return out;
    });
  };

  const collectNameDescriptionMap = (rows) => {
    const map = {};
    for (const row of rows || []) {
      const name = norm(getRecordValue(row, "name"));
      const desc = trimText(getRecordValue(row, "description") || getRecordValue(row, "effect"));
      if (name && desc) map[name] = desc;
    }
    return map;
  };

  const addToIndex = (index, name, desc) => {
    if (!name || !desc) return;
    const key = canonKey(name);
    index[key] = desc;
    index[key.replace(/\s+/g, "")] = desc;
  };

  const buildIndex = (...maps) => {
    const index = {};
    for (const map of maps) {
      for (const [name, desc] of Object.entries(map || {})) addToIndex(index, name, desc);
    }
    return index;
  };

  const addKnownParameterizedTraitReferences = (traitIndex, sheets) => {
    for (const rows of Object.values(sheets || {})) {
      for (const row of rows || []) {
        for (const [columnName, value] of Object.entries(row || {})) {
          if (!columnIs(columnName, "traits")) continue;
          for (const traitRef of splitTraitList(value)) {
            const match = traitRef.match(TRAIT_PARAMETER_RE);
            if (!match) continue;
            const baseName = norm(match[1]);
            const templateKey = canonKey(`${baseName} (X)`);
            const templateKeyCompact = canonKey(`${baseName}(X)`);
            const desc = traitIndex[templateKey] || traitIndex[templateKeyCompact] || null;
            if (desc) addToIndex(traitIndex, traitRef, desc);
          }
        }
      }
    }
  };

  const buildMetaFromSheets = (sheets) => {
    const traits = {};
    const states = {};
    const vehicleTraits = {};
    const vehicleWeaponTraits = {};
    const vehicleStates = {};

    for (const [sheetName, rows] of Object.entries(sheets || {})) {
      const sheetKey = getCanonicalSheetKey(sheetName);
      if (sheetKey === "traits") Object.assign(traits, collectNameDescriptionMap(rows));
      if (sheetKey === "conditions") Object.assign(states, collectNameDescriptionMap(rows));
      if (sheetKey === "vehicleConditions") Object.assign(vehicleStates, collectNameDescriptionMap(rows));
      if (sheetKey === "vehicleTraits") {
        Object.assign(vehicleTraits, collectNameDescriptionMap(rows));
        for (const row of rows || []) {
          const type = canonKey(getRecordValue(row, "type"));
          const name = norm(getRecordValue(row, "name"));
          const desc = trimText(getRecordValue(row, "description") || getRecordValue(row, "effect"));
          if (name && desc && (type.includes("weapon") || type.includes("bron"))) {
            vehicleWeaponTraits[name] = desc;
          }
        }
      }
    }

    return { traits, states, vehicleTraits, vehicleWeaponTraits, vehicleStates };
  };

  const installRuntimePatches = () => {
    const originalNormaliseDB = window.normaliseDB;
    const originalFormatDataCellHTML = window.formatDataCellHTML;
    const originalOpenTraitPopover = window.openTraitPopover;

    if (typeof originalNormaliseDB === "function") {
      window.normaliseDB = function normaliseDBRelease(data) {
        const sheetsIn = data?.sheets || data || {};
        const sheets = {};
        for (const name of Object.keys(sheetsIn)) {
          if (name.startsWith("_")) continue;
          const sourceRows = Array.isArray(sheetsIn[name]) ? sheetsIn[name] : (sheetsIn[name]?.rows || []);
          const rows = normaliseRowsForSheet(name, sourceRows).map((row, index) => ({
            __id: row.__id ?? `${name}:${index + 1}`,
            ...row,
          }));
          sheets[name] = rows;
        }

        const meta = data?._meta || {};
        const derived = buildMetaFromSheets(sheets);
        const traits = { ...derived.traits, ...(meta.traits || {}) };
        const states = { ...derived.states, ...(meta.states || {}) };
        const vehicleTraits = { ...derived.vehicleTraits, ...(meta.vehicleTraits || {}) };
        const vehicleWeaponTraits = { ...derived.vehicleWeaponTraits, ...(meta.vehicleWeaponTraits || {}) };
        const vehicleStates = { ...derived.vehicleStates, ...(meta.vehicleStates || {}) };
        const sheetOrder = Array.isArray(meta.sheetOrder) ? meta.sheetOrder : Object.keys(sheetsIn);
        const columnOrder = meta.columnOrder && typeof meta.columnOrder === "object" ? meta.columnOrder : {};

        // The legacy app.js resolver knows only _meta.traitIndex and _meta.stateIndex.
        // Fold vehicle trait dictionaries into traitIndex so existing tooltip code can resolve
        // demo EN entries such as Mounted and Shield without requiring a large app.js rewrite.
        const traitIndex = buildIndex(traits, vehicleTraits, vehicleWeaponTraits);
        const stateIndex = buildIndex(states, vehicleStates);
        const vehicleTraitIndex = buildIndex(vehicleTraits);
        const vehicleWeaponTraitIndex = buildIndex(vehicleWeaponTraits);
        const vehicleStateIndex = buildIndex(vehicleStates);
        addKnownParameterizedTraitReferences(traitIndex, sheets);
        addKnownParameterizedTraitReferences(vehicleTraitIndex, sheets);
        addKnownParameterizedTraitReferences(vehicleWeaponTraitIndex, sheets);

        return {
          sheets,
          _meta: {
            traits,
            states,
            vehicleTraits,
            vehicleWeaponTraits,
            vehicleStates,
            traitIndex,
            stateIndex,
            vehicleTraitIndex,
            vehicleWeaponTraitIndex,
            vehicleStateIndex,
            sheetOrder,
            columnOrder,
          },
        };
      };
    }

    if (typeof originalFormatDataCellHTML === "function") {
      window.formatDataCellHTML = function formatDataCellHTMLRelease(row, col, sheetName) {
        if (columnIs(col, "traits")) {
          const traits = splitTraitList(row?.[col]);
          if (!traits.length) return "-";
          const sheetAttr = escapeHtmlLocal(sheetName || "");
          return traits.map((trait) => {
            const escapedTrait = escapeHtmlLocal(trait);
            return `<span class="tag" data-dv-trait-tag="1" data-trait-text="${escapedTrait}" data-sheet-name="${sheetAttr}">${escapedTrait}</span>`;
          }).join("");
        }
        return originalFormatDataCellHTML(row, col, sheetName);
      };
    }

    if (typeof originalOpenTraitPopover === "function") {
      document.addEventListener("click", (event) => {
        const tag = event.target?.closest?.("[data-dv-trait-tag]");
        if (!tag) return;
        event.preventDefault();
        event.stopPropagation();
        originalOpenTraitPopover(tag.getAttribute("data-trait-text") || "");
      });
    }
  };

  const escapeHtmlLocal = (value) => String(value ?? "").replace(/[&<>\"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[char]));

  installRuntimePatches();

  const buildDataJsonFromSheetsRelease = (rawSheets, opts = {}) => {
    const { sheetOrder = null, columnOrder = null } = opts;
    const sheets = {};

    for (const [sheetName, rows] of Object.entries(rawSheets || {})) {
      sheets[sheetName] = normaliseRowsForSheet(sheetName, rows || []);
    }

    const derived = buildMetaFromSheets(sheets);
    const resolvedSheetOrder = Array.isArray(sheetOrder) ? sheetOrder : Object.keys(rawSheets || {});
    const resolvedColumnOrder = columnOrder && typeof columnOrder === "object" ? columnOrder : {};

    return {
      sheets,
      _meta: {
        ...derived,
        sheetOrder: resolvedSheetOrder,
        columnOrder: resolvedColumnOrder,
      },
    };
  };

  const downloadJsonFile = (filename, objectToDownload) => {
    const jsonText = JSON.stringify(objectToDownload, null, 2);
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const buildFirebaseImportJson = (dataJsonObject) => ({
    datavault: {
      live: {
        schemaVersion: "datavault-firebase-import-v1",
        createdAt: new Date().toISOString(),
        source: "Repository_EN.xlsx",
        dataJson: JSON.stringify(dataJsonObject),
      },
    },
  });

  const pickLocalWorkbookFile = () => new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xlsm,.xls";
    input.style.display = "none";
    input.addEventListener("change", async () => {
      try {
        const file = input.files && input.files[0];
        if (!file) {
          reject(new Error("No workbook selected"));
          return;
        }
        resolve(await file.arrayBuffer());
      } catch (error) {
        reject(error);
      } finally {
        input.remove();
      }
    }, { once: true });
    document.body.appendChild(input);
    input.click();
  });

  const showGenerationStatus = (message, isError = false) => {
    console[isError ? "error" : "info"](`[DataVault release XLSX] ${message}`);
    const note = document.querySelector("#updateDataGroup .actionsNote");
    if (note) {
      note.dataset.releaseGenerationStatus = isError ? "error" : "ok";
      note.title = message;
    }
  };

  if (btn) {
    btn.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      try {
        if (!window.XlsxCanonicalParser || !window.XlsxCanonicalParser.loadXlsxMinimal) {
          throw new Error("XlsxCanonicalParser is unavailable");
        }
        showGenerationStatus("Select XLSX file for EN-first release generation...");
        const xlsxBuffer = await pickLocalWorkbookFile();
        const { sheets: rawSheets, sheetOrder, columnOrder } = await window.XlsxCanonicalParser.loadXlsxMinimal(xlsxBuffer);
        const data = buildDataJsonFromSheetsRelease(rawSheets, { sheetOrder, columnOrder });
        const firebaseImport = buildFirebaseImportJson(data);
        downloadJsonFile("data.json", data);
        setTimeout(() => downloadJsonFile("firebase-import.json", firebaseImport), 150);
        showGenerationStatus("Generated alias-aware data.json and firebase-import.json.");
      } catch (error) {
        showGenerationStatus(error && error.message ? error.message : String(error), true);
      }
    }, true);
  }
})();
