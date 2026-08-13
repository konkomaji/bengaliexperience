# Asset brief: the driving scene

Everything needed to replace the static hero with a bus actually driving down
an infinite road, with the wheels, the suspension and the parallax all
physically correct.

The current hero (`design/source/hero-kolkata.png`, 1915×821, flat, no alpha)
cannot be animated. The bus is painted into the background, so it cannot be
moved, and the background cannot scroll behind it. Everything below exists to
separate those into layers.

---

## How to use this file

Every prompt is built the same way:

```
[STYLE PREFIX]  +  [the asset's own prompt]  +  [GLOBAL NEGATIVE]  +  [the asset's own negatives]
```

Paste the style prefix and the global negative every single time. They are what
keep eight separately generated files looking like one scene. Skipping them on
one asset is how you end up with a road that does not belong to its own
background.

---

## Style prefix

Paste at the start of every prompt.

```
Painterly digital illustration with faceted low-poly shading, hand-painted
texture, cinematic dusk lighting in Kolkata, warm sodium streetlamp glow,
muted ochre and deep green palette, hazy humid air, wet reflective surfaces
after rain, rich shadows, slightly desaturated, film grain, 1970s Indian
street photography colour grade, high detail, no camera perspective
distortion,
```

## Global negative

Paste at the end of every prompt.

```
text, letters, words, numbers, signage with readable writing, watermark,
logo, signature, caption, UI elements, frame, border, vignette, drop shadow,
cast shadow on ground, people in foreground, cartoon, anime, cel shading,
flat vector, 3D render, CGI, plastic look, oversaturated, neon, HDR glow,
lens flare, bokeh, depth of field blur, motion blur, tilted horizon, fisheye,
wide angle distortion, perspective distortion, cropped subject, cut off edges
```

Three of those matter more than the rest:

- **`drop shadow` / `cast shadow on ground`.** The bus needs a contact shadow
  that moves with it, which I generate at runtime. A shadow painted into the
  image slides around underneath and looks broken.
- **`text` / `numbers`.** Generators garble lettering, and this art is shown
  large. Route boards stay blank; I can add real text in HTML later if wanted.
- **`perspective distortion`.** Every layer must be a flat side-on elevation.
  One layer with vanishing-point perspective will not sit with the others.

---

## The files

| # | File | Size | Alpha | Tiles | Priority |
|---|---|---|---|---|---|
| 1 | `bus-body.png` | 2400×1200 | yes | no | **required** |
| 2 | `bus-wheel.png` | 512×512 | yes | no | **required** |
| 3 | `bus-reference.png` | 2400×1200 | no | no | **required** |
| 4 | `road.png` | 2048×512 | no | **horizontally** | **required** |
| 5 | `bg-far.png` | 3840×1080 | yes | **horizontally** | required |
| 6 | `bg-mid.png` | 3840×1080 | yes | **horizontally** | required |
| 7 | `bg-near.png` | 3840×1080 | yes | **horizontally** | required |
| 8 | `traffic-taxi.png` | 1200×600 | yes | no | optional |
| 9 | `traffic-truck.png` | 1600×800 | yes | no | optional |
| 10 | `exhaust-puff.png` | 512×512 | yes | no | optional |

Sizes are **masters**. Generate once at these dimensions and I derive every
smaller variant myself, including all the mobile ones. Do not generate a
second set by hand.

If your generator cannot reach 3840 wide, 2048 is acceptable for the three
background layers and I will handle it. Do **not** upscale the bus: it is the
one thing shown large and soft edges will be obvious.

---

## 1. `bus-body.png` — the bus, no wheels

**2400×1200, transparent PNG.** The single most important file here.

```
[STYLE PREFIX]

A classic Indian city bus in exact side profile elevation, viewed straight on
at eye level, isolated on a fully transparent background. West Bengal state
transport livery: deep yellow lower body panels, maroon window band, a single
red horizontal stripe, cream skirt along the bottom, weathered and dusty with
honest wear, small rust marks and scuffs near the wheel arches.

The bus is FULL and ALIVE. Through the long row of side windows, ten to twelve
passengers are clearly visible: men and women of different ages in everyday
Bengali clothing, some seated and some standing holding overhead rails, one
leaning an elbow out of an open window, one turned talking to another,
silhouetted against the warm interior light. The interior is dimly lit amber,
so the figures read as real people rather than dark shapes.

At the front, the DRIVER is clearly visible through the large driver's side
window: a middle-aged Bengali man in a short-sleeved shirt, both hands on a
large thin steering wheel, looking ahead down the road, seated slightly high
in an open cab.

A steel roof rack carries stacked luggage: canvas bundles, tin trunks, jute
sacks and a rolled bedroll, roped down. Round headlamps, chrome mirrors on
long arms, a folding door behind the cab, ventilation grille, empty blank
destination board with no writing on it.

Empty wheel arches, no wheels or tyres drawn, the openings clean and dark so
wheels can be placed in them separately. The bus sits level, its lowest point
horizontal. Full vehicle visible with generous empty margin on all four sides,
nothing touching or crossing the image edge.
```

