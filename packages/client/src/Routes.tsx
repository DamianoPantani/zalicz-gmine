import React, { useMemo } from "react";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { Map } from "./Map";
import { Login } from "./Login";

export const Routes: React.FC = () => {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "/",
          element: <Map />,
        },

        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/*",
          loader: () => redirect("/login"),
        },
      ]),
    []
  );

  return <RouterProvider router={router} />;
};
