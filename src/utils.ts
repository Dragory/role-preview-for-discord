type HexColor = string; // AABBCC or #AABBCC
type RGBColor = [number, number, number]; // [255, 100, 200]

export function hexToRgb(hex: HexColor) {
  hex = hex.replace(/[^0-9a-f]/gi, "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
}

function luminanceValue(normalizedColorValue: number) {
  return normalizedColorValue <= 0.03928
    ? normalizedColorValue / 12.92
    : Math.pow((normalizedColorValue + 0.055) / 1.055, 2.4);
}

// https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
// https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
function getLuminance(hexOrRgb: HexColor | RGBColor): number {
  const rgb = typeof hexOrRgb === "string" ? hexToRgb(hexOrRgb) : hexOrRgb;

  const r = luminanceValue(rgb[0] / 255);
  const g = luminanceValue(rgb[1] / 255);
  const b = luminanceValue(rgb[2] / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
export function getContrastRatio(color1: HexColor | RGBColor, color2: HexColor | RGBColor): number {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
}
