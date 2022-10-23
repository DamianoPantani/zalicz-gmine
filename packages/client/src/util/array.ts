type SplitArray<T> = [T[], T[]];

export const splitBy = <T>(
  values: T[],
  predicate: (value: T) => boolean
): SplitArray<T> => {
  return values.reduce<SplitArray<T>>(
    (result, value) => {
      const [yes, no] = result;

      predicate(value) ? yes.push(value) : no.push(value);

      return result;
    },
    [[], []]
  );
};

export const diff = <T>(values: T[], valuesToRemove: T[]): T[] => {
  return values.filter((v) => !valuesToRemove.includes(v));
};
