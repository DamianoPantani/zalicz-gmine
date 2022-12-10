import React from "react";
import cx from "classnames";

import { GlobalFooter } from "../GlobalFooter";
import { GlobalNavbar } from "../GlobalNavbar";

import styles from "./PageLayout.module.scss";

type Props = {
  minimal?: boolean;
  Component: React.FC;
};

export const PageLayout: React.FC<Props> = ({ minimal, Component }) => {
  return (
    <>
      <GlobalNavbar />
      <div className={cx(styles.mainContainer, minimal && styles.minimal)}>
        <Component />
      </div>
      <GlobalFooter />
    </>
  );
};
