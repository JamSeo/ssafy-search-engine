import styled from "styled-components";

export const mainContainer = styled.div`
  width: 300px;
`;

export const TabListContainer = styled.div`
  box-sizing: border-box;
  height: 50px;
  background-color: #111;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`;

export const TabPanelContainer = styled.div`
  box-sizing: border-box;
  height: 144px;
  overflow-y: auto;
  background-color: #f8f8fa;
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
`;
