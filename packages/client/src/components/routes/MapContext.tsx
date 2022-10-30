import { DateForm, GminaCoords } from "@damianopantani/zaliczgmine-server";
import React, {
  createContext,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import {
  getAllGminas,
  getCheckedGminaIds,
  updateGminas,
} from "../../api/requests";
import { useAsync, useRequest } from "../../api/useAsync";
import { useSessionStore } from "../core/SessionContext";

import {
  commitMapAction,
  gminasStatusReducer,
  initializeUserGminasAction,
  MapState,
  toggleUnvisitedGminaAction,
  toggleVisitedGminaAction,
} from "./useGminasStatusReducer";

export type MapContextType = MapState & {
  initializingError?: string;
  hasChanges: boolean;
  isSaving: boolean;
  visitDate: Date;
  toggleVisited(gmina: GminaCoords): void;
  setVisitDate(date: Date): void;
  saveChanges(): void;
};

export const MapContext = createContext<MapContextType | undefined>(undefined);

const defaultGminasStatus: MapState = {
  isInitialized: false,
  visitedGminas: [],
  unvisitedGminas: [],
  gminasToAdd: [],
  gminasToRemove: [],
  apiState: {},
};

export const MapProvider = ({ children }: PropsWithChildren): ReactElement => {
  const { t } = useTranslation();
  const { run, runWithParams } = useRequest();
  const [initializingError, setInitializingError] = useState<string>();
  const [visitDate, setVisitDate] = useState(() => new Date());
  const user = useSessionStore((s) => s.user);

  const [
    {
      apiState,
      gminasToAdd,
      gminasToRemove,
      unvisitedGminas,
      visitedGminas,
      isInitialized,
    },
    dispatch,
  ] = useReducer(gminasStatusReducer, defaultGminasStatus);

  const initializeGminasStatus = useCallback(
    async (userId: number) => {
      const [allGminasResults, checkedGminasResults] = await Promise.all([
        run(getAllGminas),
        runWithParams(getCheckedGminaIds, userId),
      ]);

      const { data: allGminas, error: error1 } = allGminasResults;
      const { data: checkedGminaIds, error: error2 } = checkedGminasResults;
      const error = error1 || error2;
      if (error || !allGminas || !checkedGminaIds) {
        setInitializingError(error ?? t("error.UNKNOWN_ERROR"));
      } else {
        dispatch(initializeUserGminasAction({ allGminas, checkedGminaIds }));
      }
    },
    [run, runWithParams, t]
  );

  const { runWithParams: runUpdateGminas, isLoading: isSaving } =
    useAsync(updateGminas); // TODO: error handling

  const toggleVisited = useCallback(
    (gmina: GminaCoords) =>
      dispatch(
        visitedGminas.includes(gmina)
          ? toggleUnvisitedGminaAction(gmina)
          : toggleVisitedGminaAction(gmina)
      ),
    [visitedGminas]
  );

  const saveChanges = useCallback(() => {
    const date: DateForm = {
      day: visitDate.getDate(),
      month: visitDate.getMonth() + 1,
      year: visitDate.getFullYear(),
    };

    runUpdateGminas({ date, status: apiState }, (isSuccess) => {
      if (isSuccess) {
        dispatch(commitMapAction());
      }
      // TODO: notify user: toast(error ?? successMessage);
    });
  }, [runUpdateGminas, apiState, visitDate]);

  useEffect(() => {
    user?.userId && initializeGminasStatus(user.userId);
  }, [user?.userId, initializeGminasStatus]);

  return (
    <MapContext.Provider
      value={{
        isInitialized,
        initializingError,
        apiState,
        gminasToAdd,
        gminasToRemove,
        unvisitedGminas,
        visitedGminas,
        hasChanges: Boolean(gminasToAdd.length || gminasToRemove.length),
        visitDate,
        setVisitDate,
        isSaving,
        saveChanges,
        toggleVisited,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = (): MapContextType => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error(
      `MapContext compound components cannot be rendered outside the MapContext component`
    );
  }
  return context;
};
