import { create } from "zustand";

type GameStore = {
  state: "answering" | "matching" | "finished";
};

export const useGameStore = create<GameStore>((set) => ({
  state: "matching",
  setStateAnswering: () => set({ state: "answering" }),
  setStateMatching: () => set({ state: "matching" }),
  setStateFinished: () => set({ state: "finished" }),
}));
