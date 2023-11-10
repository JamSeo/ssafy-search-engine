/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 캡쳐모드 실행
  if (message.action === 'activateCaptureMode') {
    const tabId = message.tabId
    window.myCaptureTool.activateCaptureMode((captureAreaData, popupId) => {
      sendResponse({ tabId, captureAreaData, popupId })
    });
    return true;
  }

  // 스크린샷 parsing
  if (message.action === "processScreenshot") {
    window.imageUtils.parsingImageData(message).then(imageUrl => {
      console.log("캡처이미지URL: ", imageUrl);
      sendResponse({ imageUrl });
    }).catch(error => {
      console.error("Error parsing image data", error);
      sendResponse({ error });
    });
    return true;
  }

  // OCR 결과 popup에 띄우기
  if (message.action === 'ocrResponseData') {
    const { data, popupId } = message;
    console.log("OCR 결과: ", data);
    window.popupUtils.updatePopup(popupId, data);
  }
});
