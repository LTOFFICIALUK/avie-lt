import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend.avie.live";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
  validateStatus: (status) => {
    return (status >= 200 && status < 300) || status === 304;
  }
});

// Add interceptor for adding JWT token to header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Samo določene poti naj sprožijo odjavo
    const logoutPaths = [
      "/api/user/profile",
      "/api/user/me",
      "/api/auth/verify",
    ];

    const shouldLogout =
      (error.response?.status === 401 || error.response?.status === 403) &&
      logoutPaths.some((path) => error.config?.url?.includes(path));

    if (shouldLogout) {
      localStorage.clear();
      window.dispatchEvent(new Event("authChange"));

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/")
      ) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem("jwt_token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("email_verified");
  localStorage.removeItem("welcome_user");
  localStorage.removeItem("show_welcome");
  delete api.defaults.headers.common["Authorization"];
  window.dispatchEvent(new Event("authChange"));
};

export default api;
