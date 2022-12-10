import {
  DateForm,
  GminaCoords,
  GminasStatus,
} from "@damianopantani/zaliczgmine-server";
import React, { PropsWithChildren, useCallback } from "react";
import { useTranslation } from "react-i18next";
import create, { StoreApi } from "zustand";
import createContext from "zustand/context";
import { TFunction } from "i18next";

import allGminasJson from "../../resources/coords_prec_4.json";
import { getCheckedGminaIds, updateGminas } from "../../api/requests";
import { splitBy, diff } from "../../util/array";
import { UseRequest, useRequest } from "../../api/useAsync";

type MapStore = {
  isInitialized: boolean;
  visitedGminas: GminaCoords[];
  unvisitedGminas: GminaCoords[];
  gminasToAdd: GminaCoords[];
  gminasToRemove: GminaCoords[];
  apiState: GminasStatus;
  initializingError?: string;
  hasChanges: boolean;
  isSaving: boolean;
  visitDate: Date;
  initializeGminasStatus(userId: number): Promise<void>;
  toggleVisited(gmina: GminaCoords): void;
  setVisitDate(date: Date): void;
  saveChanges(): Promise<void>;
  commitChanges(): void;
};

const { Provider, useStore } = createContext<StoreApi<MapStore>>();

const allGminas = allGminasJson as GminaCoords[];

const createMapStore = ({ runWithParams }: UseRequest, t: TFunction) =>
  create<MapStore>((set, get) => ({
    isInitialized: false,
    visitedGminas: [],
    unvisitedGminas: allGminas,
    gminasToAdd: [],
    gminasToRemove: [],
    apiState: {},
    initializingError: undefined,
    hasChanges: false,
    isSaving: false,
    visitDate: new Date(),

    initializeGminasStatus: async (userId: number) => {
      const { data: checkedGminaIds, error } = await runWithParams(
        getCheckedGminaIds,
        userId
      );

      if (error || !checkedGminaIds) {
        set({
          initializingError: error ?? t("error.client.COULD_NOT_GET_STATUS"),
        });
      } else {
        const [visitedGminas, unvisitedGminas] = checkedGminaIds.length
          ? splitBy(allGminas, (g) => checkedGminaIds.includes(g.id))
          : [[], allGminas];

        set({ visitedGminas, unvisitedGminas, isInitialized: true });
      }
    },

    toggleVisited: (gmina: GminaCoords) => {
      const { visitedGminas, apiState, gminasToAdd, gminasToRemove } = get();
      const wasAlreadyMarked = !!apiState[gmina.id];
      const markToVisit = !visitedGminas.includes(gmina);

      if (wasAlreadyMarked) {
        const { [gmina.id]: _unselected, ...newApiState } = apiState;
        const newGminasToAdd = gminasToAdd.filter((g) => g !== gmina);
        const newGminasToRemove = gminasToRemove.filter((g) => g !== gmina);

        set({
          apiState: newApiState,
          gminasToAdd: newGminasToAdd,
          gminasToRemove: newGminasToRemove,
          hasChanges: Boolean(
            newGminasToAdd.length || newGminasToRemove.length
          ),
        });
      } else {
        const newApiState: GminasStatus = {
          ...apiState,
          [gmina.id]: markToVisit ? "a" : "d",
        };
        const newGminasToAdd = markToVisit
          ? gminasToAdd.concat(gmina)
          : gminasToAdd;
        const newGminasToRemove = markToVisit
          ? gminasToRemove
          : gminasToRemove.concat(gmina);

        set({
          apiState: newApiState,
          gminasToAdd: newGminasToAdd,
          gminasToRemove: newGminasToRemove,
          hasChanges: Boolean(
            newGminasToAdd.length || newGminasToRemove.length
          ),
        });
      }
    },

    setVisitDate: (visitDate: Date) => set({ visitDate }),

    saveChanges: async () => {
      const { visitDate, apiState, commitChanges } = get();
      const date: DateForm = {
        day: visitDate.getDate(),
        month: visitDate.getMonth() + 1,
        year: visitDate.getFullYear(),
      };

      set({ isSaving: true });
      const res = await runWithParams(updateGminas, { date, status: apiState });
      set({ isSaving: false });

      return res.error || res.errorDetails
        ? Promise.reject(res)
        : commitChanges();
    },

    commitChanges: () => {
      const { unvisitedGminas, gminasToAdd, visitedGminas, gminasToRemove } =
        get();
      set({
        apiState: {},
        gminasToAdd: [],
        gminasToRemove: [],
        unvisitedGminas: diff(unvisitedGminas, gminasToAdd).concat(
          gminasToRemove
        ),
        visitedGminas: diff(visitedGminas, gminasToRemove).concat(gminasToAdd),
      });
    },
  }));

export const MapProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const requestRunner = useRequest();
  const createStore = useCallback(() => {
    return createMapStore(requestRunner, t);
  }, [requestRunner, t]);

  return <Provider createStore={createStore}>{children}</Provider>;
};

export const useMapStore = useStore;
