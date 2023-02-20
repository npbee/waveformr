let { gray, grayDark, violet, violetDark } = require("@radix-ui/colors");

let grayDarkColor = {};

Object.keys(grayDark).forEach((key, i) => {
  grayDarkColor[`grayDark${i + 1}`] = grayDark[key];
});

let violetDarkColor = {};

Object.keys(violetDark).forEach((key, i) => {
  violetDarkColor[`violetDark${i + 1}`] = violetDark[key];
});

// 1 App background
// 2 Subtle background
// 3 UI element background
// 4 Hovered UI element background
// 5 Active / Selected UI element background
// 6 Subtle borders and separators
// 7 UI element border and focus rings
// 8 Hovered UI element border
// 9 Solid backgrounds
// 10 Hovered solid backgrounds
// 11 Low-contrast text
// 12 High-contrast text

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ...gray,
        ...grayDarkColor,
        ...violet,
        ...violetDarkColor,
      },
    },
  },
  plugins: [],
};
