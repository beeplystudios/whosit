import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { roomRouter } from "./routers/room-router";
import SuperJSON from "superjson";
import bodyParser from "body-parser";
import { addUser, allUsersAnswered, getHost, makeGuess, nextRound, removeQuestion, removeUser, setQuestion, setUserAnswer, startGame } from "./db/room";

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
  const leave = (roomId: string) => {
    socket.leave(roomId);
    console.log(`User with id ${socket.id} left room ${roomId}`);

    try {
      removeUser(roomId, socket.id);
      socket.to(roomId).emit("userLeft");
    } catch (_) {}
  };

  const isHost = (roomId: string) => {
    const hostId = getHost(roomId);
    return hostId === socket.id;
  };

  console.log(`Client with id ${socket.id} connected`);
  socket.on("joinRoom", (roomId, userName) => {
    socket.join(roomId);
    console.log(`User with id ${socket.id} named ${userName} joined room ${roomId}`);

    const user = { id: socket.id, name: userName };
    try {
      addUser(roomId, user);
      io.to(roomId).except(socket.id).emit("newUser", user);
    } catch (_) {}
  });

  socket.on("leaveRoom", (roomId) => {
    leave(roomId);
  });

  socket.on("startGame", (roomId) => {
    if (!isHost(roomId)) return;

    try {
      startGame(roomId);

      io.to(roomId).emit("gameStarted");
    } catch (_) {}
  });

  socket.on("nextRound", (roomId) => {
    if (!isHost(roomId)) return;

    try {
      const round = nextRound(roomId);

      io.to(roomId).emit("round", round);
    } catch (_) {}
  })

  socket.on("answer", (roomId, answer) => {
    try {
      setUserAnswer(roomId, socket.id, answer);

      if (allUsersAnswered(roomId)) {
        io.to(roomId).emit("setStateMatching");
      }
    } catch (_) {}
  });

  socket.on("setQuestion", (roomId, questionIdx, question) => {
    if (!isHost(roomId)) return;

    try {
      setQuestion(roomId, questionIdx, question);

      io.to(roomId).emit("questionSet", { questionIdx, question });
    } catch (_) {}
  });

  socket.on("removeQuestion", (roomId, questionIdx) => {
    if (!isHost(roomId)) return;

    try {
      removeQuestion(roomId, questionIdx);

      io.to(roomId).emit("questionRemoved", questionIdx);
    } catch (_) {}
  })

  socket.on("makeGuess", (roomId, index, guessedUserId) => {
    try {
      makeGuess(roomId, socket.id, index, guessedUserId);
      io.to(roomId).emit("guessMade", { userId: socket.id, index, guessedUserId });
    } catch (_) {}
  });

  socket.on("disconnecting", () => {
    for (const roomId of socket.rooms) {
      if (roomId != socket.id) {
        leave(roomId);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client with id ${socket.id} disconnected`);
  });
});

const port = 3000;
console.log(`Server is listening on port ${port}`);

httpServer.listen(port);
