import { RequestHandler } from "express";
import { toUIError } from "./error";
import { LoginRequest } from "./types/shared";
import { createNewSessionCookie, loginToZG } from "./zgBroker";

export const loginUser: RequestHandler<unknown, unknown, LoginRequest> = async (
  req,
  res
) => {
  try {
    const { authToken, options } = await createNewSessionCookie();
    const userId = await loginToZG(req.body, authToken);

    res.cookie("authToken", authToken, options).json({ userId });
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};
