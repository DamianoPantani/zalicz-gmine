import { useField } from "formik";
import { useCallback } from "react";

type FormikField<T> = [T, (newValue: T | undefined) => void];

// - patches `useField` - `setValue` caused infinite loops

export const useFormikField = <T>(path: string): FormikField<T> => {
  const [{ value }, , { setValue }] = useField<T>(path);

  const patchedSetValue = useCallback(
    (newValue: T | undefined) => {
      newValue && value !== newValue && setValue(newValue);
    },
    [setValue, value]
  );

  return [value, patchedSetValue];
};
