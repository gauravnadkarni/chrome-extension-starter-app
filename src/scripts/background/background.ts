import { onAppInstalled, onMessage } from "../../lib/worker";

(() => {
    chrome.runtime.onInstalled.addListener(onAppInstalled);
    chrome.runtime.onMessage.addListener(onMessage)
})();