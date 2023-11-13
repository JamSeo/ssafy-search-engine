import { useEffect, useState } from "react";
import { serverApi } from "../../utils/serverApi";
import HistoryTabItem from "./HistoryTabItem";

interface IhistoryData {
  fileLocation: string;
  createData: string;
  result: string;
  title: string;
}

const HistoryTab: React.FC = () => {
  const [historyData, setHistoryData] = useState<IhistoryData[]>([]);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await serverApi.get<IhistoryData[]>("/ocr");
        const dataWithTitles = response.data.map((item) => ({
          ...item,
          title:
            item.result.length <= 10
              ? item.result
              : item.result.substring(0, 10), // 10자 이상이면 잘라서 title 설정
        }));
        setHistoryData(dataWithTitles); // 응답 데이터 설정
      } catch (error) {
        console.error("[popup.html/HistoryTab] History 가져오기 실패", error);
      }
    };

    fetchHistoryData();
  }, []);

  return (
    <div>
      {historyData.map((element) => {
        return (
          <HistoryTabItem title={element.title} key={element.fileLocation} />
        );
      })}
    </div>
  );
};

export default HistoryTab;
