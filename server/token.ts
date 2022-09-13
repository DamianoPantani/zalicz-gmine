import { RequestHandler } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { Session, User } from "./types";

const jwtSecret = process.env.JWT_SECRET ?? "no-token"; // TODO: ensure it's set

 export const decodeSession: RequestHandler<Session> = (req, res, next) => {
    const token = (req.headers["x-access-token"] ?? "") as string;
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      req.session = err ? {} : decodedToken;
      next();
    });
  },


export const createSession = (user: User) => jwt.sign(user, jwtSecret, { expiresIn: "5d" });


