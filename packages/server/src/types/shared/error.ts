// Backend side enums declared as union types, so they can be shared with Frontend app
export type ErrorType =
  | "INVALID_COOKIE_RETRIEVED"
  | "INVALID_CREDENTIALS"
  | "NO_AUTH_TOKEN_PROVIDED"
  | "NO_COOKIE_RETRIEVED"
  | "SESSION_EXPIRED"
  | "UNKNOWN_ERROR";

export type UIError = {
  type: ErrorType;
  detailsString?: string;
};
