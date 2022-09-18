import React from "react";
import { Routes } from "./Routes";
import { SessionProvider } from "./SessionContext";
import { SessionInitializer } from "./SessionInitializer";

export const App: React.FC = () => {
  return (
    <SessionProvider>
      <SessionInitializer>
        <Routes />
      </SessionInitializer>
    </SessionProvider>
  );
};
