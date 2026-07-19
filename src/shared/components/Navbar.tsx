// Navbar.tsx
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronUp, LogIn } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import LogoNoImage from "/logo-no-text.png?url";

interface NavbarProps {
	isMenuOpen: boolean;
	setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
	navbarHeight?: number;
}

const Navbar = ({ isMenuOpen, setIsMenuOpen, navbarHeight }: NavbarProps) => {
	const { isAuthenticated, user } = useAuth();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const pageTitle = getPageTitle(pathname);

	return (
		<nav
			className={`flex items-center justify-between pb-4 ${navbarHeight ? `h-[${navbarHeight}px]` : ""}`}
		>
			<div className="flex items-center gap-2">
				<Link to="/">
					<img
						src={LogoNoImage}
						alt="Logo"
						className="h-8 w-8 rounded-full"
					/>
				</Link>
				<span className="text-3xl font-bold">{pageTitle}</span>
			</div>

			<div className="flex items-center gap-3">
				{isAuthenticated ? (
					<div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
						<span>{user?.displayName}</span>
					</div>
				) : (
					<Link
						to="/login"
						className="inline-flex size-9 items-center justify-center rounded-lg border border-(--line) bg-(--surface) text-foreground"
						aria-label="Sign in"
					>
						<LogIn size={17} />
					</Link>
				)}

				<button
					type="button"
					className="cursor-pointer"
					onClick={() => setIsMenuOpen((prev) => !prev)}
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					aria-expanded={isMenuOpen}
				>
					<ChevronUp
						className={`transition-transform duration-300 ease-in-out ${
							isMenuOpen ? "-rotate-180" : "rotate-0"
						}`}
					/>
				</button>
			</div>
		</nav>
	);
};

export default Navbar;

function getPageTitle(pathname: string) {
	if (pathname.startsWith("/transaction/create")) {
		return "New transaction";
	}

	if (pathname.startsWith("/transaction") || pathname.startsWith("/transactions")) {
		return "Transaction";
	}

	if (pathname.startsWith("/login")) {
		return "Login";
	}

	return "Home";
}
