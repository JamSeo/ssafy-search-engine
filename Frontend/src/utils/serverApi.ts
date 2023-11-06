import axios, { AxiosInstance } from "axios";

// 서버 API URI
const REACT_APP_SERVER = "http://localhost:8080";

const serverApi: AxiosInstance = axios.create({
  baseURL: REACT_APP_SERVER,
  withCredentials: true,
});

export { serverApi };
