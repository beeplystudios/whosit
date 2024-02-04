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
};

const rooms: Map<string, Room> = new Map();

export const createRoom = (hostId: string) => {
  const code = Math.random().toString(36).substring(2, 8);

  const room = { id: code, hostId, questions: [], users: new Map(), started: false, finished: false, round: 0, order: new Map() };
  rooms.set(code, room);

  return room;
};

export const addUser = (id: string, userData: { id: string, name: string }) => {
  const room = rooms.get(id);
  if (!room) {
    throw new Error(`Room with id ${id} not found!`);
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
  ids.map((id, idx) => ({ id, idx, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .forEach(({ id, idx }) => {
      orderMap.set(id, idx);
    });

  room.started = true;
  room.order = orderMap;
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

export const makeGuess = (roomId: string, userId: string, index: number, guessedUserId: string) => {
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

  if (!!user.guesses.get(index)) return;
  
  user.guesses.set(index, guessedUserId);
}
