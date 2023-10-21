import { useCallback } from "react";
import type { Permission } from "~/modules/users";
import type { Role } from "~/types";
import { path } from "~/utils/path";
import { useRouteData } from "./useRouteData";

export function usePermissions() {
  const data = useRouteData<{ permissions: unknown; role: unknown }>(
    path.to.authenticatedRoot
  );

  if (!isPermissions(data?.permissions) || !isRole(data?.role)) {
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

  const has = useCallback(
    (feature: string) => {
      return feature in (data?.permissions as Record<string, Permission>);
    },
    [data?.permissions]
  );

  const is = useCallback(
    (role: Role) => {
      return data?.role === role;
    },
    [data?.role]
  );

  return {
    can,
    has,
    is,
  };
}

function isPermissions(value: unknown): value is Record<string, Permission> {
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

function isRole(value: unknown): value is Role {
  return value === "employee" || value === "customer" || value === "supplier";
}
