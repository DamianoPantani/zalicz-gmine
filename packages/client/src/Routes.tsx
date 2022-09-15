import React, { useMemo } from "react";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { useSessionStore } from "./SessionProvider";
import { Map } from "./Map";

export const Routes: React.FC = () => {
  const isLoggedIn = useSessionStore((s) => s.isLoggedIn);

  const router = useMemo(
    () =>
      createBrowserRouter(
        isLoggedIn
          ? [
              {
                path: "/",
                element: <Map />,
              },
              {
                path: "/*",
                loader: () => redirect("/"),
              },
            ]
          : [
              {
                path: "/login",
                element: <h1>TODO - Login</h1>,
              },
              {
                path: "/*",
                loader: () => redirect("/login"),
              },
            ]
      ),
    [isLoggedIn]
  );

  return <RouterProvider router={router} />;
};
