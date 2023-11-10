import styled from "styled-components";

export const HistoryTabItem = styled.div`
  box-sizing: border-box;
  height: 40px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 13px;
  font-family: inherit;
  color: #333;
  &:hover {
    background-color: #e1e5ee;
    color: #000;
  }

  .messageIcon {
    flex: 1;
  }
  .title {
    flex: 8;
    padding: 0 8px;
  }
  .editIcon {
    flex: 1;
  }
  .trashIcon {
    flex: 1;
  }
`;
