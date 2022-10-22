import type { LoginRequest, User } from "@damianopantani/zaliczgmine-server";
import React, { PropsWithChildren, useCallback } from "react";
import create, { StoreApi } from "zustand";
import createContext from "zustand/context";
import { getLoggedInUser, loginUser, logoutUser } from "../../api/requests";
import { UseRequest, useRequest } from "../../api/useAsync";

type SessionStore = {
  isInitializing: boolean;
  isLoggingIn: boolean;
  loginError?: string;
  loginErrorDetails?: string;
  isLoggedIn: boolean;
  user?: User;
  initialize(): void;
  login(form: LoginRequest): void;
  logout(): void;
};

const { Provider, useStore } = createContext<StoreApi<SessionStore>>();

const createSessionStore = ({ run, runWithParams }: UseRequest) =>
  create<SessionStore>((set) => ({
    isInitializing: true,
    isLoggingIn: false,
    isLoggedIn: false,
    user: undefined,
    loginError: undefined,
    loginErrorDetails: undefined,

    initialize: async () => {
      const { data: user } = await run(getLoggedInUser);

      set(
        user
          ? { isInitializing: false, user, isLoggedIn: true }
          : { isInitializing: false }
      );
    },

    login: async (form) => {
      if (!form.username || !form.password) {
        return;
      }

      set({ isLoggingIn: true });
      const {
        data: user,
        error: loginError,
        errorDetails: loginErrorDetails,
      } = await runWithParams(loginUser, form);

      set({
        isLoggedIn: !!user,
        user,
        loginError,
        loginErrorDetails,
        isLoggingIn: false,
      });
    },

    logout: async () => {
      const { error } = await run(logoutUser);

      !error &&
        set({
          isLoggedIn: false,
          user: undefined,
        });
    },
  }));

export const SessionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const requestRunner = useRequest();

  const createStore = useCallback(() => {
    return createSessionStore(requestRunner);
  }, [requestRunner]);

  return <Provider createStore={createStore}>{children}</Provider>;
};

export const useSessionStore = useStore;
