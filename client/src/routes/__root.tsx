import { ConnectionWrapper } from "@/lib/connection-wrapper";
import { queryClient } from "@/lib/query-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <ConnectionWrapper>
        <Outlet />
      </ConnectionWrapper>
    </QueryClientProvider>
  ),
});
