import { UIError } from "@damianopantani/zaliczgmine-server";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { noLowerCaseRegex } from "../util/regex";

export type ResponseError = {
  error?: string;
  errorDetails?: string;
};

export type UseAsync<T, P> = ResponseError & {
  isLoading: boolean;
  data?: T;
  run: (done?: (isSuccess: boolean) => void) => void;
  runWithParams: (params: P, done?: (isSuccess: boolean) => void) => void;
};

export type RequestResults<T> = ResponseError & {
  data?: T;
};

export type UseRequest = {
  run: <T>(request: () => Promise<T>) => Promise<RequestResults<T>>;
  runWithParams: <T, P>(
    request: (params: P) => Promise<T>,
    params: P
  ) => Promise<RequestResults<T>>;
};

export const useAsync = <T, P>(
  request: (params: P) => Promise<T>
): UseAsync<T, P> => {
  const { decodeError } = useErrorDecoder();
  const [isLoading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState<ResponseError>();
  const [data, setData] = useState<T>();

  const runWithParams = useCallback(
    async (params: P, done?: (isSuccess: boolean) => void) => {
      setLoading(true);
      setResponseError(undefined);

      try {
        setData(await request(params));
        done?.(true);
      } catch (e) {
        setResponseError(decodeError(e as AxiosError));
        done?.(false);
      }

      setLoading(false);
    },
    [request, decodeError]
  );

  const run = useCallback(
    (done?: (isSuccess: boolean) => void) =>
      runWithParams(undefined as unknown as P, done),
    [runWithParams]
  );

  return {
    data,
    isLoading,
    run,
    runWithParams,
    error: responseError?.error,
    errorDetails: responseError?.errorDetails,
  };
};

export const useRequest = (): UseRequest => {
  const { decodeError } = useErrorDecoder();

  const runWithParams = useCallback(
    async <T, P>(request: (params: P) => Promise<T>, params: P) => {
      try {
        return { data: await request(params) };
      } catch (e) {
        return decodeError(e as AxiosError);
      }
    },
    [decodeError]
  );

  const run = useCallback(
    <T>(request: () => Promise<T>) => runWithParams(request, undefined),
    [runWithParams]
  );

  return { run, runWithParams };
};

const useErrorDecoder = () => {
  const { t } = useTranslation();

  const decodeError = useCallback(
    ({ response }: AxiosError): ResponseError => {
      const { data, statusText } = response || {};

      return isEncodedUIError(data)
        ? {
            error: t(`error.${data.type}`),
            errorDetails: data.detailsString,
          }
        : {
            error: t("error.UNKNOWN_ERROR"),
            errorDetails: statusText,
          };
    },
    [t]
  );

  return { decodeError };
};

const isEncodedUIError = (response: unknown): response is UIError => {
  const castResponse = response as UIError | undefined;

  return (
    typeof castResponse?.type === "string" &&
    noLowerCaseRegex.test(castResponse?.type)
  );
};
