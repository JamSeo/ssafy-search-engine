import * as S from "./ImageUploadButton.style";
import { getActiveTab } from "../getActiveTab";
import { TbPhotoUp } from "react-icons/tb";

/** 이미지 첨부하는 함수 */
const handleUploadClick = () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*"; // 이미지 파일만 선택 가능하게 함

  fileInput.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files![0];
    const currentTab = await getActiveTab();

    // 2. 이미지 데이터 읽기
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const originalImage = new Image();

        originalImage.onload = () => {
          // 이미지 리사이징을 위한 canvas 생성
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // 리사이징할 이미지 크기 설정 (예: 너비 500px, 비율에 맞는 높이로 조정)
          const maxWidth = 500;
          const scale = maxWidth / originalImage.width;
          canvas.width = maxWidth;
          canvas.height = originalImage.height * scale;

          // canvas에 이미지 그리기
          ctx?.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

          // 리사이징된 이미지를 base64 형식으로 인코딩
          const resizedImage = canvas.toDataURL("image/jpeg"); // JPEG 형식으로, 품질은 0.7 (70%)

          console.log("[popup.js/ImageUploadButton] 이미지 url:", resizedImage);

          chrome.runtime.sendMessage({
            action: "analyzeUploadImage",
            tabId: currentTab?.id,
            uploadImageUrl: resizedImage,
          });
        };
        // FileReader.result가 string인지 확인
        const result = (event.target as FileReader).result;

        if (typeof result === "string") {
          originalImage.src = result;
        } else {
          console.error(
            "[popup.js/ImageUploadButton] FileReader 결과가 문자열이 아님"
          );
        }
      };

      reader.readAsDataURL(file);
    }
  };
  fileInput.click();
};

const ImageUploadButton: React.FC = () => {
  return (
    <>
      <S.ImageUploadButton onClick={handleUploadClick}>
        <TbPhotoUp size={18} />
        UPLOAD IMAGE
      </S.ImageUploadButton>
    </>
  );
};

export default ImageUploadButton;
