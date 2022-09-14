import axios from "axios";
import type { LoginRequest } from "@damianopantani/zaliczgmine-server";
import { GminaBounds } from "./types";

const isLocal = process.env.NODE_ENV !== "production";

const Api = axios.create({
  baseURL: isLocal ? "http://localhost:5000/api" : "/api",
});

export const getAllGminas = () => {
  return axios.get<GminaBounds[]>("/gminas.json");
};

export const loginUser = (loginForm: LoginRequest) => {
  return Api.post("/session", loginForm);
};
