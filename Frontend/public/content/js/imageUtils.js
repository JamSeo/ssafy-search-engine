/** 원하는 영역과 크기로 이미지를 그리는 함수 */
const resizeImage = (image, startX, startY, originalWidth, originalHeight, targetWidth, targetHeight) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx?.drawImage(
    image, startX, startY, originalWidth, originalHeight, 0, 0, targetWidth, targetHeight
  );
  return canvas;
};

/** 캡처 이미지 parsing하는 함수 */
const parsingImageData = (message) => {
  return new Promise((resolve, reject) => {
    const { imageUrl, captureAreaData, tabWidth, tabHeight } = message.data;
    const { startX, startY, width, height } = captureAreaData;
    const screenshot = new Image();

    screenshot.onload = () => {
      const ratioX = screenshot.width / tabWidth;
      const ratioY = screenshot.height / tabHeight;
      const actualX = startX * ratioX;
      const actualY = startY * ratioY;
      const actualWidth = width * ratioX;
      const actualHeight = height * ratioY;

      try {
        const capturedImage = resizeImage(
          screenshot, actualX, actualY, actualWidth, actualHeight, actualWidth, actualHeight
        );
        const captureImageUrl = capturedImage.toDataURL('image/jpeg');
        resolve(captureImageUrl);
      }
      catch (error) {
        reject(error);
      }
    };
    screenshot.src = imageUrl;
  });
}

window.imageUtils = { resizeImage, parsingImageData };