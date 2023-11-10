/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 브라우저 캡처 요청
  if (message.action === 'activateCaptureMode') {
    console.log("[background.js] 메시지 요청 내용: 'activateCaptureMode'")
    const { tabId, action } = message;
    chrome.tabs.sendMessage(tabId, { tabId, action }, (response) => {
      handleCaptureAreaData(response);
    });
  }

  // 로그인 요청
  if (message.action === 'activateAuthMode') {
    console.log("[background.js] 메시지 요청 내용: 'activateAuthMode'")
    // chrome.windows.create({
    //   url: "http://k9a708.p.ssafy.io:8081/swagger-ui/index.html#/",
    //   type: 'popup',
    // });
    chrome.identity.launchWebAuthFlow(
      {
        url: "http://k9a708.p.ssafy.io:8081/login",
        interactive: true,
      },
      (redirectUrl) => {
        // redirectUrl에서 인증 코드 추출
        if (redirectUrl) {
          const url = new URL(redirectUrl);
          const code = url.searchParams.get('code');
          console.log(code);
        }
      }
    );
  }
});

/** 캡쳐 이미지를 pasring하고 OCR 서버로 전송하는 함수 */
const handleCaptureAreaData = async (message, sender, sendResponse) => {
  try {
    const { tabId, captureAreaData } = message;

    // [1] 캡쳐된 이미지 parsing
    const capturedImageUrl = await parsingCaptureData(tabId, captureAreaData);

    // [2] parsing된 이미지 OCR 서버로 전송
    const ocrResponseData = await sendImageToOcrApi(capturedImageUrl);

    // [3] 반환된 결과 content-script로 전송
    console.log("[background.js/handleCaptureAreaData] OCR 결과를 브라우저로 전송")
    chrome.tabs.sendMessage(tabId, { action: "ocrResponseData", data: ocrResponseData });
    return;
  } catch (error) {
    console.error("[background.js/handleCaptureAreaData] 전송 실패", error);
  }
};

/** 반환된 좌표를 이용해서 캡쳐 이미지를 그리는 함수 */
const parsingCaptureData = (tabId, captureAreaData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // [0] 활성 탭 정보 가져오기
      const { windowId, width, height } = await chrome.tabs.get(tabId);
      // [1] 현재 보이는 탭 캡처
      chrome.tabs.captureVisibleTab(windowId, { format: "jpeg" }, (imageUrl) => {
        // [2] 캡처된 이미지 parsing
        console.log("[background.js/parsingCaptureData] 메시지 요청 내용: processScreenshot");
        chrome.tabs.sendMessage(tabId, {
          action: "processScreenshot",
          data: {
            imageUrl,
            captureAreaData,
            tabWidth: width,
            tabHeight: height,
          }
        },
          // [3] parsing된 이미지 반환
          (response) => {
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
  const OCR_SERVER_URL = "http://k9a708.p.ssafy.io:8081/ocr/predict";

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("image", blob, "image.jpeg");

    // OCR API에 POST 요청
    console.log("[background.js/sendImageToOcrApi] 이미지를 OCR 서버로 전송")
    const ocrResponse = await fetch(OCR_SERVER_URL, {
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