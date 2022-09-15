import type {
  User,
  CheckedGmina,
  UISession,
} from "@damianopantani/zaliczgmine-server";
import React, { PropsWithChildren } from "react";
import create, { StoreApi } from "zustand";
import createContext from "zustand/context";
import { getSession, loginUser, logoutUser, saveGminas } from "./api";

interface SessionStore {
  isInitializing: boolean;
  isLoggedIn: boolean;
  isSavingData: boolean;
  user: User;
  checkedGminas: CheckedGmina[];
  continueSession(): void;
  login(email: string, password: string): void;
  logout(): void;
  checkGminas(gminasToRemove: number[], gminasToAdd: number[]): void;
  _initializeSession(session: UISession): void;
}

const { Provider, useStore } = createContext<StoreApi<SessionStore>>();

const createSessionStore = () =>
  create<SessionStore>((set, get) => ({
    isInitializing: true,
    isLoggedIn: false,
    isSavingData: false, // TODO: error handling
    user: { email: "", id: 0, userName: "" },
    checkedGminas: [],

    continueSession: async () => {
      const session = await getSession();
      session && get()._initializeSession(session);
      set({ isInitializing: false });
    },

    // TODO: catch
    login: (email, password) => {
      loginUser({ email, password }).then(get()._initializeSession);
    },

    logout: () => {
      logoutUser();
      set({
        isLoggedIn: false,
        user: { email: "", id: 0, userName: "" },
        checkedGminas: [],
      });
    },

    checkGminas: (gminasToRemove, gminasToAdd) => {
      set({ isSavingData: true });
      saveGminas(gminasToRemove, gminasToAdd).finally(() =>
        set({ isSavingData: false })
      );
    },

    _initializeSession: (session) => {
      set({
        checkedGminas: session.checkedGminas,
        user: session.user,
        isLoggedIn: true,
      });
    },
  }));

export const SessionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <Provider createStore={createSessionStore}>{children}</Provider>;
};

export const useSessionStore = useStore;
