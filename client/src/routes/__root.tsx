import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const API = import.meta.env.VITE_API_URL;

export const Route = createRootRoute({
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
});
