import React, { useEffect, useState } from "react";
import { NoteMe } from "../../lib/components/NoteMe";
import {
  AppEventForContent,
  ContentEvent,
  Note,
  NoteWithIdAndWithoutSite,
  NoteWithSite,
  SidebarPosition,
  SidebarState,
  SidebarStatus,
  WorkerEvent,
} from "../../lib/types";
import { Sidebar } from "./Sidebar";
import { getFormattedUrl, getRandomId, sendMessageToWorker } from "../helpers";

export const ContentApp: React.FC<React.PropsWithChildren> = () => {
  const formattedUrl = getFormattedUrl(window.location);
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    status: SidebarStatus.CLOSE,
    position: SidebarPosition.BOTTOM_RIGHT,
  });
  const [notes, setNotes] = useState<Array<Note>>([]);
  const [note, setNote] = useState<string>("");
  const [isNoteValid, setNoteValid] = useState<boolean>(false);
  const [isSyncDisabled, setSyncDisabled] = useState<boolean>(false);
  const [isSaveDisabled, setSaveDisabled] = useState<boolean>(false);
  const [isResetDisabled, setResetDisabled] = useState<boolean>(false);

  const refreshNotes = () => {
    sendMessageToWorker(
      {
        name: WorkerEvent.GET_ALL_NOTES_FROM_STORAGE_FOR_SITE,
        data: {
          site: formattedUrl,
        },
      },
      (response: { notes: Array<NoteWithIdAndWithoutSite> }) => {
        setNotes(response.notes);
      }
    );
  }

  const changePosition = (position: SidebarPosition) => {
    setSidebarState((prevState) => {
      return {
        ...prevState,
        position,
      };
    });
  };

  const noteSavedToStorage = (note: NoteWithIdAndWithoutSite) => {
    setNotes((prevState) => [...prevState, note]);
    setNoteValid(false);
    setNote("");
  };
  
  const onNoteDelete = (id:string, e: React.MouseEvent<HTMLButtonElement>) =>{
    sendMessageToWorker(
      {
        name: WorkerEvent.DELETE_NOTE_FOR_SITE_FROM_STORAGE,
        data: { site: formattedUrl, id },
      },
      (response: any) => {
        refreshNotes();
      }
    );
  }

  const onSync = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSyncDisabled(true);
    sendMessageToWorker(
      {
        name: WorkerEvent.SYNC_NOTES_WITH_BACKEND,
        data: { site: formattedUrl },
      },
      (response: any) => {
        console.log(response)
        setSyncDisabled(false);
      }
    );
  };

  const onClickOfNoteMe = (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    setSidebarState((prevState) => {
      const status =
        sidebarState.status === SidebarStatus.CLOSE
          ? SidebarStatus.OPEN
          : SidebarStatus.CLOSE;
      return {
        ...prevState,
        status,
      };
    });
  };

  const onNoteSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isNoteValid) {
      return;
    }
    setSaveDisabled(true);
    setResetDisabled(true);
    const randomId = getRandomId();
    const currentNote = {
      tempId: randomId,
      id: undefined,
      text: note,
    };
    sendMessageToWorker(
      {
        name: WorkerEvent.SAVE_NOTE_TO_STORAGE,
        data: { ...currentNote, site: formattedUrl } as NoteWithSite,
      },
      (response: { note: NoteWithIdAndWithoutSite }) => {
        setSaveDisabled(false);
        setResetDisabled(false);
        noteSavedToStorage(response.note);
      }
    );
  };

  const onNoteReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    setNoteValid(false);
    setNote("");
  };

  const onNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!e.target.value && isNoteValid === true) {
      setNoteValid(false);
    } else if (e.target.value.length > 0 && isNoteValid === false) {
      setNoteValid(true);
    }
    setNote(e.target.value);
  };

  useEffect(() => {
    const callback = (
      message: AppEventForContent,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (message.name === ContentEvent.SIDEBAR_CONTROL_POSITION_CHANGED) {
        changePosition(message.data as SidebarPosition);
        sendResponse({ status: "success", message: "Button Position Changed" });
      }
    };
    chrome.runtime.onMessage.addListener(callback);
    refreshNotes();
    return () => {
      chrome.runtime.onMessage.removeListener(callback);
    };
  }, []);

  return (
    <>
      <Sidebar
        isSyncDisabled={isSyncDisabled}
        isResetDisabled={isResetDisabled}
        isSaveDisabled={isSaveDisabled}
        isNoteValid={isNoteValid}
        note={note}
        onSync={onSync}
        onNoteChange={onNoteChange}
        notes={notes}
        isVisible={sidebarState.status === SidebarStatus.OPEN ? true : false}
        onHideSidebar={onClickOfNoteMe}
        onNoteSave={onNoteSave}
        onNoteReset={onNoteReset}
        onNoteDelete={onNoteDelete}
      />
      <NoteMe
        position={sidebarState.position}
        status={sidebarState.status}
        onClick={onClickOfNoteMe}
      />
    </>
  );
};
