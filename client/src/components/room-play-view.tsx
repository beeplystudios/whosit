import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { useZodForm } from "@/lib/hooks/use-zod-form";
import { z } from "zod";
import { Textarea } from "./ui/textarea";

export const RoomPlayView = () => {
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
