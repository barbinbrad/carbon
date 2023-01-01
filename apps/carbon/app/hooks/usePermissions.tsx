import { useCallback } from "react";
import type { Permission } from "~/interfaces/Users/types";
import { useRouteData } from "./useRouteData";

export function usePermissions() {
  const data = useRouteData<{ permissions: unknown }>("/app");

  if (!isPermissions(data?.permissions)) {
    // TODO: force logout -- the likely cause is development changes
    throw new Error(
      "usePermissions must be used within an authenticated route. If you are seeing this error, you are likely in development and have changed the session variables. Try deleting the cookies."
    );
  }

  const can = useCallback(
    (action: "view" | "create" | "update" | "delete", feature: string) => {
      return (
        // not sure why we have to type cast here
        (data?.permissions as Record<string, Permission>)[feature]?.[action] ??
        false
      );
    },
    [data?.permissions]
  );

  return {
    can,
  };
}

function isPermissions(value: any): value is Record<string, Permission> {
  if (
    typeof value === "object" &&
    Array.isArray(value) === false &&
    value !== null
  ) {
    return Object.values(value as object).every(
      (permission) =>
        "view" in permission &&
        "create" in permission &&
        "update" in permission &&
        "delete" in permission
    );
  } else {
    return false;
  }
}
