export type AuthUser = {
	userId: string;
	lineUserId: string;
	displayName: string;
};

export type LineCallbackResponse = {
	accessToken: string;
	user: AuthUser;
};

export type MeResponse = {
	user: AuthUser;
};
