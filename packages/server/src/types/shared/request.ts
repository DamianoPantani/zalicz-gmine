export type LoginRequest = { username: string; password: string };

export type SessionResponse = { authToken: string };

export type SessionValidityResponse = { isSessionValid: boolean };
