import { useState, useEffect } from "react";
import HistoryTab from "./HistoryTab";
import SigninButton from "./SigninButton";

const SigninTab: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const checkAccessToken = async () => {
      const result = await new Promise<{ accessToken?: string }>((resolve) => {
        chrome.storage.local.get(["accessToken"], (res) => {
          resolve(res as { accessToken?: string });
        });
      });

      setIsAuthOpen(!!result.accessToken);
    };

    checkAccessToken();

    // 스토리지 변경 감지 리스너
    const onStorageChange = (changes: any, area: any) => {
      if (area === "local" && changes.accessToken) {
        setIsAuthOpen(!!changes.accessToken.newValue);
      }
    };

    chrome.storage.onChanged.addListener(onStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(onStorageChange);
    };
  }, []);

  return isAuthOpen ? <HistoryTab /> : <SigninButton />;
};

export default SigninTab;
