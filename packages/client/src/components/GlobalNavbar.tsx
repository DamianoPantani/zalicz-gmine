import React from "react";
import { useSessionStore } from "../SessionContext";

// TODO: Scss modules VS Code / TS plugin
import styles from "./GlobalNavbar.module.scss";

export const GlobalNavbar: React.FC = () => {
  const isLoggedIn = useSessionStore((s) => s.isLoggedIn);
  const logout = useSessionStore((s) => s.logout);

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbar}>
        <div>logo - todo</div>
        <div className={styles.navMenu}>
          {isLoggedIn ? (
            <>
              <span>username - todo</span>
              <span>map - todo</span>
              <span onClick={logout}>Wyloguj</span>
            </>
          ) : (
            <>
              <span>login</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
