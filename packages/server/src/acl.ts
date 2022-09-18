import { getAuthToken } from "./auth";
import { toUIError } from "./error";
import { ZGRequestHandler } from "./types/express";

export const rejectIfNoAuthTokenSet: ZGRequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const authToken = getAuthToken(req.headers);
    res.locals = { authToken };
    next();
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};
