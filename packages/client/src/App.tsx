import React, { useEffect, useState } from "react";
import { isUserLoggedIn } from "./api";
import { Routes } from "./Routes";

export const App: React.FC = () => {
  const [isSessionInitialized, setSessionInitialized] = useState(false);

  useEffect(() => {
    isUserLoggedIn()
      .then((isLoggedIn) => console.log(isLoggedIn))
      .finally(() => setSessionInitialized(true));
  }, []);

  return isSessionInitialized ? <Routes /> : null; // TODO: loading spinner
};
