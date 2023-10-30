/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 캡쳐 실행(background => content)
  if (message.action === 'activateCaptureMode') {
    const action = message.action
    const tabId = message.tabId
    chrome.tabs.sendMessage(tabId, { action: action });
  }
});