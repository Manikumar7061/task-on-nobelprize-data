import axios from "axios";
const AxiosInstance = axios.create({
  timeout: 30000
});

export const getRequest = async ({ baseURL, url, param }) => {
  try {
    return await AxiosInstance({
      method: "get",
      baseURL,
      url: url,
    });
  } catch (error) {
    let data = error.response && error.response.data;
    return { error: true, message: error.message, data: data };
  }
};

