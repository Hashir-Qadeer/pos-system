import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://localhost:7154/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token to every outgoing request, if one exists
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;