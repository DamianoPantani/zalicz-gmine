import { RequestHandler } from "express";

export type ZGLocals = { authToken: string };

export type ZGRequestHandler<
  Req = unknown,
  Res = unknown,
  Par = unknown
> = RequestHandler<Par, Res, Req, unknown, ZGLocals>;
