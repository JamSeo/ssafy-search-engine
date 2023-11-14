import { useEffect, useState } from "react";
import styled from "styled-components";
import { createServerApi } from "../../utils/serverApi";
import HistoryTabItem from "./HistoryTabItem";

export interface IhistoryData {
  fileLocation: string;
  createData: string;
  result: string;
}

const HistoryTabContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  color: #444;
`;

const HistoryTab: React.FC = () => {
  const [historyData, setHistoryData] = useState<IhistoryData[]>([]);

  /** HistoryData 요청하는 함수 */
  const fetchHistoryData = async () => {
    try {
      const serverApi = await createServerApi();
      const response = await serverApi.get<IhistoryData[]>("/ocr");
      console.log("[popup.js/HistoryTab] History 가져오기 성공", response);
      setHistoryData(response.data); // 응답 데이터 설정
    } catch (error) {
      console.error("[popup.html/HistoryTab] History 가져오기 실패", error);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const messageListener = (
    message: { action: string },
    sender: any,
    sendResponse: any
  ) => {
    if (message.action === "fetchHistoryData") {
      fetchHistoryData();
    }
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return historyData.length ? (
    <div>
      {historyData.map((data, index) => (
        <HistoryTabItem
          historyData={data}
          key={index}
          fetchHistoryData={() => fetchHistoryData()}
        />
      ))}
    </div>
  ) : (
    <HistoryTabContainer>
      <p>No Data...</p>
      <button onClick={() => chrome.storage.local.remove("accessToken")}>
        Logout
      </button>
    </HistoryTabContainer>
  );
};

export default HistoryTab;
