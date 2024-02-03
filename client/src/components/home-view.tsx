import { getRouteApi } from "@tanstack/react-router";

const indexRoute = getRouteApi("/");

export const HomeView = () => {
  const data = indexRoute.useLoaderData();

  return (
    <div>
      <h1>Index Route</h1>
      <p>{data.message}</p>
    </div>
  );
};
