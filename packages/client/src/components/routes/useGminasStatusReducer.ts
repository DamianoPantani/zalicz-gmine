import { GminaCoords, GminasStatus } from "@damianopantani/zaliczgmine-server";
import { Reducer } from "react";

export type MapState = {
  gminasToAdd: GminaCoords[];
  gminasToRemove: GminaCoords[];
  apiState: GminasStatus;
};

export type Action = {
  type: "VISITED" | "UNVISITED";
  gmina: GminaCoords;
};

export const toggleVisitedGmina = (gmina: GminaCoords): Action => ({
  type: "VISITED",
  gmina,
});

export const toggleUnvisitedGmina = (gmina: GminaCoords): Action => ({
  type: "UNVISITED",
  gmina,
});

export const gminasStatusReducer: Reducer<MapState, Action> = (
  state,
  action
) => {
  const { type, gmina } = action;
  const { apiState, gminasToAdd, gminasToRemove } = state;
  const hasChangeState = !!apiState[gmina.id];

  if (hasChangeState) {
    const { [gmina.id]: _unselected, ...newApiState } = apiState;

    return {
      apiState: newApiState,
      gminasToAdd: gminasToAdd.filter((g) => g !== gmina),
      gminasToRemove: gminasToRemove.filter((g) => g !== gmina),
    };
  } else {
    const isToVisit = type === "VISITED";
    const newApiState: GminasStatus = {
      ...apiState,
      [gmina.id]: isToVisit ? "a" : "d",
    };

    return {
      apiState: newApiState,
      gminasToAdd: isToVisit ? gminasToAdd.concat(gmina) : gminasToAdd,
      gminasToRemove: isToVisit ? gminasToRemove : gminasToRemove.concat(gmina),
    };
  }
};
