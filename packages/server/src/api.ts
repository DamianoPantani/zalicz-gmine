import { toUIError } from "./error";
import { ZGRequestHandler } from "./types/express";
import {
  LoginRequest,
  SessionResponse,
  LoggedUserResponse,
  UpdateStatusRequest,
  UserGminasStatus,
  UserGminasStatusRequest,
} from "./types/shared";
import { UIError } from "./types/shared/error";
import { zgApi } from "./zgBroker";

export const createSession: ZGRequestHandler<
  unknown,
  SessionResponse | UIError
> = async (_, res) => {
  try {
    const { authToken } = await zgApi.createNewSessionCookie();
    res.json({ authToken });
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};

export const getLoggedInUser: ZGRequestHandler<
  unknown,
  LoggedUserResponse | UIError
> = async (_req, res) => {
  try {
    const { authToken } = res.locals;
    const user = await zgApi.setToken(authToken).getUserFromSession(); // throws if session is expired
    res.json(user);
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};

export const loginUser: ZGRequestHandler<
  LoginRequest,
  LoggedUserResponse | UIError
> = async (req, res) => {
  try {
    const { authToken } = res.locals;
    const user = await zgApi.setToken(authToken).loginToZG(req.body);

    res.json(user);
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};

export const logoutUser: ZGRequestHandler = async (_req, res) => {
  try {
    const { authToken } = res.locals;
    await zgApi.setToken(authToken).logoutFromZG();

    res.send();
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};

export const updateGminasStatus: ZGRequestHandler<UpdateStatusRequest> = async (
  req,
  res
) => {
  try {
    const { authToken } = res.locals;
    await zgApi.setToken(authToken).updateGminasStatus(req.body);

    res.send();
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};

export const getCheckedGminas: ZGRequestHandler<
  unknown,
  UserGminasStatus | UIError,
  UserGminasStatusRequest
> = async (req, res) => {
  try {
    const { userId } = req.params;
    const checkedGminas = await zgApi.getCheckedGminas(userId);

    res.json(checkedGminas);
  } catch (error) {
    res.status(400).json(toUIError(error));
  }
};
