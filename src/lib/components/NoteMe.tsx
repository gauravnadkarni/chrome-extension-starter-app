import React, { SyntheticEvent } from "react";
import { getResourceUrl } from "../helpers";
import { SidebarPosition } from "../types";

interface NoteMeProps {
  status: "open" | "close";
  position: SidebarPosition;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const getClassesByPosition = (position: SidebarPosition) => {
  let classX;
  let classY;

  switch (position) {
    case SidebarPosition.TOP_LEFT:
      classX = "left-5";
      classY = "top-5";
      break;
    case SidebarPosition.TOP_CENTER:
      classX = "left-1/2";
      classY = "top-5";
      break;
    case SidebarPosition.TOP_RIGHT:
      classX = "right-5";
      classY = "top-5";
      break;
    case SidebarPosition.LEFT_CENTER:
      classX = "left-5";
      classY = "top-1/2";
      break;
    case SidebarPosition.CENTER:
      classX = "left-1/2";
      classY = "top-1/2";
      break;
    case SidebarPosition.CENTER_RIGHT:
      classX = "right-5";
      classY = "top-1/2";
      break;
    case SidebarPosition.BOTTOM_LEFT:
      classX = "left-5";
      classY = "bottom-5";
      break;
    case SidebarPosition.BOTTOM_CENTER:
      classX = "left-1/2";
      classY = "bottom-5";
      break;
    case SidebarPosition.BOTTOM_RIGHT:
      classX = "right-5";
      classY = "bottom-5";
      break;
    default:
      const exhaustiveCheck: never = position;
      throw new Error(`Unhandled case: ${position}`);
  }

  return `${classX} ${classY}`;
};

export const NoteMe: React.FC<NoteMeProps> = ({
  status,
  position,
  onClick,
}) => {
  const sidebarOpenImageUrl = getResourceUrl("sidebar-open.png");
  const sidebarCloseImageUrl = getResourceUrl("sidebar-close.png");
  const positionalClassNames = `${getClassesByPosition(position)}`;

  return (
    <div
      className={`fixed ${positionalClassNames} bg-gray-100 border rounded-3xl shadow-md text-9xl cursor-pointer`}
      onClick={onClick}
    >
      <img
        src={status === "open" ? sidebarCloseImageUrl : sidebarOpenImageUrl}
        width="50"
        height="50"
      />
    </div>
  );
};
