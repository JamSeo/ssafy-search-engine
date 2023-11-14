/* global chrome */

/** 팝업을 만들고 스타일을 설정하는 함수 */
const createPopup = (popupId) => {
  if (!popupId || document.getElementById(popupId)) return;
  // 팝업 컨테이너
  const popupContainer = document.createElement("div");
  popupContainer.id = popupId;
  popupContainer.classList.add("sse-popup-container");

  // 팝업 헤더
  const popupHeader = document.createElement("div");
  popupHeader.classList.add("sse-popup-header");

  // 팝업 타이틀
  const popupTitle = document.createElement("span");
  popupTitle.textContent = "SSE";
  popupTitle.classList.add("sse-popup-title");
  popupHeader.appendChild(popupTitle);

  // 닫기 버튼
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("sse-button-container");
  const closeButton = document.createElement("button");
  closeButton.classList.add("sse-popup-button");
  closeButton.classList.add("sse-close-button");
  closeButton.textContent = "Close";
  closeButton.onclick = () => {
    popupContainer.remove();
  };
  buttonContainer.appendChild(closeButton);
  popupHeader.appendChild(buttonContainer);
  popupContainer.appendChild(popupHeader);

  // 팝업 컨텍스트 생성 및 깜빡이는 커서 효과 추가
  const popupContext = document.createElement("div");
  popupContext.classList.add("sse-popup-context");
  popupContext.classList.add("blinking-cursor");
  popupContainer.appendChild(popupContext);

  // 팝업 컨테이너를 body에 추가
  document.body.appendChild(popupContainer);
}

/** OCR 결과를 업데이트 해주는 함수 */
const updatePopup = (popupId, ocrResponseData, capturedImageUrl) => {
  const popupContainer = document.getElementById(popupId);

  if (!popupContainer) return;

  const buttonContainer = popupContainer.querySelector(".sse-button-container");

  // 기존 버튼과 텍스트 삭제
  if (buttonContainer) {
    const copyButton = buttonContainer.querySelector(".sse-copy-button");
    const saveButton = buttonContainer.querySelector(".sse-save-button");
    copyButton?.remove();
    saveButton?.remove();
  }
  const existingText = popupContainer.querySelector(".sse-ocr-text");
  existingText?.remove();

  // 복사 버튼 추가
  const copyButton = document.createElement("button");
  copyButton.classList.add("sse-popup-button");
  copyButton.classList.add("sse-copy-button");
  copyButton.textContent = "Copy";
  copyButton.onclick = () => {
    console.log("[popupUtils.js/updatePopup] 결과 복사", ocrResponseData);
    navigator.clipboard.writeText(ocrResponseData);
  };
  buttonContainer.insertBefore(copyButton, buttonContainer.firstChild);

  // 저장 버튼 추가
  const saveButton = document.createElement("button");
  saveButton.classList.add("sse-popup-button");
  saveButton.classList.add("sse-save-button");
  saveButton.textContent = "Save";
  saveButton.onclick = () => {
    console.log("[popupUtils.js/updatePopup] 서버에 저장 요청", ocrResponseData, capturedImageUrl);
    chrome.runtime.sendMessage({
      action: "saveOcrResult",
      ocrResponseData,
      capturedImageUrl,
    });
  };
  buttonContainer.insertBefore(saveButton, buttonContainer.firstChild);

  // 깜빡이는 커서 효과 제거
  const popupContext = document.querySelector(".sse-popup-context");
  if (popupContext) {
    popupContext.classList.remove("blinking-cursor");
    popupContext.remove();
  }

  // 텍스트 추가
  const ocrResultText = document.createElement("div");
  ocrResultText.classList.add("sse-ocr-text");
  popupContainer.appendChild(ocrResultText);
  if (ocrResponseData) {
    typeText(ocrResultText, ocrResponseData, 0, 20);
  }
}

/** 타이핑 효과를 위한 함수 */
const typeText = (textElement, text, index, interval) => {
  if (index < text.length) {
    textElement.textContent += text[index++];
    setTimeout(() => typeText(textElement, text, index, interval), interval);
  }
}

window.popupUtils = { createPopup, updatePopup, typeText };