import type { User } from "@damianopantani/zaliczgmine-server";
import React, { PropsWithChildren } from "react";
import create, { StoreApi } from "zustand";
import createContext from "zustand/context";
import { loginUser, logoutUser, getLoggedInUser } from "./api";

type LoginStatus =
  | {
      isLoggedIn: true;
      user: User;
    }
  | {
      isLoggedIn: false;
      user: undefined;
    };

type SessionStore = LoginStatus & {
  isInitializing: boolean;
  initialize(): Promise<void>;
  login(username: string, password: string): Promise<void>;
  logout(): Promise<void>;
};

const { Provider, useStore } = createContext<StoreApi<SessionStore>>();

const createSessionStore = () =>
  create<SessionStore>((set) => ({
    isInitializing: true,
    isLoggedIn: false,
    user: undefined,

    initialize: async () => {
      try {
        const user = await getLoggedInUser();
        set(
          user
            ? { isInitializing: false, user, isLoggedIn: true }
            : { isInitializing: false }
        );
      } catch {
        set({ isInitializing: false });
      }
    },

    login: async (username, password) => {
      const user = await loginUser({ username, password });
      set({ isLoggedIn: true, user });
    },

    logout: async () => {
      await logoutUser();
      set({
        isLoggedIn: false,
        user: undefined,
      });
    },
  }));

export const SessionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <Provider createStore={createSessionStore}>{children}</Provider>;
};

export const useSessionStore = useStore;
