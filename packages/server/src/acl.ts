import { ErrorCode } from "./types/shared";
import { ZGRequestHandler } from "./types/express";

export const acceptLoggedUsersOnly: ZGRequestHandler = (_req, res, next) => {
  return res.locals.isInitialized
    ? next()
    : res.status(400).json({ error: ErrorCode.NOT_LOGGED_IN });
};

export const acceptGuestsOnly: ZGRequestHandler = (_req, res, next) => {
  return !res.locals.isInitialized
    ? next()
    : res.status(400).json({ error: ErrorCode.ALREADY_LOGGED });
};
