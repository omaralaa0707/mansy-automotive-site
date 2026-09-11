# Mansy Automotive — site 17 of 46

A concept site built entirely from this dealership's own published material.
**Not affiliated with Mansy Automotive, and not an official site.**

- **Live:** https://mansy-automotive-site.vercel.app
- **Repo:** [mansy-automotive-site](https://github.com/omaralaa0707/mansy-automotive-site)

## What this page is about

Every site in this series is built around something true and checkable about
the dealer's own account — a pattern in what they publish, a contradiction
between two of their channels, or a fact about their showroom — rather than
around a generic template. The palette, type, 3D piece and motion below were
all chosen to serve that finding.

## Design record

**Palette**
: Their showroom sampled: plaster #F0ECEA ground, ink #191718, and the two things in every frame they publish — the gold fluted column (#FFEA80, taken down to #8A6B1F for text) and the red branded mat in every footwell (#A4142D). A light page keeps the gold as *architecture* rather than luxury signalling, which is how it behaves in their photographs

**Type pairing**
: Syne + Plus Jakarta Sans / Lalezar + Alexandria (AR)

**3D / signature technique**
: **The fluted chart**: one column per car, height driven by the figure they published, built as a ring of vertical reeds with a per-reed tint so the section reads round without a light rig — the form taken from the gold fluted column standing behind every car in their showroom. Heights ease between metrics so a change of figure reads as the same four cars reordering

**Motion language**
: The read-out: figures settle rather than perform, and the columns ease between values instead of cutting

## Sources

Everything on the page was sourced from:

- Instagram: https://www.instagram.com/mansyautomotive/
- Facebook: https://www.facebook.com/MansyAutomotive/
- Google Maps: https://www.google.com/maps/place/Mansy+Automotive/data=!4m2!3m1!1s0x0:0x3a49e7796ecd8c94

Photography belongs to the dealership (or, where their frames are watermarked
by an outside studio, to that studio) and is used here only to document their
own published material. No figure on the page is invented: anything the dealer
did not publish is marked as unpublished rather than estimated.

## Running it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build — must pass before shipping
pnpm lint     # eslint, zero warnings
```

Requires `node-linker=hoisted` in `.npmrc` (already present) or three.js peer
deps fail to resolve.

## Structure

```
src/content/media.ts      verified facts and figures — the data layer
src/content/en.ts|ar.ts   all copy, both locales, identical shapes
src/content/schema-ext.ts the page-specific content contract
src/components/webgl/     the 3D piece
src/components/site/      the page composition
src/app/globals.css       palette tokens, type, RTL overrides, motion
```

Arabic/English toggle with full RTL. All CSS direction overrides key off
`[dir="rtl"]` (never `[lang]`) and live outside `@layer`. Every Latin or
numeric fragment inside Arabic copy is wrapped in `.latin` for correct bidi.

---

Part of a 46-site series. See the [top-level README](../README.md) for the full
index and [`TRACKING.md`](../TRACKING.md) for the differentiation log.
