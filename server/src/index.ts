import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { roomRouter } from "./routers/room-router";

const app = express();
app.use(cors({ origin: "*" }));
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
  res.send({ message: "Hello World" });
});

app.use("/room", roomRouter);

io.on("connection", (socket) => {
  console.log(`Client with id ${socket.id} connected`);
  socket.on("join", (roomId) => {
    socket.join(roomId);
  });

  socket.on("leave", (roomId) => {
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    console.log(`Client with id ${socket.id} disconnected`);
  });
});

const port = 3000;
console.log(`Server is listening on port ${port}`);

httpServer.listen(port);
