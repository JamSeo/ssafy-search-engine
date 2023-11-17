import styled from "styled-components";

export const HistoryTabItem = styled.div`
  box-sizing: border-box;
  height: 40px;
  padding: 0 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 13px;
  font-family: inherit;
  color: #444;
  &:hover {
    background-color: #e1e5ee;
    color: #000;
  }

  .messageIcon {
    flex: 1;
  }
  .title {
    flex: 9;
    padding: 0 8px;
  }
  .trashIcon {
    flex: 1;
    &:hover {
      border-radius: 50%;
      background-color: #d4d9e5;
    }
  }
`;
