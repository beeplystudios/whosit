import { z } from "zod";
import SuperJSON from "superjson";

const SERVER_URL = "http://localhost:3000";

type RequestOptions<T> =
  | {
      route: string;
      schema: T;
      options?: RequestInit;
      method?: "GET";
    }
  | {
      route: string;
      schema: T;
      options?: RequestInit;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body?: any;
      method?: "POST";
    };

export const request = async <T extends z.ZodType>(
  opts: RequestOptions<T>
): Promise<z.infer<T>> => {
  const res = await fetch(`${SERVER_URL}${opts.route}`, {
    ...opts.options,
    body: opts.method == "POST" ? JSON.stringify(opts.body) : undefined,
    headers: {
      "Content-Type": "application/json",
      ...opts.options?.headers,
    },
    method: opts.method ?? "GET",
  });

  const json = await res.text();

  // console.log(SuperJSON.parse(json));

  return opts.schema.parse(SuperJSON.parse(json));
};
