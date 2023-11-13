import * as S from "./HistoryTabItem.style";
import { LuMessageSquare, LuPenLine, LuTrash2 } from "react-icons/lu";

type HistoryTabProps = {
  title: string;
};

const HistoryTabItem: React.FC<HistoryTabProps> = ({ title }) => {
  return (
    <S.HistoryTabItem>
      <LuMessageSquare className="messageIcon" />
      <div className="title">{title}</div>
      <LuPenLine className="editIcon" />
      <LuTrash2 className="trashIcon" />
    </S.HistoryTabItem>
  );
};

export default HistoryTabItem;
