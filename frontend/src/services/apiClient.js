import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5174/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/identity/Auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          "http://localhost:5174/api/identity/Auth/refresh",
          {},
          { withCredentials: true },
        );

        return apiClient(originalRequest);
      } catch (refreshError) {

        if (originalRequest.url.includes("/identity/Auth/me")) {
          return Promise.reject(error);
        }

        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
