import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { PreviewPane } from "./PreviewPane";
import type { Role } from "./Role";
import { RoleConfigurator } from "./RoleConfigurator";
import { ColorBlindModes } from "./ColorBlindModes";
import { ColorBlindMode, colorBlindModes as allColorBlindModes } from "./colorBlind";
import Twemoji from "react-twemoji";
import copy from "copy-to-clipboard";

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

  const [simulateColorBlindness, setSimulateColorBlindness] = useState(false);

  useEffect(() => {
    if (colorBlindModes.size > 0 && !simulateColorBlindness) {
      setSimulateColorBlindness(true);
    }
  }, [colorBlindModes]);

  function getColorBlindRoles(mode: ColorBlindMode, roles: Role[]): Role[] {
    return roles.map((role) => {
      return {
        ...role,
        color: mode.convert(role.color),
      };
    });
  }

  function loadAndApplyState(allowEmptyReset = false) {
    const savedState = loadState();
    if (!savedState) {
      if (allowEmptyReset) {
        reset();
      }

      return;
    }

    setRoles(savedState.roles);

    const matchingColorBlindModes = allColorBlindModes.filter((mode) => savedState.colorBlindModes.includes(mode.name));
    setColorBlindModes(new Set(matchingColorBlindModes));
  }

  useEffect(() => {
    loadAndApplyState();

    const ref = () => loadAndApplyState(true);
    window.addEventListener("hashchange", ref);
    return () => window.removeEventListener("hashchange", ref);
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

  const previewRef = useRef<HTMLDivElement | null>(null);
  const [creatingImage, setCreatingImage] = useState(false);

  async function downloadImage() {
    if (!previewRef.current) {
      return;
    }

    if (creatingImage) {
      return;
    }

    setCreatingImage(true);

    const htmlToImage = await import("html-to-image");
    const dataUrl = await htmlToImage.toPng(previewRef.current, {
      backgroundColor: "transparent",
    });

    const temp = document.createElement("a");
    temp.download = `roles-${Date.now()}.png`;
    temp.href = dataUrl;
    temp.click();

    setCreatingImage(false);
  }

  const [copied, setCopied] = useState(false);
  async function copyLink() {
    const linkToCopy = window.location.toString();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Role Preview for Discord",
          url: linkToCopy,
        });
      } catch (e) {}
      return;
    }

    copy(linkToCopy);

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="App">
      <div className="main-wrapper">
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
          </p>
        </div>

        <div className="config">
          <h2>Roles</h2>
          <div className="mobile-scroll-hint">Scroll further below to see the preview!</div>
          <RoleConfigurator roles={roles} setRoles={setRoles} />
        </div>

        <div className="tools">
          <h2>Tools</h2>

          <div className="tool">
            <label>
              <input
                type="checkbox"
                checked={simulateColorBlindness}
                onChange={(ev) => setSimulateColorBlindness(ev.target.checked)}
              />
              Simulate color blindness
            </label>

            {simulateColorBlindness && (
              <div className="color-blind-modes">
                <ColorBlindModes modes={colorBlindModes} setModes={setColorBlindModes} />
              </div>
            )}
          </div>

          <div className="tool-buttons">
            <button className="copy-link" onClick={copyLink}>
              {(copied && "Copied!") || "Copy link"}
            </button>
            <button className="download-image" onClick={downloadImage}>
              Download as image
            </button>
            <button className="reset" onClick={reset}>
              Reset all
            </button>
          </div>
        </div>

        <div className="preview">
          <h2>Preview</h2>
          <div className="image-preview-wrapper">
            <div className="image-preview-padding" ref={previewRef}>
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
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="footer-content">
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
            <span>"Lacking" is below contrast recommendations, but still somewhat readable. </span>
            <span>"Insufficient" can be hard to read even for those with better than average vision. </span>
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
    </div>
  );
}
