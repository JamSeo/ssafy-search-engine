import * as S from "./HistoryTabItem.style";
import { createServerApi } from "../../utils/serverApi";
import { LuMessageSquare, LuTrash2 } from "react-icons/lu";
import { IhistoryData } from "./HistoryTab";

interface IHistoryTabItem {
  data: IhistoryData;
}

const HistoryTabItem: React.FC<IHistoryTabItem> = ({ data }) => {
  const { fileLocation, result } = data;
  const title = result.length <= 15 ? result : result.substring(0, 15) + " ...";

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();

    const requestDeleteData = async () => {
      const serverApi = await createServerApi();
      console.log("[popup.js/HistoryTabItem] 삭제 요청");
      serverApi.post("/ocr/delete", { url: fileLocation });
    };
    requestDeleteData();
  };

  return (
    <S.HistoryTabItem>
      <LuMessageSquare className="messageIcon" />
      <div className="title">{title}</div>
      <LuTrash2 className="trashIcon" onClick={handleDelete} />
    </S.HistoryTabItem>
  );
};

export default HistoryTabItem;
