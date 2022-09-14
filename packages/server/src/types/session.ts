import type { RequestHandler } from "express";
import { CheckedGmina, User } from "./types";

export type JWTSession = {
  authToken: string;
  user: User;
  checkedGminas: CheckedGmina[];
};

export type Session =
  | {
      isInitialized: true;
      user: User;
    }
  | {
      isInitialized: false;
    };

export type ZGRequestHandler<P = unknown, R = unknown> = RequestHandler<
  unknown,
  R,
  P,
  unknown,
  Session
>;
