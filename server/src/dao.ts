import { query } from "./db";
import { LoginRequest } from "./types/request";
import { CheckedGmina, User } from "./types/types";

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
