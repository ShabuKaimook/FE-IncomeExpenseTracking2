export type AuthUser = {
	userId: string;
	lineUserId: string;
	discordId?: string | null;
	displayName: string;
};

export type LineCallbackResponse = {
	accessToken: string;
	user: AuthUser;
};

export type MeResponse = {
	user: AuthUser;
};

export type LinkDiscordResponse = {
	user: AuthUser;
};
