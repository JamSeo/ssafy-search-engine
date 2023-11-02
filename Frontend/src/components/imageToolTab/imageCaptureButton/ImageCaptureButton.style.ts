import styled from "styled-components";
import { BaseButton } from "../ImageToolTab.style";

export const CaptureButton = styled(BaseButton)`
  color: #fff;
  background-color: #03a9f4;
  transition: background-color 100ms;
  &:hover {
    background-color: #0288d1;
  }
`;
