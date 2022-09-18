import React from "react";
import styles from "./GlobalFooter.module.scss";

export const GlobalFooter: React.FC = () => {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.footer}>
        footer - todo - contact + open source + original app
      </div>
    </div>
  );
};
