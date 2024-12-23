import React from "react";
import { AppEventForContent, ContentEvent, SidebarPosition } from "../types";

interface NoteMePositionProps {
  buttons: Array<{
    text: string;
    position: SidebarPosition;
  }>
}

export const NoteMePosition: React.FC<NoteMePositionProps> = ({buttons}) => {
  const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const position = Number(e.currentTarget.getAttribute("data-position"));
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      for (let tab of tabs) {
        if (!tab.id) {
          continue;
        }

        chrome.tabs.sendMessage(
          tab.id,
          {
            name: ContentEvent.SIDEBAR_CONTROL_POSITION_CHANGED,
            data: position,
          } as AppEventForContent,
          () => {}
        );
      }
    });
  };

  return (
    <div className="p-4 m-2">
      {buttons.map((button, idx) => (
        <button
          key={`button-${idx}`}
          className="m-1 min-w-28 px-4 py-2 bg-blue-500 text-white rounded text-nowrap"
          data-position={button.position}
          onClick={onButtonClick}
        >
          {button.text}
        </button>
      ))}
    </div>
  );
};
