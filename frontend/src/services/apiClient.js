import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5174/api",
  withCredentials: true, // CRITICAL: This allows cookies to be sent
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;