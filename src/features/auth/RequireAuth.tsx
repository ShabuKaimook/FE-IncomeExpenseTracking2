import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { useAuth } from "./AuthProvider";

export function RequireAuth({ children }: { children: ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<LoadingSpinner label="Loading session" />
			</div>
		);
	}

	if (!isAuthenticated) {
		if (typeof window !== "undefined") {
			window.sessionStorage.setItem(
				"auth-return-to",
				`${window.location.pathname}${window.location.search}`,
			);
		}
		return <Navigate to="/login" />;
	}

	return children;
}
