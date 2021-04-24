import { AxiosError } from "axios";
import { pathOr } from "ramda";

export const getRequestStatus = (error: AxiosError) => error?.response?.status ?? 503;

export const getErrorMessage = (error: Error, defaultMessage?: string) =>
	pathOr(defaultMessage || error.message, ["response", "data", "message"], error);
