import logger from "~/lib/logger";
import type { Result } from "~/types";

export function error(error: any, message = "Request failed"): Result {
  logger.error({ error, message });

  return {
    success: false,
    message,
  };
}

export function success(message = "Request succeeded"): Result {
  return {
    success: true,
    message,
  };
}
