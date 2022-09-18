import React, { PropsWithChildren, ReactElement } from "react";
import cx from "classnames";

import styles from "./Button.module.scss";

type Props = PropsWithChildren<{
  onClick?(): void;
  type?: "button" | "submit";
  variant?: ButtonVariants;
  secondary?: boolean; // not supported by `floating`
  disabled?: boolean;
}>;

type ButtonVariants = "main" | "alternative" | "negative" | "positive";

export const Button = ({
  variant = "main",
  type,
  onClick,
  secondary,
  disabled,
  children,
}: Props): ReactElement => {
  const className = cx(
    styles.button,
    styles[variant],
    secondary ? styles.secondary : styles.primary
  );

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
