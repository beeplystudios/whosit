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

export const questionListQuery = (id: string) =>
  queryOptions({
    queryKey: ["room-questions", id],
    queryFn: async () =>
      await request({
        route: `/room/${id}/questions`,
        schema: z.array(z.string()),
      }),
    refetchOnWindowFocus: false,
  });

export const answersListQuery = (id: string, userId: string) =>
  queryOptions({
    queryKey: ["room-answers", id],
    queryFn: async () =>
      await request({
        route: `/room/${id}/responses?userId=${encodeURIComponent(userId)}`,
        schema: z.array(z.object({ answers: z.map(z.number(), z.string()) })),
      }),
  });

export const leaderboardQuery = (id: string) =>
  queryOptions({
    queryKey: ["room-leaderboard", id],
    queryFn: async () =>
      await request({
        route: `/room/${id}/leaderboard`,
        schema: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            answers: z.map(z.number(), z.string()),
            points: z.number(),
            guesses: z.array(
              z.object({
                guessedUser: userSchema,
                realUser: userSchema,
                round: z.number(),
              })
            ),
          })
        ),
      }),
  });
