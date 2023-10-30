import * as S from "./ImageUploadButton.style";

import { TbPhotoUp } from "react-icons/tb";

const ImageUploadButton: React.FC = () => {
  // 1. 이미지 첨부하기
  const onUploadImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // 이미지 파일만 선택 가능하게 함
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files![0];
      // 2. 이미지 데이터 읽기
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Image = (event.target as FileReader).result;
          console.log("이미지url:", base64Image);
        };

        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  return (
    <>
      <S.ImgUploadButton onClick={onUploadImage}>
        <TbPhotoUp size={18} />
        Upload Image
      </S.ImgUploadButton>
    </>
  );
};

export default ImageUploadButton;
