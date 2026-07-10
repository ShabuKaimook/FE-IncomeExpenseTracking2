import axios from "axios";
import { env } from "@/config/env";

export const axiosInstance = axios.create({
	baseURL: env.API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(error),
);
