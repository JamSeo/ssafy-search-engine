import * as S from "./MainContainer.style";

import ImageToolTab from "../imageToolTab";
import SigninTab from "../historyTab";

import { Tabs, Tab, TabList, TabPanel } from "@mui/joy";
import { tabClasses } from "@mui/joy/Tab";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { TbTextRecognition, TbFileTextAi, TbHistory } from "react-icons/tb";

const MainContainer: React.FC = () => {
  return (
    <S.mainContainer>
      <Tabs
        aria-label="Icon tabs"
        defaultValue={0}
        sx={{ bgcolor: "transparent" }}
        size="sm"
      >
        <S.TabListContainer>
          {/* 앱 Title */}
          <S.Title>SSE</S.Title>
          {/* 탭목록 */}
          <TabList
            disableUnderline
            sx={{
              p: 0.5,
              gap: 0.5,
              borderRadius: "xl",
              bgcolor: "background.level4",
              [`& .${tabClasses.root}[aria-selected="true"]`]: {
                boxShadow: "sm",
              },
            }}
          >
            <Tab disableIndicator>
              <TbTextRecognition size={20} />
            </Tab>
            <Tab disableIndicator>
              <TbHistory size={20} />
            </Tab>
          </TabList>
          {/* Exit 버튼 */}
          <S.CloseButton onClick={() => window.close()}>
            <CloseOutlinedIcon
              style={{ alignItems: "center", width: "18px", height: "18px" }}
            />
          </S.CloseButton>
        </S.TabListContainer>
        <S.TabPanelContainer>
          <TabPanel value={0}>
            <ImageToolTab />
          </TabPanel>
          <TabPanel value={1}>
            <SigninTab />
          </TabPanel>
        </S.TabPanelContainer>
      </Tabs>
    </S.mainContainer>
  );
};

export default MainContainer;
