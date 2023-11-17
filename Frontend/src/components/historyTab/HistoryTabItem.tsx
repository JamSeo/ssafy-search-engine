import * as S from "./HistoryTabItem.style";
import { createServerApi } from "../../utils/serverApi";
import { LuMessageSquare, LuTrash2 } from "react-icons/lu";
import { IhistoryData } from "./HistoryTab";

interface IHistoryTabItem {
  historyData: IhistoryData;
  fetchHistoryData: () => Promise<void>;
}

const HistoryTabItem: React.FC<IHistoryTabItem> = ({
  historyData,
  fetchHistoryData,
}) => {
  const { fileLocation, result } = historyData;
  const title = result.length <= 15 ? result : result.substring(0, 15) + " ...";

  /** HistoryData 삭제 요청 함수 */
  const requestDeleteData = async () => {
    try {
      const serverApi = await createServerApi();
      console.log("[popup.js/HistoryTabItem] 삭제 요청");

      const response = await serverApi.post("/ocr/delete", {
        url: fileLocation,
      });
      console.log("[popup.js/HistoryTabItem] 삭제 요청 성공", response.data);

      fetchHistoryData();
    } catch (error) {
      console.error("[popup.js/HistoryTabItem] 삭제 요청 실패", error);
    }
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    requestDeleteData();
  };

  const requestDisplayData = () => {
    console.log(
      "[popup.js/HistoryTabItem] background로 historyData 보여주기 요청"
    );

    chrome.runtime.sendMessage({
      action: "displayHistoryData",
      historyData,
    });
  };

  return (
    <S.HistoryTabItem onDoubleClick={requestDisplayData}>
      <LuMessageSquare className="messageIcon" />
      <div className="title">{title}</div>
      <LuTrash2 className="trashIcon" onClick={handleDelete} />
    </S.HistoryTabItem>
  );
};

export default HistoryTabItem;
