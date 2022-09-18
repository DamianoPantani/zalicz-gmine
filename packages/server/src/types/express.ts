import { RequestHandler } from "express";

export type ZGLocals = { authToken: string };

export type ZGRequestHandler<Req = unknown, Res = unknown> = RequestHandler<
  unknown,
  Res,
  Req,
  unknown,
  ZGLocals
>;
