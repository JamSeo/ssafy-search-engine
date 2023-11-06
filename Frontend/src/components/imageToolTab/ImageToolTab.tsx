import * as S from "./ImageToolTab.style";

import ImageCaptureButton from "./imageCaptureButton/ImageCaptureButton";
import ImageUploadButton from "./imageUploadButton/ImageUploadButton";

const ButtonSeperator: React.FC = () => {
  return (
    <S.ButtonSeperator>
      <S.OrText>OR</S.OrText>
    </S.ButtonSeperator>
  );
};

const ImageToolTab: React.FC = () => {
  return (
    <>
      <S.ImageToolTabContainer>
        <ImageCaptureButton />
        <ButtonSeperator />
        <ImageUploadButton />
      </S.ImageToolTabContainer>
    </>
  );
};

export default ImageToolTab;
