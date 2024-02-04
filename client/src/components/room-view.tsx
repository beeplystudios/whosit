import { useIo, useIoEvent } from "@/lib/connection";
import { useZodForm } from "@/lib/hooks/use-zod-form";
import { memberListQuery, questionListQuery } from "@/lib/queries";
import { userSchema } from "@/lib/schemas";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import React, { Suspense, useCallback, useEffect } from "react";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

const roomRoute = getRouteApi("/room/$id");

const questionFormSchema = z.object({
  question: z.string().min(5).max(250),
});

const QuestionEditor: React.FC<{ isHost: boolean }> = (props) => {
  const { id } = roomRoute.useParams();
  const { data } = useSuspenseQuery(questionListQuery(id));
  const queryClient = useQueryClient();

  const questionSetHandler = useCallback(
    ({ questionIdx: index, question: value }: { questionIdx: number, question: string }) => {
      const newData = [...data];
      if (index < newData.length) {
        newData[index] = value;
      } else {
        newData.push(value);
      }

      queryClient.setQueryData(["room-questions", id], newData)
    }, [queryClient, data, id]);

  const questionRemovedHandler = useCallback(
    (index: number) => {
      queryClient.setQueryData(["room-questions", id], data.filter((_, idx) => idx !== index));
    }, [queryClient, data, id]);

  useIoEvent({
    eventName: "questionSet",
    handler: questionSetHandler,
  });

  useIoEvent({
    eventName: "questionRemoved",
    handler: questionRemovedHandler,
  });

  const form = useZodForm({
    schema: questionFormSchema,
    defaultValues: {
      question: "",
    }
  });

  const io = useIo();

  const onSubmit = (values: z.infer<typeof questionFormSchema>) => {
    io.emit("setQuestion", id, data.length, values.question);
    form.reset();
  };

  const moveUp = (index: number) => {
    const current = data[index];
    const prev = data[index - 1];
    io.emit("setQuestion", id, index, prev);
    io.emit("setQuestion", id, index - 1, current);
  };

  const moveDown = (index: number) => {
    const current = data[index];
    const next = data[index + 1];
    io.emit("setQuestion", id, index, next);
    io.emit("setQuestion", id, index + 1, current);
  };

  const removeQuestion = (index: number) => {
    io.emit("removeQuestion", id, index);
  };

  const [questions] = useAutoAnimate();

  return (
    <div className="flex lg:flex-col flex-col-reverse gap-4">
      <ScrollArea className="h-48">
        <div className="flex flex-col gap-2" ref={questions}>
          {data.map((question, idx) => (
            <div
              key={idx}
              className="bg-white/60 py-3 px-4 border-2 border-stone-800 rounded-md group flex items-center justify-between gap-8 transition-opacity"
            >
              <p className="font-medium">{question}</p>
              {props.isHost && <div className="group-hover:opacity-100 opacity-0 gap-2 flex">
                <Button size="icon" onClick={() => moveUp(idx)} disabled={idx === 0}>
                  <ChevronUpIcon className="h-4 w-4" />
                </Button>
                <Button size="icon" onClick={() => moveDown(idx)} disabled={idx === data.length - 1}>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => removeQuestion(idx)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>}
            </div>
          ))}
        </div>
      </ScrollArea>
      {props.isHost && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center mb-4"
          >
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input
                        {...field}
                        placeholder="Thoughtful and interesting question..."
                      />
                      <Button type="submit">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-rose-900" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
    </div>
  );
};

export const RoomView = () => {
  const { id } = roomRoute.useParams();
  const { data, refetch } = useSuspenseQuery(memberListQuery(id));
  const queryClient = useQueryClient();

  const newUserHandler = useCallback(
    (user: z.infer<typeof userSchema>) => {
      queryClient.setQueryData(["room-members", id], {
        ...data,
        users: [...data.users, user],
      });
    },
    [queryClient, data, id]
  );

  const userLeaveHandler = useCallback(refetch, [refetch]);

  useIoEvent({
    eventName: "newUser",
    handler: newUserHandler,
  });

  useIoEvent({
    eventName: "userLeft",
    handler: userLeaveHandler,
  });

  const router = useRouter();
  const io = useIo();

  useEffect(() => {
    router.subscribe("onBeforeLoad", (data) => {
      if (!data.toLocation.pathname.startsWith("/room/")) {
        io.emit("leaveRoom", id);
      }
    });
  }, [router, io, id]);

  const [users] = useAutoAnimate();

  return (
    <main className="h-screen flex items-center">
      <div className="flex flex-col justify-center gap-8 w-[95%] mx-auto md:w-1/2 bg-orange-500/25 rounded-3xl h-max px-8 py-16 border-4 border-stone-800 shadow-rose-700 shadow-md">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-4xl font-semibold font-whosit">
            Welcome to the Room
          </h1>
          <p className="font-medium font-mono text-2xl">Join Code: {id}</p>
        </div>
        <div className="flex gap-4 flex-col-reverse lg:flex-row">
          <div className="flex-1">
            <p className="text-2xl mb-4 font-medium">
              Players: <span className="font-mono">{data.users.length}/8</span>
            </p>
            <div className="flex flex-col gap-2" ref={users}>
              {data.users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white/60 py-3 px-4 border-2 border-stone-800 rounded-md"
                >
                  <p className="text-lg font-medium">{user.name}</p>
                  {user.id === data.hostId && (
                    <p className="font-semibold text-emerald-700">Host</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-[2]">
            <p className="text-2xl font-medium mb-4">Questions</p>
            <Suspense fallback={<p>Loading questions...</p>}>
              <QuestionEditor isHost={data.hostId === io.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
};
