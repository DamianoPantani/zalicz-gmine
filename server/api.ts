import express from "express";
import { acceptGuestsOnly } from "./acl";
import { getUserByEmailAndPassword } from "./dao";
import { initializeSession } from "./session";

export const api = express.Router();

api.post("/api/session", acceptGuestsOnly, (req, res) => {
  getUserByEmailAndPassword(req.body)
    .then((user) => initializeSession(user))
    .then((session) => res.json(session))
    .catch((error) => res.status(400).json({ error }));
});
