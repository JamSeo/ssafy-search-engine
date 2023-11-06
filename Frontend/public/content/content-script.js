/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'activateCaptureMode') {
    if (window.myCaptureTool) {
      window.myCaptureTool.activateCaptureMode();
    } else {
      console.error("Capture tool not initialized!");
    }
  }
});