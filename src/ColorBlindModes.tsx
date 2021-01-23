import React, { Dispatch } from "react";
import type { ColorBlindMode } from "./colorBlind";
import { colorBlindModes } from "./colorBlind";
import "./ColorBlindModes.css";

interface ColorBlindModesProps {
  modes: Set<ColorBlindMode>;
  setModes: Dispatch<Set<ColorBlindMode>>;
}

export function ColorBlindModes(props: ColorBlindModesProps) {
  const sortedModes = [...colorBlindModes].sort((a, b) => {
    const aMaxPrevalence = Math.max(a.prevalenceMen || 0, a.prevalenceWomen || 0);
    const bMaxPrevalence = Math.max(b.prevalenceMen || 0, b.prevalenceWomen || 0);
    if (aMaxPrevalence > bMaxPrevalence) return -1;
    if (aMaxPrevalence < bMaxPrevalence) return 1;
    return 0;
  });

  function setModeStatus(mode: ColorBlindMode, status: boolean) {
    if (status) {
      props.modes.add(mode);
    } else {
      props.modes.delete(mode);
    }

    props.setModes(new Set(props.modes));
  }

  return (
    <div className="ColorBlindModes">
      {sortedModes.map((mode) => (
        <label className="mode" key={mode.name}>
          <input
            type="checkbox"
            defaultChecked={props.modes.has(mode)}
            onChange={(ev) => setModeStatus(mode, ev.target.checked)}
          />
          <span>{mode.name} </span>
          {mode.prevalenceMen && mode.prevalenceWomen && (
            <span>
              ({mode.prevalenceMen}% of M, {mode.prevalenceWomen}% of F)
            </span>
          )}
          {mode.prevalenceMen && !mode.prevalenceWomen && <span>({mode.prevalenceMen}% of M)</span>}
          {!mode.prevalenceMen && mode.prevalenceWomen && <span>({mode.prevalenceMen}% of F)</span>}
        </label>
      ))}
    </div>
  );
}
