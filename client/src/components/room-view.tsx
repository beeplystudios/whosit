import { getRouteApi } from "@tanstack/react-router";

const roomRoute = getRouteApi("/room/$id");

export const RoomView = () => {
  const { id } = roomRoute.useParams();

  return <div>Room {id}</div>;
};
