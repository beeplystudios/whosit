export type Room = {
  id: string;
  name: string;
  code: string;
};

const rooms: Room[] = [];

export const createRoom = (name: string) => {
  const code = Math.random().toString(36).substring(2, 8);

  const room = { id: code, name, code };
  rooms.push(room);

  return room;
};
