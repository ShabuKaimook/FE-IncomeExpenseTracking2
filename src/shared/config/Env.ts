const required = (name: string): string => {
	const value = import.meta.env[name];

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
};

const optional = (name: string): string | undefined => import.meta.env[name];

export const env = {
	API_BASE_URL: required("VITE_API_BASE_URL"),
	LINE_LOGIN_CHANNEL_ID: required("VITE_LINE_LOGIN_CHANNEL_ID"),
	LINE_REDIRECT_URI: required("VITE_LINE_REDIRECT_URI"),
	DISCORD_CLIENT_ID:
		optional("VITE_DISCORD_CLIENT_ID") ?? optional("DISCORD_CLIENT_ID"),
	FAKE_AUTH_TOKEN: optional("VITE_FAKE_AUTH_TOKEN"),
} as const;
