import React, { PropsWithChildren } from "react";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import {
  FaRegMap,
  FaRegUserCircle,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useSessionStore } from "../SessionContext";
import { Paths } from "../paths";
import logo from "../resources/logo.svg";

// TODO: typescript-plugin-css-modules doesn't work
import styles from "./GlobalNavbar.module.scss";

type NavItemProps = {
  onClick?(): void;
  goTo?: Paths;
  Icon: IconType;
};

export const GlobalNavbar: React.FC = () => {
  const isLoggedIn = useSessionStore((s) => s.isLoggedIn);
  const logout = useSessionStore((s) => s.logout);
  const user = useSessionStore((s) => s.user);
  const { t } = useTranslation();

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbar}>
        <img src={logo} alt="logo" className={styles.logo} />
        <div className={styles.navMenu}>
          {isLoggedIn ? (
            <>
              <NavItem Icon={FaRegUserCircle}>{user?.username}</NavItem>
              <NavItem Icon={FaRegMap} goTo={Paths.main}>
                {t("nav.map")}
              </NavItem>
              <NavItem Icon={FaSignOutAlt} onClick={logout}>
                {t("nav.logout")}
              </NavItem>
            </>
          ) : (
            <>
              <NavItem Icon={FaSignInAlt} goTo={Paths.main}>
                {t("nav.login")}
              </NavItem>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const NavItem: React.FC<PropsWithChildren<NavItemProps>> = ({
  children,
  onClick,
  goTo,
  Icon,
}) => {
  // TODO: isCurrent = not clickable and another style

  return (
    <a
      className={cx(styles.navItem, (!goTo && !onClick) && styles.noAction)}
      href={goTo}
      onClick={onClick}
    >
      <Icon /> {children}
    </a>
  );
};
