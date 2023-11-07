/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import * as S from "./ImageCaptureButton.style";
import {
  getActiveTab,
  handleCaptureData,
  sendImageToOcrApi,
} from "./ImageCaptureFunc";
import { IcaptureAreaData } from "../../../interface/ImageCaptureButton";
import { TbPhotoSensor } from "react-icons/tb";

const ImageCaptureButton: React.FC = () => {
  // 이미지 캡쳐 버튼 작동 함수
  const handleCaptureClick = async () => {
    const currentTab = await getActiveTab();
    currentTab?.id &&
      chrome.runtime.sendMessage({
        action: "activateCaptureMode",
        tabId: currentTab.id,
      });
  };

  // 캡쳐 이미지를 OCR 서버로 전송하는 함수
  const handleMessage = async (
    message: { action: string; data: IcaptureAreaData },
    sender: any,
    endResponse: any
  ) => {
    if (message.action === "captureAreaData") {
      try {
        // [1] 캡쳐된 이미지 parsing
        const capturedImageUrl = await handleCaptureData(message.data);
        console.log(capturedImageUrl);

        // [2] parsing된 이미지 OCR 서버로 전송
        const ocrResponseData = await sendImageToOcrApi(capturedImageUrl);
        console.log(ocrResponseData);

        // [3] 반환된 결과 content-script로 전송
        chrome.runtime.sendMessage({
          action: "ocrResponseData",
          data: ocrResponseData,
        });
        return;
      } catch (error) {
        console.error("위치: ImageCaptureButton/index.tsx", error);
      }
    }
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <S.ImageCaptureButton onClick={handleCaptureClick}>
      <TbPhotoSensor size={20} />
      CAPTURE SCREEN
    </S.ImageCaptureButton>
  );
};

export default ImageCaptureButton;
