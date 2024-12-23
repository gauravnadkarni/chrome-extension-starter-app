import { getRandomId, httpHandler } from "./helpers";
import { getInitialState, getStateSlice, setLocalState } from "./storage-model";
import {
    AppEventForWorker,
    NoteWithIdAndWithoutSite,
    NoteWithSite,
    StorageModel,
    WorkerEvent
} from "./types";

export const onMessage = (
  event: AppEventForWorker,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
): boolean => {
  const eventType = event.name;
  switch (eventType) {
    case WorkerEvent.SAVE_NOTE_TO_STORAGE: {
      const { site, ...data } = event.data as NoteWithSite;
      const id = getRandomId();
      const dataWithNoteIdAndWithoutSite: NoteWithIdAndWithoutSite = {
        ...data,
        id,
      };
      setLocalState((state: StorageModel) => {
        const notes = state.notes;
        const matchedNote = notes.find((note) => note.site === site);
        let notesListWithSite: StorageModel["notes"];
        if (!matchedNote) {
          notesListWithSite = [
            ...state.notes,
            {
              site,
              list: [dataWithNoteIdAndWithoutSite],
            },
          ];
        } else {
          notesListWithSite = state.notes.map((note) => {
            if (note.site !== site) {
              return note;
            }
            return {
              site: matchedNote.site,
              list: [...matchedNote.list, dataWithNoteIdAndWithoutSite],
            };
          });
        }

        return {
          ...state,
          notes: notesListWithSite,
        };
      })
        .then(() => getStateSlice("notes"))
        .then((notes) => {
          const notesForGivenSite = notes.find((note) => note.site === site);
          if (!notesForGivenSite) {
            throw new Error("Failed to save the note to storage");
          }
          const note = notesForGivenSite.list.find(
            (note) =>
              note.id === dataWithNoteIdAndWithoutSite.id &&
              note.tempId === dataWithNoteIdAndWithoutSite.tempId
          );
          if (!note) {
            throw new Error("Failed to find the note from storage");
          }
          sendResponse({ note });
        })
        .catch((err) => {
          console.log(err);
          sendResponse({ error: err.message });
        });
      break;
    }
    case WorkerEvent.GET_ALL_NOTES_FROM_STORAGE_FOR_SITE: {
      const { site } = event.data as { site: string };
      getStateSlice("notes")
        .then((notesList) => {
          const notes = notesList.find((note) => note.site === site);
          let resNotes: Array<NoteWithIdAndWithoutSite>;
          if (!notes) {
            resNotes = [];
          } else {
            resNotes = notes.list;
          }
          sendResponse({ notes: resNotes });
        })
        .catch((err) => {
          console.log(err);
          sendResponse({ error: err.message });
        });
      break;
    }
    case WorkerEvent.SYNC_NOTES_WITH_BACKEND: {
      const { site } = event.data;
      getStateSlice("notes")
        .then((notesList) => {
          const notes = notesList.find((note) => note.site === site);
          if (!notes || notes.list.length===0) {
            throw new Error("Unable to find any notes for the site")
          }
          httpHandler("backend_url",notes,{}).then((response)=>{
            sendResponse(response);
          })
        })
        .catch((err) => {
          console.log(err);
          sendResponse({ error: err.message });
        });
      break;
    }
    case WorkerEvent.DELETE_NOTE_FOR_SITE_FROM_STORAGE: {
      const { site, id } = event.data;
      getStateSlice("notes")
        .then((notesList) => {
          const notes = notesList.find((note) => note.site === site);
          if (!notes || notes.list.length===0) {
            throw new Error("Unable to find any notes for the site")
          }
          const matchedNote = notes.list.find((note)=>(note.id===id));
          if(!matchedNote) {
            throw new Error("Unable to find matching note for the site")
          }
          setLocalState((state:StorageModel)=>{
            return {
              ...state,
              notes: [
                ...state.notes.map((noteData)=>{
                  if(noteData.site !== site) {
                    return noteData;
                  }
                  const filteredNoteList = noteData.list.filter((note)=>(note.id !== id))
                  return {
                    ...noteData,
                    list:filteredNoteList,
                  };
                })
              ]
            }
          })
          sendResponse({ message: "success" });
        })
        .catch((err) => {
          console.log(err);
          sendResponse({ error: err.message });
        });
      break;
    }
    default:
      const exhaustiveCheck: never = eventType;
      throw new Error(`Unknown event received ${eventType}`);
  }
  return true;
};

export const onAppInstalled = (tab: chrome.runtime.InstalledDetails) => {
  chrome.storage.local.set(getInitialState());
};
