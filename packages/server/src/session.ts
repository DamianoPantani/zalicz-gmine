import jwt from "jsonwebtoken";
import { ZGRequestHandler } from "./types/express";
import { UISession, User } from "./types/shared";
import { getCheckedGminas } from "./dao";

const getSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("No JWT_SECRET env variable set");
  }

  return jwtSecret;
};

export const decodeSession: ZGRequestHandler = (req, res, next) => {
  const token = (req.headers["x-access-token"] ?? "") as string;
  jwt.verify(token, getSecret(), (err, decodedToken) => {
    res.locals = err
      ? { isInitialized: false }
      : { isInitialized: true, user: decodedToken as User };
    next();
  });
};

const createSession = (user: User) =>
  jwt.sign(user, getSecret(), { expiresIn: "5d" });

export const initializeSession = async (user: User): Promise<UISession> => {
  const authToken = createSession(user); // recreates token every time, to extend expiration time
  const checkedGminas = await getCheckedGminas();

  return {
    authToken,
    user,
    checkedGminas,
  };
};
