import { create } from "zustand";

type GameStore = {
  state: "answering" | "matching" | "finished";
  timeLeft: number;
  setTimeLeft: (time: number) => void;
  setStateAnswering: () => void;
  setStateMatching: () => void;
  setStateFinished: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  state: "matching",
  timeLeft: 0,
  setTimeLeft: (time: number) => set({ timeLeft: time }),
  setStateAnswering: () => set({ state: "answering" }),
  setStateMatching: () => set({ state: "matching" }),
  setStateFinished: () => set({ state: "finished" }),
}));
