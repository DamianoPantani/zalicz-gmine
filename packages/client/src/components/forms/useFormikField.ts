import { useField } from "formik";

type FormikField<T> = [T, (newValue: T) => void];

// - patches `useField` - `setValue` caused infinite loops

export const useFormikField = <T>(path: string): FormikField<T> => {
  const [{ value }, , { setValue }] = useField<T>(path);

  return [value, setValue];
};
