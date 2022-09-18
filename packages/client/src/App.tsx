import React, { useEffect, useState } from "react";
import { getLoggedInUser } from "./api";
import { Routes } from "./Routes";

export const App: React.FC = () => {
  const [isSessionInitialized, setSessionInitialized] = useState(false);

  useEffect(() => {
    getLoggedInUser()
      .then((user) => console.log(user)) // TODO: init session (zustand)
      .catch(() => {
        /* session expired or not initialized, proceed to login page */
      })
      .finally(() => setSessionInitialized(true));
  }, []);

  return isSessionInitialized ? <Routes /> : null; // TODO: loading spinner
};
