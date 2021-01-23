import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { PreviewPane } from "./PreviewPane";
import type { Role } from "./Role";
import { RoleConfigurator } from "./RoleConfigurator";
import { ColorBlindModes } from "./ColorBlindModes";
import { ColorBlindMode, colorBlindModes as allColorBlindModes } from "./colorBlind";
import Twemoji from "react-twemoji";

interface SaveableState {
  roles: Role[];
  colorBlindModes: string[];
}

function getHashVars() {
  return window.location.hash
    .slice(2) // Remove #? at the beginning
    .split("&")
    .filter(Boolean)
    .reduce((obj, hashVar) => {
      const [prop, value] = hashVar.split("=");
      obj[prop] = value;
      return obj;
    }, {} as any);
}

function stringifyHashVars(obj: any) {
  const varStr = Object.entries(obj)
    .map(([prop, value]) => `${prop}=${value}`)
    .join("&");

  return varStr ? `#?${varStr}` : "";
}

function saveState(state: SaveableState) {
  const encoded = btoa(JSON.stringify(state));
  const hashVars = getHashVars();
  hashVars.state = encoded;
  window.history.replaceState(null, "", stringifyHashVars(hashVars));
}

function loadState(): SaveableState | null {
  const hashVars = getHashVars();
  return hashVars.state ? JSON.parse(atob(hashVars.state)) : null;
}

const useEffectAfterNCalls = (n: number, effect: any, deps: any[]) => {
  const callN = useRef(0);

  useEffect(() => {
    callN.current++;
    if (callN.current <= n) {
      return;
    }

    effect();
  }, deps);
};

const defaultRoles: Role[] = [
  {
    id: 1,
    name: "Example 1",
    color: "#DC86FF",
  },
  {
    id: 2,
    name: "Example 2",
    color: "#1EAB42",
  },
];

export function App() {
  const [roles, setRoles] = useState<Role[]>(JSON.parse(JSON.stringify(defaultRoles)));
  const [colorBlindModes, setColorBlindModes] = useState<Set<ColorBlindMode>>(new Set());
  const [importExport, setImportExport] = useState<"import" | "export" | null>(null);
  const [stateToImport, setStateToImport] = useState("");

  function getColorBlindRoles(mode: ColorBlindMode, roles: Role[]): Role[] {
    return roles.map((role) => {
      return {
        ...role,
        color: mode.convert(role.color),
      };
    });
  }

  function loadAndApplyState() {
    const savedState = loadState();
    if (!savedState) {
      return;
    }

    setRoles(savedState.roles);

    const matchingColorBlindModes = allColorBlindModes.filter((mode) => savedState.colorBlindModes.includes(mode.name));
    setColorBlindModes(new Set(matchingColorBlindModes));
  }

  useEffect(() => {
    loadAndApplyState();

    const ref = loadAndApplyState;
    window.addEventListener("onHashChange", ref);
    return () => window.removeEventListener("onHashChange", ref);
  }, []);

  function getSaveableState() {
    return {
      roles,
      colorBlindModes: Array.from(colorBlindModes).map((mode) => mode.name),
    };
  }

  // Skip the initial call
  useEffectAfterNCalls(
    1,
    () => {
      saveState(getSaveableState());
    },
    [roles, colorBlindModes],
  );

  function reset() {
    window.location.hash = "#";
    window.location.reload();
  }

  return (
    <div className="App">
      <div className="title">
        <h1>Role Preview for Discord</h1>
        <p>
          Preview role colors and check for possible issues with contrast and color schemes!
          <br />
          📋 Copy the website address to share your changes!
        </p>
        <p>
          <strong>Note:</strong> It's normal to only reach "Passable contrast" when optimizing for both dark and light
          theme.
          <br />
          See "Info" below for more details on contrast.
        </p>
      </div>

      <div className="config">
        <h2>Roles</h2>
        <div className="mobile-scroll-hint">Scroll further below to see the preview!</div>
        <RoleConfigurator roles={roles} setRoles={setRoles} />

        <h2>Simulate color blindness</h2>
        <ColorBlindModes modes={colorBlindModes} setModes={setColorBlindModes} />

        <h2>Reset</h2>
        <button className="reset" onClick={reset}>
          Click here to reset
        </button>
      </div>
      <div className="preview">
        <PreviewPane theme="dark" roles={roles} />
        <PreviewPane theme="light" roles={roles} />

        {Array.from(colorBlindModes).map((mode) => (
          <div key={mode.name}>
            <h2>{mode.name}</h2>
            <PreviewPane theme="dark" roles={getColorBlindRoles(mode, roles)} />
            <PreviewPane theme="light" roles={getColorBlindRoles(mode, roles)} />
          </div>
        ))}
      </div>
      <div className="info">
        <h2>Info</h2>
        <p>
          This tool is created and maintained by <a href="https://github.com/Dragory">Dragory</a>
        </p>
        <p>
          <a href="https://github.com/Dragory/role-preview-for-discord">The source code is available on GitHub</a>
        </p>
        <p>
          <span>
            Contrast ratio calculations are based on the{" "}
            <a href="https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio">WCAG&nbsp;2.0</a> standard.{" "}
          </span>
          <span>
            <a href="https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html">
              For an explanation of WCAG&nbsp;2.0 contrast requirements, see this link.
            </a>{" "}
          </span>
          <span>"Good" and "Great" contrast ratios pass level AA contrast requirements. </span>
          <span>
            "Passable" passes the <em>minimum</em> contrast level recommended by <em>ISO-9241-3</em> and{" "}
            <em>ANSI-HFES-100-1988</em> for standard text and vision.{" "}
          </span>
          <span>"Poor" does not pass any contrast ratio requirements. </span>
        </p>
        <p>
          <span>Source for the prevalence numbers for the different types of color blindness: </span>
          <br />
          <a className="allow-break" href="https://www.ncbi.nlm.nih.gov/books/NBK11538/table/ch28kallcolor.T1/">
            https://www.ncbi.nlm.nih.gov/books/NBK11538/table/ch28kallcolor.T1/
          </a>
        </p>
        <p className="twemoji-info">
          <span>
            <a href="https://twemoji.twitter.com/">Twemoji</a> are used under the{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0 license</a>.{" "}
          </span>
          <Twemoji options={{ folder: "svg", ext: ".svg" }} noWrapper={true}>
            <span>
              The website icon is a resized version of the <span className="nowrap">🛠 icon.</span>{" "}
            </span>
          </Twemoji>
        </p>
      </div>
    </div>
  );
}
