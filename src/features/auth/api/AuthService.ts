import { axiosInstance } from "@/shared/api/AxiosInstance";
import type { LineCallbackResponse, MeResponse } from "./AuthResponse";

export const AuthService = {
	signInWithLine: async (
		code: string,
		redirectUri: string,
	): Promise<LineCallbackResponse> => {
		const response = await axiosInstance.post<LineCallbackResponse>(
			"/auth/line/callback",
			{
				code,
				redirect_uri: redirectUri,
			},
		);

		return response.data;
	},

	me: async (): Promise<MeResponse> => {
		const response = await axiosInstance.get<MeResponse>("/auth/me");
		return response.data;
	},
};
