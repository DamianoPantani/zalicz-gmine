import axios from "axios";
import {
  LoggedUserResponse,
  LoginRequest,
  SessionResponse,
} from "./types/shared";
import { ZGApiError } from "./ZGApiError";
import { ErrorType } from "./types/shared/error";
import { flatten, ParsedObject } from "./utils";
import { parseAuthCookie, requestOptions } from "./auth";
import { parseUser } from "./htmlBodyParser";

const ZGApi = axios.create({
  baseURL: "https://zaliczgmine.pl",
});

export const getUserFromSession = async (
  authToken: string
): Promise<LoggedUserResponse> => {
  const { data } = await ZGApi.get<string>("/", requestOptions(authToken));
  const user = parseUser(data);

  if (user) {
    return { user };
  }

  throw new ZGApiError(ErrorType.SESSION_EXPIRED);
};

export const createNewSessionCookie = async (): Promise<SessionResponse> => {
  const { headers } = await ZGApi.get("/", requestOptions());
  return parseAuthCookie(headers);
};

export const loginToZG = async (
  loginForm: LoginRequest,
  authToken: string
): Promise<LoggedUserResponse> => {
  const { password, username } = loginForm;
  const { data } = await ZGApi.post<string>(
    "/users/login",
    zgDataString({ User: { username, password } }),
    requestOptions(authToken)
  );

  const user = parseUser(data);

  if (user) {
    return { user };
  }

  throw new ZGApiError(ErrorType.INVALID_CREDENTIALS);
};

export const logoutFromZG = async (authToken: string): Promise<void> => {
  await ZGApi.get("/users/logout", requestOptions(authToken));
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
//     zgDataString({ User: { username: "test", password: "test2" } }),
//     requestOptions(authToken)
//   );
// };

const zgDataString = (object: ParsedObject) =>
  encodeURI(`${flatten(object, "data").join("&")}`);
