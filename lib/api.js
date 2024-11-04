// api.js
import axios from "axios";

const environment = process.env.NODE_ENV|| 'development';

const config = {
  development: {
    baseUrl: "http://192.168.1.89:8080",
    wssUrl: "ws://192.168.1.89:8080"
  },
  production: {
    baseUrl: "https://vipblackbets.ozzo.az",
    wssUrl: "wss://vipblackbets.ozzo.az"
  }
};

const currentConfig = config[environment];

export const baseUrl = currentConfig.baseUrl;
export const wssUrl = currentConfig.wssUrl;
export const baseApiUrl = `${baseUrl}/api`;

const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000, // 10 saniye timeout
});

// İsteğe bağlı: Global error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export default api;