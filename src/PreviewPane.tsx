import React from "react";
import type { Role } from "./Role";
import "./PreviewPane.css";
import { getContrastRatio } from "./colorUtils";
import Twemoji from "react-twemoji";

interface PreviewPaneProps {
  theme: "dark" | "light";
  roles: Role[];
}

export function PreviewPane(props: PreviewPaneProps) {
  function getContrastRatioText(color: string) {
    const bgColor = props.theme === "dark" ? "#36393f" : "#ffffff";
    const contrastRatio = getContrastRatio(color, bgColor);
    const formatted = contrastRatio.toFixed(2);
    const comparisonValue = parseFloat(formatted);

    if (comparisonValue >= 7.0) {
      return `😄 Great contrast (${formatted}:1)`;
    } else if (comparisonValue >= 4.5) {
      return `🙂 Good contrast (${formatted}:1)`;
    } else if (comparisonValue >= 3.0) {
      return `😐 Passable contrast (${formatted}:1)`;
    } else if (comparisonValue >= 2.0) {
      return `😨 Lacking contrast (${formatted}:1)`;
    } else {
      return `🚫 Insufficient contrast (${formatted}:1)`;
    }
  }

  return (
    <div className={`PreviewPane ${props.theme}`}>
      <div className="messages">
        {props.roles.map((role) => (
          <div key={role.id} className="message" style={{ ["--role-color" as any]: role.color }}>
            <div className="avatar">
              <div className="avatar-image" />
            </div>
            <div className="name">{role.name}</div>
            <div className="body">
              <Twemoji options={{ folder: "svg", ext: ".svg" }}>{getContrastRatioText(role.color)}</Twemoji>
            </div>
          </div>
        ))}
      </div>
      <div className="sidebar">
        <div className="title">ONLINE—{props.roles.length}</div>
        {props.roles.map((role) => (
          <div key={role.id} className="member" style={{ ["--role-color" as any]: role.color }}>
            <div className="avatar">
              <div className="avatar-image" />
            </div>
            <div className="name">{role.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
