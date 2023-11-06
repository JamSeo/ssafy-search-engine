import styled from "styled-components";
import { BaseButton } from "../ImageToolTab.style";

export const ImageUploadButton = styled(BaseButton)`
  border: 1px solid #e1e5ee;
  color: #757575;
  background-color: #fff;
  transition: background-color 100ms, border-color 100ms;
  &:hover {
    background-color: #e1e5ee;
    border-color: #fff;
  }
`;
