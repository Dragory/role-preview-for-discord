import React, { Dispatch, Suspense, useCallback, useEffect, useState } from "react";
import type { Role } from "./Role";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import "./RoleConfigurator.css";

const SketchPicker = React.lazy(() => import("./SketchPicker"));

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

// From https://codesandbox.io/s/k260nyxq9v?file=/index.js:373-567
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

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

  function updateRoleOrder(result: DropResult) {
    if (!result.destination) {
      return;
    }

    const reordered = reorder(props.roles, result.source.index, result.destination.index);
    props.setRoles(reordered);
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
      <DragDropContext onDragEnd={updateRoleOrder}>
        <Droppable droppableId="roles-droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="roles-list">
              {props.roles.map((role, index) => (
                <Draggable key={role.id} draggableId={role.id.toString()} index={index}>
                  {(provided) => (
                    <div className="role" ref={provided.innerRef} {...provided.draggableProps}>
                      <div className="options">
                        <div className="drag-handle-wrapper">
                          <div {...provided.dragHandleProps} className="drag-handle">
                            <div className="scuffed-drag-icon" title="Drag to reorder" />
                          </div>
                        </div>
                        <div className="color-button-wrapper">
                          <button
                            className="color-button"
                            style={{ ["--role-color" as any]: role.color }}
                            onClick={() => toggleColorPicker(role)}
                          >
                            {role.color}
                          </button>
                          {openedColorPicker === role.id && (
                            <Suspense fallback={<div className="color-picker placeholder">Loading...</div>}>
                              <SketchPicker
                                className="color-picker"
                                disableAlpha={true}
                                color={role.color}
                                presetColors={discordDefaultColors}
                                onChange={(color) => updateRoleColor(role, color.hex)}
                              />
                            </Suspense>
                          )}
                        </div>
                        <input
                          className="name-input"
                          type="text"
                          value={role.name}
                          onChange={(e) => updateRoleName(role, e.target.value)}
                        />
                        <button className="delete-button" onClick={() => deleteRole(role.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button className="add-button" onClick={addRole}>
        Add role
      </button>
    </div>
  );
}
