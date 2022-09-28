import axios from "axios";
import type {
  LoginRequest,
  SessionResponse,
  LoggedUserResponse,
  User,
  UserGminasStatus,
  GminaCoords,
  Coords,
  UpdateStatusRequest,
} from "@damianopantani/zaliczgmine-server";
import LocalStorage from "./localStorage";

const { hostname, port } = window.location;
const isLocalEnv = !!port;

const authLocalStorage = new LocalStorage<string>("authToken");

const Api = axios.create({
  baseURL: isLocalEnv ? `http://${hostname}:5000/api` : "/api",
});

Api.interceptors.request.use((request) => {
  const token = authLocalStorage.get();

  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

// public api - start

export const getAllGminas = async (): Promise<GminaCoords[]> => {
  const { data } = await axios.get<GminaCoords[]>("/map/coords_prec_4.json");
  return data;
};
export const getCapitalCitiesCoords = async (): Promise<Coords> => {
  const { data } = await axios.get<Coords>("/map/capitalCoords.json");
  return data;
};

// public api - end

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

export const getCheckedGminaIds = async (
  userId: number
): Promise<UserGminasStatus> => {
  const { data } = await Api.get<UserGminasStatus>("/map/" + userId);
  return data;
};

export const updateGminas = async (
  status: UpdateStatusRequest
): Promise<void> => {
  await Api.put("/map/", status);
};
