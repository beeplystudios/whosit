import express from "express";
import { createRoom, getHost, getOrder, getQuestions, getUsers } from "../db/room";
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
    res.send(SuperJSON.stringify({
      hostId: getHost(roomId), users: users.map((user) => {
        return { id: user.id, name: user.name };
      })
    }));
  } catch (err) {
    res.status(404);
    res.send(SuperJSON.stringify({ error: (err as Error).message }));
  }
})

roomRouter.get("/:roomId/questions", (req, res) => {
  const { roomId } = req.params;

  try {
    const questions = getQuestions(roomId);
    res.send(SuperJSON.stringify(questions));
  } catch (err) {
    res.status(404);
    res.send(SuperJSON.stringify({ error: (err as Error).message }));
  }
})

roomRouter.get("/:roomId/responses", (req, res) => {
  const { roomId } = req.params;

  try {
    const users = getUsers(roomId);
    const order = getOrder(roomId);
    res.send(SuperJSON.stringify(users.map((user) => ({
      id: users[order.get(user.id)!].id,
      answers: users[order.get(user.id)!].answers
    }))));
  } catch (err) {
    res.status(404);
    res.send(SuperJSON.stringify({ error: (err as Error).message }));
  }
});
