import React, { PropsWithChildren } from "react";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import { useLocation, Link } from "react-router-dom";
import { FaRegMap, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

import { useSessionStore } from "../components/core/SessionContext";
import logo from "../resources/logo.svg";

import { Paths } from "./core/paths";
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
  const { t } = useTranslation();

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
        </div>
        <div className={styles.navMenu}>
          {isLoggedIn ? (
            <>
              <NavItem Icon={FaRegMap} goTo={Paths.map}>
                {t("nav.map")}
              </NavItem>
              <NavItem Icon={FaSignOutAlt} onClick={logout}>
                {t("nav.logout")}
              </NavItem>
            </>
          ) : (
            <NavItem Icon={FaSignInAlt} goTo={Paths.login}>
              {t("nav.login")}
            </NavItem>
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
  const { pathname } = useLocation();
  const isCurrentRoute = pathname === goTo || pathname === `${goTo}/`;

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      className={cx(
        styles.navItem,
        isCurrentRoute || (!goTo && !onClick) ? styles.noAction : undefined,
        isCurrentRoute && styles.current
      )}
      to={{ pathname: isCurrentRoute ? undefined : goTo }}
      onClick={onClick}
    >
      <Icon /> <span>{children}</span>
    </Link>
  );
};
