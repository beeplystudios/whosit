import { create } from "zustand";

type GameStore = {
  state: "answering" | "matching" | "finished";
  timeLeft: number;
  round: number;
  setRound: (round: number) => void;
  setTimeLeft: (time: number) => void;
  setStateAnswering: () => void;
  setStateMatching: () => void;
  setStateFinished: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  state: "answering",
  timeLeft: 0,
  round: 0,
  setRound: (round: number) => set({ round }),
  setTimeLeft: (time: number) => set({ timeLeft: time }),
  setStateAnswering: () => set({ state: "answering" }),
  setStateMatching: () => set({ state: "matching" }),
  setStateFinished: () => set({ state: "finished" }),
}));
