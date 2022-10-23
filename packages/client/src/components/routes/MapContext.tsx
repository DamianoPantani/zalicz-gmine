import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { getAllGminas, getCheckedGminaIds } from "../../api/requests";
import { useRequest } from "../../api/useAsync";
import { useSessionStore } from "../core/SessionContext";

import {
  Action,
  gminasStatusReducer,
  initializeUserGminas,
  MapState,
} from "./useGminasStatusReducer";

export type MapContextType = MapState & {
  initializingError?: string;
  dispatch: Dispatch<Action<unknown>>;
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
        dispatch(initializeUserGminas({ allGminas, checkedGminaIds }));
      }
    },
    [run, runWithParams, t]
  );

  useEffect(() => {
    user?.userId && initializeGminasStatus(user.userId);
  }, [user?.userId, initializeGminasStatus]);

  return (
    <MapContext.Provider
      value={{
        isInitialized,
        initializingError,
        dispatch,
        apiState,
        gminasToAdd,
        gminasToRemove,
        unvisitedGminas,
        visitedGminas,
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
