// /* global chrome, html2canvas */
/* global chrome */

window.myCaptureTool = (() => {
  // 상태 변수
  let isSelecting = false;
  let startPoint = {};
  const body = document.body;

  // 캡쳐 모드 활성화
  const activateCaptureMode = () => {
    console.log("activateCaptureMode ON");

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
      sendSelectedAreaToPopup(startPoint, endPoint);
      deactivateCaptureMode();
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

  // 선택된 영역을 popup으로 전송하는 함수
  const sendSelectedAreaToPopup = (start, end) => {
    const startX = Math.min(start.x, end.x);
    const startY = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    const captureAreaData = { startX: startX, startY: startY, width: width, height: height }
    chrome.runtime.sendMessage({ action: 'captureAreaData', data: captureAreaData });
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





// // 마우스 스크롤 범위 나타내는 함수
// const updateSelectionArea = (start, end, bgElement) => {
//   const scrollTop = window.scrollY || document.documentElement.scrollTop;
//   const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
//   // 스크롤 위치를 고려한 실제 선택 영역 좌표
//   const adjustedStart = {
//     x: start.x - scrollLeft,
//     y: start.y - scrollTop
//   };
//   const adjustedEnd = {
//     x: end.x - scrollLeft,
//     y: end.y - scrollTop
//   };
//   const top = Math.min(adjustedStart.y, adjustedEnd.y);
//   const left = Math.min(adjustedStart.x, adjustedEnd.x);
//   const right = document.documentElement.clientWidth - Math.max(adjustedStart.x, adjustedEnd.x);
//   const bottom = document.documentElement.clientHeight - Math.max(adjustedStart.y, adjustedEnd.y);

//   bgElement.style.borderWidth = `${top}px ${right}px ${bottom}px ${left}px`;
// }


// // 캡쳐 이미지 리턴 함수
// const captureArea = async (start, end) => {
//   const start_x = Math.min(start.x, end.x);
//   const start_y = Math.min(start.y, end.y);
//   const width = Math.abs(end.x - start.x) + 8;
//   const height = Math.abs(end.y - start.y) + 8;
//   const canvas = await html2canvas(document.body, {
//     x: start_x,
//     y: start_y,
//     width: width,
//     height: height
//   });

//   return canvas;
// }

// // 캡쳐 이미지 popup으로 전송 함수
// const sendImageDataToPopup = (canvas) => {
//   const imgDataUrl = canvas.toDataURL();
//   chrome.runtime.sendMessage({ action: 'imageData', data: imgDataUrl });
// }