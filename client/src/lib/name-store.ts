import { createStore } from "zustand/vanilla";

type NameStore = {
  name: string | null;
};

export const nameStore = createStore<NameStore>(() => ({
  name: null,
}));
