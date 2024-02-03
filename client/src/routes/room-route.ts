import { RoomView } from "@/components/room-view";
import { memberListQuery } from "@/lib/queries";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";

export const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/room/$id",
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(memberListQuery(params.id));
  },
  component: RoomView,
});
