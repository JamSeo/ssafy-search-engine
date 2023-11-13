/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 브라우저 캡처 요청
  if (message.action === 'activateCaptureMode') {
    console.log("[background.js] 메시지 요청 내용: 'activateCaptureMode'");

    const { tabId, action } = message;
    chrome.tabs.sendMessage(tabId, { tabId, action }, (response) => {
      handleCaptureAreaData(response);
    });
  }

  // OCR 결과 저장 요청
  if (message.action === "saveOcrResult") {
    console.log("[background.js] 메시지 요청 내용: 'saveOcrResult'");

    chrome.storage.local.get(["accessToken"], async (res) => {
      let accessToken = res.accessToken;

      if (!accessToken) {
        accessToken = await requestAuthorization();
      }

      accessToken && requestSaveData(accessToken, message);
    });
  }

  // 로그인 요청
  if (message.action === "activateAuthMode") {
    console.log("[background.js] 메시지 요청 내용: 'activateAuthMode'");

    requestAuthorization();
  }
});


/** 캡쳐 이미지를 pasring하고 OCR 서버로 전송하는 함수 */
const handleCaptureAreaData = async (message, sender, sendResponse) => {
  try {
    const { tabId, captureAreaData, popupId } = message;

    // [1] 캡쳐된 이미지 parsing
    const capturedImageUrl = await parsingCaptureData(tabId, captureAreaData);

    // [2] parsing된 이미지 OCR 서버로 전송
    const ocrResponseData = await sendImageToOcrApi(capturedImageUrl);

    // [3] 반환된 결과 content-script로 전송
    console.log("[background.js/handleCaptureAreaData] OCR 결과를 브라우저로 전송")
    chrome.tabs.sendMessage(tabId, {
      action: "ocrResponseData",
      ocrResponseData,
      popupId,
      capturedImageUrl,
    });
    return;
  } catch (error) {
    console.error("[background.js/handleCaptureAreaData] 전송 실패", error);
  }
};

/** 구글 O-AUTH 요청하는 함수 */
const requestAuthorization = () => {
  return new Promise((resolve, reject) => {
    chrome.windows.create(
      {
        url: "http://k9a708.p.ssafy.io:8081/swagger-ui/index.html#/",
        type: "popup",
      },
      (popupWindow) => {
        // 팝업이 열린 후에 URL에서 코드를 찾아 저장하고 팝업을 닫음
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
          if (
            tabId === popupWindow.tabs[0].id &&
            changeInfo.status === "complete"
          ) {
            chrome.tabs.get(tabId, (currentTab) => {
              const currentURL = currentTab.url;
              const url = new URL(currentURL);
              const accessToken = url.searchParams.get("code");

              // loacal storage에 AccessToken 저장
              if (accessToken) {
                chrome.storage.local.set({ accessToken }, () => {
                  console.log("[background.js] AccessToken is saved");
                });
                chrome.windows.remove(popupWindow.id); // 팝업 닫기
                chrome.tabs.onUpdated.removeListener(listener);
                resolve(accessToken);
              }
            });
          }
        });
      }
    );
  });
}

/** OCR 데이터 저장 요청하는 함수 */
const requestSaveData = async (accessToken, { ocrResponseData, capturedImageUrl }) => {
  const OCR_SAVE_URL = "http://k9a708.p.ssafy.io:8081/ocr/create";

  try {
    const imageUrl = await fetch(capturedImageUrl);
    const blob = await imageUrl.blob();
    const formData = new FormData();
    formData.append("image", blob, "image.jpeg");
    formData.append("result", ocrResponseData);

    // OCR API에 POST 요청
    console.log("[background.js/fetchData] OCR 데이터 저장 요청")
    const response = await fetch(OCR_SAVE_URL, {
      method: "POST",
      body: formData,
      headers: { accessToken },
    });

    const data = await response.json();
    console.log("[background.js/fetchData] 메시지 반환 내용", data.url);
  } catch (error) {
    console.log("[background.js/fetchData] 메시지 전송 실패", error);
    throw error;
  }
}

/** 반환된 좌표를 이용해서 캡쳐 이미지를 그리는 함수 */
const parsingCaptureData = (tabId, captureAreaData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // [0] 활성 탭 정보 가져오기
      const { width, height } = await chrome.tabs.get(tabId);
      // [1] 현재 보이는 탭 캡처
      chrome.tabs.captureVisibleTab(null, { format: "jpeg" }, (imageUrl) => {
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
