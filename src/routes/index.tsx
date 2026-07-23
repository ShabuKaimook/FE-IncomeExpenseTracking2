import { createRoute } from "@tanstack/react-router";
import AuthCallbackPage from "@/features/auth/AuthCallbackPage";
import LoginPage from "@/features/auth/LoginPage";
import { RedirectIfAuthenticated } from "@/features/auth/RedirectIfAuthenticated";
import { RequireAuth } from "@/features/auth/RequireAuth";
import DashboardPage from "@/features/dashboard/DashboardPage";
import TransactionCreatePage from "@/features/transactions/create/TransactionCreatePage";
import TransactionPage from "@/features/transactions/TransactionPage";
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
	path: "/transaction",
	component: () => (
		<RequireAuth>
			<TransactionPage />
		</RequireAuth>
	),
});

const transactionCreateRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/transaction/create",
	component: () => (
		<RequireAuth>
			<TransactionCreatePage />
		</RequireAuth>
	),
});

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: () => (
		<RedirectIfAuthenticated>
			<LoginPage />
		</RedirectIfAuthenticated>
	),
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
	transactionCreateRoute,
	loginRoute,
	authCallbackRoute,
	lineAuthCallbackRoute,
]);
