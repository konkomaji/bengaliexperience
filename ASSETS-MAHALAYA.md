# Asset brief: the Mahalaya window

Everything needed to replace the placeholder CSS scene with real painted art: a
1990s Kolkata room before dawn, an old radio on the barred windowsill, and the
city and sky beyond it. The sky, the sun, the warm light and the dust are drawn
at runtime and driven by how far through the broadcast we are; **the art is the
still, layered world they move inside.**

Deliver the layers and the engine composites them: each sits at its own depth
and shifts by a different amount as the pointer moves (and on a phone, as the
device tilts), so the flat window gains real depth — you feel like you are
sitting a little behind the sill looking out. That is the parallax; it needs
the scene cut into the layers below and nothing else.

---

## How to use this file

Every prompt is built the same way:

```
[STYLE PREFIX]  +  [the layer's own prompt]  +  [GLOBAL NEGATIVE]  +  [the layer's own negatives]
```

Paste the style prefix and the global negative every time. They are what keep
seven separately generated files reading as one room at one moment.

## Style prefix

```
Painterly nostalgic digital illustration, pre-dawn in 1990s Kolkata, the room
lit low and warm by a single tungsten bulb, the world outside still cool blue
night, humid Bengal air with faint haze, muted teal-and-ochre palette, soft
film grain, hand-painted texture, flat straight-on elevation with no camera
perspective, cinematic and quiet, 1970s to 1990s Indian domestic nostalgia,
high detail,
```

## Global negative

```
text, letters, words, numbers, readable writing, watermark, logo, signature,
caption, UI, frame border, vignette, harsh cast shadow, people, faces, cartoon,
anime, cel shading, flat vector, 3D render, CGI, plastic, oversaturated, neon,
HDR glow, lens flare, bokeh, depth of field blur, motion blur, tilted horizon,
fisheye, wide angle distortion, perspective distortion, cropped subject
```

Three matter most:

- **`perspective distortion` / flat elevation.** Every layer is a flat, head-on
  plane. One layer with vanishing-point perspective will not sit with the rest.
- **`text` / `numbers`.** Generators garble lettering; the Bengali and the
  frequency scale are added cleanly in HTML. Keep every surface blank.
- **The sky is not painted.** Leave the window opening and everything above the
  rooftops transparent. The sky, the sun and the dawn are generated in code so
  they can brighten across the hour and a half; a painted sky cannot.

---

## The layers

Back to front. Sizes are **masters** — generate once, all smaller variants are
derived. `alpha` means a real transparent PNG, not white.

| # | File | Size | Alpha | Depth | Priority |
|---|---|---|---|---|---|
| 1 | `maha-clouds.png` | 2560×1000 | yes | far | optional |
| 2 | `maha-city-far.png` | 2560×900 | yes | far | required |
| 3 | `maha-city-near.png` | 2560×1000 | yes | mid | required |
| 4 | `maha-room.png` | 2560×1440 | yes | **foreground** | **required** |
| 5 | `maha-radio.png` | 1200×900 | yes | foreground | **required** |
| 6 | `maha-curtain.png` | 1400×1600 | yes | nearest | optional |

The city layers are **wider than the window on purpose** so the parallax has
something to slide into; keep the interest centred and let the sides run out.

---

## 1. `maha-clouds.png` — thin dawn cloud, slowest layer

**2560×1000, transparent.** A few long, low wisps only.

```
[STYLE PREFIX]

A few thin, long, horizontal wisps of high cloud on a fully transparent
background, the kind that catch the first colour of a Bengal dawn. Very sparse,
soft-edged, low contrast, almost monochrome cool grey, occupying only a
horizontal band across the middle with large empty transparent gaps. Nothing
solid, no full cloud cover.
```

Extra negatives: `dense cloud, overcast, storm, sky colour, gradient, sun,
moon, stars, ground, buildings`

---

## 2. `maha-city-far.png` — the distant skyline, slow layer

**2560×900, transparent, seen from a rooftop across the city.**

```
[STYLE PREFIX]

A distant Kolkata skyline silhouette on a fully transparent background, seen far
off through pre-dawn haze from a North Kolkata rooftop: the faint dome of the
Victoria Memorial, a hint of the Howrah Bridge lattice to one side, a scatter of
old mid-rise blocks and water tanks, a mill chimney, all low-contrast and softly
hazed almost to one flat tone. Sparse, simple, sitting only in a low horizontal
band with fully transparent sky above and transparent foreground below.
```

Extra negatives: `foreground detail, sharp focus, tall glass towers, modern
skyscrapers, high contrast, ground, road, sky colour, vehicles, people`

---

## 3. `maha-city-near.png` — the near rooftops, mid layer

**2560×1000, transparent.** The detail layer, the one you actually read.

