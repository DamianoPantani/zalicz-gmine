export default class LocalStorage<T> {
  constructor(private key: string) {}

  get = (): T | undefined => {
    const value = localStorage.getItem(this.key);
    if (value === "undefined" || typeof value === "undefined") {
      return undefined;
    }

    return JSON.parse(value as string) as T;
  };

  set = (value: T): void => {
    localStorage.setItem(this.key, JSON.stringify(value));
  };

  clear = (): void => localStorage.removeItem(this.key);
}
