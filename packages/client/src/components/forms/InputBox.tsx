import React, { PropsWithChildren, ReactElement } from "react";
import cx from "classnames";

import styles from "./InputBox.module.scss";

type Props = {
  onClick?(): void;
  className?: string;
};

export const InputBox = ({
  children,
  onClick,
  className,
}: PropsWithChildren<Props>): ReactElement => {
  return (
    <div onClick={onClick} className={cx(styles.inputBox, className)}>
      {children}
    </div>
  );
};
