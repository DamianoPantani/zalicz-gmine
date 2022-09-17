import axios, { AxiosRequestConfig } from "axios";
import { CookieOptions, RequestHandler } from "express";
import cookie from "cookie";
import { LoginRequest } from "./types/shared";
import { ZGApiError } from "./ZGApiError";
import { ErrorType } from "./types/shared/error";
import { flatten, ParsedObject } from "./utils";

type ZGCookie = {
  authToken: string;
  options: CookieOptions;
};

const authCookieKey = "ZALICZGMINEPL";

const ZGApi = axios.create({
  baseURL: "https://zaliczgmine.pl",
});

export const createNewSessionCookie = async (): Promise<ZGCookie> => {
  const { headers } = await ZGApi.get("/", requestOptions());
  const zgCookies = headers["set-cookie"]?.[0];

  if (!zgCookies) {
    throw new ZGApiError(ErrorType.NO_COOKIE_RETRIEVED);
  }

  const { expires, path, [authCookieKey]: authToken } = cookie.parse(zgCookies);

  if (!authToken) {
    throw new ZGApiError(ErrorType.INVALID_COOKIE_RETRIEVED);
  }

  return {
    authToken,
    options: {
      expires: new Date(expires),
      path,
      secure: true,
    },
  };
};

export const loginToZG = async (
  loginForm: LoginRequest,
  authToken: string
): Promise<number> => {
  const { password, username } = loginForm;
  const { request } = await ZGApi.post(
    "/users/login",
    zgDataString({ User: { username, password } }),
    requestOptions(authToken)
  );

  const { path: redirectUrl } = request;

  if (redirectUrl.startsWith("/users/view/")) {
    return +redirectUrl.split("/users/view/")[1];
  }

  throw new ZGApiError(ErrorType.INVALID_CREDENTIALS);
};

// TODO: implement
// export const checkGminas = async (): Promise<void> => {
//   // data[UsersCommune][1512]: 0
//   // data[UsersCommune][1513]: 0
//   // data[UsersCommune][commune_add_date][month]: 09
//   // data[UsersCommune][commune_add_date][day]: 17
//   // data[UsersCommune][commune_add_date][year]: 2022
//   // data[UsersCommune][sender]: list
//   // data[UsersCommune][updateData]: {"1423":"d","1424":"a"}
//   // data[UsersCommune][voivodeship]: 9

//   await ZGApi.post(
//     "/users_communes/addmulti",
//     requestBody({ User: { username: "test", password: "test2" } }),
//     requestOptions(authToken)
//   );
// };

export const zgDataString = (data: ParsedObject) =>
  encodeURI(`${flatten({ data }).join("&")}`);

const requestOptions = (cookie = ""): AxiosRequestConfig => {
  return {
    headers: {
      cookie: cookie ? `${authCookieKey}=${cookie}` : false,
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 OPR/90.0.4480.84",
    },
  };
};
