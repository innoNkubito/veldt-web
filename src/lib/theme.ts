import { createTheme, type Shadows } from "@mui/material/styles";

// MUI expects exactly 25 shadow levels. Declared as Shadows so the tuple
// length is checked at compile time rather than asserted away.
const SHADOWS: Shadows = [
  "none",
  "0 1px 3px rgba(0,0,0,0.06)", // 1 — card
  "0 2px 8px rgba(0,0,0,0.08)", // 2 — elevated card
  "0 4px 16px rgba(0,0,0,0.10)", // 3 — dropdown
  "0 8px 32px rgba(0,0,0,0.12)", // 4 — modal
  // 5–24 unused
  "none", "none", "none", "none", "none",
  "none", "none", "none", "none", "none",
  "none", "none", "none", "none", "none",
  "none", "none", "none", "none", "none",
];

// Veldt design tokens — extracted from Veldt_Dashboard_v2.html
const T = {
  bg: "#FAF6EF",
  navBg: "#FFFFFF",
  sideBg: "#FFFFFF",
  card: "#FFFFFF",
  cardAlt: "#F7F1E7",
  border: "#EDE6D6",
  terra: "#C4704A",
  terraLt: "#FFF0E8",
  gold: "#B89840",
  goldLt: "#FFF8E8",
  sage: "#5E8A64",
  sageLt: "#EEF4EE",
  teal: "#5A8888",
  tealLt: "#EEF4F4",
  text: "#2A1F14",
  sub: "#5A4A38",
  muted: "#9E8E7A",
  dim: "#F4EDE0",
};

export { T };

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
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: T.gold,
      light: T.goldLt,
    },
    success: {
      main: T.sage,
      light: T.sageLt,
    },
    info: {
      main: T.teal,
      light: T.tealLt,
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
          background: "#DDD4C0",
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
          "&:hover": { backgroundColor: "#AE6341" },
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
