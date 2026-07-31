import axios from "axios";
import { tokenStorage } from "./storage";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Attache l'access token à chaque requête
apiClient.interceptors.request.use(async (config) => {
  const accessToken = await tokenStorage.getAccessToken();
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Sur un 401, tente un refresh une seule fois puis rejoue la requête
let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const routesExclues = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/auth/logout",
    ];
    const estRouteAuth = routesExclues.some((route) =>
      originalRequest.url?.includes(route),
    );

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      estRouteAuth
    ) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push(() => resolve(apiClient(originalRequest)));
      });
    }

    isRefreshing = true;
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } },
      );
      await tokenStorage.setTokens(data.accessToken, data.refreshToken);
      pendingRequests.forEach((cb) => cb());
      pendingRequests = [];
      return apiClient(originalRequest);
    } catch (refreshError) {
      await tokenStorage.clearTokens();
      pendingRequests = [];
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
