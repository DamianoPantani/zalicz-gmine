import { RequestHandler } from "express";
import { getAuthToken } from "./auth";
import { toUIError } from "./error";
import {
  LoginRequest,
  SessionResponse,
  SessionValidityResponse,
} from "./types/shared";
import { UIError } from "./types/shared/error";
import { createNewSessionCookie, loginToZG, validateSession } from "./zgBroker";

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

export const isSessionValid: RequestHandler<
  unknown,
  SessionValidityResponse
> = async (req, res) => {
  try {
    // TODO: save authToken to local directory !
    const authToken = getAuthToken(req.headers); // throws if auth token is not set
    await validateSession(authToken); // throws if session is expired
    res.json({ isSessionValid: true });
  } catch {
    res.json({ isSessionValid: false });
  }
};

// TODO: response type
export const loginUser: RequestHandler<unknown, unknown, LoginRequest> = async (
  req,
  res
) => {
  try {
    const authToken = getAuthToken(req.headers);
    const userId = await loginToZG(req.body, authToken);

    res.json({ userId });
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};
