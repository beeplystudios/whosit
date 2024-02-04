import { useIo } from "@/lib/connection";
import { request } from "@/lib/fetcher";
import { useZodForm } from "@/lib/hooks/use-zod-form";
import { roomSchema } from "@/lib/schemas";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ChevronRightIcon, PlayIcon } from "@heroicons/react/16/solid";
import { Link, getRouteApi, useNavigate } from "@tanstack/react-router";
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

const indexRoute = getRouteApi("/");

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
    defaultValues: {
      name: "",
    },
  });

  const navigate = useNavigate();
  const io = useIo();

  const onSubmit = async (values: z.infer<typeof createFormSchema>) => {
    const room = await request({
      route: "/room",
      method: "POST",
      schema: roomSchema,
      body: {
        userId: io.id,
      },
    });

    io.emit("joinRoom", room.id, values.name);
    // setName(values.name);

    navigate({
      to: "/room/$id",
      params: {
        id: room.id,
      },
    });
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
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const io = useIo();
  const navigate = useNavigate();

  const onSubmit = (values: z.infer<typeof joinFormSchema>) => {
    io.emit("joinRoom", values.code, values.name);

    navigate({
      to: "/room/$id",
      params: {
        id: values.code,
      },
    });
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

  const [parent] = useAutoAnimate();
  const params = indexRoute.useSearch();

  return (
    <main className="h-screen flex items-center">
      <div
        ref={parent}
        className="flex flex-col items-center justify-center gap-8 w-[95%] mx-auto md:w-1/2 bg-orange-500/25 rounded-3xl h-max px-8 py-16 border-4 border-stone-800 shadow-rose-700 shadow-md"
      >
        <h1 className="text-6xl font-semibold font-whosit">WhosIt!</h1>
        {!params.mode && (
          <div className="flex flex-col gap-3 w-full lg:max-w-xl">
            <Link
              to="/"
              search={{ mode: "create" }}
              className="bg-stone-200 transition-colors h-max hover:bg-green-100 cursor-default p-4 rounded-md border-2 border-stone-800"
            >
              <span className="flex items-center">
                <span className="flex flex-col">
                  <span className="text-lg font-semibold">
                    Create a New Game
                  </span>
                  <p className="text-sm font-medium text-neutral-700">
                    If you're hosting this round, create a new room for the
                    team!
                  </p>
                </span>
                <span className="flex-grow" />
                <ChevronRightIcon className="h-6 w-6 mt-0.5 ml-8" />
              </span>
            </Link>
            <Link
              to="/"
              search={{ mode: "join" }}
              className="bg-stone-200 transition-colors h-max hover:bg-purple-100 cursor-default p-4 rounded-md border-2 border-stone-800"
            >
              <span className="flex items-center">
                <span className="flex flex-col">
                  <span className="text-lg font-semibold">Join a Game</span>
                  <p className="text-sm font-medium text-neutral-700">
                    If you're not hosting this round, join an existing room with
                    a code!
                  </p>
                </span>
                <span className="flex-grow" />
                <ChevronRightIcon className="h-6 w-6 mt-0.5 ml-8" />
              </span>
            </Link>
          </div>
        )}
        {params.mode === "create" && (
          <div className="bg-white/70 backdrop-blur-md py-6 px-8 rounded-xl border-2 border-stone-800 shadow-orange-700">
            <p className="text-lg font-medium mb-4">Create a new Game!</p>
            <CreateRoom />
          </div>
        )}
        {params.mode === "join" && (
          <div className="bg-white/70 backdrop-blur-md py-6 px-8 rounded-xl border-2 border-stone-800 shadow-orange-700">
            <p className="text-lg font-medium mb-4">Join a new Game!</p>
            <JoinRoom />
          </div>
        )}
      </div>
    </main>
  );
};
