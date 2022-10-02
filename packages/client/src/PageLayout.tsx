import React from "react";
import { GlobalFooter } from "./components/GlobalFooter";
import { GlobalNavbar } from "./components/GlobalNavbar";
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
