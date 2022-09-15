import axios, { AxiosResponse } from "axios";
import type {
  CheckedGmina,
  LoginRequest,
  UISession,
} from "@damianopantani/zaliczgmine-server";
import { GminaBounds } from "./types";

const isLocal = process.env.NODE_ENV !== "production";

let apiAuthToken: string | null = null;

const Api = axios.create({
  baseURL: isLocal ? "http://localhost:5000/api" : "/api",
});

Api.interceptors.request.use((request) => {
  if (apiAuthToken && request.headers) {
    request.headers["x-access-token"] = apiAuthToken;
  }

  return request;
});

export const getAllGminas = () => {
  return axios.get<GminaBounds[]>("/gminas.json");
};

export const saveGminas = (gminasToRemove: number[], gminasToAdd: number[]) => {
  return Api.post<CheckedGmina[]>("/api/gmina", {
    gminasToAdd,
    gminasToRemove,
  });
};

export const getSession = async (): Promise<UISession | null> => {
  apiAuthToken = localStorage.getItem("authToken");
  if (apiAuthToken) {
    return Api.get("/session").then(setFreshAuthToken);
  } else {
    return null;
  }
};

export const loginUser = (loginForm: LoginRequest): Promise<UISession> => {
  return Api.post("/session", loginForm).then(setFreshAuthToken);
};

export const logoutUser = () => {
  localStorage.removeItem("authToken");
  apiAuthToken = null;
};

const setFreshAuthToken = ({ data }: AxiosResponse<UISession>): UISession => {
  apiAuthToken = data.authToken;
  localStorage.setItem("authToken", data.authToken);
  return data;
};
