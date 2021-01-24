import type { Role } from "./Role";
import { getHashVars, setHashVars } from "./hashVars";

export interface SaveableState {
  roles: Role[];
  colorBlindModes: string[];
}

export function saveState(state: SaveableState) {
  const encoded = btoa(JSON.stringify(state));
  const hashVars = getHashVars();
  hashVars.state = encoded;
  setHashVars(hashVars);
}

export function loadState(): SaveableState | null {
  const hashVars = getHashVars();
  return hashVars.state ? JSON.parse(atob(hashVars.state)) : null;
}
