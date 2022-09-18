import React, { useMemo } from "react";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { Map } from "./Map";
import { Login } from "./Login";
import { Paths } from "./paths";
import { useSessionStore } from "./SessionContext";

export const Routes: React.FC = () => {
  const isLoggedIn = useSessionStore((s) => s.isLoggedIn);

  const router = useMemo(
    () =>
      createBrowserRouter(
        isLoggedIn
          ? [
              {
                path: Paths.main,
                element: <Map />,
              },

              {
                path: "/*",
                loader: () => redirect(Paths.main),
              },
            ]
          : [
              {
                path: Paths.login,
                element: <Login />,
              },
              {
                path: "/*",
                loader: () => redirect(Paths.login),
              },
            ]
      ),
    [isLoggedIn]
  );

  return <RouterProvider router={router} />;
};
