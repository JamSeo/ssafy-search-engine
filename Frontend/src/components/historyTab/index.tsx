import * as S from "./HistoryTab.style";
import { LuMessageSquare, LuPenLine, LuTrash2 } from "react-icons/lu";

const History: React.FC = () => {
  const data = [
    { title: "인간정보" },
    { title: "기상정보" },
    { title: "지형정보" },
    { title: "인간정보" },
    { title: "기상정보" },
    { title: "지형정보" },
  ];

  return (
    <div>
      {data.map((element) => {
        return <HistoryTab title={element.title} key={element.title} />;
      })}
    </div>
  );
};

type HistoryTabProps = {
  title: string;
};

const HistoryTab: React.FC<HistoryTabProps> = ({ title }) => {
  return (
    <S.HistoryTab>
      <LuMessageSquare className="messageIcon" />
      <div className="title">{title}</div>
      <LuPenLine className="editIcon" />
      <LuTrash2 className="trashIcon" />
    </S.HistoryTab>
  );
};

export default History;
