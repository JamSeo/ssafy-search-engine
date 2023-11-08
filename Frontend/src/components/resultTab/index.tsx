import { useState } from "react";
import LoginPopup from "../loginPopup";

const ResultTab: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const toggleForm = () => {
    setIsAuthOpen(!isAuthOpen);
  };

  const requestLogin2Back = () => {
    chrome.runtime.sendMessage({
      action: "activateAuthMode",
    });
  };

  return !isAuthOpen ? (
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
      {/* <button onClick={toggleForm}>Sign in</button> */}
      <button onClick={requestLogin2Back}>Sign in</button>
    </div>
  ) : (
    <div>
      <button onClick={toggleForm}>Go Back</button>
      <LoginPopup />
    </div>
  );
};

export default ResultTab;
