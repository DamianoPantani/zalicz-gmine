import { ErrorType, UIError } from "./types/shared/error";

export class ZGApiError extends Error {
  details: UIError;

  public name = "ZGApiError";

  constructor(type: ErrorType, detailsString?: string) {
    super(detailsString);

    this.details = {
      type,
      detailsString,
    };

    Object.setPrototypeOf(this, ZGApiError.prototype); // fixes `isntanceof`
  }
}
