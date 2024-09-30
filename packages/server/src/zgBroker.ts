import axios from "axios";

import {
  Coord,
  GminaCoords,
  GminaPolygonResponse,
  LoginRequest,
  UpdateStatusRequest,
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
  createNewSessionCookie: async () => {
    const { headers } = await ZGApi.get("/", tokenlessHeaders);
    return parseAuthCookie(headers);
  },

  getCheckedGminaIds: async (userId: string) => {
    const { data: rawCsv } = await ZGApi.get<string>(
      `/files/users-communes/users-communes-${userId}.csv`,
      tokenlessHeaders
    );

    const parsedCsv = parseGminasCSV(rawCsv);
    const checkedGminaIds = parsedCsv.map((g) => g.id);

    return { checkedGminaIds };
  },

  getGminasCoords: async (precision: number) => {
    const { data } = await ZGApi.get<GminaPolygonResponse>(
      "/api/polygons?zoom=8"
    );

    return data.items.map<GminaCoords>(({ c: coords, i: id, n: name }) => ({
      id,
      name,
      polygons: (JSON.parse(coords) as Coord[][][]).map((a) =>
        a.map((b) =>
          b.map(([x, y]) => [+x.toFixed(precision), +y.toFixed(precision)])
        )
      ),
    }));
  },

  getVoivodeship: async (id: number) => {
    const { data } = await ZGApi.get<string>(
      "/communes/index/" + id,
      tokenlessHeaders
    );
    return data;
  },

  setToken: (authToken: string) => {
    const headers = requestOptions(authToken);

    return {
      getUserFromSession: async () => {
        const { data } = await ZGApi.get<string>("/", headers);
        const user = parseUser(data);

        if (user) {
          return { user };
        }

        throw new ZGApiError("SESSION_EXPIRED");
      },

      loginToZG: async (loginForm: LoginRequest) => {
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

      logoutFromZG: async () => {
        await ZGApi.get("/users/logout", headers);
      },

      updateGminasStatus: async ({ date, status }: UpdateStatusRequest) => {
        await ZGApi.post(
          "/users_communes/addmulti",
          zgDataString({
            UsersCommune: {
              sender: "list",
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
