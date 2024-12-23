import { StorageModel } from "./types";

export const getInitialState = (): StorageModel => ({
  notes: []
});

export const setLocalState = async (
  callback: (state: StorageModel) => StorageModel | null
): Promise<void> => {
  const fullState = (await getFullState()) as StorageModel;
  const partialState = callback(fullState);
  if (partialState === null) {
    return; //abort
  }
  chrome.storage.local.set({ ...partialState });
};

export const getFullState = async <
  T extends StorageModel,
  StorageModel
>(): Promise<T> => {
  const data = await chrome.storage.local.get(null);
  return data as T;
};

export const getStateSlice = async <K extends keyof StorageModel>(
  state: K
): Promise<StorageModel[K]> => {
  const data = await chrome.storage.local.get(state);
  return data[state];
};

export const getStateSections = async <K extends keyof StorageModel>(
  state: Array<K>
): Promise<Pick<StorageModel, K>> => {
  const data = await chrome.storage.local.get(state);
  return data as Pick<StorageModel, K>;
};
