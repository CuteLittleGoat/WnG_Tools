// Release-only admin generation override for DataVault.
//
// This file intentionally lives outside app.js so future updates can clearly see the release-specific
// XLSX/data-language policy in one place.
//
// DATA LANGUAGE EXTENSION POINT / MIEJSCE ROZSZERZENIA JĘZYKA DANYCH:
// - WnG_Tools is EN-first. English sheet and column names are the canonical release format.
// - Polish names are kept only as legacy fallback aliases.
// - To add another data language, add sheet aliases in SHEET_ALIASES and column aliases in COLUMN_ALIASES.
// - If the new language has numbered trait/range columns, update TRAIT_NUMBERED_RE and RANGE_NUMBERED_RE.
// - Do not change UI translations here; this file concerns XLSX/JSON data structure only.
(function installReleaseAdminOverrides(){
  const btn = document.getElementById("btnUpdateData");
  if (!btn) return;

  const norm = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const canonKey = (value) => norm(value).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+\(/g, "(");

  const SHEET_ALIASES = {
    notes: ["Notes", "Notatki"],
    bestiary: ["Bestiary", "Bestiariusz"],
    traits: ["Traits", "Cechy"],
    conditions: ["Conditions", "States", "Stany"],
    armor: ["Armor", "Armour", "Pancerze"],
    weapons: ["Weapons", "Bronie"],
    vehicleTraits: ["Vehicle Traits", "Cechy Pojazdów"],
    vehicleConditions: ["Vehicle Conditions", "Vehicle States", "Stany Pojazdów"],
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
    traits: ["Traits", "Cechy"],
    range: ["Range", "Zasięg"],
    keywords: ["Keywords", "Słowa Kluczowe", "Słowo Kluczowe"],
  };

  const RANGE_NUMBERED_RE = /^(range|zasi[eę]g)\s*([0-9]+)$/i;
  const TRAIT_NUMBERED_RE = /^(trait|cecha)\s*([0-9]+)$/i;

  const getCanonicalSheetKey = (sheetName) => {
    const wanted = canonKey(sheetName);
    for (const [key, aliases] of Object.entries(SHEET_ALIASES)) {
      if (aliases.some((alias) => canonKey(alias) === wanted)) return key;
    }
    return wanted;
  };

  const getRecordValue = (record, canonicalColumnKey) => {
    const aliases = COLUMN_ALIASES[canonicalColumnKey] || [canonicalColumnKey];
    const keys = Object.keys(record || {});
    const match = keys.find((key) => aliases.some((alias) => canonKey(alias) === canonKey(key)));
    return match ? record[match] : "";
  };

  const firstExistingColumnName = (record, aliases) => {
    const keys = Object.keys(record || {});
    return keys.find((key) => aliases.some((alias) => canonKey(alias) === canonKey(key))) || null;
  };

  const preferredSyntheticName = (record, canonicalColumnKey) => {
    const aliases = COLUMN_ALIASES[canonicalColumnKey] || [canonicalColumnKey];
    const existing = firstExistingColumnName(record, aliases);
    if (existing) return existing;
    return aliases[0];
  };

  const mergeNumberedColumns = (row, regex, canonicalColumnKey, joiner) => {
    const entries = Object.keys(row)
      .map((key) => {
        const match = norm(key).match(regex);
        return match ? { key, index: Number(match[2]), prefix: match[1] } : null;
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

  const normaliseRowsForSheet = (sheetName, rows) => {
    const sheetKey = getCanonicalSheetKey(sheetName);
    const shouldMergeTraits = new Set(["armor", "weapons", "vehicleTraits", "vehicles", "vehicleWeapons"]);
    const shouldMergeRange = new Set(["weapons", "vehicleWeapons"]);

    return (rows || []).map((row) => {
      let out = { ...row };
      if (shouldMergeRange.has(sheetKey)) out = mergeNumberedColumns(out, RANGE_NUMBERED_RE, "range", " / ");
      if (shouldMergeTraits.has(sheetKey)) out = mergeNumberedColumns(out, TRAIT_NUMBERED_RE, "traits", "; ");
      return out;
    });
  };

  const collectNameDescriptionMap = (rows) => {
    const map = {};
    for (const row of rows || []) {
      const name = norm(getRecordValue(row, "name"));
      const desc = norm(getRecordValue(row, "description") || getRecordValue(row, "effect"));
      if (name && desc) map[name] = desc;
    }
    return map;
  };

  const buildDataJsonFromSheetsRelease = (rawSheets, opts = {}) => {
    const { sheetOrder = null, columnOrder = null } = opts;
    const sheets = {};
    const traits = {};
    const states = {};
    const vehicleTraits = {};
    const vehicleWeaponTraits = {};
    const vehicleStates = {};

    for (const [sheetName, rows] of Object.entries(rawSheets || {})) {
      const sheetKey = getCanonicalSheetKey(sheetName);
      const processedRows = normaliseRowsForSheet(sheetName, rows || []);
      sheets[sheetName] = processedRows;

      if (sheetKey === "traits") Object.assign(traits, collectNameDescriptionMap(processedRows));
      if (sheetKey === "conditions") Object.assign(states, collectNameDescriptionMap(processedRows));
      if (sheetKey === "vehicleConditions") Object.assign(vehicleStates, collectNameDescriptionMap(processedRows));
      if (sheetKey === "vehicleTraits") {
        const allVehicleTraits = collectNameDescriptionMap(processedRows);
        Object.assign(vehicleTraits, allVehicleTraits);
        for (const row of processedRows) {
          const type = canonKey(getRecordValue(row, "type"));
          const name = norm(getRecordValue(row, "name"));
          const desc = norm(getRecordValue(row, "description") || getRecordValue(row, "effect"));
          if (name && desc && (type.includes("weapon") || type.includes("bron"))) {
            vehicleWeaponTraits[name] = desc;
          }
        }
      }
    }

    const resolvedSheetOrder = Array.isArray(sheetOrder) ? sheetOrder : Object.keys(rawSheets || {});
    const resolvedColumnOrder = columnOrder && typeof columnOrder === "object" ? columnOrder : {};

    return {
      sheets,
      _meta: {
        traits,
        states,
        vehicleTraits,
        vehicleWeaponTraits,
        vehicleStates,
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
        source: "Repozytorium.xlsx",
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
})();