```
[STYLE PREFIX]

The near rooftops of old North Kolkata seen straight on across a lane, on a
fully transparent background: flat terrace roofs with low parapets, black
plastic and galvanised water tanks on iron stands, a thicket of TV aerials and
dish antennas, sagging electrical and cable wires strung between bamboo poles,
a rooftop temple finial with a small trishul, a water tank ladder, a couple of
pigeons perched on a wire, a lone potted plant on a parapet. Weathered, lived-in,
silhouetted and slightly darker than the far skyline, catching a thin warm rim
of dawn light along the top edges. Occupies the lower half; fully transparent
above the roofline and below.
```

Extra negatives: `skyscrapers, glass, modern towers, clean new buildings, sky
colour, ground floor, street level, vehicles, crowds, perspective, vanishing
point`

---

## 4. `maha-room.png` — the room and the window, foreground

**2560×1440, transparent window opening.** The single most important file: the
whole interior, with a hole cut for the world outside.

```
[STYLE PREFIX]

The inside of a modest 1990s Kolkata home at four in the morning, seen straight
on, lit low and warm by one tungsten bulb off to the side. Centre of the wall is
a tall window with a dark teak wooden frame and a grid of vertical wrought-iron
security bars, its wooden shutters folded open to the sides, a thin cotton
curtain tied back at one edge, a wide wooden windowsill worn smooth. The wall is
old ochre distemper with patches of damp and peeling paint. On the wall beside
the window: a small framed print of the goddess Durga with a faded marigold
garland over it, a hanging paper wall calendar, a black bakelite light switch
board, a nail with a cloth bag. A slow ceiling fan blade and the ceiling edge
just enter at the top. The window opening itself is COMPLETELY EMPTY and
transparent, no glass, no sky, no city painted in it, so the layers behind show
through. Full transparent margin is not needed; the walls fill the frame to all
four edges, only the window is cut out.
```

**Extra negatives**

```
sky, clouds, city, buildings outside, sun, view through window, glass
reflection, people, furniture blocking the window, modern interior, television,
computer, plastic furniture, bright daylight, readable calendar dates, readable
text on frame
```

**Check before sending**

- [ ] The window opening is genuinely transparent, not painted with sky
- [ ] Iron bars and wooden frame are on the room layer, not the city layer
- [ ] Warm interior on the walls, no daylight
- [ ] The sill is clear and flat where the radio will sit
- [ ] Straight-on, no perspective

---

## 5. `maha-radio.png` — the radio, the thing you press

**1200×900, transparent, isolated.** Featured and exact: this is the control and
the emotional centre, so it earns the most detail.

```
[STYLE PREFIX]

A single old valve table radio from the 1960s-70s, in exact side-on front
elevation, isolated on a fully transparent background, the kind that sat in
every Bengali home. A warm wooden cabinet with rounded corners and a French-
polish sheen, a large rectangular speaker area covered in beige woven cloth
behind a few thin wooden slats, a long horizontal glass tuning dial to one side
lit from behind with a soft amber glow and a thin vertical red tuning needle,
two round bakelite knobs below with knurled edges, a short telescopic chrome
antenna angled up from one back corner, a small blank metal maker's plate, faint
dust and honest wear. Photographed straight on, level, the whole radio in frame
with clean even margin, the dial clearly the brightest part.
```

**Extra negatives**

```
modern radio, digital radio, boombox, speaker, bluetooth, transistor pocket
radio, plastic body, ground, shadow beneath, table, wall, background, angled
view, perspective, readable frequency numbers, brand name, screen, buttons
```

**Check before sending**

- [ ] Warm wood cabinet, cloth grille, glowing horizontal dial, two knobs, antenna
- [ ] Isolated on transparent, no shadow or surface under it
- [ ] Straight-on and level, nothing cropped
- [ ] The lit dial is the brightest thing on it (the engine makes it pulse)

---

## 6. `maha-curtain.png` — the sheer curtain, nearest layer

**1400×1600, transparent.** Optional. The closest thing to the viewer, so it
gets the strongest parallax and a slow drift.

```
[STYLE PREFIX]

A single thin white cotton net curtain hanging down one side of the frame on a
fully transparent background, softly translucent, catching a little warm lamp
light, gently gathered, the rest of the frame fully transparent. Just the one
vertical fall of fabric down the left edge.
```

Extra negatives: `heavy drape, opaque curtain, full cover, rod, wall, window,
pattern, print, people`

---

## What the engine adds (no art needed)

So you do not generate these:

- **the sky**, a night-to-dawn gradient across the whole broadcast;
- **the sun**, a disc that rises and crests the near rooftops at the very end;
- **the warm light** raking through the bars into the room as it brightens, and
  the **dust** turning in it;
- **the dial's glow**, pulsing while it plays;
- **the parallax**, each layer shifting by its depth as the pointer moves.

## Delivering

Drop the PNGs into `design/source/` (gitignored). Keep the filenames exactly as
above. Tell me if a layer could not reach its size, if the window opening is not
truly transparent, or if the radio arrived with a shadow — and I will work
around it. Then I wire the parallax and the dawn, and the placeholder room is
replaced layer by layer.
