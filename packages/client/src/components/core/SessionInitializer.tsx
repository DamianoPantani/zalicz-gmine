import React, { PropsWithChildren, useEffect } from "react";
import { useSessionStore } from "./SessionContext";
import { LoadingSpinner } from "../LoadingSpinner";

import styles from "./SessionInitializer.module.scss";

export const SessionInitializer: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const initializeSession = useSessionStore((s) => s.initialize);
  const isInitializing = useSessionStore((s) => s.isInitializing);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  return isInitializing ? (
    <div className={styles.fullPage}>
      <LoadingSpinner size="lg" />
    </div>
  ) : (
    <div className={styles.pageLayout}>{children}</div>
  );
};
