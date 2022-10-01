import React from "react";
import { useSessionStore } from "../SessionContext";
import logo from "../resources/logo.svg";

// TODO: typescript-plugin-css-modules doesn't work
import styles from "./GlobalNavbar.module.scss";

export const GlobalNavbar: React.FC = () => {
  const isLoggedIn = useSessionStore((s) => s.isLoggedIn);
  const logout = useSessionStore((s) => s.logout);
  const user = useSessionStore((s) => s.user);

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbar}>
        <img src={logo} alt="logo" className={styles.logo} />
        <div className={styles.navMenu}>
          {isLoggedIn ? (
            <>
              <span>{user?.username}</span>
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
