import { Session, User } from "./types";
import { createSession } from "./token";
import { getCheckedGminas } from "./dao";

export const initializeSession = async (user: User): Promise<Session> => {
  const authToken = createSession(user); // recreates token every time, to extend expiration time

  const checkedGminas = await getCheckedGminas();

  return {
    authToken,
    user,
    checkedGminas,
  };
};
