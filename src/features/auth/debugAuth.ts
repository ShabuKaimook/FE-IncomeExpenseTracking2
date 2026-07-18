import { env } from "@/shared/config/Env";

const debugAuthStorageKey = "income-expense-debug-auth-enabled";
export const debugAuthChangedEvent = "income-expense-debug-auth-changed";

declare global {
	interface Window {
		enableDebug?: (enabled: boolean) => boolean;
	}
}

const canUseBrowserStorage = () =>
	typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const isDebugAuthEnabled = () => {
	if (!canUseBrowserStorage()) return false;

	return window.localStorage.getItem(debugAuthStorageKey) === "true";
};

export const setDebugAuthEnabled = (enabled: boolean) => {
	if (!canUseBrowserStorage()) return false;

	if (enabled) {
		window.localStorage.setItem(debugAuthStorageKey, "true");
		window.dispatchEvent(new CustomEvent(debugAuthChangedEvent));
		console.info("Debug auth enabled. Future API requests will use the fake bearer token.");
		return true;
	}

	window.localStorage.removeItem(debugAuthStorageKey);
	window.dispatchEvent(new CustomEvent(debugAuthChangedEvent));
	console.info("Debug auth disabled. Future API requests will use the normal auth token.");
	return false;
};

export const getDebugAuthToken = () => {
	if (!isDebugAuthEnabled()) return undefined;

	return env.FAKE_AUTH_TOKEN;
};

export const installDebugAuthControl = () => {
	if (typeof window === "undefined") return;

	window.enableDebug = setDebugAuthEnabled;
};

installDebugAuthControl();
