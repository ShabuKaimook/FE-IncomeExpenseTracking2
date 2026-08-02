import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { useAuth } from "./AuthProvider";

export function RequireAuth({ children }: { children: ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();
	const liffReturnTo = getLiffReturnTo();

	useEffect(() => {
		if (!isLoading && isAuthenticated && liffReturnTo) {
			window.location.replace(liffReturnTo);
		}
	}, [isAuthenticated, isLoading, liffReturnTo]);

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
				liffReturnTo ?? `${window.location.pathname}${window.location.search}`,
			);
		}
		return <Navigate to="/login" />;
	}

	if (liffReturnTo) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<LoadingSpinner label="Opening page" />
			</div>
		);
	}

	return children;
}

function getLiffReturnTo() {
	if (typeof window === "undefined") {
		return null;
	}

	const returnTo = new URLSearchParams(window.location.search).get("liff.state");
	return returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : null;
}
