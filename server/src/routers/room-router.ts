import express from "express";
import { createRoom, getHost, getQuestions, getUsers } from "../db/room";
import SuperJSON from "superjson";

export const roomRouter = express.Router();

roomRouter.post("/", (req, res) => {
  const room = createRoom(req.body.userId);

  res.send(SuperJSON.stringify(room));
});

roomRouter.get("/:roomId/users", (req, res) => {
  const { roomId } = req.params;

  try {
    const users = getUsers(roomId);
    res.send(SuperJSON.stringify({ hostId: getHost(roomId), users }));
  } catch (err) {
    res.status(404);
    res.send(SuperJSON.stringify({ error: (err as Error).message }));
  }
})

roomRouter.get("/:roomId/questions", (req, res) => {
  const { roomId } = req.params;

  console.log("GET questions");

  try {
    const questions = getQuestions(roomId);
    res.send(SuperJSON.stringify(questions));
  } catch (err) {
    res.status(404);
    res.send(SuperJSON.stringify({ error: (err as Error).message }));
  }
})
