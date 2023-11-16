import * as S from "./ImageCaptureButton.style";
import { getActiveTab } from "../getActiveTab";
import { TbPhotoSensor } from "react-icons/tb";

const ImageCaptureButton: React.FC = () => {
  const handleCaptureClick = async () => {
    const currentTab = await getActiveTab();
    if (!currentTab || typeof currentTab.id !== "number") {
      console.error("No active tab found or tab ID is undefined.");
      return;
    }
    chrome.runtime.sendMessage({
      action: "activateCaptureMode",
      tabId: currentTab?.id,
    });
  };

  return (
    <S.ImageCaptureButton onClick={handleCaptureClick}>
      <TbPhotoSensor size={20} />
      CAPTURE SCREEN
    </S.ImageCaptureButton>
  );
};

export default ImageCaptureButton;
