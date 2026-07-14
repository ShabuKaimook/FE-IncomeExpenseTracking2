import { createRoute } from "@tanstack/react-router";
import AuthCallbackPage from "@/features/auth/AuthCallbackPage";
import LoginPage from "@/features/auth/LoginPage";
import { RequireAuth } from "@/features/auth/RequireAuth";
import DashboardPage from "@/features/dashboard/DashboardPage";
import { Route as rootRoute } from "./__root";

const dashboardRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: () => (
		<RequireAuth>
			<DashboardPage />
		</RequireAuth>
	),
});

const transactionRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/transactions",
	component: () => (
		<RequireAuth>
			<DashboardPage />
		</RequireAuth>
	), // TODO: Replace with the actual component for the transactions page
});

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: LoginPage,
});

const authCallbackRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/auth/callback",
	component: AuthCallbackPage,
});

const lineAuthCallbackRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/auth/line/callback",
	component: AuthCallbackPage,
});

export const routeTree = rootRoute.addChildren([
	dashboardRoute,
	transactionRoute,
	loginRoute,
	authCallbackRoute,
	lineAuthCallbackRoute,
]);
