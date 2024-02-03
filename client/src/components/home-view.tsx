import { getRouteApi } from "@tanstack/react-router";
import { CreateRoom } from "./create-room";
import FactCardGrid from "./factCardGrid";

const indexRoute = getRouteApi("/");

export const HomeView = () => {
  const data = indexRoute.useLoaderData();

  const factses = [
    [
      "I ate a slug as a kid, it was on purpose",
      "I still do it sometimes, you know",
      "nobody ever understands",
      "I'm slug man",
    ],
    [
      "I didn't eat anything particularly weird as a kid, besides a worm",
      "I still do it sometimes, you know",
      "nobody ever understands",
      "I'm worm man",
    ],
    [
      "I ate a your mom's ass as a kid, it was on purpose",
      "I still do it sometimes, you know",
      "nobody ever understands",
      "I'm you're mom's as's man",
    ],
  ];

  const guesseses = [
    ["slugman", "slugman", "lucy"],
    ["wormman", "wormman", "janet"],
    ["you'remom'sass'sman", "you'remom'sass'sman", "eleanor"],
  ];

  return (
    <main className="h-screen flex items-center">
      <div className="flex items-center justify-center bg-white/60 rounded-3xl w-1/2 mx-auto h-max p-8 border-4 border-black shadow-rose-700 shadow-md">
        <h1 className="text-4xl font-semibold">WhosIt!</h1>
      </div>
      {/* <FactCardGrid factses={factses} guesseses={guesseses} />
      <p>{data.message}</p>
      <CreateRoom /> */}
    </main>
  );
};
