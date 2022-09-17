import axios from "axios";
import type {
  LoginRequest,
  SessionResponse,
  SessionValidityResponse,
} from "@damianopantani/zaliczgmine-server";
import { GminaBounds } from "./types";

const isLocal = process.env.NODE_ENV !== "production";

// TODO: refactor localstorage

const Api = axios.create({
  baseURL: isLocal ? "http://localhost:5000/api" : "/api",
});

Api.interceptors.request.use((request) => {
  const token = localStorage.getItem("authToken");

  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

// TODO: how about `getLoggedUser` or smtng?
export const isUserLoggedIn = async () => {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    const { data } = await Api.get<SessionResponse>("/session");
    localStorage.setItem("authToken", data.authToken);
    return false;
  } else {
    const { data } = await Api.put<SessionValidityResponse>("/session");
    return data.isSessionValid;
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
