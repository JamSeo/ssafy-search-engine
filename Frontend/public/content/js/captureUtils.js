window.myCaptureTool = (() => {
  // 상태 변수
  let isSelecting = false;
  let startPoint = {};
  const body = document.body;

  // 캡쳐 모드 활성화
  const activateCaptureMode = (callback) => {
    console.log("activateCaptureMode ON");

    // 이미 screenBg가 존재한다면 제거
    const existingBg = document.getElementById("screenshot_background");
    if (existingBg) existingBg.remove();

    body.classList.add("edit_cursor");
    const screenBg = createDivElement("screenshot_background");
    body.appendChild(screenBg);
    addEventListeners(body, screenBg, callback);
  }

  const addEventListeners = (body, screenBg, callback) => {
    // 마우스 클릭(캡쳐 시작)
    const handleMouseDown = (e) => {
      isSelecting = true;
      startPoint = { x: e.clientX, y: e.clientY };
    }

    // 마우스 이동(스클롤)
    const handleMouseMove = (e) => {
      if (!isSelecting) return;
      const currentPoint = { x: e.clientX, y: e.clientY };
      updateSelectionArea(startPoint, currentPoint, screenBg);
    }

    // esc키 클릭(캡쳐 취소)
    const handleKeyUp = (e) => {
      if (e.key === "Escape") {
        deactivateCaptureMode();
      }
    }

    // 마우스 언클릭(캡쳐 완료)
    const handleMouseUp = (e) => {
      if (!isSelecting) return;
      const endPoint = { x: e.clientX, y: e.clientY };
      const captureAreaData = parsingCaptureAreaData(startPoint, endPoint);
      const popupId = "" + startPoint.y + endPoint.x;
      deactivateCaptureMode();
      callback(captureAreaData, popupId);
      window.popupUtils.createPopup(popupId);
    }

    // 캡쳐 비활성화
    const deactivateCaptureMode = () => {
      console.log("activateCaptureMode OFF");
      const existingBg = document.getElementById("screenshot_background");
      existingBg.remove();
      screenBg.remove();
      isSelecting = false;
      body.classList.remove("edit_cursor");
      body.removeEventListener("mousedown", handleMouseDown);
      body.removeEventListener("mousemove", handleMouseMove);
      body.removeEventListener("mouseup", handleMouseUp);
      body.removeEventListener("keyup", handleKeyUp);
    }

    // 캡쳐 모드 실행
    body.addEventListener("mousedown", handleMouseDown);
    body.addEventListener("mousemove", handleMouseMove);
    body.addEventListener("mouseup", handleMouseUp);
    body.addEventListener("keyup", handleKeyUp);
  }

  // 마우스 스크롤 범위 나타내는 함수
  const updateSelectionArea = (start, current, bgElement) => {
    const left = Math.min(start.x, current.x);
    const top = Math.min(start.y, current.y);
    const right = document.documentElement.clientWidth - Math.max(start.x, current.x);
    const bottom = document.documentElement.clientHeight - Math.max(start.y, current.y);
    bgElement.style.borderWidth = `${top}px ${right}px ${bottom}px ${left}px`;
  }

  // 선택된 영역을 데이터로 parsing하는 함수
  const parsingCaptureAreaData = (start, end) => {
    const startX = Math.min(start.x, end.x);
    const startY = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    return { startX, startY, width, height };
  }

  // div 태그 생성 함수
  const createDivElement = (id) => {
    const div = document.createElement("div");
    div.id = id;
    return div;
  }

  return {
    activateCaptureMode: activateCaptureMode
  };
})();