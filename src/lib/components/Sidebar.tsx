import React, { SyntheticEvent, useState } from "react";
import { Note } from "../types";

interface SidebarProps {
  isSaveDisabled: boolean;
  isResetDisabled: boolean;
  isSyncDisabled: boolean;
  isNoteValid: boolean;
  note: string;
  isVisible: boolean;
  notes: Array<Note>;
  onSync: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onHideSidebar: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onNoteSave: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onNoteReset: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onNoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onNoteDelete: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSaveDisabled,
  isResetDisabled,
  isSyncDisabled,
  isNoteValid,
  note,
  isVisible,
  notes,
  onSync,
  onHideSidebar,
  onNoteSave,
  onNoteReset,
  onNoteChange,
  onNoteDelete,
}) => {
  if (!isVisible) return null;

  const validityClass =
    isNoteValid === true ? "border-gray-300" : "border-red-300";

  return (
    <div className="fixed top-0 right-0 w-1/4 h-full bg-gray-100 shadow-lg z-[9999] flex flex-col text-black border border-black rounded-sm shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
      <div className=" h-full">
        <div className="note-me-header p-2 flex flex-row-reverse justify-between">
          <button
            className="px-2 py-1 text-sm bg-gray-300 rounded"
            onClick={onHideSidebar}
          >
            X
          </button>
          <button
            className="px-2 py-1 text-sm bg-gray-300 rounded"
            onClick={onSync}
            disabled={isSyncDisabled}
          >
            {isSyncDisabled ? "----" : "Sync"}
          </button>
        </div>
        <div className="note-me-content">
          <div>
            <div className="m-1">
              <textarea
                style={{}}
                className={`w-full h-20 resize-none border ${validityClass} p-2 text-black bg-white outline-none`}
                value={note}
                onChange={onNoteChange}
              />
            </div>
            <div className="m-1">
              <button
                className="px-2 py-1 m-1 text-sm bg-gray-300 rounded"
                onClick={onNoteSave}
                disabled={isSaveDisabled}
              >
                Save
              </button>
              <button
                className="px-2 py-1 m-1 text-sm bg-gray-300 rounded"
                onClick={onNoteReset}
                disabled={isResetDisabled}
              >
                Reset
              </button>
            </div>
          </div>
          <div
            style={{ height: "80vh" }}
            className="flex-1 overflow-auto border border-gray-300 rounded p-2 m-1"
          >
            {notes.map((note, idx) => {
              const noteData = notes[notes.length - 1 - idx];
              return (
                <div
                  key={`div-${idx}`}
                  className="p-2 my-2 mx-1 bg-white border rounded shadow-sm relative"
                >
                  <button
                    className="absolute bottom-0 right-0 p-1 m-1 border rounded bg-red-300"
                    onClick={(e) => {
                      onNoteDelete(noteData.id!, e);
                    }}
                  >
                    del
                  </button>
                  {noteData.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
