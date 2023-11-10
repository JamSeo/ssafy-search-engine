import HistoryTabItem from "./HistoryTabItem";

const HistoryTab: React.FC = () => {
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
        return <HistoryTabItem title={element.title} key={element.title} />;
      })}
    </div>
  );
};

export default HistoryTab;
