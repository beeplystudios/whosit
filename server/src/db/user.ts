export type User = {
  id: string;
  name: string;
  points: number;
  answers: Map<number, string>;
  guesses: Map<number, { round: number, guessedId: string }>;
};
