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
import styles from "./Routes.module.scss";

export const Routes: React.FC = () => {
  const isLoggedIn = useSessionStore((s) => s.isLoggedIn);

  const router = useMemo(
    () =>
      createBrowserRouter(
        isLoggedIn
          ? [
              {
                path: Paths.main,
                element: <MapPROTOTYPE />,
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

  return (
    <div className={styles.mainContainer}>
      <RouterProvider router={router} />
    </div>
  );
};
