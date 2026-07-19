import { useAuth } from "@/features/auth/AuthProvider";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
	BarChart3,
	ChevronUp,
	Home,
	LogOut,
	type LucideIcon,
	Receipt,
	Settings,
	Tags,
} from "lucide-react";
import { DropDown } from "./DropDown";

interface NavItem {
	label: string;
	to: string;
	icon: LucideIcon;
}

const navItems: NavItem[] = [
	{ label: "Home", to: "/", icon: Home },
	{ label: "Transaction", to: "/transaction", icon: Receipt },
	{ label: "Category", to: "/category", icon: Tags },
	{ label: "Analytic", to: "/analytic", icon: BarChart3 },
	{ label: "Setting", to: "/setting", icon: Settings },
];

const LOGOUT_VALUE = "__logout";

export const Sidebar = () => {
	const { isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	return (
		<DropDown
			triggerAriaLabel="Open navigation menu"
			triggerClassName="!border-none !bg-transparent p-0 hover:!bg-transparent focus-visible:!ring-0"
			contentClassName="w-56"
			selectedValues={[pathname]}
			sections={[
				{
					sectionType: "static",
					items: navItems.map(({ label, to, icon }) => ({
						icon,
						title: label,
						value: to,
					})),
				},
				...(isAuthenticated
					? [
							{
								sectionType: "static" as const,
								items: [
									{
										icon: LogOut,
										title: "Logout",
										value: LOGOUT_VALUE,
									},
								],
							},
						]
					: []),
			]}
			onItemSelect={({ item }) => {
				if (item.value === LOGOUT_VALUE) {
					logout();
					return;
				}

				navigate({ to: item.value as "/" });
			}}
		>
			<ChevronUp className="size-5 transition-transform duration-300 ease-in-out group-data-[state=open]:-rotate-180" />
		</DropDown>
	);
};
