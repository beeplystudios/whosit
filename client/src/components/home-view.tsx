import { getRouteApi } from "@tanstack/react-router";
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
    <div className="">
      <FactCardGrid factses={factses} guesseses={guesseses} />
      <p>{data.message}</p>
    </div>
  );
};
