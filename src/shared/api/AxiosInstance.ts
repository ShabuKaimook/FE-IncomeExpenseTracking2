import axios from "axios";
import { getAuthToken } from "@/features/auth/authStorage";
import { env } from "@/shared/config/Env";

export const axiosInstance = axios.create({
	baseURL: env.API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use((config) => {
	const token = getAuthToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(error),
);
