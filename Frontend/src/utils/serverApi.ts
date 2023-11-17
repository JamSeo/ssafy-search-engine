import axios from "axios";

// 서버 API URI
const REACT_APP_SERVER = "http://k9a708.p.ssafy.io:8081";

// accessToken을 가져오는 함수
const getAccessToken = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(["accessToken"], (result) => {
      resolve(result.accessToken);
    });
  });
};

// Axios 인스턴스를 생성하는 함수
const createServerApi = async () => {
  const accessToken = await getAccessToken();

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["accessToken"] = "" + accessToken;
  }

  return axios.create({
    baseURL: REACT_APP_SERVER,
    withCredentials: true,
    headers: headers,
  });
};

export { REACT_APP_SERVER, getAccessToken, createServerApi };