**Extra negatives**

```
wheels, tyres, tires, rims, hubcaps, ground, road, tarmac, kerb, background,
sky, buildings, scenery, shadow beneath vehicle, front three-quarter view,
rear view, angled view, modern bus, low-floor bus, air-conditioned coach,
tinted windows, empty bus, no passengers, blurred faces
```

**Check before sending**

- [ ] Background genuinely transparent, not white or checkered pixels
- [ ] Wheel arches empty, no tyres
- [ ] Driver visible at the front with hands on the wheel
- [ ] Ten or more passengers visible through the windows
- [ ] Nothing cropped, clear margin all round
- [ ] Exact side view, no angle, no perspective
- [ ] No shadow under the bus

---

## 2. `bus-wheel.png` — one wheel

**512×512, transparent PNG.** Reused for both axles.

```
[STYLE PREFIX]

A single heavy bus wheel in exact side profile, isolated on a fully
transparent background. Worn black rubber tyre with a chunky cross-ply tread
pattern, a dusty steel rim, five visible lug nuts around a slightly rusted
central hub, faint dried mud spatter on the sidewall. Perfectly circular,
photographed straight on with no angle. The wheel is centred exactly in the
frame, with the centre of the hub at the exact centre of the image, and a
small even margin of empty transparent space all around it.
```

**Extra negatives**

```
ground, road, shadow, vehicle, bus body, wheel arch, background, angled view,
perspective, oval, ellipse, squashed, off-centre, cropped, multiple wheels,
alloy wheel, chrome spinner, modern tyre
```

**Check before sending**

- [ ] Hub centre is the exact image centre. Rotate the image 90°: if the wheel
      appears to move, it is off-centre and will visibly wobble when it spins
- [ ] Circular, not oval
- [ ] Transparent, no ground or shadow

This is the most common failure in the whole set. Four pixels off centre is
clearly visible once the wheel is rotating at speed.

---

## 3. `bus-reference.png` — the same bus, with wheels

**2400×1200, background can be anything.** Not used on the site.

Same prompt as `bus-body.png`, but with the wheels fitted normally. I measure
the axle positions off this so the separate wheels land exactly in the arches.
Without it I am guessing, and a wheel a few pixels out of its arch looks
broken.

Generate it from the same seed as `bus-body.png` if your tool supports seeds,
so the two are the same bus.

---

## 4. `road.png` — seamless road strip

**2048×512, no alpha needed, must tile horizontally.**

```
[STYLE PREFIX]

A seamlessly horizontally tileable strip of wet Kolkata city asphalt, viewed
from a low side-on angle, as a flat horizontal band. Dark grey tarmac,
patched and uneven, with old repairs, faint tram rails set into the surface,
scattered small potholes, damp reflective patches catching warm streetlamp
light, grit and dust at the edges. Along the top edge a low stone kerb runs
the full width. Perfectly even lighting across the entire strip with no
brighter or darker end. The left edge continues exactly into the right edge
so the strip repeats forever with no visible seam or join.
```

**Extra negatives**

```
vehicles, bus, car, people, buildings, sky, horizon, lane markings with
text, arrows, crosswalk, zebra crossing, vanishing point, perspective,
converging lines, road disappearing into distance, centred composition,
vignette, darker edges, brighter centre, visible seam, repeating obvious
pattern
```

**Check before sending**

- [ ] Paste the image twice side by side. If you can see where they meet, it
      is not tileable and I cannot use it
- [ ] Even brightness left to right, no vignette
- [ ] Flat band, no vanishing point

---

## 5–7. Background layers

All three: **3840×1080, transparent PNG, seamless horizontally.**

They stack, so each must be sparse. Three dense layers scrolling at different
speeds turns into visual mush at any real speed.

**Keep the interest in the middle 60% vertically.** The top and bottom get
cropped differently on different screens, badly so on tall phones.

### `bg-far.png` — skyline, slowest layer

