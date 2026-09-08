import { createTheme, type Shadows } from "@mui/material/styles";
import { P } from "./palette";

// ─────────────────────────────────────────────────────────────
// `T` — semantic design tokens. This is what components import.
//
// Every name here describes a JOB ("border", "danger", "muted"),
// never a colour. Swapping the brand means editing `palette.ts`;
// this file only ever changes when a new *role* is needed.
//
// Raw hex in a component is a bug — the `veldt/no-raw-color` lint
// rule will catch it. If nothing here fits, add a role here first.
// ─────────────────────────────────────────────────────────────

const T = {
  // ── Surfaces ────────────────────────────────────────────────
  bg: P.mist,
  navBg: P.white,
  sideBg: P.white,
  card: P.white,
  cardAlt: P.sageWash,
  dim: P.haze,
  white: P.white,

  // ── Lines ───────────────────────────────────────────────────
  border: P.stone,
  borderStrong: P.stoneDeep,

  // ── Text ────────────────────────────────────────────────────
  text: P.ink,
  sub: P.inkSoft,
  muted: P.inkFaint,
  onBrand: P.white, // text/icons sitting on a filled brand colour

  // ── Brand ───────────────────────────────────────────────────
  terra: P.forest,
  terraDk: P.forestDeep, // hover / pressed on filled brand
  terraLt: P.forestWash,

  sage: P.eucalyptus,
  sageDk: P.eucalyptusDp,
  sageLt: P.eucalyptusWa,

  teal: P.lagoon,
  tealDk: P.lagoonDeep,
  tealLt: P.lagoonWash,

  gold: P.amber,
  goldDk: P.amberDeep,
  goldLt: P.amberWash,

  // ── Status ──────────────────────────────────────────────────
  // Each has: base (icons, borders, mid-weight text), Dk (text on
  // the wash, meets AA), Lt (fill), Bd (border on the fill).
  danger: P.brick,
  dangerDk: P.brickDeep,
  dangerLt: P.brickWash,
  dangerBd: P.brickBorder,

  warning: P.amber,
  warningDk: P.amberDeep,
  warningLt: P.amberWash,
  warningBd: P.amberBorder,

  success: P.eucalyptus,
  successDk: P.eucalyptusDp,
  successLt: P.eucalyptusWa,
  successBd: P.eucalyptusBd,

  info: P.lagoon,
  infoDk: P.lagoonDeep,
  infoLt: P.lagoonWash,
  infoBd: P.lagoonBorder,

  // ── Overlays ────────────────────────────────────────────────
  scrim: P.scrim,
  scrimDeep: P.scrimDeep,
  glass: P.glass,
  glassSoft: P.glassSoft,

  // ── Composites ──────────────────────────────────────────────
  // Placeholder fill behind a cover image that hasn't loaded.
  coverGradient: `linear-gradient(160deg, ${P.eucalyptus} 0%, ${P.ink} 100%)`,
} as const;

// Categorical badge palette — for distinguishing CATEGORIES, not
// status. Consumed by CONTENT_TYPE_CONFIG and TASK_TYPE_CONFIG so
// both badge sets stay in step. Order is the assignment order.
const ACCENT = {
  moss: P.moss,
  indigo: P.indigo,
  plum: P.plum,
  rose: P.rose,
  leaf: P.leaf,
  clay: P.clay,
} as const;

export type AccentName = keyof typeof ACCENT;

export { T, ACCENT };

// MUI expects exactly 25 shadow levels. Declared as Shadows so the tuple
// length is checked at compile time rather than asserted away.
const SHADOWS: Shadows = [
  "none",
  "0 1px 3px rgba(0,0,0,0.06)", // 1 — card
  "0 2px 8px rgba(0,0,0,0.08)", // 2 — elevated card
  "0 4px 16px rgba(0,0,0,0.10)", // 3 — dropdown
  "0 8px 32px rgba(0,0,0,0.12)", // 4 — modal
  // 5–24 unused
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
];

export const theme = createTheme({
  // ── Palette ──────────────────────────────────────────────
  palette: {
    background: {
      default: T.bg,
      paper: T.card,
    },
    primary: {
      main: T.terra,
      light: T.terraLt,
      contrastText: T.onBrand,
    },
    secondary: {
      main: T.gold,
      light: T.goldLt,
    },
    success: {
      main: T.success,
      light: T.successLt,
    },
    info: {
      main: T.info,
      light: T.infoLt,
    },
    error: {
      main: T.danger,
      light: T.dangerLt,
      dark: T.dangerDk,
    },
    warning: {
      main: T.warning,
      light: T.warningLt,
      dark: T.warningDk,
    },
    text: {
      primary: T.text,
      secondary: T.sub,
      disabled: T.muted,
    },
    divider: T.border,
  },

  // ── Typography ───────────────────────────────────────────
  // UI font: DM Sans, Display font: Playfair Display
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: 13,

    h1: {
      fontFamily: '"Playfair Display", serif',
      fontSize: 34,
      fontWeight: 500,
      lineHeight: 1.1,
      color: T.text,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontSize: 24,
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontSize: 20,
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"DM Sans", sans-serif',
      fontSize: 16,
      fontWeight: 600,
      lineHeight: 1.4,
    },

    // Section labels — 9px, 700, uppercase, wide tracking
    // Used as: <Typography variant="overline">WORKSPACE</Typography>
    overline: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: "0.25em",
      color: T.muted,
      lineHeight: 1.2,
    },

    // Column headers in tables
    caption: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.15em",
      color: T.muted,
      textTransform: "uppercase" as const,
    },

    body1: { fontSize: 13, color: T.text },
    body2: { fontSize: 11, color: T.sub },
  },

  // ── Shape ────────────────────────────────────────────────
  shape: {
    borderRadius: 7,
  },

  // ── Shadows — MUI uses an array of 25 ────────────────────
  shadows: SHADOWS,

  // ── Component overrides ───────────────────────────────────
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: T.bg,
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 13,
          WebkitFontSmoothing: "antialiased",
        },
        "::-webkit-scrollbar": { width: 5 },
        "::-webkit-scrollbar-track": { background: "transparent" },
        "::-webkit-scrollbar-thumb": {
          background: T.borderStrong,
          borderRadius: 10,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 600,
          fontSize: 12.5,
          borderRadius: 7,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        contained: {
          backgroundColor: T.terra,
          "&:hover": { backgroundColor: T.terraDk },
        },
        outlined: {
          borderColor: T.border,
          color: T.sub,
          "&:hover": {
            backgroundColor: T.dim,
            borderColor: T.border,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${T.border}`,
        },
        elevation1: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: T.border },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.15em",
          color: T.muted,
          textTransform: "uppercase",
          borderBottom: `1px solid ${T.border}`,
          backgroundColor: T.card,
          padding: "0 0 8px",
        },
        body: {
          fontSize: 12.5,
          color: T.sub,
          borderBottom: `1px solid ${T.border}`,
          padding: "11px 0",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 11,
          fontWeight: 600,
          borderRadius: 20,
          height: 24,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: T.text,
          fontSize: 11,
          borderRadius: 5,
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: 13,
          fontFamily: '"DM Sans", sans-serif',
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: T.border,
        },
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: T.muted,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: T.terra,
          },
        },
      },
    },
  },
});
