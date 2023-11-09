/** 팝업을 만들고 스타일을 설정하는 함수 */
const createPopup = () => {
  // 팝업 컨테이너
  const popupContainer = document.createElement("div");
  popupContainer.id = "PopupContainer";

  // 팝업 헤더
  const popupHeader = document.createElement("div");
  popupHeader.classList.add("popupHeader");

  // 팝업 타이틀
  const popupTitle = document.createElement("span");
  popupTitle.textContent = "SSE";
  popupTitle.classList.add("popupTitle");
  popupHeader.appendChild(popupTitle);

  // 닫기 버튼
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");

  const closeButton = document.createElement("button");
  closeButton.classList.add("popupButton");
  closeButton.classList.add("closeButton");
  closeButton.textContent = "Close";
  closeButton.onclick = () => {
    popupContainer.remove();
  };

  buttonContainer.appendChild(closeButton);
  popupHeader.appendChild(buttonContainer);

  // 텍스트 커서 깜빡이 효과
  const popupContext = document.createElement("div");
  popupContext.classList.add("popupContext");
  // blink("popupContext");
  // setInterval(blink, 500);

  popupContainer.appendChild(popupHeader);
  popupContainer.appendChild(popupContext);
  document.body.appendChild(popupContainer);

}

/** OCR 결과를 업데이트 해주는 함수 */
const updatePopup = (text) => {
  // 복사 버튼 추가
  const copyButton = document.createElement("button");
  const buttonContainer = document.querySelector(".buttonContainer");
  const closeButton = document.querySelector(".closeButton")
  copyButton.classList.add("popupButton");
  copyButton.classList.add("copyButton");
  copyButton.textContent = "Copy";
  copyButton.onclick = () => {
    navigator.clipboard.writeText(text);
  };
  buttonContainer.insertBefore(copyButton, closeButton);

  // 텍스트 추가
  const popupContext = document.querySelector(".popupContext");
  const ocrResultText = document.createElement("div");
  popupContext.appendChild(ocrResultText);
  typeText(ocrResultText, text, 0, 20);
}

/** 커서 깜빡이는 효과 */
const blink = (targetElement) => {
  // targetElement.classList.toggle("active");
}

/** 타이핑 효과를 위한 함수 */
const typeText = (textElement, text, index, interval) => {
  if (index < text.length) {
    textElement.textContent += text[index++];
    setTimeout(() => typeText(textElement, text, index, interval), interval);
  }
}


window.popupUtils = { createPopup, updatePopup, typeText };