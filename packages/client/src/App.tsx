import React from "react";
import "reset-css/reset.css";
import { Routes } from "./Routes";
import { SessionProvider } from "./SessionContext";
import { SessionInitializer } from "./SessionInitializer";

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
