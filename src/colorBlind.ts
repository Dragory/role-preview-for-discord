import colorBlind from "color-blind";

// Prevalence data from:
// https://www.ncbi.nlm.nih.gov/books/NBK11538/table/ch28kallcolor.T1/

export interface ColorBlindMode {
  name: string;
  convert: (hex: string) => string;
  prevalenceMen?: number;
  prevalenceWomen?: number;
}

export const colorBlindModes: ColorBlindMode[] = [
  {
    name: "Protanomaly",
    convert: colorBlind.protanomaly,
    prevalenceMen: 1,
    prevalenceWomen: 0.01,
  },
  {
    name: "Protanopia",
    convert: colorBlind.protanopia,
    prevalenceMen: 1,
    prevalenceWomen: 0.01,
  },
  {
    name: "Deuteranomaly",
    convert: colorBlind.deuteranomaly,
    prevalenceMen: 5,
    prevalenceWomen: 0.4,
  },
  {
    name: "Deuteranopia",
    convert: colorBlind.deuteranopia,
    prevalenceMen: 1.5,
    prevalenceWomen: 0.01,
  },
  {
    name: "Tritanomaly",
    convert: colorBlind.tritanomaly,
  },
  {
    name: "Tritanopia",
    convert: colorBlind.tritanopia,
    prevalenceMen: 0.008,
    prevalenceWomen: 0.008,
  },
  {
    name: "Achromatomaly",
    convert: colorBlind.achromatomaly,
  },
  {
    name: "Achromatopsia",
    convert: colorBlind.achromatopsia,
  },
];
