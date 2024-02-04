import { useIo, useIoEvent } from "@/lib/connection";
import { useGameStore } from "@/lib/game";
import { useZodForm } from "@/lib/hooks/use-zod-form";
import {
  ChevronRightIcon,
  InformationCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/16/solid";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Suspense, useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { userSchema } from "@/lib/schemas";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { answersListQuery, leaderboardQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";

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

  useTimerLoop(60, () => {
    if (!answered) {
      io.emit("answer", id, "");
    }

    // setStateMatching();
  });

  useIoEvent({
    eventName: "setStateMatching",
    handler: setStateMatching,
  });

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
    <div className="flex justify-center flex-col items-center py-8">
      <h1 className="font-whosit text-5xl font-bold my-4 text-center">
        Answer!
      </h1>
      <div className="bg-pink-400/60 p-4 rounded-md border-2 border-stone-800 flex items-center gap-4 my-4">
        <InformationCircleIcon className="h-4 w-4" />
        <p className="max-w-2xl font-medium">
          Answer the question below, and try to be as honest as possible!
          Remember, the overarching goal is to share yourself and get to know
          others!
        </p>
      </div>
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

  useTimerLoop(60, () => {
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
    if (guesses[idx]?.userId ?? "" === value) {
      setGuess(idx, undefined);
    } else {
      setGuess(idx, value);
    }
  };

  const lockIn = (value: string, idx: number) => {
    setGuess(idx, value, true);
    io.emit("makeGuess", id, idx, value);
  };

  return (
    <div className="flex justify-center flex-col items-center py-8">
      <h1 className="font-whosit text-5xl font-bold my-4 text-center">
        Now Match!
      </h1>
      <div className="bg-pink-400/60 p-4 rounded-md border-2 border-stone-800 flex items-center gap-4 my-4">
        <InformationCircleIcon className="h-4 w-4" />
        <p className="max-w-2xl font-medium">
          Try your best to match each card to a person based on their responses
          to the questions! If you're sure of your choice, lock it in!
        </p>
      </div>
      <div className="grid gap-4 w-full md:grid-cols-2 grid-cols-1">
        {data.map((unknownUser, idx) => (
          <>
            {unknownUser.mine ? null : (
              <div className="bg-stone-200 p-4 rounded-xl border-2 border-stone-800 flex flex-col gap-3 w-full">
                {[...unknownUser.answers].map(([questionIdx, answer]) => (
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-medium">
                      {questions[questionIdx]}
                    </p>
                    <p className={cn(answer === "" && "italic")}>
                      {answer === "" ? "No answer provided" : answer}
                    </p>
                  </div>
                ))}
                <div className="flex items-center gap-4 justify-between">
                  <ToggleGroup
                    type="single"
                    className="my-2"
                    value={guesses[idx]?.userId ?? undefined}
                    onValueChange={(value) => toggleUserValue(value, idx)}
                    disabled={!!guesses[idx]?.isLocked}
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
                    onClick={() => lockIn(guesses[idx]!.userId, idx)}
                    disabled={!guesses[idx] || guesses[idx]?.isLocked}
                  >
                    <span>
                      <LockClosedIcon className="h-4 w-4" />
                    </span>
                    Lock In
                  </Button>
                </div>
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

const FinishedStateView = () => {
  const { id } = routeApi.useParams();
  const { data } = useSuspenseQuery(leaderboardQuery(id));

  console.log(data);

  return (
    <div className="flex justify-center flex-col items-center py-8">
      <h1 className="font-whosit text-5xl font-bold my-4">Leaderboard</h1>
      <Accordion type="multiple" className="w-full flex gap-4 flex-col my-8">
        {data.map((user) => (
          <>
            <AccordionItem value={user.id}>
              <AccordionTrigger>
                <p className="text-lg font-medium">{user.name}</p>
                <p className="font-mono">{user.points}</p>
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guessed User</TableHead>
                      <TableHead>Real User</TableHead>
                      <TableHead>Round</TableHead>
                      <TableHead>Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.guesses.map((guess, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{guess.guessedUser.name}</TableCell>
                        <TableCell>{guess.realUser.name}</TableCell>
                        <TableCell>{guess.round + 1}</TableCell>
                        <TableCell className="font-mono text-emerald-500">
                          {guess.guessedUser.id === guess.realUser.id
                            ? guess.round === 0
                              ? `+${20}`
                              : guess.round === 1
                                ? `+${15}`
                                : `+${10}`
                            : "None"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </>
        ))}
      </Accordion>
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

  if (gameState === "finished") {
    return <FinishedStateView />;
  }
};

export const RoomPlayView = () => {
  const { id } = routeApi.useParams();
  const [
    state,
    timeLeft,
    guesses,
    round,
    setRound,
    setStateFinished,
    setStateAnswering,
  ] = useGameStore((s) => [
    s.state,
    s.timeLeft,
    s.guesses,
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
        for (const [index, data] of Object.entries(guesses)) {
          if (data) {
            if (!data.isLocked) {
              io.emit("makeGuess", id, index, data.userId);
            }
          }
        }
      } else {
        setRound(round);
        setStateAnswering();
      }
    },
    [
      setRound,
      id,
      queryClient,
      setStateAnswering,
      setStateFinished,
      guesses,
      io,
    ]
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
      <nav className="flex justify-between items-center gap-8 w-full mx-auto md:max-w-fit bg-orange-500/25 rounded-3xl h-max p-6 border-4 border-stone-800 shadow-rose-700 shadow-md">
        <p className="font-semibold text-xl whitespace-nowrap">
          My Nickname: {me.name}
        </p>
        <p className="text-3xl bg-pink-600 p-4 font-bold rounded-full h-14 w-14 flex items-center justify-center border-2 border-stone-800">
          {timeLeft}
        </p>
        <p className="font-mono text-lg text-emerald-950 bg-emerald-300 px-4 rounded-full border-2 border-stone-800 w-max whitespace-nowrap">
          {state === "finished" ? "Game Over" : `Round: ${round + 1}`}
        </p>
      </nav>
      <Suspense>
        <GameState />
      </Suspense>
    </main>
  );
};
