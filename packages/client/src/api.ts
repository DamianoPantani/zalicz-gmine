import axios from "axios";
import type {
  LoginRequest,
  SessionResponse,
  LoggedUserResponse,
  User,
  UserGminasStatus,
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

export const getLoggedInUser = async (): Promise<User | undefined> => {
  const authToken = authLocalStorage.get();

  if (!authToken) {
    const { data } = await Api.put<SessionResponse>("/session");
    authLocalStorage.set(data.authToken);
    return undefined;
  } else {
    const { data } = await Api.get<LoggedUserResponse>("/session");
    return data.user;
  }
};

export const loginUser = async (loginForm: LoginRequest): Promise<User> => {
  const { data } = await Api.post<LoggedUserResponse>("/session", loginForm);
  return data.user;
};

export const logoutUser = async (): Promise<void> => {
  await Api.delete("/session");
};

export const getAllGminas = async (): Promise<GminaBounds[]> => {
  const { data } = await axios.get<GminaBounds[]>("/gminas.json");
  return data;
};

export const getCheckedGminas = async (
  userId: number
): Promise<UserGminasStatus> => {
  const { data } = await Api.get<UserGminasStatus>("/map/" + userId);
  return data;
};
