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

type AuthContextValue = {
	user: AuthUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	completeLogin: (accessToken: string, user: AuthUser) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = getAuthToken();
		if (!token) {
			setIsLoading(false);
			return;
		}

		AuthService.me()
			.then((response) => setUser(response.user))
			.catch(() => {
				clearAuthToken();
				setUser(null);
			})
			.finally(() => setIsLoading(false));
	}, []);

	const completeLogin = useCallback((accessToken: string, nextUser: AuthUser) => {
		setAuthToken(accessToken);
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
			logout,
		}),
		[user, isLoading, completeLogin, logout],
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
