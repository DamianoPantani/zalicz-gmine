import { RequestHandler } from "express-serve-static-core";
import { Error } from "./enums";

export const acceptLoggedUsersOnly: RequestHandler = (req, res, next) => {
  return req.session.user
    ? next()
    : res.status(400).json({ error: Error.NOT_LOGGED_IN });
};

export const acceptGuestsOnly: RequestHandler = (req, res, next) => {
  return !req.session.user
    ? next()
    : res.status(400).json({ error: Error.ALREADY_LOGGED });
};
