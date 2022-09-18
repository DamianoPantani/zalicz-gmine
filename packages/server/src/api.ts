import { toUIError } from "./error";
import { ZGRequestHandler } from "./types/express";
import {
  LoginRequest,
  SessionResponse,
  LoggedUserResponse,
} from "./types/shared";
import { UIError } from "./types/shared/error";
import {
  createNewSessionCookie,
  loginToZG,
  getUserFromSession,
  logoutFromZG,
} from "./zgBroker";

export const createSession: ZGRequestHandler<
  unknown,
  SessionResponse | UIError
> = async (_, res) => {
  try {
    const { authToken } = await createNewSessionCookie();
    res.json({ authToken });
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};

export const getLoggedInUser: ZGRequestHandler<
  unknown,
  LoggedUserResponse | UIError
> = async (_req, res) => {
  try {
    const { authToken } = res.locals;
    const user = await getUserFromSession(authToken); // throws if session is expired
    res.json(user);
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};

export const loginUser: ZGRequestHandler<
  LoginRequest,
  LoggedUserResponse | UIError
> = async (req, res) => {
  try {
    const { authToken } = res.locals;
    const user = await loginToZG(req.body, authToken);

    res.json(user);
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};

export const logoutUser: ZGRequestHandler = async (_req, res) => {
  try {
    const { authToken } = res.locals;
    await logoutFromZG(authToken);

    res.send();
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};
