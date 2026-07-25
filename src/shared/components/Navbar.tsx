import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { Sidebar } from "@/shared/components/Sidebar";
import { cn } from "@/shared/utils/Utils";
import LogoNoImage from "/logo-no-text.png?url";

interface NavbarProps {
	navbarHeight?: number;
}

const Navbar = ({ navbarHeight }: NavbarProps) => {
	const { isAuthenticated, user } = useAuth();
	const navRef = useRef<HTMLElement>(null);
	const fixedThresholdRef = useRef(0);
	const [isFixed, setIsFixed] = useState(false);
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const pageTitle = getPageTitle(pathname);

	useEffect(() => {
		const updateThreshold = () => {
			const navElement = navRef.current;

			if (!navElement) {
				return;
			}

			fixedThresholdRef.current =
				navElement.getBoundingClientRect().top +
				window.scrollY +
				navElement.offsetHeight;
		};

		const updateFixedState = () => {
			setIsFixed(window.scrollY > fixedThresholdRef.current);
		};

		updateThreshold();
		updateFixedState();
		window.addEventListener("scroll", updateFixedState, { passive: true });
		window.addEventListener("resize", updateThreshold);

		return () => {
			window.removeEventListener("scroll", updateFixedState);
			window.removeEventListener("resize", updateThreshold);
		};
	}, []);

	return (
		<>
			{isFixed && (
				<div
					aria-hidden
					style={{ height: navbarHeight }}
					className="mb-4"
				/>
			)}

			<nav
				ref={navRef}
				style={{ height: navbarHeight }}
				className={cn(
					"flex items-center justify-between pb-4 transition-all duration-200 ease-out",
					isFixed &&
						"fixed left-4 right-4 top-4 z-50 rounded-xl border border-(--line) bg-linear-to-tr from-(--surface-strong) to-primary/40 px-4 pb-0 shadow-xl backdrop-blur",
				)}
			>
				<div className="flex min-w-0 items-center gap-2">
					<Link to="/">
						<img
							src={LogoNoImage}
							alt="Logo"
							className="h-8 w-8 rounded-full"
						/>
					</Link>
					<span className="truncate text-3xl font-bold">{pageTitle}</span>
				</div>

				<div className="flex items-center gap-3">
					{isAuthenticated ? (
						<div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
							<span>{user?.displayName}</span>
						</div>
					) : (
						null
					)}

					<Sidebar />
				</div>
			</nav>
		</>
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

	if (pathname.startsWith("/category")) {
		return "Category";
	}

	if (pathname.startsWith("/login")) {
		return "Login";
	}

	return "Home";
}
