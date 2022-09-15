import React, { useEffect } from "react";
import { Routes } from "./Routes";
import { SessionProvider, useSessionStore } from "./SessionProvider";

export const App: React.FC = () => {
  return (
    <SessionProvider>
      <AppInitializer />
    </SessionProvider>
  );
};

const AppInitializer = () => {
  const initializeSession = useSessionStore((s) => s.continueSession);
  const isInitializing = useSessionStore((s) => s.isInitializing);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  return isInitializing ? null : <Routes />;
};
