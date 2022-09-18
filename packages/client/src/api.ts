import axios from "axios";
import type {
  LoginRequest,
  SessionResponse,
  LoggedUserResponse,
} from "@damianopantani/zaliczgmine-server";
import { GminaBounds } from "./types";
import LocalStorage from "./localStorage";

const isLocal = process.env.NODE_ENV !== "production";

const authLocalStorage = new LocalStorage<string>("authToken");

const Api = axios.create({
  baseURL: isLocal ? "http://localhost:5000/api" : "/api",
});

Api.interceptors.request.use((request) => {
  const token = authLocalStorage.get();

  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

export const getLoggedInUser = async (): Promise<
  LoggedUserResponse | undefined
> => {
  const authToken = authLocalStorage.get();

  if (!authToken) {
    const { data } = await Api.put<SessionResponse>("/session");
    authLocalStorage.set(data.authToken);
    return undefined;
  } else {
    const { data } = await Api.get<LoggedUserResponse>("/session");
    return data;
  }
};

export const loginUser = (loginForm: LoginRequest) => {
  return Api.post("/session", loginForm);
};

export const logoutUser = () => {
  // TODO: send request (but don't clear localstorage)
};

export const getAllGminas = () => {
  return axios.get<GminaBounds[]>("/gminas.json");
};
