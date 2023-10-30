import { useEffect } from "react";
import * as S from "./ImageCaptureButton.style";

import { TbPhotoSensor } from "react-icons/tb";

const sendMessage2Background = (action: string, tabId: number) => {
  chrome.runtime.sendMessage({ action: action, tabId: tabId });
};

const ImageCaptureButton: React.FC = () => {
  const handleCaptureClick = async () => {
    // 1. 현재 chrome 탭에 script 전달
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.url?.startsWith("chrome://")) {
      alert("Capture is not available on this tab.");
      return false;
    }

    // 2. 현재 탭에 캡쳐모드 활성화 요청
    if (tab.id !== undefined) {
      sendMessage2Background("activateCaptureMode", tab.id);
    } else {
      console.error("Tab ID is undefined.");
    }
  };

  // 3. 캡쳐된 이미지 반환 받음
  useEffect(() => {
    // 메시지 리스너 함수
    const handleMessage = (
      message: { action: string; data: any },
      sender: any,
      sendResponse: any
    ) => {
      if (message.action === "imageData") {
        console.log(message.data);
      }
    };
    // 리스너 등록
    chrome.runtime.onMessage.addListener(handleMessage);

    // 컴포넌트가 언마운트될 때 리스너 제거
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <S.CaptureButton onClick={handleCaptureClick}>
      <TbPhotoSensor size={20} />
      Capture Screen
    </S.CaptureButton>
  );
};

export default ImageCaptureButton;
