import { User } from "./user";

export type Room = {
  id: string;
  code: string;
  users: Map<string, User>;
};

const rooms: Map<string, Room> = new Map();

export const createRoom = (user: User) => {
  const code = Math.random().toString(36).substring(2, 8);

  const room = { id: code, code, users: new Map() };
  room.users.set(user.id, user)
  rooms.set(code, room);

  return room;
};

export const addUser = (id: string, user: User) => {
  const room = rooms.get(id);
  if (!room) {
    throw new Error(`Room with id ${id} not found!`);
  }
  
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
