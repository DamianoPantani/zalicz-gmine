import React, { useMemo } from "react";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { MapPROTOTYPE } from "./components/routes/Map";
import { Login } from "./components/routes/Login";
import { Paths } from "./paths";
import { useSessionStore } from "./SessionContext";
import { PageLayout } from "./PageLayout";

export const Routes: React.FC = () => {
  const isLoggedIn = useSessionStore((s) => s.isLoggedIn);

  const router = useMemo(
    () =>
      createBrowserRouter(
        isLoggedIn
          ? [
              {
                path: Paths.map,
                element: <PageLayout Component={MapPROTOTYPE} />,
              },

              {
                path: "/*",
                loader: () => redirect(Paths.map),
              },
            ]
          : [
              {
                path: Paths.login,
                element: <PageLayout Component={Login} />,
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
