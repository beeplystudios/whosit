import { getRouteApi } from "@tanstack/react-router";
import FactCard from "./factCard";

const indexRoute = getRouteApi("/");

export const HomeView = () => {
  const data = indexRoute.useLoaderData();

  return (
    <div className="">
      <FactCard 
        facts={[
          "I ate a slug as a kid, it was on purpose",
          "I still do it sometimes, you know",
          "nobody ever understands",
          "I'm slug man"
        ]}
        guesses={[
          "slugman",
          "slugman",
          "lucy"
        ]}
      />
      <p>{data.message}</p>
    </div>
  );
};
