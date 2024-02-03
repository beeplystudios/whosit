import express from "express";
import { addUser, createRoom, removeUser } from "../db/room";

export const roomRouter = express.Router();

roomRouter.post("/", (req, res) => {
  const { user } = req.body;

  const room = createRoom(user);

  res.json(room);
});

roomRouter.post("/join/:roomId", (req, res) => {
  const { roomId } = req.params;
  const { user } = req.body;

  try {
    const room = addUser(roomId, user);
    res.json(room);
  } catch (err) {
    res.status(404);
    res.send({ error: (err as Error).message });
  }
});

roomRouter.post("/leave/:roomId", (req, res) => {
  const { roomId } = req.params;
  const { user } = req.body;
  const userId = user.id;

  try {
    const room = removeUser(roomId, userId);
    res.json(room);
  } catch (err) {
    res.status(404);
    res.send({ error: (err as Error).message });
  }
});
