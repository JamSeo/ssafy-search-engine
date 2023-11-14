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

  // 업로드 이미지 분석 전 빈 popup 띄우기
  if (message.action === "analyzeUploadImage") {
    if (!message?.ocrResponseData) {
      console.log("업로드이미지 분석 전 빈 팝업 띄우기");

      window.popupUtils.createPopup(message.popupId);
    }
    if (message?.ocrResponseData) {
      console.log("업로드이미지 분석 결과 띄우기");

      const { popupId, ocrResponseData, uploadImageUrl } = message;
      window.popupUtils.updatePopup(popupId, ocrResponseData, uploadImageUrl);
    }
  }

  // OCR 결과 popup에 띄우기
  if (message.action === 'ocrResponseData') {
    const { ocrResponseData, popupId, capturedImageUrl } = message;
    console.log("OCR 결과: ", ocrResponseData);

    window.popupUtils.updatePopup(popupId, ocrResponseData, capturedImageUrl);
  }

  // HistoryData popup에 띄우기
  if (message.action === "displayHistoryData") {

    const { fileLocation, createDate, result } = message.historyData;
    const popupId = createDate;

    console.log("HistoryData 띄우기: ", result)

    window.popupUtils.createPopup(popupId);
    window.popupUtils.updatePopup(popupId, result, fileLocation);
  }
});
