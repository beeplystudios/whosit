import { ConnectionWrapper } from "@/lib/connection-wrapper";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const rootRoute = createRootRoute({
  component: () => (
    <ConnectionWrapper>
      <Outlet />
    </ConnectionWrapper>
  ),
});
