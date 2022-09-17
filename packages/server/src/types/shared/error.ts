export enum ErrorType {
  INVALID_COOKIE_RETRIEVED = "INVALID_COOKIE_RETRIEVED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  NO_COOKIE_RETRIEVED = "NO_COOKIE_RETRIEVED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export type UIError = {
  type: ErrorType;
  detailsString?: string;
};