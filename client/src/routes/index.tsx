import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { request } from "../lib/fetcher";
import { z } from "zod";
import { HomeView } from "../components/home-view";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
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
