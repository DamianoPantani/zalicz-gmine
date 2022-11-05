import React, { PropsWithChildren, ReactElement } from "react";
import cx from "classnames";

import { LoadingSpinner } from "../LoadingSpinner";

import styles from "./Button.module.scss";

type Props = PropsWithChildren<{
  onClick?(): void;
  type?: "button" | "submit";
  variant?: ButtonVariants;
  secondary?: boolean; // not supported by `floating`
  disabled?: boolean;
  isLoading?: boolean;
}>;

export type ButtonVariants = "main" | "alternative" | "negative" | "positive";

export const Button = ({
  variant = "main",
  type,
  onClick,
  secondary,
  disabled,
  isLoading,
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
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
    >
      {isLoading && <LoadingSpinner size="xs" />}
      {children}
    </button>
  );
};
