import React from "react";
import { GlobalFooter } from "./components/GlobalFooter";
import { GlobalNavbar } from "./components/GlobalNavbar";
import { Routes } from "./Routes";
import { SessionProvider } from "./SessionContext";
import { SessionInitializer } from "./SessionInitializer";

import "./css/global.scss";

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
