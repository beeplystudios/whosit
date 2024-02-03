import express from "express";
import { addUser, createRoom, removeUser } from "../db/room";
import SuperJSON from "superjson";

export const roomRouter = express.Router();

roomRouter.post("/", (req, res) => {
  const room = createRoom();

  res.send(SuperJSON.stringify(room));
});
