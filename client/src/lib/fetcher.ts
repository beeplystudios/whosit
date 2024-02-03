import { z } from "zod";

const SERVER_URL = "http://localhost:3000";

type RequestOptions<T> = {
  route: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: T;
  options?: RequestInit;
};

export const request = async <T extends z.ZodType>(
  opts: RequestOptions<T>
): Promise<z.infer<T>> => {
  const res = await fetch(`${SERVER_URL}${opts.route}`, {
    ...opts.options,
    headers: {
      "Content-Type": "application/json",
      ...opts.options?.headers,
    },
  });

  const json = await res.json();

  return opts.schema.parse(json);
};
