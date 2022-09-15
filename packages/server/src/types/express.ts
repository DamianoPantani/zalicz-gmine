import type { RequestHandler } from "express";
import { User } from "./shared";

export type JWTSession =
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
  JWTSession
>;
