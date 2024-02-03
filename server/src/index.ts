import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { roomRouter } from "./routers/room-router";

const app = new Hono();

app.route("/api/room", roomRouter);

app.use("*", cors());

app.get("/", (c) => {
  return c.json({ message: "Hello, World!" });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
