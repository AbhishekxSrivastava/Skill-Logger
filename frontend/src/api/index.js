import axios from "axios";

// --- 1. Configuration ---
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5111/api";

// --- 2. Create a pre-configured Axios instance ---
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is crucial!
});

// --- 3. Request Interceptor (The "Attach Token" Gatekeeper) ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 4. Response Interceptor (The "Token Expired?" Gatekeeper) ---
api.interceptors.response.use(
  (response) => response, // If the response is successful, just pass it through.
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        localStorage.setItem("accessToken", data.accessToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh token is also invalid, we log the user out.
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        window.location.href = "/"; // Force a reload to the login page
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
