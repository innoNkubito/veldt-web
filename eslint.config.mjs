import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Raw colour literals are a bug: they bypass the design tokens and drift
// out of step the next time the palette changes. Colours live in
// src/lib/palette.ts and are named in src/lib/theme.ts — components import
// `T` (or `ACCENT`). If no token fits, add a role to theme.ts first.
const HEX = String.raw`#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b`;
const NO_RAW_COLOR = [
  {
    // 'color: #fff' in a plain string, JSX attribute or object property
    selector: `Literal[value=/${HEX}/]`,
    message:
      "Raw colour literal. Import { T } from '@/lib/theme' and use a token (e.g. T.terra). Colours are defined once in src/lib/palette.ts.",
  },
  {
    // '#fff' inside a styled`` template literal
    selector: `TemplateElement[value.raw=/${HEX}/]`,
    message:
      "Raw colour literal in a template. Use ${T.token} — see src/lib/theme.ts. Colours are defined once in src/lib/palette.ts.",
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    // The token files are the one place raw hex belongs.
    ignores: ["src/lib/palette.ts", "src/lib/theme.ts"],
    rules: {
      "no-restricted-syntax": ["error", ...NO_RAW_COLOR],
    },
  },
]);

export default eslintConfig;
