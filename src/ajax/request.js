import axios from "axios";
const service = axios.create({
  withCredentials: true, // 跨域发送 cookie
  timeout: 300000, // 请求超时
  headers: {
    "Content-Type": "application/json"
  }
});

service.interceptors.response.use(
  (response) => {
    const { code, content } = response.data;
    if (code === 200) {
      return content;
    } else {
      return false;
    }
  },
  () => {
    return false;
  }
);

export default service;
