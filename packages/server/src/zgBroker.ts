import axios from "axios";

import {
  LoggedUserResponse,
  LoginRequest,
  SessionResponse,
  UpdateStatusRequest,
  UserGminasStatus,
} from "./types/shared";
import { ZGApiError } from "./ZGApiError";
import { flatten, ParsedObject } from "./utils";
import { parseAuthCookie, requestOptions } from "./auth";
import { parseGminasCSV, parseUser } from "./htmlBodyParser";

const ZGApi = axios.create({
  baseURL: "https://zaliczgmine.pl",
});

const tokenlessHeaders = requestOptions();

export const zgApi = {
  createNewSessionCookie: async (): Promise<SessionResponse> => {
    const { headers } = await ZGApi.get("/", tokenlessHeaders);
    return parseAuthCookie(headers);
  },

  getCheckedGminaIds: async (userId: string): Promise<UserGminasStatus> => {
    const { data: rawCsv } = await ZGApi.get(
      `/files/users-communes/users-communes-${userId}.csv`,
      tokenlessHeaders
    );

    const parsedCsv = parseGminasCSV(rawCsv);
    const checkedGminaIds = parsedCsv.map((g) => g.id);

    return { checkedGminaIds };
  },

  getVoivodeship: async (id: number): Promise<string> => {
    const { data } = await ZGApi.get<string>(
      "/communes/index/" + id,
      tokenlessHeaders
    );
    return data;
  },

  setToken: (authToken: string) => {
    const headers = requestOptions(authToken);

    return {
      getUserFromSession: async (): Promise<LoggedUserResponse> => {
        const { data } = await ZGApi.get<string>("/", headers);
        const user = parseUser(data);

        if (user) {
          return { user };
        }

        throw new ZGApiError("SESSION_EXPIRED");
      },

      loginToZG: async (
        loginForm: LoginRequest
      ): Promise<LoggedUserResponse> => {
        const { password, username } = loginForm;
        const { data } = await ZGApi.post<string>(
          "/users/login",
          zgDataString({ User: { username, password } }),
          headers
        );

        const user = parseUser(data);

        if (user) {
          return { user };
        }

        throw new ZGApiError("INVALID_CREDENTIALS");
      },

      logoutFromZG: async (): Promise<void> => {
        await ZGApi.get("/users/logout", headers);
      },

      updateGminasStatus: async ({
        date,
        status,
      }: UpdateStatusRequest): Promise<void> => {
        await ZGApi.post(
          "/users_communes/addmulti",
          zgDataString({
            UsersCommune: {
              sender: "map",
              updateData: JSON.stringify(status),
              commune_add_date: date,
            },
          }),
          headers
        );
      },
    };
  },
};

const zgDataString = (object: ParsedObject) =>
  encodeURI(`${flatten(object, "data").join("&")}`);
