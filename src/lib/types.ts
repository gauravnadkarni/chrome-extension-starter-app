export enum SidebarPosition {
  TOP_LEFT = 1,
  TOP_CENTER = 2,
  TOP_RIGHT = 3,
  LEFT_CENTER = 4,
  CENTER = 5,
  CENTER_RIGHT = 6,
  BOTTOM_LEFT = 7,
  BOTTOM_CENTER = 8,
  BOTTOM_RIGHT = 9,
}

export enum WorkerEvent {
  SAVE_NOTE_TO_STORAGE="SAVE_NOTE_TO_STORAGE",
  GET_ALL_NOTES_FROM_STORAGE_FOR_SITE="GET_ALL_NOTES_FROM_STORAGE_FOR_SITE",
  SYNC_NOTES_WITH_BACKEND="SYNC_NOTES_WITH_BACKEND",
  DELETE_NOTE_FOR_SITE_FROM_STORAGE="DELETE_NOTE_FOR_SITE_FROM_STORAGE",
}

export enum ContentEvent {
  SIDEBAR_CONTROL_POSITION_CHANGED="SIDEBAR_CONTROL_POSITION_CHANGED",
}

export enum SidebarStatus {
  OPEN = "open",
  CLOSE = "close",
}

export type SidebarState = {
  status: SidebarStatus;
  position: SidebarPosition;
};

export type SelectedSidebarPosition = Omit<SidebarState, "status">;

export type AppEventForWorker = {
  name: WorkerEvent;
  data: any;
};

export type AppEventForContent = {
  name: ContentEvent;
  data: any;
};

export type Note = {
  tempId: string | undefined;
  id: string | undefined;
  text: string;
};

export type NoteWithSite = Note & {
  site: string
}

export type NoteWithIdAndWithoutSite = Omit<Note,"id" | "site"> & {
  id: string;
}

export type StorageModel = {
  notes: Array<{
    site: string | null;
    list:Array<NoteWithIdAndWithoutSite>;
  }>
}
