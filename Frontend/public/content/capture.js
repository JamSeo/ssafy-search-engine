/* global chrome, html2canvas */

window.myCaptureTool = (() => {
  // 상태 변수
  const state = {
    isSelecting: false,
    startPosition: {}
  };

  // 캡쳐 모드 활성화
  const activateCaptureMode = () => {
    console.log("activateCaptureMode ON");
    const body = document.body;

    // 이미 screenBg가 존재한다면 제거
    const existingBg = document.getElementById("screenshot_background");
    if (existingBg) existingBg.remove();

    body.classList.add("edit_cursor");
    const screenBg = createDivElement("screenshot_background");
    body.appendChild(screenBg);
    addEventListeners(body, screenBg);
  }

  // 마우스, 키보드 기능
  const addEventListeners = (body, screenBg) => {

    // 마우스 클릭(캡쳐 시작)
    const handleMouseDown = (e) => {
      state.isSelecting = true;
      state.startPosition = { x: e.clientX, y: e.clientY };
    }

    // 마우스 이동(스클롤)
    const handleMouseMove = (e) => {
      if (!state.isSelecting) return;
      updateSelectionArea(state.startPosition, { x: e.clientX, y: e.clientY }, screenBg);
    }

    // esc키 클릭(캡쳐 취소)
    const handleKeyUp = (e) => {
      if (e.key === "Escape") {
        deactivateCaptureMode();
      }
    }

    // 마우스 언클릭(캡쳐 완료)
    const handleMouseUp = async (e) => {
      if (!state.isSelecting) return;
      deactivateCaptureMode();
      const cavas = await captureArea(state.startPosition, { x: e.clientX, y: e.clientY });
      sendImageDataToPopup(cavas);
    }

    // 캡쳐 비활성화
    const deactivateCaptureMode = () => {
      const body = document.body;
      body.classList.remove("edit_cursor");

      // 필요한 정리 작업
      screenBg.remove();
      const existingScreenBg = document.getElementById("screenshot_background");
      if (existingScreenBg) existingScreenBg.remove();

      body.removeEventListener("mousedown", handleMouseDown);
      body.removeEventListener("mousemove", handleMouseMove);
      body.removeEventListener("mouseup", handleMouseUp);
      body.removeEventListener("keyup", handleKeyUp);

      state.isSelecting = false;
      console.log("activateCaptureMode OFF");
    }

    body.addEventListener("mousedown", handleMouseDown);
    body.addEventListener("mousemove", handleMouseMove);
    body.addEventListener("mouseup", handleMouseUp);
    body.addEventListener("keyup", handleKeyUp);
  }

  // div 태그 생성 함수
  const createDivElement = (id) => {
    const div = document.createElement("div");
    div.id = id;
    return div;
  }

  // 마우스 스크롤 범위 나타내는 함수
  const updateSelectionArea = (start, end, bgElement) => {
    const top = Math.min(start.y, end.y);
    const right = document.documentElement.clientWidth - Math.max(start.x, end.x);
    const bottom = document.documentElement.clientHeight - Math.max(start.y, end.y);
    const left = Math.min(start.x, end.x);
    bgElement.style.borderWidth = `${top}px ${right}px ${bottom}px ${left}px`;
  }

  // 캡쳐 이미지 리턴 함수
  const captureArea = async (start, end) => {
    const start_x = Math.min(start.x, end.x);
    const start_y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    const canvas = await html2canvas(document.body, {
      x: start_x,
      y: start_y,
      width: width,
      height: height
    });

    return canvas;
  }

  // 캡쳐 이미지 popup으로 전송 함수
  const sendImageDataToPopup = (canvas) => {
    const imgDataUrl = canvas.toDataURL();
    chrome.runtime.sendMessage({ action: 'imageData', data: imgDataUrl });
  }

  return {
    activateCaptureMode: activateCaptureMode
  };
})();