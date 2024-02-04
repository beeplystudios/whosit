import { create } from "zustand";

type GameStore = {
  state: "answering" | "matching" | "finished";
  timeLeft: number;
  guesses: Record<number, string>,
  round: number;
  setRound: (round: number) => void;
  setGuess: (idx: number, userId: string) => void;
  setTimeLeft: (time: number) => void;
  setStateAnswering: () => void;
  setStateMatching: () => void;
  setStateFinished: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  state: "answering",
  timeLeft: 0,
  guesses: {},
  round: 0,
  setRound: (round: number) => set({ round }),
  setGuess: (idx: number, userId: string) => set((state) => ({ guesses: { ...state.guesses, [idx]: userId } })),
  setTimeLeft: (time: number) => set({ timeLeft: time }),
  setStateAnswering: () => set({ state: "answering" }),
  setStateMatching: () => set({ state: "matching" }),
  setStateFinished: () => set({ state: "finished" }),
}));
