import { RequestHandler } from "express";
import { getAuthToken } from "./auth";
import { toUIError } from "./error";

export const rejectIfNoAuthTokenSet: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    getAuthToken(req.headers);
    next();
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};
