import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import FactCard from "../components/factCard";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <div>
      Hi there
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
    </div>
  ),
});
