#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""build_json.py — generates DataVault data.json from Repository_EN.xlsx / Repozytorium.xlsx.

GOAL:
- WnG_Tools release is EN-first: English sheet and column names are canonical.
- Polish sheet/column names remain supported as legacy aliases.
- Weapons / Vehicle Weapons: merge Range 1..3 -> Range and Trait 1..N -> Traits.
- Armour / Vehicles: merge Trait 1..N -> Traits.
- Build dictionaries used by tooltip resolution:
  - _meta.traits from Traits.Name -> Description
  - _meta.states from Conditions/States.Name -> Description/Effect
  - _meta.vehicleTraits from Vehicle Traits.Name -> Description
  - _meta.vehicleWeaponTraits from Vehicle Traits rows whose Type/Kind marks a weapon trait
  - _meta.vehicleStates from Vehicle Conditions.Name -> Description/Effect
  - _meta.sheetOrder and _meta.columnOrder from the XLSX workbook

Usage:
  python build_json.py Repository_EN.xlsx data.json
Defaults:
  python build_json.py
"""

import json
import re
import sys
import unicodedata
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET


def replace_polish_quotes(text: str) -> str:
  return text.replace("„", "\"").replace("”", "\"")


def trim_text(value) -> str:
  return replace_polish_quotes(str(value or "").strip())


def norm(value) -> str:
  return re.sub(r"\s+", " ", trim_text(value))


def strip_diacritics(value: str) -> str:
  return "".join(ch for ch in unicodedata.normalize("NFD", value) if unicodedata.category(ch) != "Mn")


def canon_key(value) -> str:
  return re.sub(r"\s+\(", "(", strip_diacritics(norm(value)).lower())


SHEET_ALIASES = {
  "notes": ["Notes", "Notatki"],
  "bestiary": ["Bestiary", "Bestiariusz"],
  "mobs": ["Mobs", "Hordy"],
  "specialEnemyBonuses": ["Special Enemy Bonuses", "Specjalne Bonusy Wrogów"],
  "sizeTable": ["Size Table", "Tabela Rozmiarów"],
  "species": ["Species", "Gatunki"],
  "archetypes": ["Archetypes", "Archetypy"],
  "ascensionPackages": ["Ascension Packages", "Pakiety Wyniesienia"],
  "factionBackgrounds": ["Faction Backgrounds"],
  "factionKeywords": ["Faction Keywords", "Słowa Kluczowe Frakcji"],
  "specialFactionBonuses": ["Special Faction Bonuses", "Specjalne Bonusy Frakcji"],
  "astartesImplants": ["Astartes Implants", "Implanty Astartes"],
  "firstFoundingChapters": ["First Founding Chapters", "Zakony Pierwszego Powołania"],
  "traits": ["Traits", "Cechy"],
  "conditions": ["Conditions", "States", "Stany"],
  "keywords": ["Keywords", "Słowa Kluczowe"],
  "talents": ["Talents", "Talenty"],
  "prayers": ["Prayers", "Modlitwy"],
  "psionics": ["Psionics", "Psychic Powers", "Psionika"],
  "augmentations": ["Augmentations", "Augmentics", "Augumentacje"],
  "equipment": ["Equipment", "Ekwipunek"],
  "armor": ["Armor", "Armour", "Pancerze"],
  "weapons": ["Weapons", "Bronie"],
  "criticalHits": ["Critical Hits", "Trafienia Krytyczne"],
  "perilsOfTheWarp": ["Perils of the Warp", "Warp Perils", "Groza Osnowy"],
  "rulesReference": ["Rules Reference", "Quick Reference Guide", "Skrót Zasad"],
  "fireModes": ["Fire Modes", "Tryby Ognia"],
  "dnPenalties": ["DN Penalties", "Kary do ST"],
  "vehicleRoles": ["Vehicle Roles", "Role W Pojeździe"],
  "vehicleActions": ["Vehicle Actions", "Akcje Pojazdu"],
  "vehicleConditions": ["Vehicle Conditions", "Vehicle States", "Stany Pojazdów"],
  "vehicleTraits": ["Vehicle Traits", "Cechy Pojazdów"],
  "vehicles": ["Vehicles", "Pojazdy"],
  "vehicleWeapons": ["Vehicle Weapons", "Bronie Pojazdów"],
  "vehicleWargear": ["Vehicle Wargear", "Vehicle Equipment", "Ekwipunek Pojazdów"],
  "vehicleDamage": ["Vehicle Damage"],
  "vehicleExplosions": ["Vehicle Explosions"],
}

COLUMN_ALIASES = {
  "id": ["ID", "LP", "Lp"],
  "state": ["State", "Stan"],
  "type": ["Type", "Typ", "Kind", "Rodzaj"],
  "name": ["Name", "Nazwa"],
  "description": ["Description", "Opis"],
  "effect": ["Effect", "Efekt"],
  "example": ["Example", "Przykład"],
  "keywords": ["Keywords", "Słowa Kluczowe", "Słowo Kluczowe"],
  "traits": ["Traits", "Cechy"],
  "range": ["Range", "Zasięg"],
  "damage": ["Damage", "Obrażenia"],
  "dn": ["DN", "DK", "ST"],
  "ap": ["AP", "PP"],
  "rateOfFire": ["Rate of fire", "Rate Of Fire", "Szybkostrzelność", "Salvo"],
  "armorValue": ["AV", "AR", "Armor Rating", "Armour Rating", "Wartość Pancerza", "WP"],
  "source": ["Source", "Book", "Podręcznik"],
  "page": ["Page", "Strona"],
}

RANGE_NUMBERED_RE = re.compile(r"^(?:range|zasi[eę]g)\s*([0-9]+)$", re.IGNORECASE)
TRAIT_NUMBERED_RE = re.compile(r"^(?:trait|cecha)\s*([0-9]+)$", re.IGNORECASE)


def get_canonical_sheet_key(sheet_name) -> str:
  wanted = canon_key(sheet_name)
  for key, aliases in SHEET_ALIASES.items():
    if any(canon_key(alias) == wanted for alias in aliases):
      return key
  return wanted


def get_column_aliases(canonical_key: str):
  return COLUMN_ALIASES.get(canonical_key, [canonical_key])


def column_is(column_name, canonical_key: str) -> bool:
  wanted = canon_key(column_name)
  return any(canon_key(alias) == wanted for alias in get_column_aliases(canonical_key))


def get_record_value(record: dict, canonical_key: str) -> str:
  for key, value in (record or {}).items():
    if column_is(key, canonical_key):
      return value
  return ""


def preferred_synthetic_name(record: dict, canonical_key: str) -> str:
  for key in (record or {}).keys():
    if column_is(key, canonical_key):
      return key
  return get_column_aliases(canonical_key)[0]


def derive_column_order(header):
  order = []
  has_range = False
  has_traits = False
  for raw_col in header:
    col = norm(raw_col)
    if not col:
      continue
    if column_is(col, "id"):
      continue
    if RANGE_NUMBERED_RE.match(col):
      if not has_range:
        order.append("Range")
        has_range = True
      continue
    if TRAIT_NUMBERED_RE.match(col):
      if not has_traits:
        order.append("Traits")
        has_traits = True
      continue
    order.append(col)
  return order


def _is_red_color(node) -> bool:
  if node is None:
    return False
  rgb = (node.attrib.get("rgb") or "").lstrip("#").upper()
  if rgb:
    return rgb.endswith("FF0000") or rgb in {"FF0000", "00FF0000", "FFFF0000"}
  return False


def _is_enabled(tag) -> bool:
  if tag is None:
    return False
  val = tag.attrib.get("val")
  return val is None or str(val).lower() not in {"0", "false"}


def _wrap_with_markers(text: str, *, red=False, bold=False, italic=False, strike=False) -> str:
  markers = [
    ("{{RED}}", "{{/RED}}", red),
    ("{{B}}", "{{/B}}", bold),
    ("{{I}}", "{{/I}}", italic),
    ("{{S}}", "{{/S}}", strike),
  ]
  start = "".join(op for op, _, use in markers if use)
  end = "".join(cl for _, cl, use in reversed(markers) if use)
  return f"{start}{text}{end}"


def _rich_text_to_string(el, ns):
  runs = el.findall("main:r", ns)
  if not runs:
    plain = "".join(t.text or "" for t in el.findall(".//main:t", ns))
    return plain, False
  parts = []
  for run in runs:
    text = "".join(t.text or "" for t in run.findall("main:t", ns))
    if not text:
      continue
    rpr = run.find("main:rPr", ns)
    color = rpr.find("main:color", ns) if rpr is not None else None
    red = _is_red_color(color)
    bold = _is_enabled(rpr.find("main:b", ns) if rpr is not None else None)
    italic = _is_enabled(rpr.find("main:i", ns) if rpr is not None else None)
    strike = _is_enabled(rpr.find("main:strike", ns) if rpr is not None else None)
    parts.append(_wrap_with_markers(text, red=red, bold=bold, italic=italic, strike=strike))
  return "".join(parts), True


def rows_to_records(header, rows):
  out = []
  for row in rows:
    if not any(x is not None and str(x).strip() != "" for x in row):
      continue
    rec = {}
    for idx, header_name in enumerate(header):
      if not header_name:
        continue
      rec[header_name] = "" if idx >= len(row) or row[idx] is None else trim_text(row[idx])
    out.append(rec)
  return out


def merge_numbered_columns(record: dict, regex: re.Pattern, canonical_key: str, joiner: str) -> dict:
  entries = []
  for key in record.keys():
    match = regex.match(norm(key))
    if match:
      entries.append((int(match.group(1)), key))
  if not entries:
    return record
  entries.sort()
  out = dict(record)
  synthetic_name = preferred_synthetic_name(record, canonical_key)
  values = []
  for _, key in entries:
    value = norm(record.get(key, ""))
    if value and value != "-":
      values.append(value)
  for _, key in entries:
    out.pop(key, None)
  out[synthetic_name] = joiner.join(values) if values else "-"
  return out


def normalise_rows_for_sheet(sheet_name: str, records):
  sheet_key = get_canonical_sheet_key(sheet_name)
  should_merge_range = {"weapons", "vehicleWeapons"}
  should_merge_traits = {"armor", "weapons", "vehicles", "vehicleWeapons"}
  out = []
  for record in records:
    current = dict(record)
    if sheet_key in should_merge_range:
      current = merge_numbered_columns(current, RANGE_NUMBERED_RE, "range", " / ")
    if sheet_key in should_merge_traits:
      current = merge_numbered_columns(current, TRAIT_NUMBERED_RE, "traits", "; ")
    out.append(current)
  return out


def collect_name_description_map(records):
  collected = {}
  for record in records or []:
    name = norm(get_record_value(record, "name"))
    desc = trim_text(get_record_value(record, "description") or get_record_value(record, "effect"))
    if name and desc:
      collected[name] = desc
  return collected


def _load_shared_strings(z: ZipFile):
  try:
    root = ET.fromstring(z.read("xl/sharedStrings.xml"))
  except KeyError:
    return []
  ns = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
  items = []
  for si in root.findall("main:si", ns):
    text, has_runs = _rich_text_to_string(si, ns)
    items.append({"text": text, "has_runs": has_runs})
  return items


def _load_styles(z: ZipFile):
  try:
    root = ET.fromstring(z.read("xl/styles.xml"))
  except KeyError:
    return {"cell_xf_formats": []}

  ns = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
  fonts = []
  for font in root.findall("main:fonts/main:font", ns):
    color = font.find("main:color", ns)
    fonts.append({
      "red": _is_red_color(color),
      "bold": _is_enabled(font.find("main:b", ns)),
      "italic": _is_enabled(font.find("main:i", ns)),
      "strike": _is_enabled(font.find("main:strike", ns)),
    })

  cell_xf_formats = []
  for xf in root.findall("main:cellXfs/main:xf", ns):
    font_id = int(xf.attrib.get("fontId", "0"))
    cell_xf_formats.append(fonts[font_id] if font_id < len(fonts) else {})

  return {"cell_xf_formats": cell_xf_formats}


def _style_format(styles, idx: int) -> dict:
  if idx is None:
    return {}
  formats = styles.get("cell_xf_formats", [])
  return formats[idx] if idx < len(formats) else {}


def _col_to_index(ref: str) -> int:
  idx = 0
  for char in ref:
    if not char.isalpha():
      break
    idx = idx * 26 + (ord(char.upper()) - ord("A") + 1)
  return idx - 1


def _load_rows_from_xml(z: ZipFile, path: str, shared_strings, styles):
  ns = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
  root = ET.fromstring(z.read(path))
  rows = []
  for row in root.findall(".//main:sheetData/main:row", ns):
    cells = {}
    for cell in row.findall("main:c", ns):
      ref = cell.attrib.get("r", "")
      match = re.match(r"([A-Za-z]+)", ref) if ref else None
      col = _col_to_index(match.group(1)) if match else len(cells)
      cell_type = cell.attrib.get("t")
      style_idx = cell.attrib.get("s")
      style_idx_int = int(style_idx) if style_idx is not None and str(style_idx).isdigit() else None
      cell_format = _style_format(styles, style_idx_int)
      val_node = cell.find("main:v", ns)
      if cell_type == "s":
        item = shared_strings[int(val_node.text)] if val_node is not None and val_node.text else {"text": "", "has_runs": False}
        text = item.get("text", "")
        has_runs = item.get("has_runs", False)
        if not has_runs and any(cell_format.values()):
          text = _wrap_with_markers(text, **cell_format)
        val = text
      elif cell_type == "inlineStr":
        is_node = cell.find("main:is", ns) or cell
        text, has_runs = _rich_text_to_string(is_node, ns)
        if not has_runs and any(cell_format.values()):
          text = _wrap_with_markers(text, **cell_format)
        val = text
      elif cell_type == "b":
        val = "TRUE" if (val_node.text if val_node is not None else "") in ("1", "true", "TRUE") else "FALSE"
      else:
        val = val_node.text if val_node is not None else ""
        if isinstance(val, str) and val and any(cell_format.values()):
          val = _wrap_with_markers(val, **cell_format)
      cells[col] = val
    rows.append(cells)
  if not rows:
    return []
  max_col = max((max(row.keys()) for row in rows if row), default=-1)
  return [[row.get(idx, "") for idx in range(max_col + 1)] for row in rows]


def load_xlsx_minimal(path: Path):
  """Minimal XLSX loader when openpyxl is unavailable (no external deps)."""
  sheets = {}
  sheet_order = []
  column_order = {}
  with ZipFile(path, "r") as z:
    shared_strings = _load_shared_strings(z)
    styles = _load_styles(z)
    wb_root = ET.fromstring(z.read("xl/workbook.xml"))
    ns_main = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    ns_rel = {"rel": "http://schemas.openxmlformats.org/package/2006/relationships"}
    rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    rid_to_target = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels.findall("rel:Relationship", ns_rel)}

    for sheet in wb_root.findall("main:sheets/main:sheet", ns_main):
      name = sheet.attrib.get("name", "Sheet")
      sheet_order.append(name)
      rid = sheet.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
      target = rid_to_target.get(rid)
      if not target:
        sheets[name] = []
        continue
      path_xml = "xl/" + target
      rows = _load_rows_from_xml(z, path_xml, shared_strings, styles)
      if not rows:
        sheets[name] = []
        continue
      header = [norm(cell) for cell in rows[0]]
      column_order[name] = derive_column_order(header)
      sheets[name] = rows_to_records(header, rows[1:])
  return sheets, sheet_order, column_order


def build_data_json(raw_sheets, sheet_order, column_order):
  sheets = {}
  traits = {}
  states = {}
  vehicle_traits = {}
  vehicle_weapon_traits = {}
  vehicle_states = {}

  for sheet_name, records in raw_sheets.items():
    sheet_key = get_canonical_sheet_key(sheet_name)
    processed = normalise_rows_for_sheet(sheet_name, records)
    sheets[sheet_name] = processed

    if sheet_key == "traits":
      traits.update(collect_name_description_map(processed))
    elif sheet_key == "conditions":
      states.update(collect_name_description_map(processed))
    elif sheet_key == "vehicleConditions":
      vehicle_states.update(collect_name_description_map(processed))
    elif sheet_key == "vehicleTraits":
      vehicle_traits.update(collect_name_description_map(processed))
      for record in processed:
        type_value = canon_key(get_record_value(record, "type"))
        name = norm(get_record_value(record, "name"))
        desc = trim_text(get_record_value(record, "description") or get_record_value(record, "effect"))
        if name and desc and ("weapon" in type_value or "bron" in type_value):
          vehicle_weapon_traits[name] = desc

  return {
    "sheets": sheets,
    "_meta": {
      "traits": traits,
      "states": states,
      "vehicleTraits": vehicle_traits,
      "vehicleWeaponTraits": vehicle_weapon_traits,
      "vehicleStates": vehicle_states,
      "sheetOrder": sheet_order,
      "columnOrder": column_order,
    },
  }


def main():
  xlsx = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("Repository_EN.xlsx")
  out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("data.json")

  raw_sheets, sheet_order, column_order = load_xlsx_minimal(xlsx)
  data = build_data_json(raw_sheets, sheet_order, column_order)
  out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
  print(f"OK: saved {out}")


if __name__ == "__main__":
  main()
