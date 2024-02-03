import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { request } from "../lib/fetcher";
import { z } from "zod";
import { HomeView } from "../components/home-view";

const searchSchema = z.object({
  mode: z.enum(["create", "join"]).optional(),
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: searchSchema,
  loader: async () => {
    return await request({
      route: "/",
      schema: z.object({
        message: z.string(),
      }),
    });
  },
  component: HomeView,
});
