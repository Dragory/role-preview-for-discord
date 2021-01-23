import React, { Dispatch, useCallback, useEffect, useState } from "react";
import type { Role } from "./Role";
import { SketchPicker } from "react-color";
import "./RoleConfigurator.css";

interface RoleConfiguratorProps {
  roles: Role[];
  setRoles: Dispatch<Role[]>;
}

const discordDefaultColors = [
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#e91e63",
  "#f1c40f",
  "#e67e22",
  "#e74d3c",
  "#95a5a6",
  "#607d8b",

  "#11806a",
  "#1f8b4c",
  "#206694",
  "#71368a",
  "#ad1457",
  "#c27c0e",
  "#a84300",
  "#992d22",
  "#979c9f",
  "#546e7a",
];

function isChildOf(ref: HTMLElement, selector: string) {
  let cursor: HTMLElement | null = ref;
  do {
    if (cursor.matches(selector)) {
      return true;
    }

    cursor = cursor.parentElement;
  } while (cursor);

  return false;
}

export function RoleConfigurator(props: RoleConfiguratorProps) {
  function addRole() {
    const id = Math.max(0, ...props.roles.map((r) => r.id)) + 1;
    const lastColor = props.roles.length > 0 ? props.roles[props.roles.length - 1].color : "#2ecc71";

    props.setRoles([
      ...props.roles,
      {
        id,
        name: `Role ${props.roles.length + 1}`,
        color: lastColor,
      },
    ]);
  }

  function deleteRole(id: number) {
    props.setRoles(props.roles.filter((role) => role.id !== id));
  }

  function updateRoleName(role: Role, newName: string) {
    role.name = newName;
    props.setRoles([...props.roles]);
  }

  const [openedColorPicker, setOpenedColorPicker] = useState(0);

  function toggleColorPicker(role: Role) {
    if (openedColorPicker === role.id) {
      setOpenedColorPicker(0);
    } else {
      setOpenedColorPicker(role.id);
    }
  }

  const handleClick = useCallback(
    (ev: MouseEvent) => {
      if (openedColorPicker === 0) {
        return;
      }

      if (isChildOf(ev.target as HTMLElement, ".RoleConfigurator .color-button-wrapper")) {
        return;
      }

      setOpenedColorPicker(0);
    },
    [openedColorPicker],
  );

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [handleClick]);

  function updateRoleColor(role: Role, color: string) {
    role.color = color;
    props.setRoles([...props.roles]);
  }

  return (
    <div className="RoleConfigurator">
      {props.roles.map((role) => (
        <div key={role.id} className="role">
          <div className="options">
            <input
              className="name-input"
              type="text"
              defaultValue={role.name}
              onChange={(e) => updateRoleName(role, e.target.value)}
            />
            <div className="color-button-wrapper">
              <button
                className="color-button"
                style={{ ["--role-color" as any]: role.color }}
                onClick={() => toggleColorPicker(role)}
              >
                {role.color}
              </button>
              {openedColorPicker === role.id && (
                <SketchPicker
                  className="color-picker"
                  disableAlpha={true}
                  color={role.color}
                  presetColors={discordDefaultColors}
                  onChange={(color) => updateRoleColor(role, color.hex)}
                />
              )}
            </div>
            <button className="delete-button" onClick={() => deleteRole(role.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
      <button className="add-button" onClick={addRole}>
        Add role
      </button>
    </div>
  );
}
