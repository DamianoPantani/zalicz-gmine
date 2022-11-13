import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";

import { Button } from "../forms/Button";

import { ToastState } from "./useToast";
import styles from "./Toast.module.scss";

type ToastProps = {
  toast: ToastState;
};

export const Toast = ({ toast }: ToastProps): ReactElement | null => {
  const toastRoot = document.getElementById("toast-root");
  const { t } = useTranslation();
  const { isOpen, close, content, variant } = toast;

  if (!toastRoot || !isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className={styles.overlay}
      data-overlay
      onClick={(e) => {
        const isOverlayClicked =
          (e.target as HTMLElement).dataset["overlay"] === "true";
        isOverlayClicked && close();
      }}
    >
      <div className={styles.toast}>
        <div className={styles.content}>{content}</div>
        <div className={styles.footer}>
          <Button variant={variant} onClick={close}>
            {t("toast.close")}
          </Button>
        </div>
      </div>
    </div>,
    toastRoot
  );
};
