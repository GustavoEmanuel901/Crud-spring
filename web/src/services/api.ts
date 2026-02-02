import axios from "axios";
import { getToken, getRefreshToken, setTokens, clearTokens } from "@/utils/tokenManager";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Flag para evitar múltiplas chamadas de refresh token
let isRefreshing = false;
let failedQueue: Array<{
  onSuccess: (token: string) => void;
  onFailed: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.onFailed(error);
    } else {
      prom.onSuccess(token!);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

// Interceptor para adicionar o token nas requisições
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros e refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já está atualizando o token, aguarda na fila
        return new Promise((onSuccess, onFailed) => {
          failedQueue.push({
            onSuccess: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              onSuccess(api(originalRequest));
            },
            onFailed: (err) => {
              onFailed(err);
            },
          });
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        processQueue(error, null);
        return Promise.reject(error);
      }

      // Tenta renovar o token
      return axios
        .post("http://localhost:8080/api/auth/refresh", {
          refreshToken: refreshToken,
        })
        .then((response) => {
          const { token, refreshToken: newRefreshToken } = response.data;
          setTokens(token, newRefreshToken);
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          processQueue(null, token);
          return api(originalRequest);
        })
        .catch((err) => {
          clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          processQueue(err, null);
          return Promise.reject(err);
        });
    }

    return Promise.reject(error);
  }
);

export default api;
