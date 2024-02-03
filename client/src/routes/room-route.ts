import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { RoomView } from "@/components/room-view";

export const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/room/$id",
  component: RoomView,
});