```
[STYLE PREFIX]

A seamlessly horizontally tileable distant Kolkata skyline silhouette on a
fully transparent background, seen from far away in hazy dusk air. The steel
lattice of the Howrah Bridge, distant colonial rooftops, water tanks, a few
mill chimneys, faint radio masts. Very low contrast, heavily atmospheric, all
detail softened by humid haze, almost monochrome warm grey with a hint of
ochre. Sparse and simple, large empty gaps between shapes, occupying only the
middle horizontal band of the image with fully transparent space above and
below. The left edge continues exactly into the right edge with no seam.
```

Extra negatives: `foreground detail, sharp focus, high contrast, dense
buildings, full skyline, ground, road, sky colour, gradient background,
vehicles, people, trees in front`

### `bg-mid.png` — the street, middle layer

```
[STYLE PREFIX]

A seamlessly horizontally tileable row of old Kolkata street buildings on a
fully transparent background, seen straight on in flat side elevation. Two and
three storey colonial shophouses with shuttered fronts, peeling plaster in
ochre, faded green and dusty pink, iron balconies, awnings over dark shopfront
openings, tangles of overhead electrical wire, a few blank unlit signboards
with no writing, occasional streetlamp posts with warm glowing bulbs. Moderate
detail, medium contrast. Buildings of varying heights with clear gaps between
groups. The left edge continues exactly into the right edge with no seam.
```

Extra negatives: `readable signs, shop names, hoardings with text, perspective,
angled buildings, vanishing point, ground, road, pavement, sky, vehicles,
crowds, modern buildings, glass towers`

### `bg-near.png` — roadside, fastest layer

```
[STYLE PREFIX]

A seamlessly horizontally tileable roadside foreground strip on a fully
transparent background: leaning palm and gulmohar trees, overgrown shrubs,
rusted iron railings, a few leaning electricity poles, a hand-pump, stacked
bricks, a closed tea stall. Higher contrast and darker than the background,
slightly silhouetted against the dusk. Very sparse, with large fully
transparent gaps between objects so the layers behind stay visible. Occupies
only the lower middle band of the image. The left edge continues exactly into
the right edge with no seam.
```

Extra negatives: `dense foliage, solid hedge, continuous wall, filling the
frame, ground, road surface, sky, buildings, people, vehicles, perspective`

---

## 8–10. Optional extras

Skip these until the main scene is running.

**`traffic-taxi.png`** — 1200×600, transparent. A yellow Hindustan Ambassador
taxi in exact side profile, black roof, worn paint, isolated, no wheels
separated (its wheels can stay attached, it moves too fast to notice). Same
negatives as the bus.

**`traffic-truck.png`** — 1600×800, transparent. A decorated Indian lorry in
exact side profile, painted panels and hanging chains, blank where text would
normally go.

**`exhaust-puff.png`** — 512×512, transparent. A single soft grey-brown puff
of diesel smoke, wispy, no hard edges, fading to fully transparent at every
edge.

---

## Mobile

**You do not need to generate anything twice.** Portrait phones show the same
scene at a smaller size; nothing needs recomposing. From each master I
generate, automatically:

| Variant | Width | Used at |
|---|---|---|
| `@2x` | as delivered | desktop retina, large tablets |
| `@1x` | 50% | desktop standard, tablets |
| `@mobile` | ~35% | phones, both orientations |

Served through `<picture>` with `srcset`, so a phone downloads roughly an
eighth of the desktop bytes. WebP with alpha, AVIF where supported.

Three things in the art itself decide whether mobile works, which is why they
are in the prompts above:

1. **Interest in the middle 60% vertically.** A tall phone crops the scene band
   hard. Anything near the top or bottom edge of a background layer will be
   cut on some screens.
2. **Sparse background layers.** At phone width you see maybe a third as much
   scene, so dense art becomes noise. Big transparent gaps are what make it
   readable small.
3. **Bus fully in frame with margin.** On a narrow screen the bus is scaled to
   fit, and anything touching the image edge will look clipped.

The rest of the page is already responsive and I will check the driving scene
on real viewport sizes once it is in.

---

## Delivering

Drop the PNGs into `design/source/` (gitignored, so they will not bloat the
repo). Keep the filenames exactly as listed above.

Tell me if any of these are true and I will work around them:

- your generator could not reach the stated size
- a background layer is not truly seamless
- the wheel hub is not exactly centred
- you have the axle coordinates from `bus-reference.png` already

Then I build the engine: fixed-timestep loop, wheel spin locked to ground
speed so nothing slips, parallax at real depth ratios, damped-spring
suspension with pitch under acceleration and braking, a lurch on the horn, and
`prefers-reduced-motion` honoured. A static poster frame covers first paint and
crawlers so the LCP and the structured data do not regress.
