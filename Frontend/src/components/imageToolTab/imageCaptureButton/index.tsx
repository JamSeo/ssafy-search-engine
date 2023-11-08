import * as S from "./ImageCaptureButton.style";
import { getActiveTab } from "./ImageCaptureFunc";
import { TbPhotoSensor } from "react-icons/tb";

const ImageCaptureButton: React.FC = () => {
  const handleCaptureClick = async () => {
    const currentTab = await getActiveTab();
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
