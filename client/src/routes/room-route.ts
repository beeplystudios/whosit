import { RoomView } from "@/components/room-view";
import { memberListQuery } from "@/lib/queries";
import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { RoomPlayView } from "@/components/room-play-view";

export const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/room/$id",
  beforeLoad: async ({ params }) => {
    // throw redirect({ to: "/" });
  },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(memberListQuery(params.id));
  },
  component: RoomView,
});

export const roomPlayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/room/$id/play",
  beforeLoad: async ({ context, params }) => {
    if (!context.queryClient.getQueryData(["room-members", params.id])) {
      throw redirect({ to: "/" });
    }
  },
  component: RoomPlayView,
})
