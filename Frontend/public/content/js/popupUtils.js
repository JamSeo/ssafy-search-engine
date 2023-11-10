/** 팝업을 만들고 스타일을 설정하는 함수 */
const createPopup = () => {
  // 팝업 컨테이너
  const popupContainer = document.createElement("div");
  popupContainer.id = "popupContainer";

  // 팝업 헤더
  const popupHeader = document.createElement("div");
  popupHeader.classList.add("popup-header");

  // 팝업 타이틀
  const popupTitle = document.createElement("span");
  popupTitle.textContent = "SSE";
  popupTitle.classList.add("popup-title");
  popupHeader.appendChild(popupTitle);

  // 닫기 버튼
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  const closeButton = document.createElement("button");
  closeButton.classList.add("popup-button");
  closeButton.classList.add("close-button");
  closeButton.textContent = "Close";
  closeButton.onclick = () => {
    popupContainer.remove();
  };
  buttonContainer.appendChild(closeButton);
  popupHeader.appendChild(buttonContainer);
  popupContainer.appendChild(popupHeader);

  // 팝업 컨텍스트 생성 및 깜빡이는 커서 효과 추가
  const popupContext = document.createElement("div");
  popupContext.classList.add("popup-context");
  popupContext.classList.add("blinking-cursor");
  popupContainer.appendChild(popupContext);

  // 팝업 컨테이너를 body에 추가
  document.body.appendChild(popupContainer);
}

/** OCR 결과를 업데이트 해주는 함수 */
const updatePopup = (text) => {
  const popupContainer = document.querySelector("#popupContainer");

  if (!popupContainer) {
    createPopup();
  }

  // 복사 버튼 추가
  const copyButton = document.createElement("button");
  const buttonContainer = document.querySelector(".button-container");
  const closeButton = document.querySelector(".close-button")
  copyButton.classList.add("popup-button");
  copyButton.classList.add("copy-button");
  copyButton.textContent = "Copy";
  copyButton.onclick = () => {
    navigator.clipboard.writeText(text);
  };
  buttonContainer.insertBefore(copyButton, closeButton);

  // 깜빡이는 커서 효과 제거
  const popupContext = document.querySelector(".popup-context");
  if (popupContext) {
    popupContext.classList.remove("blinking-cursor");
    popupContext.remove();
  }

  // 텍스트 추가
  const ocrResultText = document.createElement("div");
  ocrResultText.classList.add("ocr-text");
  popupContainer.appendChild(ocrResultText);
  typeText(ocrResultText, text, 0, 20);
}

/** 타이핑 효과를 위한 함수 */
const typeText = (textElement, text, index, interval) => {
  if (index < text.length) {
    textElement.textContent += text[index++];
    setTimeout(() => typeText(textElement, text, index, interval), interval);
  }
}

window.popupUtils = { createPopup, updatePopup, typeText };