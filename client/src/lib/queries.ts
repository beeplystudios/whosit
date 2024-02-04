import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { userSchema } from "./schemas";
import { request } from "./fetcher";

export const memberListQuery = (id: string) =>
  queryOptions({
    queryKey: ["room-members", id],
    queryFn: async () =>
      await request({
        route: `/room/${id}/users`,
        schema: z.object({
          hostId: z.string(),
          users: z.array(userSchema),
        }),
      }),
    refetchOnWindowFocus: false,
  });
