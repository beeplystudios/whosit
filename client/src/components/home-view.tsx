import { useZodForm } from "@/lib/hooks/use-zod-form";
import { ChevronRightIcon, PlayIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const createFormSchema = z.object({
  name: z.string(),
});

const joinFormSchema = z.object({
  name: z.string(),
  code: z.string(),
});

const CreateRoom = () => {
  const form = useZodForm({
    schema: createFormSchema,
  });

  const onSubmit = (values: z.infer<typeof createFormSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormDescription className="text-neutral-700 text-xs">
                This nickname will be shown to everyone in your room!
              </FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="flex items-center gap-2">
          <PlayIcon className="h-4 w-4" />
          <span>Play</span>
        </Button>
      </form>
    </Form>
  );
};

const JoinRoom = () => {
  const form = useZodForm({
    schema: joinFormSchema,
  });

  const onSubmit = (values: z.infer<typeof createFormSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormDescription className="text-neutral-700 text-xs">
                This nickname will be shown to everyone in your room!
              </FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Join Code</FormLabel>
              <FormDescription className="text-neutral-700 text-xs">
                You can ask the host for the join code
              </FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="flex items-center gap-2">
          <PlayIcon className="h-4 w-4" />
          <span>Play</span>
        </Button>
      </form>
    </Form>
  );
};

export const HomeView = () => {
  // const data = indexRoute.useLoaderData();

  // const factses = [
  //   [
  //     "I ate a slug as a kid, it was on purpose",
  //     "I still do it sometimes, you know",
  //     "nobody ever understands",
  //     "I'm slug man",
  //   ],
  //   [
  //     "I didn't eat anything particularly weird as a kid, besides a worm",
  //     "I still do it sometimes, you know",
  //     "nobody ever understands",
  //     "I'm worm man",
  //   ],
  //   [
  //     "I ate a your mom's ass as a kid, it was on purpose",
  //     "I still do it sometimes, you know",
  //     "nobody ever understands",
  //     "I'm you're mom's as's man",
  //   ],
  // ];

  // const guesseses = [
  //   ["slugman", "slugman", "lucy"],
  //   ["wormman", "wormman", "janet"],
  //   ["you'remom'sass'sman", "you'remom'sass'sman", "eleanor"],
  // ];

  const [mode, setMode] = useState<"unselected" | "join" | "create">(
    "unselected"
  );

  const [parent] = useAutoAnimate();

  return (
    <main className="h-screen flex items-center">
      <div
        ref={parent}
        className="flex flex-col items-center justify-center gap-8 bg-orange-400/60 rounded-3xl w-1/2 mx-auto h-max p-8 border-4 border-black shadow-rose-700 shadow-md"
      >
        <h1 className="text-4xl font-semibold">WhosIt!</h1>
        {mode === "unselected" && (
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setMode("create")}
              asChild
              className="bg-white h-max hover:bg-purple-300 cursor-default p-4"
            >
              <span className="flex items-start gap-8">
                <span className="flex flex-col">
                  <span className="text-lg font-medium">Create a New Game</span>
                  <p className="text-sm font-medium text-neutral-700">
                    If you're hosting this round, create a new room for the
                    team!
                  </p>
                </span>
                <ChevronRightIcon className="h-6 w-6 mt-0.5 ml-8" />
              </span>
            </Button>
            <Button
              onClick={() => setMode("join")}
              asChild
              className="bg-white h-max hover:bg-indigo-300 cursor-default p-4"
            >
              <span className="flex items-start">
                <span className="flex flex-col">
                  <span className="text-lg font-medium">Join a Game</span>
                  <p className="text-sm font-medium text-neutral-700">
                    If you're not hosting this round, join an existing room with
                    a code!
                  </p>
                </span>
                <ChevronRightIcon className="h-6 w-6 mt-0.5 ml-8" />
              </span>
            </Button>
          </div>
        )}
        {mode === "create" && (
          <div className="bg-white/70 backdrop-blur-md py-6 px-8 rounded-xl border-2 border-black shadow-orange-700">
            <p className="text-lg font-medium mb-4">Create a new Game!</p>
            <CreateRoom />
          </div>
        )}
        {mode === "join" && (
          <div className="bg-white/70 backdrop-blur-md py-6 px-8 rounded-xl border-2 border-black shadow-orange-700">
            <p className="text-lg font-medium mb-4">Join a new Game!</p>
            <JoinRoom />
          </div>
        )}
      </div>
    </main>
  );
};
