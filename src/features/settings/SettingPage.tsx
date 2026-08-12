import { Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthService } from "@/features/auth/api/AuthService";
import { useAuth } from "@/features/auth/AuthProvider";
import { env } from "@/shared/config/Env";

const discordStateKey = "discord-link-state";
const settingPath = "/setting";

function getRedirectUri() {
	return env.DISCORD_REDIRECT_URI;
}

function buildDiscordOAuthUrl() {
	const state = crypto.randomUUID();
	const redirectUri = getRedirectUri();

	window.sessionStorage.setItem(discordStateKey, state);

	const params = new URLSearchParams({
		client_id: env.DISCORD_CLIENT_ID,
		response_type: "code",
		redirect_uri: redirectUri,
		scope: "identify",
		state,
	});

	return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export default function SettingPage() {
	const { user, updateUser } = useAuth();
	const [isLinking, setIsLinking] = useState(false);

	useEffect(() => {
		const callbackUrl = new URL(window.location.href);
		const code = callbackUrl.searchParams.get("code");
		const state = callbackUrl.searchParams.get("state");
		const savedState = window.sessionStorage.getItem(discordStateKey);

		if (!code) {
			return;
		}

		if (!state || state !== savedState) {
			toast.error("Discord link could not be verified.");
			return;
		}

		window.sessionStorage.removeItem(discordStateKey);
		window.history.replaceState(null, "", settingPath);
		setIsLinking(true);

		AuthService.linkDiscord(code, getRedirectUri())
			.then((response) => {
				updateUser(response.user);
				toast.success("Discord linked.");
			})
			.catch(() => toast.error("Unable to link Discord."))
			.finally(() => setIsLinking(false));
	}, [updateUser]);

	const canLinkDiscord = !!env.DISCORD_CLIENT_ID && !!env.DISCORD_REDIRECT_URI;

	return (
		<div className="mx-auto flex min-h-[55vh] w-full max-w-xl flex-col justify-center gap-5">
			<section className="island-shell rise-in rounded-xl p-5 sm:p-6">
				<div className="mb-5 space-y-1">
					<p className="island-kicker">Account</p>
					<h1 className="text-2xl font-bold text-(--sea-ink)">Setting</h1>
					<p className="text-sm text-muted-foreground">
						{user?.discordId
							? "Your Discord account is connected."
							: "Connect Discord to your LINE account."}
					</p>
				</div>

				<button
					type="button"
					disabled={!canLinkDiscord || isLinking}
					onClick={() => window.location.assign(buildDiscordOAuthUrl())}
					className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#4752C4] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
				>
					<Link2 size={18} />
					{isLinking
						? "Linking Discord..."
						: user?.discordId
							? "Relink Discord"
							: "Link Discord"}
				</button>

				{!canLinkDiscord ? (
					<p className="mt-3 text-sm text-muted-foreground">
						Add VITE_DISCORD_CLIENT_ID and VITE_DISCORD_REDIRECT_URI to enable
						Discord linking.
					</p>
				) : null}
			</section>
		</div>
	);
}
