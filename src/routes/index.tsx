import { createRoute } from "@tanstack/react-router";
import DashboardPage from "#/pages/dashboard";
import { Route as rootRoute } from "./__root";

const dashboardRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: DashboardPage,
});

const transactionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transactions",
  component: DashboardPage, // TODO: Replace with the actual component for the transactions page
});

export const routeTree = rootRoute.addChildren([dashboardRoute, transactionRoute]);
