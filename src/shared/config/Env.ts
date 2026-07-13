const required = (name: string): string => {
	const value = import.meta.env[name];

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
};

export const env = {
	API_BASE_URL: required("VITE_API_BASE_URL"),
} as const;
