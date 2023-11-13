import axios, { AxiosInstance } from "axios";

// 서버 API URI
const REACT_APP_SERVER = "http://k9a708.p.ssafy.io:8081";

const serverApi: AxiosInstance = axios.create({
  baseURL: REACT_APP_SERVER,
  withCredentials: true,
});

export { serverApi, REACT_APP_SERVER };
