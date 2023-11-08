/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 캡쳐모드 실행
  if (message.action === 'activateCaptureMode') {
    if (window.myCaptureTool) {
      window.myCaptureTool.activateCaptureMode();
    } else {
      console.error("Capture tool not initialized!");
    }
  }

  // 스크린샷 parsing
  if (message.action === "processScreenshot") {
    parsingImageData(message).then(imageUrl => {
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
    const ocrData = message.data;
    console.log("OCR 결과: ", ocrData);
    createPopup(ocrData);
  }
});

/** 원하는 영역과 크기로 이미지를 그리는 함수 */
const resizeImage = (image, startX, startY, originalWidth, originalHeight, targetWidth, targetHeight) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx?.drawImage(
    image, startX, startY, originalWidth, originalHeight, 0, 0, targetWidth, targetHeight
  );
  return canvas;
};

/** 캡처 이미지 parsing하는 함수 */
const parsingImageData = (message) => {
  return new Promise((resolve, reject) => {
    const { imageUrl, captureAreaData, activeTabData } = message;
    const { startX, startY, width, height } = captureAreaData;
    const { activeTabWidth, activeTabHeight } = activeTabData;
    const screenshot = new Image();

    screenshot.onload = () => {
      const ratioX = screenshot.width / activeTabWidth;
      const ratioY = screenshot.height / activeTabHeight;
      const actualX = startX * ratioX;
      const actualY = startY * ratioY;
      const actualWidth = width * ratioX;
      const actualHeight = height * ratioY;

      try {
        const capturedImage = resizeImage(
          screenshot, actualX, actualY, actualWidth, actualHeight, actualWidth, actualHeight
        );
        const captureImageUrl = capturedImage.toDataURL();
        resolve(captureImageUrl);
      }
      catch (error) {
        reject(error);
      }
    };
    screenshot.src = imageUrl;
  });
}

/** 팝업을 만들고 스타일을 설정하는 함수 */
const createPopup = (data) => {
  // 팝업 컨테이너
  const popupContainer = document.createElement('div');
  popupContainer.id = 'PopupContainer';

  // 팝업 헤더
  const popupHeader = document.createElement('div');
  popupHeader.classList.add('popupHeader');

  // 팝업 타이틀
  const popupTitle = document.createElement('span');
  popupTitle.textContent = 'SSE';
  popupTitle.classList.add('popupTitle');
  popupHeader.appendChild(popupTitle);

  // 닫기 버튼
  const closeButton = document.createElement('button');
  closeButton.classList.add('closeButton');
  closeButton.textContent = 'Close';
  closeButton.onclick = () => popupContainer.remove();
  popupHeader.appendChild(closeButton);

  // 팝업 컨테이너에 헤더 추가
  popupContainer.appendChild(popupHeader);

  // OCR 결과 텍스트
  const ocrResultText = document.createElement('div');
  ocrResultText.textContent = data;
  popupContainer.appendChild(ocrResultText);

  // 팝업을 문서에 추가
  document.body.appendChild(popupContainer);
}