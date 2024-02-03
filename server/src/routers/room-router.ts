import express from "express";
import { createRoom, getUsers } from "../db/room";
import SuperJSON from "superjson";

export const roomRouter = express.Router();

roomRouter.post("/", (req, res) => {
  const room = createRoom();

  res.send(SuperJSON.stringify(room));
});

roomRouter.get("/:roomId/users", (req, res) => {
  const { roomId } = req.params;

  try {
    const users = getUsers(roomId);
    res.send(SuperJSON.stringify(users))
  } catch (err) {
    res.status(404);
    res.send(SuperJSON.stringify({ error: (err as Error).message }));
  }
})
