import React, { PropsWithChildren, useEffect } from "react";
import { useSessionStore } from "./SessionContext";

export const SessionInitializer: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const initializeSession = useSessionStore((s) => s.initialize);
  const isInitializing = useSessionStore((s) => s.isInitializing);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  return isInitializing ? null : <>{children}</>; // TODO: loading spiner
};
