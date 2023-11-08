/* global chrome */

// 메시지 처리 블록
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 브라우저 캡처 요청
  if (message.action === 'activateCaptureMode') {
    console.log("[background.js] 메시지 내용: 'activateCaptureMode'")
    const tabId = message.tabId;
    chrome.tabs.sendMessage(tabId, { action: message.action });
  }

  // 캡처 이미지를 OCR로 분석 후 브라우저에 전송
  if (message.action === "captureAreaData") {
    console.log("[background.js] 메시지 내용: 'captureAreaData'")
    handleCaptureAreaData(message, sender, sendResponse);
  }
});

/** 현재 탭의 정보를 가져오는 함수 */
const getActiveTab = async () => {
  const tabs = await chrome.tabs.query({ active: true });
  const tab = tabs[0]

  if (!tab) {
    console.error("[background.js/getActiveTab] No active tab found.");
    return undefined;
  }

  // "chrome://"으로 시작하는 url이면 막기
  if (tab.url.startsWith("chrome://")) {
    alert("Capture is not available on this tab.");
    return undefined;
  }

  if (typeof tab.id === "number") {
    return new Promise((resolve) => {
      chrome.tabs.get(tab.id, (tabInfo) => resolve(tabInfo));
    });
  }
  return undefined;
};

/** 반환된 좌표를 이용해서 캡쳐 이미지를 그리는 함수 */
const parsingCaptureData = (captureAreaData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // [0] 활성 탭 정보 가져오기
      const activeTab = await getActiveTab();
      // [1] 현재 보이는 탭 캡처
      chrome.tabs.captureVisibleTab(null, { format: "png" }, (imageUrl) => {
        // [2] 캡처된 이미지 parsing
        console.log("[background.js/parsingCaptureData] 메시지 내용: processScreenshot");
        chrome.tabs.sendMessage(activeTab.id, {
          action: "processScreenshot",
          imageUrl: imageUrl,
          captureAreaData,
          activeTabData: {
            activeTabWidth: activeTab.width,
            activeTabHeight: activeTab.height,
          },
        }, (response) => {
          // [3] parsing된 이미지 반환
          response?.imageUrl &&
            console.log("[background.js/parsingCaptureData] 메시지 반환 내용", response.imageUrl);
          resolve(response.imageUrl);
          response?.error &&
            console.log("[background.js/parsingCaptureData] 메시지 전송 실패", response.error);
          reject(response.error);
        });
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  })
};

/** OCR API에 이미지를 전송하고 결과를 가져오는 함수 */
const sendImageToOcrApi = async (imageUrl) => {
  console.log("[background.js/sendImageToOcrApi] 이미지를 OCR 서버로 전송")
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("image", blob, "image.png");

    // OCR API에 POST 요청
    const ocrResponse = await fetch("http://k9a708.p.ssafy.io:8081/ocr/predict", {
      method: "POST",
      body: formData,
    });

    const data = await ocrResponse.json();
    console.log("[background.js/sendImageToOcrApi] 메시지 반환 내용", data.result);
    return data.result;
  }
  catch (error) {
    console.log("[background.js/sendImageToOcrApi] 메시지 전송 실패", error);
    throw error;
  }
};

/** 캡쳐 이미지를 pasring하고 OCR 서버로 전송하는 함수 */
const handleCaptureAreaData = async (message, sender, endResponse) => {
  try {
    // [1] 캡쳐된 이미지 parsing
    const capturedImageUrl = await parsingCaptureData(message.data);
    // [2] parsing된 이미지 OCR 서버로 전송
    const ocrResponseData = await sendImageToOcrApi(capturedImageUrl);
    // [3] 반환된 결과 content-script로 전송
    const currentTab = await getActiveTab()
    console.log("[background.js/handleCaptureAreaData] OCR 결과를 브라우저로 전송")
    chrome.tabs.sendMessage(currentTab.id, {
      action: "ocrResponseData",
      data: ocrResponseData,
    })
    return;
  } catch (error) {
    console.error("[background.js/handleCaptureAreaData] 전송 실패", error);
  }
};