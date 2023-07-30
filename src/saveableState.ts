import type { Role } from "./Role";
import { getHashVars, setHashVars } from "./hashVars";
import { b64DecodeUnicode, b64EncodeUnicode } from "./utils";

export interface SaveableState {
  roles: Role[];
  colorBlindModes: string[];
}

export function saveState(state: SaveableState) {
  const encoded = b64EncodeUnicode(JSON.stringify(state));
  const hashVars = getHashVars();
  hashVars.state = encoded;
  setHashVars(hashVars);
}

export function loadState(): SaveableState | null {
  const hashVars = getHashVars();
  return hashVars.state ? JSON.parse(b64DecodeUnicode(hashVars.state)) : null;
}
