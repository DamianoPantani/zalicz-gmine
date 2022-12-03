import cookie from "cookie";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IncomingHttpHeaders } from "http";

import { ZGApiError } from "./ZGApiError";
import { SessionResponse } from "./types/shared";

const authCookieKey = "ZALICZGMINEPL";

export const getAuthToken = (headers: IncomingHttpHeaders): string => {
  const token = headers.authorization?.split("Bearer ")[1];

  if (!token) {
    throw new ZGApiError("NO_AUTH_TOKEN_PROVIDED");
  }

  return token;
};

export const parseAuthCookie = (
  headers: AxiosResponse["headers"]
): SessionResponse => {
  const cookies = headers["set-cookie"];
  const authCookie = cookies?.find((c) => c.includes(authCookieKey));

  if (!authCookie) {
    throw new ZGApiError("NO_COOKIE_RETRIEVED");
  }

  const { [authCookieKey]: authToken } = cookie.parse(authCookie);

  if (!authToken) {
    throw new ZGApiError("INVALID_COOKIE_RETRIEVED");
  }

  return { authToken };
};

export const requestOptions = (cookie = ""): AxiosRequestConfig => {
  return {
    headers: {
      cookie: cookie ? `${authCookieKey}=${cookie}` : false,
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 OPR/93.0.0.0",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "application/json",
    },
  };
};
