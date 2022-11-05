import { useState, useCallback, ReactElement, ReactNode } from "react";

import { ButtonVariants } from "../forms/Button";

type ToastOpen = (content: ReactElement | ReactNode) => void;

export type ToastState = {
  isOpen: boolean;
  variant: ButtonVariants;
  content: ReactElement | ReactNode | undefined;
  openSuccess: ToastOpen;
  openError: ToastOpen;
  close(): void;
};

export const useToast = (): ToastState => {
  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState<ButtonVariants>("positive");
  const [content, setContent] = useState<ReactElement | ReactNode>();

  const openSuccess: ToastOpen = useCallback((content) => {
    setContent(content);
    setVariant("positive");
    setIsOpen(true);
  }, []);
  const openError: ToastOpen = useCallback((content) => {
    setContent(content);
    setVariant("negative");
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setContent(undefined);
    setIsOpen(false);
  }, []);

  return { isOpen, openError, openSuccess, variant, close, content };
};
