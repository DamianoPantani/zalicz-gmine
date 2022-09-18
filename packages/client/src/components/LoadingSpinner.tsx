import React, { ReactElement } from "react";
import cx from "classnames";

import styles from "./LoadingSpinner.module.scss";

export type SpinnerProps = {
  size?: "xs" | "sm" | "md" | "lg";
};

export const LoadingSpinner = ({ size = "sm" }: SpinnerProps): ReactElement => {
  const blobClassName = cx(styles.blob, styles[size]);

  return (
    <div className={cx(styles.spinner, styles[size])} data-testid="spinner">
      <div
        className={cx(blobClassName, styles.mainBlob)}
        style={{ animationDelay: "0.45s" }}
      />
      <div className={blobClassName} style={{ animationDelay: "0.3s" }} />
      <div className={blobClassName} style={{ animationDelay: "0.15s" }} />
      <div className={blobClassName} />
    </div>
  );
};
