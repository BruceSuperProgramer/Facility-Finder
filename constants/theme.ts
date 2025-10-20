/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#687076",
    border: "rgba(0, 0, 0, 0.1)",
    cardBackground: "#fff",
    iconBackground: "rgba(10, 126, 164, 0.1)",
    heroBackground: tintColorLight,
    badgeBackground: "#f8f9fa",
    badgeBorder: "rgba(10, 126, 164, 0.2)",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    tabIconDefault: "#9BA1A6",
    border: "rgba(255, 255, 255, 0.1)",
    cardBackground: "#1f2123",
    iconBackground: "rgba(255, 255, 255, 0.1)",
    heroBackground: "#1a5f7a",
    badgeBackground: "#2a2d30",
    badgeBorder: "rgba(255, 255, 255, 0.2)",
  },
};
