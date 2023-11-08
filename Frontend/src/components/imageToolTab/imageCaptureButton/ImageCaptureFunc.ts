import { serverApi } from "../../../utils/serverApi";
import { IhandleCaptureData } from "../../../interface/ImageCaptureButton";

// 원하는 영역과 크기로 이미지를 그리는 함수
const resizeImage = (
  image: HTMLImageElement | HTMLCanvasElement,
  startX: number,
  startY: number,
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx?.drawImage(
    image,
    startX,
    startY,
    originalWidth,
    originalHeight,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return canvas;
};

// 현재 탭의 정보를 가져오는 함수
const getActiveTab = async (): Promise<chrome.tabs.Tab | undefined> => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  // "chrome://"으로 시작하는 url이면 막기
  if (tab.url?.startsWith("chrome://")) {
    alert("Capture is not available on this tab.");
    return undefined;
  }
  if (typeof tab.id === "number") {
    return new Promise((resolve) => {
      chrome.tabs.get(tab.id as number, (tabInfo) => resolve(tabInfo));
    });
  }
  return undefined;
};

// 반환된 좌표를 이용해서 캡쳐 이미지를 그리는 함수
const handleCaptureData = (
  captureData: IhandleCaptureData
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const { startX, startY, width, height } = captureData;

    // [0] 현재 탭 크기 가져오기
    const currentTab = await getActiveTab();
    const browserWidth = currentTab?.width ?? 0;
    const browserHeight = currentTab?.height ?? 0;

    chrome.tabs.captureVisibleTab((screenshotDataUrl) => {
      const browserImage = new Image();
      browserImage.src = screenshotDataUrl;

      browserImage.onload = () => {
        // [1] 전체화면 캡쳐 후 실제 브라우저 크기로 이미지 사이즈 변환
        const realSizeImage = resizeImage(
          browserImage,
          0,
          0,
          browserImage.width,
          browserImage.height,
          browserWidth,
          browserHeight
        );
        // [2] 변환된 이미지에서 캡쳐 영역 자르기
        const capturedImage = resizeImage(
          realSizeImage,
          startX,
          startY,
          width,
          height,
          width,
          height
        );
        resolve(capturedImage.toDataURL());
      };
      browserImage.onerror = () => {
        reject("Failed to load captured image.");
      };
    });
  });
};

// OCR API에 이미지를 전송하고 결과를 가져오는 함수
const sendImageToOcrApi = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("image", blob, "image.png");

    // OCR API에 POST 요청
    const ocrResponse = await serverApi.post("/ocr/predict", formData);
    return ocrResponse.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { resizeImage, getActiveTab, handleCaptureData, sendImageToOcrApi };
