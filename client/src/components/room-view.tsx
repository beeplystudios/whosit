import { useIo, useIoEvent } from "@/lib/connection";
import { memberListQuery } from "@/lib/queries";
import { userSchema } from "@/lib/schemas";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { z } from "zod";

const roomRoute = getRouteApi("/room/$id");

export const RoomView = () => {
  const { id } = roomRoute.useParams();
  const { data, refetch } = useSuspenseQuery(memberListQuery(id));
  const queryClient = useQueryClient();

  const newUserHandler = useCallback(
    (user: z.infer<typeof userSchema>) => {
      queryClient.setQueryData(["room-members", id], { ...data, users: [...data.users, user] });
    },
    [queryClient, data, id]
  );

  const userLeaveHandler = useCallback(refetch, [refetch]);

  useIoEvent({
    eventName: "newUser",
    handler: newUserHandler,
  });

  useIoEvent({
    eventName: "userLeft",
    handler: userLeaveHandler,
  });

  const router = useRouter();
  const io = useIo();

  useEffect(() => {
    router.subscribe("onBeforeLoad", (data) => {
      if (!data.toLocation.pathname.startsWith("/room/")) {
        io.emit("leaveRoom", id);
      }
    });
  }, [router, io, id]);

  return (
    <div>
      Room {id}: {JSON.stringify(data)}
    </div>
  );
};
