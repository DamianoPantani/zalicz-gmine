import React from "react";

import { GlobalFooter } from "../GlobalFooter";
import { GlobalNavbar } from "../GlobalNavbar";

import styles from "./PageLayout.module.scss";

type Props = {
  Component: React.FC;
};

export const PageLayout: React.FC<Props> = ({ Component }) => {
  return (
    <>
      <GlobalNavbar />
      <div className={styles.mainContainer}>
        <Component />
      </div>
      <GlobalFooter />
    </>
  );
};
