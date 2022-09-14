import { ErrorCode } from "./types/enums";
import { ZGRequestHandler } from "./types/session";

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
