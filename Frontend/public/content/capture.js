/* global chrome, html2canvas */

window.myCaptureTool = (() => {
  // 상태 변수
  const state = {
    isSelecting: false,
    startPoint: {},
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
      state.startPoint = { x: e.pageX, y: e.pageY };
    }

    // 마우스 이동(스클롤)
    const handleMouseMove = (e) => {
      if (!state.isSelecting) return;
      updateSelectionArea(state.startPoint, { x: e.pageX, y: e.pageY }, screenBg);
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
      const cavas = await captureArea(state.startPoint, { x: e.pageX, y: e.pageY });
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
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    // 스크롤 위치를 고려한 실제 선택 영역 좌표
    const adjustedStart = {
      x: start.x - scrollLeft,
      y: start.y - scrollTop
    };
    const adjustedEnd = {
      x: end.x - scrollLeft,
      y: end.y - scrollTop
    };
    const top = Math.min(adjustedStart.y, adjustedEnd.y);
    const left = Math.min(adjustedStart.x, adjustedEnd.x);
    const right = document.documentElement.clientWidth - Math.max(adjustedStart.x, adjustedEnd.x);
    const bottom = document.documentElement.clientHeight - Math.max(adjustedStart.y, adjustedEnd.y);

    bgElement.style.borderWidth = `${top}px ${right}px ${bottom}px ${left}px`;
  }


  // 캡쳐 이미지 리턴 함수
  const captureArea = async (start, end) => {
    const start_x = Math.min(start.x, end.x);
    const start_y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x) + 8;
    const height = Math.abs(end.y - start.y) + 8;
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