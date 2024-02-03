import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { request } from "../lib/fetcher";
import { z } from "zod";

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
  component: () => {
    const data = indexRoute.useLoaderData();

    return (
      <div>
        <h1>Index Route</h1>
        <p>{data.message}</p>
      </div>
    );
  },
});
