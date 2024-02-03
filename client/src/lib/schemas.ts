import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const roomSchema = z.object({
  id: z.string(),
  users: z.map(z.string(), userSchema),
});
