import { useRouteData } from "./useRouteData";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
};

type Groups = string[];

type UserWithGroups = User & { groups: Groups };

export function useUser(): UserWithGroups {
  const data = useRouteData<{ user: unknown; groups: unknown }>("/x");
  if (
    data?.user &&
    isUser(data.user) &&
    data?.groups &&
    isGroups(data.groups)
  ) {
    return {
      ...data.user,
      groups: data.groups,
    };
  }
  // TODO: force logout -- the likely cause is development changes
  throw new Error(
    "useUser must be used within an authenticated route. If you are seeing this error, you are likely in development and have changed the session variables. Try deleting the cookies."
  );
}

function isGroups(value: any): value is Groups {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function isUser(value: any): value is User {
  return (
    typeof value.id === "string" &&
    typeof value.email === "string" &&
    typeof value.firstName === "string" &&
    typeof value.lastName === "string" &&
    "avatarUrl" in value
  );
}
