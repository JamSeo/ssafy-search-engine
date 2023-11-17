import styled from "styled-components";

export const ImageToolTabContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 7px 8px;
`;

export const BaseButton = styled.div`
  box-sizing: border-box;
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 13px;
  font-family: inherit;
`;

export const CaptureButton = styled(BaseButton)`
  background-color: #0d99ff;
  color: #fff;
  &:hover {
    background-color: #0c8ae5;
  }
`;

export const ImgUploadButton = styled(BaseButton)`
  background-color: #fff;
  border: 1.8px solid #e0e0e0;
  color: #666;
  &:hover {
    background-color: #e0e0e0;
  }
`;

export const ButtonSeperator = styled.div`
  box-sizing: border-box;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #777;
  position: relative;

  &:before,
  &:after {
    content: "";
    height: 0.1px;
    background-color: #dbdbdb;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40%;
  }

  &:before {
    left: 0;
  }

  &:after {
    right: 0;
  }
`;

export const OrText = styled.span`
  background-color: transparent;
  padding: 0 10px;
  font-size: 12px;
`;
