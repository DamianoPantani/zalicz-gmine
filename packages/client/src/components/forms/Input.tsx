import React, { ReactElement, useCallback } from "react";

import styles from "./Input.module.scss";

type Props = {
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export const Input = ({
  type,
  placeholder,
  value,
  onChange,
}: Props): ReactElement => {
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => onChange?.(e.target.value),
    [onChange]
  );

  return (
    <div className={styles.inputBox}>
      <input
        placeholder={placeholder}
        className={styles.input}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </div>
  );
};
