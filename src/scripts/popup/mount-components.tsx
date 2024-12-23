import React from "react";
import ReactDOM from "react-dom/client";
import { NoteMePosition } from "../../lib/components/NoteMePosition";
import { SidebarPosition } from "../../lib/types";

const BUTTONS = [
  {
    text: "Top-Left",
    position: SidebarPosition.TOP_LEFT,
  },
  {
    text: "Top-Center",
    position: SidebarPosition.TOP_CENTER,
  },
  {
    text: "Top-Right",
    position: SidebarPosition.TOP_RIGHT,
  },
  {
    text: "Left-Center",
    position: SidebarPosition.LEFT_CENTER,
  },
  {
    text: "Center",
    position: SidebarPosition.CENTER,
  },
  {
    text: "Center-Right",
    position: SidebarPosition.CENTER_RIGHT,
  },
  {
    text: "Bottom-Left",
    position: SidebarPosition.BOTTOM_LEFT,
  },
  {
    text: "Bottom-Center",
    position: SidebarPosition.BOTTOM_CENTER,
  },
  {
    text: "Bottom-Right",
    position: SidebarPosition.BOTTOM_RIGHT,
  },
];


(() => {
  const container = document.createElement("div");
  container.id = "note-me-position-component-root";
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);
  root.render(<NoteMePosition buttons={BUTTONS}/>);
})();


