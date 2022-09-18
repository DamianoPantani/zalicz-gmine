import { RequestHandler } from "express";
import { getAuthToken } from "./auth";
import { toUIError } from "./error";
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
} from "./zgBroker";

export const createSession: RequestHandler<
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

export const getLoggedInUser: RequestHandler<
  unknown,
  LoggedUserResponse | UIError
> = async (req, res) => {
  try {
    // TODO: save authToken to local directory !
    const authToken = getAuthToken(req.headers); // throws if auth token is not set
    const user = await getUserFromSession(authToken); // throws if session is expired
    res.json(user);
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};

export const loginUser: RequestHandler<
  unknown,
  LoggedUserResponse | UIError,
  LoginRequest
> = async (req, res) => {
  try {
    const authToken = getAuthToken(req.headers);
    const user = await loginToZG(req.body, authToken);

    res.json(user);
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};
