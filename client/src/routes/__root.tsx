import { createRootRoute, Outlet } from "@tanstack/react-router";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="bg-red-200">Root Route</div>
      <Outlet />
    </>
  ),
});
