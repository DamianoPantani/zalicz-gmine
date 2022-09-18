import { User } from "./model";

export type LoginRequest = { username: string; password: string };

export type SessionResponse = { authToken: string };

export type LoggedUserResponse = { user: User };
