import { getUserByEmailAndPassword, getUserById } from "./dao";
import { initializeSession } from "./session";
import { LoginRequest } from "./types/shared";
import { ZGRequestHandler } from "./types/express";

export const continueSession: ZGRequestHandler = (_req, res) => {
  const session = res.locals;

  session.isInitialized &&
    getUserById(session.user.id)
      .then((user) => initializeSession(user))
      .then((session) => res.json(session))
      .catch((error) => res.status(400).json({ error }));
};

export const loginUser: ZGRequestHandler<LoginRequest> = (req, res) => {
  getUserByEmailAndPassword(req.body)
    .then((user) => initializeSession(user))
    .then((session) => res.json(session))
    .catch((error) => res.status(400).json({ error }));
};
