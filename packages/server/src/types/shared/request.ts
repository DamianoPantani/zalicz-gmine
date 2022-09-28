import { DateForm, GminasStatus, User } from "./model";

export type LoginRequest = { username: string; password: string };

export type SessionResponse = { authToken: string };

export type LoggedUserResponse = { user: User };

export type UpdateStatusRequest = {
  status: GminasStatus;
  date: DateForm;
};

export type UserGminasStatusRequest = { userId: string };

export type UserGminasStatus = { checkedGminaIds: string[] };
