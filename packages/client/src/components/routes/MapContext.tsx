import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  useContext,
  useReducer,
} from "react";

import {
  Action,
  gminasStatusReducer,
  MapState,
} from "./useGminasStatusReducer";

export type MapContextType = MapState & {
  dispatch: Dispatch<Action>;
};

export const MapContext = createContext<MapContextType | undefined>(undefined);

const defaultGminasStatus: MapState = {
  gminasToAdd: [],
  gminasToRemove: [],
  apiState: {},
};

export const MapProvider = ({ children }: PropsWithChildren): ReactElement => {
  const [{ apiState, gminasToAdd, gminasToRemove }, dispatch] = useReducer(
    gminasStatusReducer,
    defaultGminasStatus
  );

  return (
    <MapContext.Provider
      value={{ dispatch, apiState, gminasToAdd, gminasToRemove }}
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
