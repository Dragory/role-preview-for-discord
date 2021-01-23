declare module "color-blind" {
  function BlinderFn(colorString: string, returnRgb: true): { R: number; G: number; B: number };
  function BlinderFn(colorString: string, returnRgb?: false): string;

  interface Blinder {
    protanomaly: typeof BlinderFn;
    protanopia: typeof BlinderFn;
    deuteranomaly: typeof BlinderFn;
    deuteranopia: typeof BlinderFn;
    tritanomaly: typeof BlinderFn;
    tritanopia: typeof BlinderFn;
    achromatomaly: typeof BlinderFn;
    achromatopsia: typeof BlinderFn;
  }

  const blinder: Blinder;
  export default blinder;
}
