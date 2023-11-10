import { useState, useEffect } from "react";
import HistoryTab from "./HistoryTab";

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

  const requestAuthMode = () => {
    chrome.runtime.sendMessage({ action: "activateAuthMode" });
  };

  return isAuthOpen ? (
    <HistoryTab />
  ) : (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "600",
        color: "#333",
      }}
    >
      <p>Sorry, you need to sign in...</p>
      <button onClick={requestAuthMode}>Sign in</button>
    </div>
  );
};

export default SigninTab;
