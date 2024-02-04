import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { useZodForm } from "@/lib/hooks/use-zod-form";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { useGameStore } from "@/lib/game";
import { useEffect, useState } from "react";

const useTimerLoop = () => {
  const duration = 30;
  const [startTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - startTime.getTime();
      const remaining = duration - elapsed / 1000;

      if (remaining < 0) {
        clearInterval(interval);
        setTimeRemaining(0);
      } else {
        setTimeRemaining(Math.ceil(remaining));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, startTime, timeRemaining]);

  return timeRemaining;
};

export const AnsweringStateView = () => {
  const question = "How's it hanging?";

  const responseFormSchema = z.object({
    response: z.string().min(5).max(300),
  });

  const form = useZodForm({
    schema: responseFormSchema,
    defaultValues: {
      response: "",
    },
  });

  const onSubmit = () => {
    return null;
  };

  return (
    <main className="h-screen flex items-center">
      <div className="flex flex-col items-center mx-auto w-full h-max">
        <h1 className="font-whosit text-5xl">timer</h1>
        <div className="flex flex-col items-center gap-4 justify-center w-[95%] md:w-1/2 bg-orange-500/25 rounded-3xl px-4 md:px-8 py-5 border-4 border-stone-800 shadow-rose-700 shadow-md">
          <h1 className="text-2xl font-bold">{question}</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center w-full lg:w-[70%] xl:w-[60%]"
            >
              <FormField
                control={form.control}
                name="response"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="flex flex-col gap-2 items-center">
                        <Textarea
                          {...field}
                          placeholder="Thoughtful response..."
                        />
                        <Button type="submit" className="font-bold">
                          Go!
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
    </main>
  );
};
const MatchingStateView = () => {
  return <div>hdwai</div>;
};

const GameState = () => {
  const gameState = useGameStore((s) => s.state);

  if (gameState === "answering") {
    return <AnsweringStateView />;
  }

  if (gameState === "matching") {
    return <MatchingStateView />;
  }

  return <div></div>;
};

export const RoomPlayView = () => {
  const timeRemaining = useTimerLoop();

  return (
    <main className="max-w-[100rem] py-6 px-4 md:mx-auto md:w-[70%]">
      <nav className="flex justify-between items-center gap-8 w-full mx-auto md:w-1/2 bg-orange-500/25 rounded-3xl h-max p-6 border-4 border-stone-800 shadow-rose-700 shadow-md">
        <p className="font-semibold text-xls">Nirjhor Nath</p>
        <p className="text-3xl bg-pink-600 p-3 font-bold rounded-full h-12 w-12 flex items-center justify-center border-2 border-stone-800">
          {timeRemaining}
        </p>
        <p className="font-mono text-lg text-emerald-950 bg-emerald-300 px-4 rounded-full border-2 border-stone-800">
          Points: 38
        </p>
      </nav>
      <GameState />
    </main>
  );
};
