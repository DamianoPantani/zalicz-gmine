import { query } from "./db";
import { LoginRequest, CheckedGmina, User } from "./types/shared";

export const getCheckedGminas = (): Promise<CheckedGmina[]> => {
  return Promise.resolve([]); // TODO
};

export const getUserByEmailAndPassword = async ({
  email,
  password,
}: LoginRequest): Promise<User> => {
  const now = await query("SELECT NOW()");

  console.log(now);

  // TODO
  return Promise.resolve({ email, id: 0, userName: password });
};

export const getUserById = async (id: number): Promise<User> => {
  const now = await query("SELECT NOW()");

  console.log(now);

  // TODO
  return Promise.resolve({ email: "", id, userName: "" });
};
