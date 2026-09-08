// ─────────────────────────────────────────────────────────────
// Veldt raw colour ramp — THE source of truth for every colour.
//
// This file holds hex values and nothing else. Names here describe
// the COLOUR ("deep"/"moss"/"clay"), never the job it does — roles
// live in `theme.ts` as `T.*`, which is what components import.
//
// To re-skin the product, edit these values and nothing else. No
// component references this file directly.
// ─────────────────────────────────────────────────────────────

export const P = {
  // ── Neutrals ────────────────────────────────────────────────
  white: "#FFFFFF",
  mist: "#F1F4F2", // page ground
  haze: "#EBF0ED", // subtle fill
  sageWash: "#EAF0EC", // alt surface
  stone: "#DCE4DF", // hairline border
  stoneDeep: "#C3D0C9", // stronger divider / scrollbar

  // ── Greens (brand) ──────────────────────────────────────────
  forest: "#1F5C4A", // primary brand
  forestDeep: "#164537", // brand pressed / hover
  forestWash: "#E4EFEA",
  eucalyptus: "#3C7D6B", // secondary green
  eucalyptusDp: "#2C5F51",
  eucalyptusWa: "#E6F0EC",
  eucalyptusBd: "#C4DCD1",

  // ── Blues ───────────────────────────────────────────────────
  lagoon: "#2C6382",
  lagoonDeep: "#1F4A61",
  lagoonWash: "#E6EEF3",
  lagoonBorder: "#C6D9E4",

  // ── Golds ───────────────────────────────────────────────────
  amber: "#8A6B12",
  amberDeep: "#6B520E",
  amberWash: "#F3EFDF",
  amberBorder: "#E4DCB8",

  // ── Reds ────────────────────────────────────────────────────
  // Desaturated brick rather than a pure alert red, so warnings
  // sit inside the palette instead of shouting over it.
  brick: "#A63D2F",
  brickDeep: "#7E2B20",
  brickWash: "#F7EBE8",
  brickBorder: "#E8D0CA",

  // ── Text ramp ───────────────────────────────────────────────
  ink: "#12211C",
  inkSoft: "#44605A",
  inkFaint: "#7C918B",

  // ── Categorical accents ─────────────────────────────────────
  // For badges that distinguish CATEGORIES (content types, task
  // types) — no status meaning. Each is a fg / bg / border trio,
  // all tuned to the same lightness so no one hue dominates.
  moss: { fg: "#2E6B52", bg: "#E4F0EA", border: "#C4DFD2" },
  indigo: { fg: "#2C5A82", bg: "#E5EDF4", border: "#C5D8E6" },
  plum: { fg: "#5E3B73", bg: "#EEE7F2", border: "#DACFE3" },
  rose: { fg: "#7C3352", bg: "#F4E6EC", border: "#E5CCD8" },
  leaf: { fg: "#4A6B2E", bg: "#EBF1E3", border: "#D3E1C4" },
  clay: { fg: "#7A5A2E", bg: "#F2EDE2", border: "#E1D6BF" },

  // ── Alpha layers ────────────────────────────────────────────
  scrim: "rgba(18, 33, 28, 0.45)",
  scrimDeep: "rgba(18, 33, 28, 0.65)",
  glass: "rgba(255, 255, 255, 0.75)",
  glassSoft: "rgba(255, 255, 255, 0.55)",
} as const;
