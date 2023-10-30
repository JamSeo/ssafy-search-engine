import styled from "styled-components";

export const mainContainer = styled.div`
  width: 340px;
`;

export const TabListContainer = styled.div`
  box-sizing: border-box;
  height: 50px;
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`;

export const TabPanelContainer = styled.div`
  box-sizing: border-box;
  min-height: 144px;
  height: fit-content;
  padding: 4px 8px 10px;
`;

export const Title = styled.h2`
  color: #c7ccdb;
  font-size: 18px;
  font-weight: 500;
`;

export const CloseButton = styled.div`
  width: fit-content;
  height: fit-content;
  color: #fff;
  background-color: transparent;
  transition: background-color 0.2s ease;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
