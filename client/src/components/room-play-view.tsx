import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { useZodForm } from "@/lib/hooks/use-zod-form";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { useGameStore } from "@/lib/game";
import { useCallback, useEffect, useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useIo, useIoEvent } from "@/lib/connection";
import { getRouteApi } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

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
  const [setStateMatching, round] = useGameStore((s) => [s.setStateMatching, s.round]);

  const { id } = routeApi.useParams();

  const queryClient = useQueryClient();

  useTimerLoop(10, setStateMatching);

  const question = (queryClient.getQueryData(["room-questions", id]) as string[])[round];

  const form = useZodForm({
    schema: responseFormSchema,
    defaultValues: {
      response: "",
    },
  });

  const io = useIo();

  const onSubmit = (values: z.infer<typeof responseFormSchema>) => {
    io.emit("answer", id, values.response);
  };

  return (
    <div className="flex items-center h-[50vh]">
      <div className="flex flex-col items-center mx-auto w-full h-max">
        <div className="flex flex-col items-center gap-4 justify-center w-[90%] md:w-3/4 lg:w-1/2 bg-orange-500/25 rounded-3xl px-4 md:px-8 py-5 border-4 border-stone-800 shadow-rose-700 shadow-md">
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
        </div>
      </div>
    </div>
  );
};
const MatchingStateView = () => {
  const { id } = routeApi.useParams();
  const io = useIo();

  useTimerLoop(10, () => {
    io.emit("nextRound", id);
  });

  return <div>hdwai</div>;
};

const GameState = () => {
  const gameState = useGameStore((s) => s.state);

  // return <AnsweringStateView />;

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
  const [timeLeft, setRound, setStateFinished, setStateAnswering] = useGameStore((s) => [s.timeLeft, s.setRound, s.setStateFinished, s.setStateAnswering]);
  const queryClient = useQueryClient();

  const nextRoundHandler = useCallback((round: number) => {
    if (round >= (queryClient.getQueryData(["room-questions", id]) as string[]).length) {
      setStateFinished();
    } else {
      setRound(round);
      setStateAnswering();
    }
  }, [setRound]);

  useIoEvent({
    eventName: "round",
    handler: nextRoundHandler,
  });

  return (
    <main className="max-w-[100rem] py-6 px-4 md:mx-auto md:w-[70%]">
      <nav className="flex justify-between items-center gap-8 w-full mx-auto md:w-3/4 lg:w-1/2 bg-orange-500/25 rounded-3xl h-max p-6 border-4 border-stone-800 shadow-rose-700 shadow-md">
        <p className="font-semibold text-xls">Nirjhor Nath</p>
        <p className="text-3xl bg-pink-600 p-3 font-bold rounded-full h-12 w-12 flex items-center justify-center border-2 border-stone-800">
          {timeLeft}
        </p>
        <p className="font-mono text-lg text-emerald-950 bg-emerald-300 px-4 rounded-full border-2 border-stone-800">
          Points: 38
        </p>
      </nav>
      <GameState />
    </main>
  );
};
