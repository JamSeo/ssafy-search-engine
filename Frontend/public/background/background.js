/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'activateCaptureMode') {
    const tabId = message.tabId;

    // // 탭의 화면 캡쳐 후 이미지 메시지로 전송
    // chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
    //   // 캡쳐된 이미지와 action을 함께 content script로 전송
    //   chrome.tabs.sendMessage(tabId, { action: message.action, img: dataUrl });
    //   console.log(dataUrl)
    // });

    // 캡쳐된 이미지와 action을 함께 content script로 전송
    chrome.tabs.sendMessage(tabId, { action: message.action });
  }
});