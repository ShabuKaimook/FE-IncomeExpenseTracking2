import { LogIn } from "lucide-react";
import { env } from "@/shared/config/Env";

function buildLineLoginUrl(): string {
	const state = crypto.randomUUID();
	const redirectUri = env.LINE_REDIRECT_URI;

	window.sessionStorage.setItem("line-login-state", state);

	const params = new URLSearchParams({
		response_type: "code",
		client_id: env.LINE_LOGIN_CHANNEL_ID,
		redirect_uri: redirectUri,
		state,
		scope: "openid profile",
	});

	return `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
}

export default function LoginPage() {
	const isLineConfigured = !!env.LINE_LOGIN_CHANNEL_ID;
	const handleLineLogin = () => {
		window.location.assign(buildLineLoginUrl());
	};

	return (
		<div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-6 text-center">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold">Sign in</h1>
				<p className="text-sm text-muted-foreground">
					Use your LINE account to open your income and expense dashboard.
				</p>
			</div>

			{isLineConfigured ? (
				<button
					type="button"
					onClick={handleLineLogin}
					className="inline-flex items-center gap-2 rounded-lg bg-[#06C755] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#05b84f]"
				>
					<LogIn size={18} />
					Continue with LINE
				</button>
			) : (
				<div className="rounded-lg border border-(--line) bg-(--surface) px-4 py-3 text-sm text-muted-foreground">
					Add VITE_LINE_LOGIN_CHANNEL_ID to enable LINE login.
				</div>
			)}
		</div>
	);
}
