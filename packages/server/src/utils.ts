export type InputValue = string | number | boolean | undefined | null;
export type ParsedValue = InputValue | InputValue[] | ParsedObject;
export type ParsedObject = { [key in string]: ParsedValue };

// Own implementation - see this post for explanation: https://stackoverflow.com/a/73756668/4060922
export const flatten = (object: ParsedObject, parent?: string): string[] => {
  let results: string[] = [];

  for (let key in object) {
    const value = object[key];
    const thisKey = parent ? `${parent}[${key}]` : `${key}`;

    results = results.concat(
      isObject(value) ? flatten(value, thisKey) : `${thisKey}=${value}`
    );
  }

  return results;
};

const isObject = (obj: ParsedValue): obj is ParsedObject => {
  return !!obj && typeof obj === "object" && !Array.isArray(obj);
};
