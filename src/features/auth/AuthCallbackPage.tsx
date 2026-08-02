import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthService } from "./api/AuthService";
import { useAuth } from "./AuthProvider";

export default function AuthCallbackPage() {
	const navigate = useNavigate();
	const { completeLogin } = useAuth();
	const [message, setMessage] = useState("Signing you in...");

	useEffect(() => {
		const callbackUrl = new URL(window.location.href);
		const code = callbackUrl.searchParams.get("code");
		const state = callbackUrl.searchParams.get("state");
		const savedState = window.sessionStorage.getItem("line-login-state");

		if (!code || !state || state !== savedState) {
			setMessage("LINE login could not be verified.");
			toast.error("LINE login could not be verified.");
			return;
		}

		window.sessionStorage.removeItem("line-login-state");

		AuthService.signInWithLine(code, callbackUrl.origin + callbackUrl.pathname)
			.then((response) => {
				completeLogin(response.accessToken, response.user);
				const returnTo = window.sessionStorage.getItem("auth-return-to");
				window.sessionStorage.removeItem("auth-return-to");
				navigate({
					to: returnTo?.startsWith("/") && !returnTo.startsWith("//")
						? returnTo
						: "/",
				});
			})
			.catch(() => {
				setMessage("Unable to complete LINE login.");
				toast.error("Unable to complete LINE login.");
			});
	}, [completeLogin, navigate]);

	return (
		<div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
			{message}
		</div>
	);
}
