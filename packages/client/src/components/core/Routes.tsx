import React, { useEffect, useMemo, useState } from "react";
import {
  createBrowserRouter,
  redirect,
  RouteObject,
  RouterProvider,
} from "react-router-dom";

import { Map } from "../routes/Map";
import { Login } from "../routes/Login";
import { Contact } from "../routes/Contact";

import { Paths } from "./paths";
import { useSessionStore } from "./SessionContext";
import { PageLayout } from "./PageLayout";

const defaultCommonPaths: RouteObject[] = [
  {
    path: Paths.contact,
    element: <PageLayout Component={Contact} />,
  },
];

export const Routes: React.FC = () => {
  const isLoggedIn = useSessionStore((s) => s.isLoggedIn);
  const [commonPaths = defaultCommonPaths, setCommonPaths] =
    useState<RouteObject[]>();

  const router = useMemo(
    () =>
      createBrowserRouter(
        isLoggedIn
          ? [
              ...commonPaths,

              {
                path: Paths.map,
                element: <PageLayout minimal Component={Map} />,
              },

              {
                path: "/*",
                loader: () => redirect(Paths.map),
              },
            ]
          : [
              ...commonPaths,

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
    [isLoggedIn, commonPaths]
  );

  useEffect(() => {
    if (!isLoggedIn) {
      // Delete common paths so only `login` page is accessible for guests
      // Then in the next animation frame, recreate common paths
      // This is a hack - we want to redirect users to login page after they log out, regardless they are on a guest or common route
      setCommonPaths((prevPaths) => (prevPaths ? [] : defaultCommonPaths));
      setTimeout(() => setCommonPaths(defaultCommonPaths));
    }
  }, [isLoggedIn]);

  return <RouterProvider router={router} />;
};
