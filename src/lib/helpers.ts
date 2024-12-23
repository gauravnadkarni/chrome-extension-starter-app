import { AppEventForContent, AppEventForWorker } from "./types";

export const injectScript = (fullPath: string) => {
  console.log(fullPath);
  const script = document.createElement("script");
  script.src = getResourceUrl(fullPath);
  console.log(script.src);
  document.documentElement.appendChild(script);
  script.onload = function () {
    script.remove();
  };
};

export const injectStyle = (fullPath: string) => {
  const link = document.createElement("link");
  link.href = getResourceUrl(fullPath);
  link.rel = "stylesheet";
  link.type = "text/css";
  document.head.appendChild(link);
};

export const getResourceUrl = (path: string) => chrome.runtime.getURL(path);

export const sendMessageToWorker = (
  event: AppEventForWorker,
  callback: (response: any) => void = () => {}
): void => {
  chrome.runtime.sendMessage(event, callback);
};

export const sendMessageFromWorkerToAllTabs = (
  event: AppEventForContent,
  callback: (response: any) => void = () => {}
): void => {
  chrome.tabs.query({}, function (tabs) {
    for (let tab of tabs) {
      if (!tab.id) {
        continue;
      }
      chrome.tabs.sendMessage(tab.id, event, callback);
    }
  });
};

export const getRandomId = (): string => crypto.randomUUID();

export const getFormattedUrl = (location: Location): string => {
  const { protocol, hostname, port, pathname } = window.location;
  return `${protocol}//${hostname}${port ? `:${port}` : ""}${pathname}`;
};

export const httpHandler = async (
  url: string,
  data: any,
  headers: Record<string, any> | undefined
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ message: "success", status: 200 });
    }, 3000);
  });
};
