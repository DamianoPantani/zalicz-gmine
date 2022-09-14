import express from "express";
import { getUserByEmailAndPassword } from "./dao";
import { initializeSession } from "./session";
import { LoginRequest } from "./types/request";
import { ZGRequestHandler } from "./types/session";

export const api = express.Router();

export const loginUser: ZGRequestHandler<LoginRequest> = (req, res) => {
  getUserByEmailAndPassword(req.body)
    .then((user) => initializeSession(user))
    .then((session) => res.json(session))
    .catch((error) => res.status(400).json({ error }));
};
