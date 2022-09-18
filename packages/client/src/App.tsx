import React from "react";
import "reset-css/reset.css";
import { GlobalFooter } from "./components/GlobalFooter";
import { GlobalNavbar } from "./components/GlobalNavbar";
import { Routes } from "./Routes";
import { SessionProvider } from "./SessionContext";
import { SessionInitializer } from "./SessionInitializer";

import "./css/rootVariables.scss";
import "./css/main.scss";

export const App: React.FC = () => {
  return (
    <SessionProvider>
      <SessionInitializer>
        <GlobalNavbar />
        <Routes />
        <GlobalFooter />
      </SessionInitializer>
    </SessionProvider>
  );
};
