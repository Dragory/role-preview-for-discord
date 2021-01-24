import React, { ComponentProps } from "react";
import _Switch from "react-switch";
import "./Switch.css";

// Workaround for weird react-switch import behavior
const SwitchComponent: typeof _Switch = (_Switch as any).default ? (_Switch as any).default : _Switch;

type SwitchProps = ComponentProps<typeof SwitchComponent>;
const defaultSwitchProps: Partial<SwitchProps> = {
  width: 34,
  height: 20,
  handleDiameter: 18,
  checkedIcon: false,
  uncheckedIcon: false,
};

export function Switch(props: SwitchProps) {
  return <SwitchComponent className="Switch" {...defaultSwitchProps} {...props} />;
}
