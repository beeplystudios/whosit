import { useIo, useIoEvent } from "@/lib/connection";
import { useGameStore } from "@/lib/game";
import { useZodForm } from "@/lib/hooks/use-zod-form";
import { ChevronRightIcon, LockClosedIcon } from "@heroicons/react/16/solid";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Suspense, useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { userSchema } from "@/lib/schemas";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { answersListQuery } from "@/lib/queries";

const routeApi = getRouteApi("/room/$id/play");

const useTimerLoop = (duration: number, callback: () => void) => {
  const [startTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useGameStore((s) => [
    s.timeLeft,
    s.setTimeLeft,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - startTime.getTime();
      const remaining = duration + 1 - elapsed / 1000;

      if (remaining < 0) {
        clearInterval(interval);

        setTimeRemaining(0);

        callback();
      } else {
        setTimeRemaining(Math.ceil(remaining));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, startTime, timeRemaining, setTimeRemaining, callback]);

  return timeRemaining;
};

const responseFormSchema = z.object({
  response: z.string().min(5).max(300),
});

export const AnsweringStateView = () => {
  const [answered, setAnswered] = useState(false);
  const [setStateMatching, round] = useGameStore((s) => [
    s.setStateMatching,
    s.round,
  ]);

  const { id } = routeApi.useParams();

  const queryClient = useQueryClient();

  useTimerLoop(10, setStateMatching);

  const question = (
    queryClient.getQueryData(["room-questions", id]) as string[]
  )[round];

  const form = useZodForm({
    schema: responseFormSchema,
    defaultValues: {
      response: "",
    },
  });

  const io = useIo();

  const onSubmit = (values: z.infer<typeof responseFormSchema>) => {
    io.emit("answer", id, values.response);
    setAnswered(true);
  };

  return (
    <div className="flex items-center h-[50vh]">
      <div className="flex flex-col items-center mx-auto w-full h-max">
        <div className="flex flex-col items-center gap-4 justify-center w-[90%] md:w-3/4 lg:w-1/2 bg-orange-500/25 rounded-3xl px-4 md:px-8 py-5 border-4 border-stone-800 shadow-rose-700 shadow-md">
          {answered && (
            <p className="font-medium text-lg">
              Thanks for your answer, sit tight until the timer is up!
            </p>
          )}
          {!answered && (
            <>
              <p className="text-2xl font-medium">{question}</p>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex items-center w-full lg:w-3/4 my-4"
                >
                  <FormField
                    control={form.control}
                    name="response"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl className="w-full">
                          <div className="flex flex-col gap-2 items-center w-full">
                            <Textarea
                              {...field}
                              className="w-full"
                              placeholder="Thoughtful response..."
                            />
                            <Button type="submit" className="font-bold w-full">
                              Go!
                              <span className="h-4 w-4">
                                <ChevronRightIcon />
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-rose-900" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
const MatchingStateView = () => {
  const { id } = routeApi.useParams();
  const [guesses, setGuess] = useGameStore((s) => [s.guesses, s.setGuess]);
  const io = useIo();

  const { data } = useSuspenseQuery(answersListQuery(id, io.id!));

  useTimerLoop(10, () => {
    io.emit("nextRound", id);
  });
  const queryClient = useQueryClient();

  const questions = queryClient.getQueryData([
    "room-questions",
    id,
  ]) as string[];

  const members = queryClient.getQueryData(["room-members", id]) as {
    hostId: string;
    users: z.infer<typeof userSchema>[];
  };

  const toggleUserValue = (value: string, idx: number) => {
    setGuess(idx, value);
    // io.emit("makeGuess", id, idx, value);
  };

  const lockIn = (value: string, idx: number) => {
    io.emit("makeGuess", id, idx, value);
  };

  return (
    <div>
      <div className="bg-stone-200 p-4 rounded-xl border-2 border-stone-800 flex flex-col gap-3">
        {data.map((unknownUser, idx) => (
          <>
            {[...unknownUser.answers].map(([questionIdx, answer]) => (
              <div className="flex flex-col gap-1">
                <p className="text-xl font-medium">{questions[questionIdx]}</p>
                <p>{answer}</p>
              </div>
            ))}
            <div className="flex items-center gap-4">
              <ToggleGroup
                type="single"
                className="my-2"
                value={guesses[idx]}
                onValueChange={(value) => toggleUserValue(value, idx)}
              >
                {members.users
                  .filter((user) => user.id !== io.id)
                  .map((user) => (
                    <ToggleGroupItem value={user.id} key={user.id}>
                      {user.name}
                    </ToggleGroupItem>
                  ))}
              </ToggleGroup>
              <Button
                className="bg-white"
                onClick={() => lockIn(guesses[idx], idx)}
              >
                <span>
                  <LockClosedIcon className="h-4 w-4" />
                </span>
                Lock In
              </Button>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

const GameState = () => {
  const gameState = useGameStore((s) => s.state);

  // return <MatchingStateView />;

  if (gameState === "answering") {
    return <AnsweringStateView />;
  }

  if (gameState === "matching") {
    return <MatchingStateView />;
  }

  return <div></div>;
};

export const RoomPlayView = () => {
  const { id } = routeApi.useParams();
  const [
    state,
    timeLeft,
    round,
    setRound,
    setStateFinished,
    setStateAnswering,
  ] = useGameStore((s) => [
    s.state,
    s.timeLeft,
    s.round,
    s.setRound,
    s.setStateFinished,
    s.setStateAnswering,
  ]);
  const queryClient = useQueryClient();
  const io = useIo();

  const nextRoundHandler = useCallback(
    (round: number) => {
      if (
        round >=
        (queryClient.getQueryData(["room-questions", id]) as string[]).length
      ) {
        setStateFinished();
      } else {
        setRound(round);
        setStateAnswering();
      }
    },
    [setRound, id, queryClient, setStateAnswering, setStateFinished]
  );

  useIoEvent({
    eventName: "round",
    handler: nextRoundHandler,
  });

  const members = queryClient.getQueryData(["room-members", id]) as {
    hostId: string;
    users: z.infer<typeof userSchema>[];
  };

  const me = members.users.find((m) => m.id === io.id);

  if (!me) throw new Error("God only knows what's happened here");

  return (
    <main className="max-w-[100rem] py-6 px-4 md:mx-auto md:w-[70%]">
      <nav className="flex justify-between items-center gap-8 w-full mx-auto md:w-3/4 lg:w-1/2 bg-orange-500/25 rounded-3xl h-max p-6 border-4 border-stone-800 shadow-rose-700 shadow-md">
        <p className="font-semibold text-xls">{me.name}</p>
        <p className="text-3xl bg-pink-600 p-4 font-bold rounded-full h-14 w-14 flex items-center justify-center border-2 border-stone-800">
          {timeLeft}
        </p>
        <p className="font-mono text-lg text-emerald-950 bg-emerald-300 px-4 rounded-full border-2 border-stone-800">
          {state === "finished" ? "Game Over" : `Round: ${round + 1}`}
        </p>
      </nav>
      <Suspense>
        <GameState />
      </Suspense>
    </main>
  );
};
