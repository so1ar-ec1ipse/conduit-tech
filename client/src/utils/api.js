import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

const api = (convertCases = false) => {
  let request = axios.create({
    baseURL: process.env && process.env.REACT_APP_API_URL,
  });
  if (convertCases) request = applyCaseMiddleware(request);

  return request;
};

export default api;
