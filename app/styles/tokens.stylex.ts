import * as stylex from "@stylexjs/stylex";
import { colors } from "./colors.stylex";

// Semantic roles for components. Scale steps stay in colors.stylex.ts so the
// palette can be retuned without touching component styles.
export const color = stylex.defineVars({
  bg: colors.khaki2,
  surface: colors.khaki1,
  component: colors.khaki3,
  componentHover: colors.khaki4,
  componentActive: colors.khaki5,
  // Borders are drawn in ink, like a print outline; subtle is for dividers
  // and inputs.
  borderSubtle: colors.khaki7,
  border: colors.khaki12,
  text: colors.khaki12,
  textMuted: colors.khaki11,

  accent: colors.orange9,
  accentHover: colors.orange10,
  accentText: colors.orange11,
  accentSubtle: colors.orange3,
  onAccent: colors.orangeContrast,
  focusRing: colors.orange8,

  danger: colors.red9,
  dangerText: colors.red11,
  dangerSubtle: colors.red3,

  // The logo mark follows the wordmark text until a theme sets its own color.
  logoMark: "currentColor",
});

// Fluid sizes: rem + vw so they follow the reader's font size and zoom.
export const text = stylex.defineVars({
  // 22px at a 360px screen to 30px at 1240px.
  lead: "clamp(1.375rem, 1.17rem + 0.91vw, 1.875rem)",
});

// Fluid between a 360px and a 1240px screen, same as `text`.
export const space = stylex.defineVars({
  // 16px to 24px
  gutter: "clamp(1rem, 0.8rem + 0.91vw, 1.5rem)",
  // 24px to 32px
  block: "clamp(1.5rem, 1.3rem + 0.91vw, 2rem)",
  // 32px to 56px
  section: "clamp(2rem, 1.39rem + 2.73vw, 3.5rem)",
});

export const font = stylex.defineVars({
  display: "Fraunces, Georgia, serif",
  sans: '"Inter var", ui-sans-serif, system-ui, sans-serif',
});

// Nested corners derive from these: inner = outer - padding.
export const radius = stylex.defineVars({
  lg: "18px",
});

// light-dark() only takes colors, so a dark texture goes in a
// "@media (prefers-color-scheme: dark)" value here.
export const texture = stylex.defineVars({
  paper: "url(/paper-texture.svg)",
});
