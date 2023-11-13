import { useState, useEffect } from "react";
import HistoryTab from "./HistoryTab";
import SigninButton from "./SigninButton";

const SigninTab: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const checkAccessToken = async () => {
      const result = await new Promise<{ accessToken?: string }>(
        (resolve, reject) => {
          chrome.storage.local.get(["accessToken"], (res) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(res as { accessToken?: string });
            }
          });
        }
      );

      setIsAuthOpen(!!result.accessToken);
    };

    checkAccessToken();
  }, []);

  return isAuthOpen ? <HistoryTab /> : <SigninButton />;
};

export default SigninTab;
