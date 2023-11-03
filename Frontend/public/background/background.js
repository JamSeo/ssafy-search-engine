/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'activateCaptureMode') {
    const tabId = message.tabId;
    // action을 함께 content script로 전송
    chrome.tabs.sendMessage(tabId, { action: message.action });
  }
});