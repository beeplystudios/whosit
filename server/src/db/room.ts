import { User } from "./user";

export type Room = {
  id: string;
  hostId: string;
  questions: string[];
  users: Map<string, User>;
  started: boolean;
  finished: boolean;
  round: number;
  order: Map<string, number>;
  orderRev: Map<number, string>;
};

const rooms: Map<string, Room> = new Map();

export const createRoom = (hostId: string) => {
  const code = Math.random().toString(36).substring(2, 8);

  const room = { id: code, hostId, questions: [], users: new Map(), started: false, finished: false, round: 0, order: new Map(), orderRev: new Map() };
  rooms.set(code, room);

  return room;
};

export const addUser = (id: string, userData: { id: string, name: string }) => {
  const room = rooms.get(id);
  if (!room) {
    throw new Error(`Room with id ${id} not found!`);
  }

  if (room.started) {
    throw new Error(`Room with ${id} is not accepting new users`);
  }

  const user = { ...userData, points: 0, answers: new Map(), guesses: new Map() };
  room.users.set(user.id, user);

  return room;
}

export const removeUser = (roomId: string, userId: string) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  if (!room.users.delete(userId)) {
    throw new Error(`User with id ${userId} does not exist in room with id ${roomId}!`);
  }

  if (room.users.size === 0) {
    rooms.delete(roomId);
  }

  return room;
}

export const getUsers = (roomId: string) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  return [...room.users.values()];
}

export const getHost = (roomId: string) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  return room.hostId;
}

export const setQuestion = (roomId: string, questionIdx: number, value: string) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  if (room.started) {
    throw new Error(`Can't set questions on started room (${roomId})`);
  }

  if (room.questions.length <= questionIdx) {
    room.questions.push(value);
  } else {
    room.questions[questionIdx] = value;
  }
}

export const removeQuestion = (roomId: string, questionIdx: number) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  if (room.started) {
    throw new Error(`Can't remove questions on started room (${roomId})`);
  }

  room.questions = room.questions.filter((_, idx) => idx !== questionIdx);
}

export const getQuestions = (roomId: string) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  return room.questions;
}

export const setUserAnswer = (roomId: string, userId: string, answer: string) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  const user = room.users.get(userId);
  if (!user) {
    throw new Error(`User with id ${userId} does not exist in room with id ${roomId}!`);
  }

  user.answers.set(room.round, answer);
}

export const allUsersAnswered = (roomId: string) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }
  
  const users = [...room.users.values()];
  return users.every((user) => !!user.answers.get(room.round));
}

export const startGame = (roomId: string) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  const ids = [...room.users.keys()];
  const orderMap = new Map();
  const orderMapRev = new Map();
  ids.map((id, idx) => ({ id, idx, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .forEach(({ id, idx }) => {
      orderMap.set(id, idx);
      orderMapRev.set(idx, id);
    });

  room.started = true;
  room.order = orderMap;
  room.orderRev = orderMapRev;
}

export const nextRound = (roomId: string) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  room.round += 1;

  if (room.round >= room.questions.length) {
    room.finished = true;
  }
  
  return room.round;
}

export const getOrder = (roomId: string) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  if (!room.started) {
    throw new Error(`Cannot get order on room ${roomId} which is not started`);
  }

  return room.order;
}

export const getOrderRev = (roomId: string) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  if (!room.started) {
    throw new Error(`Cannot get order on room ${roomId} which is not started`);
  }

  return room.orderRev;
}

export const makeGuess = (roomId: string, userId: string, index: number, guessedId: string) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  if (!room.started) {
    throw new Error(`Cannot get make guess in room ${roomId} which is not started`);
  }

  const user = room.users.get(userId);

  if (!user) {
    throw new Error(`User with id ${userId} does not exist in room with id ${roomId}!`);
  }

  if (user.guesses.get(index)) return;
  
  user.guesses.set(index, { round: room.round, guessedId });
}

export const calculatePoints = (roomId: string) => {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  if (!room.finished) {
    throw new Error(`Cannot calculate points on unfinished room ${roomId}`);
  }

  room.users.forEach((user) => {
    var points = 0;
    for (const [idx, { round, guessedId }] of user.guesses) {
      if (room.orderRev.get(idx) === guessedId) {
        switch (round) {
          case 0:
            points += 20;
            break;
          case 1:
            points += 15;
            break;
          default:
            points += 10;
        }
      }
    }

    for (const [_, answer] of user.answers) {
      if (answer === "") {
        points -= 15;
      }
    }

    user.points = points;
  })
}
