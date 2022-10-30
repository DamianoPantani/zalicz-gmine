import React from "react";

import "reset-css/reset.css";
import { Routes } from "./components/core/Routes";
import { SessionProvider } from "./components/core/SessionContext";
import { SessionInitializer } from "./components/core/SessionInitializer";

import "./css/rootVariables.scss";
import "./css/main.scss";

export const App: React.FC = () => {
  return (
    <SessionProvider>
      <SessionInitializer>
        <Routes />
      </SessionInitializer>
    </SessionProvider>
  );
};
