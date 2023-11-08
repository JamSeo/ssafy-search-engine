(function () {
  // 팝업을 만들고 스타일을 설정하는 함수
  const createPopup = (data) => {
    // 팝업 컨테이너
    const popupContainer = document.createElement('div');
    popupContainer.id = 'ocrPopupContainer';
    popupContainer.style.position = 'fixed';
    popupContainer.style.bottom = '10px';
    popupContainer.style.right = '10px';
    popupContainer.style.width = '300px';
    popupContainer.style.height = '200px';
    popupContainer.style.backgroundColor = 'white';
    popupContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    popupContainer.style.zIndex = '1000';
    popupContainer.style.padding = '10px';
    popupContainer.style.borderRadius = '4px';
    popupContainer.style.overflow = 'auto';

    // OCR 결과 텍스트
    const ocrResultText = document.createElement('div');
    ocrResultText.textContent = data;
    popupContainer.appendChild(ocrResultText);

    // 팝업 닫기 버튼
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.onclick = function () {
      popupContainer.remove();
    };
    popupContainer.appendChild(closeButton);

    // 팝업 컨테이너를 문서에 추가
    document.body.appendChild(popupContainer);
  }

  window.addEventListener('ocrData', (event) => {
    createPopup(event.detail);
  });
})();
