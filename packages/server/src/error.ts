import axios from "axios";

import { UIError } from "./types/shared/error";
import { ZGApiError } from "./ZGApiError";

export const toUIError = (details: unknown): UIError => {
  if (details instanceof ZGApiError) {
    return details.details;
  }

  return {
    type: "UNKNOWN_ERROR",
    detailsString: getDetailsString(details),
  };
};

const getDetailsString = (details: unknown): string | undefined => {
  if (!details) {
    return undefined;
  }

  if (isString(details)) {
    return details;
  }

  // TODO: probably can get more details from AxiosError
  if (axios.isAxiosError(details)) {
    return details.message;
  }

  if (details instanceof Error) {
    return details.message;
  }

  return undefined;
};

const isString = (variable: unknown): variable is string => {
  return typeof variable === "string" || variable instanceof String;
};
