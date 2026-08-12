import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { AuthService } from "./api/AuthService";
import type { AuthUser } from "./api/AuthResponse";
import { clearAuthToken, getAuthToken, setAuthToken } from "./authStorage";
import { debugAuthChangedEvent, getDebugAuthToken } from "./debugAuth";

type AuthContextValue = {
	user: AuthUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	completeLogin: (accessToken: string, user: AuthUser) => void;
	updateUser: (user: AuthUser) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refreshSession = useCallback(() => {
		const token = getDebugAuthToken() ?? getAuthToken();
		if (!token) {
			setUser(null);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		AuthService.me()
			.then((response) => setUser(response.user))
			.catch(() => {
				if (!getDebugAuthToken()) {
					clearAuthToken();
				}
				setUser(null);
			})
			.finally(() => setIsLoading(false));
	}, []);

	useEffect(() => {
		refreshSession();
	}, [refreshSession]);

	useEffect(() => {
		window.addEventListener(debugAuthChangedEvent, refreshSession);

		return () => {
			window.removeEventListener(debugAuthChangedEvent, refreshSession);
		};
	}, [refreshSession]);

	const completeLogin = useCallback((accessToken: string, nextUser: AuthUser) => {
		setAuthToken(accessToken);
		setUser(nextUser);
	}, []);

	const updateUser = useCallback((nextUser: AuthUser) => {
		setUser(nextUser);
	}, []);

	const logout = useCallback(() => {
		clearAuthToken();
		setUser(null);
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			isLoading,
			isAuthenticated: !!user,
			completeLogin,
			updateUser,
			logout,
		}),
		[user, isLoading, completeLogin, updateUser, logout],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const value = useContext(AuthContext);
	if (!value) {
		throw new Error("useAuth must be used inside AuthProvider");
	}

	return value;
}
