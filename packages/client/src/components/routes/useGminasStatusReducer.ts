import { GminaCoords, GminasStatus } from "@damianopantani/zaliczgmine-server";
import { Reducer } from "react";

import { splitBy, diff } from "../../util/array";

export type MapState = {
  isInitialized: boolean;
  visitedGminas: GminaCoords[];
  unvisitedGminas: GminaCoords[];
  gminasToAdd: GminaCoords[];
  gminasToRemove: GminaCoords[];
  apiState: GminasStatus;
};

type ActionCreator<P = void> = (payload: P) => Action<P>;

export type Action<P> = {
  type: "INITIALIZE_MAP" | "TOGGLE_VISITED" | "TOGGLE_UNVISITED" | "COMMIT_MAP";
  payload: P;
};

type InitPayload = {
  allGminas: GminaCoords[];
  checkedGminaIds: string[];
};

export const initializeUserGminasAction: ActionCreator<InitPayload> = (
  payload
) => ({
  type: "INITIALIZE_MAP",
  payload,
});

export const commitMapAction: ActionCreator = () => ({
  type: "COMMIT_MAP",
  payload: undefined,
});

export const toggleVisitedGminaAction: ActionCreator<GminaCoords> = (
  payload
) => ({
  type: "TOGGLE_VISITED",
  payload,
});

export const toggleUnvisitedGminaAction: ActionCreator<GminaCoords> = (
  payload
) => ({
  type: "TOGGLE_UNVISITED",
  payload,
});

export const gminasStatusReducer: Reducer<MapState, Action<unknown>> = (
  state,
  action
) => {
  const { payload } = action;

  switch (action.type) {
    case "INITIALIZE_MAP":
      const { allGminas, checkedGminaIds } = payload as InitPayload;
      const [initialVisitedGminas, initialUnvisitedGminas] =
        checkedGminaIds.length
          ? splitBy(allGminas, (g) => checkedGminaIds.includes(g.id))
          : [[], allGminas];

      return {
        isInitialized: true,
        apiState: {},
        gminasToAdd: [],
        gminasToRemove: [],
        unvisitedGminas: initialUnvisitedGminas,
        visitedGminas: initialVisitedGminas,
      };

    case "TOGGLE_VISITED":
    case "TOGGLE_UNVISITED":
      const gmina = payload as GminaCoords;
      const wasAlreadyMarked = !!state.apiState[gmina.id];

      if (wasAlreadyMarked) {
        const { [gmina.id]: _unselected, ...newApiState } = state.apiState;

        return {
          ...state,
          apiState: newApiState,
          gminasToAdd: state.gminasToAdd.filter((g) => g !== gmina),
          gminasToRemove: state.gminasToRemove.filter((g) => g !== gmina),
        };
      } else {
        const markToVisit = action.type === "TOGGLE_VISITED";
        const newApiState: GminasStatus = {
          ...state.apiState,
          [gmina.id]: markToVisit ? "a" : "d",
        };

        return {
          ...state,
          apiState: newApiState,
          gminasToAdd: markToVisit
            ? state.gminasToAdd.concat(gmina)
            : state.gminasToAdd,
          gminasToRemove: markToVisit
            ? state.gminasToRemove
            : state.gminasToRemove.concat(gmina),
        };
      }

    case "COMMIT_MAP":
      const { visitedGminas, unvisitedGminas, gminasToRemove, gminasToAdd } =
        state;

      return {
        ...state,
        apiState: {},
        gminasToAdd: [],
        gminasToRemove: [],
        unvisitedGminas: diff(unvisitedGminas, gminasToAdd).concat(
          gminasToRemove
        ),
        visitedGminas: diff(visitedGminas, gminasToRemove).concat(gminasToAdd),
      };
    default:
      return state;
  }
};
