# Blue frame guide — calculating `CONTENT_RECTS_BY_BACKGROUND_ID`

This file explains how to calculate the content rectangle (`x`, `y`, `w`, `h`) for a DataSlate background by using the matching technical `*_ramka.png` file with a visible blue frame.

The filename remains `NiebieskaRamka.md` for compatibility with existing project references, but the document content is English-only.

---

## 1. Source files

| File / folder | Purpose |
| --- | --- |
| `DataSlate/assets/data/Mapowanie.xlsx` | Mapping between final background files and matching blue-frame files. |
| `DataSlate/assets/ramki/*_ramka.png` | Technical blue-frame images. |
| `DataSlate/assets/backgrounds/` | Final backgrounds displayed to players. |
| `DataSlate/DataSlate_test.html` | Current place where `CONTENT_RECTS_BY_BACKGROUND_ID` is used or tested. |

`Mapowanie.xlsx` may stay in its current structure. Do not rewrite the workbook unless the background mapping itself changes.

---

## 2. What the blue frame is for

The blue-frame image is not a player-facing background.

It is a technical reference image used to detect the safe text area. The detected rectangle is normalized to 0..1 coordinates and then used by the renderer to position message text on the matching final background.

---

## 3. Pixel bounding box

For each blue-frame image, calculate the pixel bounding box of the visible blue area.

Required pixel values:

| Value | Meaning |
| --- | --- |
| `minX` | Left edge of the detected blue area. |
| `minY` | Top edge of the detected blue area. |
| `maxX` | Right edge of the detected blue area. |
| `maxY` | Bottom edge of the detected blue area. |
| `imgW` | PNG image width. |
| `imgH` | PNG image height. |

---

## 4. Normalized rectangle formula

Convert the pixel bounding box to normalized 0..1 values:

```text
x = minX / imgW
y = minY / imgH
w = (maxX - minX + 1) / imgW
h = (maxY - minY + 1) / imgH
```

Round final values to four decimal places, matching the current code style.

Example object shape:

```js
{ x:0.1214, y:0.0962, w:0.7385, h:0.8081 }
```

---

## 5. Blue pixel detection rule

A pixel belongs to the blue frame when all of these are true:

- the pixel is visible,
- the blue channel is above 140,
- the blue channel is at least 30 points stronger than red,
- the blue channel is at least 15 points stronger than green.

This detects visible pixels where the blue channel clearly dominates.

The rule reproduces the current coordinates for the existing backgrounds and gives consistent results for new frames that use the same blue-frame convention.

---

## 6. Example — WnG background

Technical frame file:

```text
DataSlate/assets/ramki/WnG_ramka.png
```

Measured PNG dimensions:

```text
1549 x 2048
```

Detected bounding box:

```text
minX = 188
minY = 197
maxX = 1331
maxY = 1851
```

Normalized coefficients:

```text
x = 0.1214
y = 0.0962
w = 0.7385
h = 0.8081
```

Entry for `CONTENT_RECTS_BY_BACKGROUND_ID`:

```js
10:{ x:0.1214, y:0.0962, w:0.7385, h:0.8081 } // WnG
```

---

## 7. Example — updated Pergamin frame

Technical frame file:

```text
DataSlate/assets/ramki/Pergamin_ramka.png
```

Measured PNG dimensions:

```text
1024 x 1536
```

Detected bounding box:

```text
minX = 79
minY = 200
maxX = 966
maxY = 1270
```

Normalized coefficients:

```text
x = 0.0771
y = 0.1302
w = 0.8672
h = 0.6973
```

Entry for `CONTENT_RECTS_BY_BACKGROUND_ID`:

```js
9:{ x:0.0771, y:0.1302, w:0.8672, h:0.6973 } // Pergamin
```

---

## 8. Procedure for adding a new background

1. Add the final player-facing background to `DataSlate/assets/backgrounds/`.
2. Add the matching technical blue-frame image to `DataSlate/assets/ramki/`.
3. Update `DataSlate/assets/data/Mapowanie.xlsx`.
4. Calculate `x`, `y`, `w`, and `h` using the method in this document.
5. Add the result to `CONTENT_RECTS_BY_BACKGROUND_ID`.
6. Verify that `backgroundId` in the GM payload matches the same background entry.
7. If the new background should be the default, update the relevant default background setting in the GM panel code.
8. Test the background in `GM_test.html` and `DataSlate_test.html`.
9. Test the production files `GM.html` and `DataSlate.html` if the change is meant for production.
10. Update `DataSlate/docs/README.md` and `DataSlate/docs/Documentation.md` if the workflow or default background changes.

---

## 9. Practical notes

- Treat the physical blue-frame file in `assets/ramki/` as the reference when calculating the rectangle.
- `Mapowanie.xlsx` maps final backgrounds to blue-frame files, but always verify that the referenced file exists.
- If the frame color changes from blue to another color, update the color-detection thresholds.
- If the frame uses antialiasing, the current thresholds should still work because they detect blue-channel dominance rather than one exact RGB value.
- If the safe text area looks wrong on the player screen, re-check the mapping, the frame file, the detected bounding box, and the assigned background ID.
