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

  const handleMessage = async (
    message: { action: string; data: IcaptureAreaData },
    sender: any,
    endResponse: any
  ) => {
    if (message.action === "captureAreaData") {
      const captureData = await handleCaptureData(message.data);
      sendImageToOcrApi(captureData);
      return;
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
