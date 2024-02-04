import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { rootRoute } from "./routes/__root.tsx";
import { indexRoute } from "./routes/index.tsx";
import "./global.css";
import { roomPlayRoute, roomRoute } from "./routes/room-route.ts";
import { queryClient } from "./lib/query-client.tsx";

const routeTree = rootRoute.addChildren([indexRoute, roomRoute, roomPlayRoute]);

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
