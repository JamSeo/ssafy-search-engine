import sigin_in_with_google from "../../assets/images/sigin_in_with_google.png";
import styled from "styled-components";

const SigninContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  color: #333;
`;

const GoogleSignInButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.3);
  }
`;

const GoogleSignInImage = styled.img`
  height: 40px;
`;

const SigninButton: React.FC = () => {
  const requestAuthMode = () => {
    chrome.runtime.sendMessage({ action: "activateAuthMode" });
  };

  return (
    <SigninContainer>
      <p>🖐 Bro you need to sign in</p>
      <GoogleSignInButton onClick={requestAuthMode}>
        <GoogleSignInImage src={sigin_in_with_google} alt="Google 로그인" />
      </GoogleSignInButton>
    </SigninContainer>
  );
};

export default SigninButton;
