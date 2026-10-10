import * as stylex from "@stylexjs/stylex";
import { colors } from "./colors.stylex";

// Semantic roles for components. Scale steps stay in colors.stylex.ts so the
// palette can be retuned without touching component styles.
export const color = stylex.defineVars({
  bg: colors.khaki1,
  bgSubtle: colors.khaki2,
  component: colors.khaki3,
  componentHover: colors.khaki4,
  componentActive: colors.khaki5,
  borderSubtle: colors.khaki6,
  border: colors.khaki7,
  borderStrong: colors.khaki8,
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
});
