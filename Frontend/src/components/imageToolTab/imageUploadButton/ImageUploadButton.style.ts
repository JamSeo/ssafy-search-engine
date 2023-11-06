import styled from "styled-components";
import { BaseButton } from "../ImageToolTab.style";

export const ImgUploadButton = styled(BaseButton)`
  border: 1px solid #e0e0e0;
  color: #757575;
  background-color: #fff;
  transition: background-color 100ms, border-color 100ms;
  &:hover {
    background-color: #e0e0e0;
    border-color: #fff;
  }
`;
