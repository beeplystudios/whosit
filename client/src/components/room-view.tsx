import { memberListQuery } from "@/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

const roomRoute = getRouteApi("/room/$id");

export const RoomView = () => {
  const { id } = roomRoute.useParams();
  const { data } = useSuspenseQuery(memberListQuery(id));

  return (
    <div>
      Room {id}: {JSON.stringify(data)}
    </div>
  );
};
