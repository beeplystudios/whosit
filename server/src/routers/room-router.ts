import { Hono } from "hono";
import { createRoom } from "../db/room";

export const roomRouter = new Hono();

roomRouter.post("/", (ctx) => {
  const { name } = ctx.body;

  const room = createRoom(name);

  return ctx.json(room);
});
