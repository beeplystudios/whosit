import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { roomRouter } from "./routers/room-router";
import SuperJSON from "superjson";
import bodyParser from "body-parser";
import { addUser, removeUser } from "./db/room";

const jsonParser = bodyParser.json();

const app = express();
app.use(cors({ origin: "*" }));
app.use(jsonParser);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 mins
  }
});

app.get("/", (req, res) => {
  res.send(SuperJSON.stringify({ message: "Hello World" }));
});

app.use("/room", roomRouter);

io.on("connection", (socket) => {
  console.log(`Client with id ${socket.id} connected`);
  socket.on("joinRoom", (roomId, userName) => {
    socket.join(roomId);
    console.log(`User with id ${socket.id} named ${userName} joined room ${roomId}`);
    addUser(roomId, { id: socket.id, name: userName });
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`User with id ${socket.id} left room ${roomId}`);
    removeUser(roomId, socket.id);
  });

  socket.on("disconnect", () => {
    console.log(`Client with id ${socket.id} disconnected`);
  });
});

const port = 3000;
console.log(`Server is listening on port ${port}`);

httpServer.listen(port);
