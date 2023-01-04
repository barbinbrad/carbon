import type { Database, Json } from "@carbon/database";
import { redis } from "@carbon/redis";
import { redirect } from "@remix-run/node";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "~/lib/supabase";
import type {
  EmployeeRow,
  EmployeeTypePermission,
  Feature,
  Permission,
  User,
} from "~/interfaces/Users/types";
import { deleteAuthAccount, sendInviteByEmail } from "~/services/auth";
import { requireAuthSession, flash } from "~/services/session";
import type { Result } from "~/types";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { error, success } from "~/utils/result";

export async function createEmployeeAccount(
  client: SupabaseClient<Database>,
  {
    email,
    firstName,
    lastName,
    employeeType,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    employeeType: string;
  }
): Promise<Result> {
  const employeeTypePermissions = await getPermissionsByEmployeeType(
    client,
    employeeType
  );
  if (employeeTypePermissions.error)
    return error(
      employeeTypePermissions.error,
      "Failed to get employee type permissions"
    );

  // TODO: we should only send this after we've done the other stuff
  const invitation = await sendInviteByEmail(email);

  if (invitation.error)
    return error(invitation.error.message, "Failed to send invitation email");

  const userId = invitation.data.user.id;

  const claims = makeClaimsFromEmployeeType(employeeTypePermissions);
  const claimsUpdate = await setUserClaims(userId, claims);
  if (claimsUpdate.error) {
    await deleteAuthAccount(userId);
    return error(claimsUpdate.error, "Failed to set user claims");
  }

  const insertUser = await createUser(client, {
    id: userId,
    email,
    firstName,
    lastName,
    avatarUrl: null,
  });

  if (insertUser.error)
    return error(insertUser.error, "Failed to create a new user");

  if (!insertUser.data)
    return error(insertUser, "No data returned from create user");

  const createEmployee = await insertEmployee(client, {
    id: insertUser.data[0].id,
    employeeTypeId: employeeType,
  });

  if (createEmployee.error)
    return error(createEmployee.error, "Failed to create an employee");

  return success("Employee account created");
}

export async function createEmployeeType(
  client: SupabaseClient<Database>,
  employeeType: { id?: string; name: string; color: string | null }
) {
  return client.from("employeeType").insert([employeeType]).select("id");
}

export async function createGroup(
  client: SupabaseClient<Database>,
  group: { name: string }
) {
  return client.from("group").insert(group).select("id");
}

async function createUser(
  client: SupabaseClient<Database>,
  user: Omit<User, "fullName">
) {
  const { data, error } = await insertUser(client, user);

  if (error) {
    await deleteAuthAccount(user.id);
  }

  return { data, error };
}

export async function deleteAttribute(
  client: SupabaseClient<Database>,
  attributeId: string
) {
  return client
    .from("userAttribute")
    .update({ active: false })
    .eq("id", attributeId);
}

export async function deleteAttributeCategory(
  client: SupabaseClient<Database>,
  attributeCategoryId: string
) {
  console.log("deleting attribute category", attributeCategoryId);
  return client
    .from("userAttributeCategory")
    .update({ active: false })
    .eq("id", attributeCategoryId);
}

export async function deleteEmployeeType(
  client: SupabaseClient<Database>,
  employeeTypeId: string
) {
  return client.from("employeeType").delete().eq("id", employeeTypeId);
}

export async function deleteGroup(
  client: SupabaseClient<Database>,
  groupId: string
) {
  return client.from("group").delete().eq("id", groupId);
}

export async function getAttribute(
  client: SupabaseClient<Database>,
  attributeId: number
) {
  return client
    .from("userAttribute")
    .select(
      "id, name, sortOrder, listOptions, attributeDataTypeId, userAttributeCategoryId, canSelfManage, userAttributeCategory(name)"
    )
    .eq("id", attributeId)
    .eq("active", true)
    .single();
}

export async function getAttributeCategories(
  client: SupabaseClient<Database>,
  args: { name: string | null } & GenericQueryFilters
) {
  let query = client
    .from("userAttributeCategory")
    .select("id, name, public, protected, userAttribute(id, name)", {
      count: "exact",
    })
    .eq("active", true)
    .eq("userAttribute.active", true);

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function getAttributeCategory(
  client: SupabaseClient<Database>,
  id: number
) {
  return client
    .from("userAttributeCategory")
    .select(
      `id, name, public, protected, 
      userAttribute(
        id, name, sortOrder, 
        attributeDataType(id, label,  isBoolean, isDate, isList, isNumeric, isText, isUser ))
      `,
      {
        count: "exact",
      }
    )
    .eq("id", id)
    .eq("active", true)
    .eq("userAttribute.active", true)
    .single();
}

export async function getAttributeDataTypes(client: SupabaseClient<Database>) {
  return client.from("attributeDataType").select("*");
}

export async function getClaimsById(
  client: SupabaseClient<Database>,
  uid: string
) {
  return client.rpc("get_claims", { uid });
}

export async function getEmployeeById(
  client: SupabaseClient<Database>,
  id: string
) {
  return client
    .from("employee")
    .select("id, user(id, firstName, lastName, email), employeeType(id)")
    .eq("id", id)
    .single();
}

export async function getEmployees(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    name: string | null;
    type: string | null;
    active: boolean | null;
  }
) {
  let query = client
    .from("employee")
    .select(
      "user!inner(id, fullName, firstName, lastName, email, avatarUrl), employeeType!inner(name)",
      { count: "exact" }
    );

  if (args.name) {
    query = query.ilike("user.fullName", `%${args.name}%`);
  }

  if (args.type) {
    query = query.eq("employeeTypeId", args.type);
  }

  if (args.active !== null) {
    query = query.eq("user.active", args.active);
  }

  query = setGenericQueryFilters(query, args, "user(lastName)");
  return query;
}

export async function getEmployeeType(
  client: SupabaseClient<Database>,
  employeeTypeId: string
) {
  return client
    .from("employeeType")
    .select("id, name, color, protected")
    .eq("id", employeeTypeId)
    .single();
}

export async function getEmployeeTypes(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & { name: string | null }
) {
  let query = client
    .from("employeeType")
    .select("id, name, color, protected", { count: "exact" });

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function getFeatures(client: SupabaseClient<Database>) {
  return client.from("feature").select("id, name").order("name");
}

export async function getGroup(
  client: SupabaseClient<Database>,
  groupId: string
) {
  return client.from("group").select("id, name").eq("id", groupId).single();
}

export async function getGroupMembersById(
  client: SupabaseClient<Database>,
  groupId: string
) {
  return client
    .from("group_member") // group_member is a view
    .select("name, groupId, memberGroupId, memberUserId")
    .eq("groupId", groupId);
}

export async function getGroups(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & {
    name: string | null;
    uid: string | null;
  }
) {
  let query = client.rpc("groups_query", {
    _uid: args?.uid ?? "",
    _name: args?.name ?? "",
  });

  if (args) query = setGenericQueryFilters(query, args);

  return query;
}

export async function getPermissionsByEmployeeType(
  client: SupabaseClient<Database>,
  employeeTypeId: string
) {
  return client
    .from("employeeTypePermission")
    .select("view, create, update, delete, feature (id, name)")
    .eq("employeeTypeId", employeeTypeId);
}

function getPermissionCacheKey(userId: string) {
  return `permissions:${userId}`;
}

export async function getPermissions(
  request: Request,
  client: SupabaseClient<Database>
) {
  const { userId } = await requireAuthSession(request);

  let permissions: Record<string, Permission> | null = null;

  try {
    permissions = JSON.parse(
      (await redis.get(getPermissionCacheKey(userId))) || "null"
    );
  } finally {
    // if we don't have permissions from redis, get them from the database
    if (!permissions) {
      const claims = await getClaimsById(client, userId);
      if (claims.error || claims.data === null) {
        throw redirect(
          "/app",
          await flash(request, error(claims.error, "Failed to get claims"))
        );
      }
      // convert claims to permissions
      permissions = makePermissionsFromClaims(claims.data);
      // store permissions in redis

      await redis.set(
        getPermissionCacheKey(userId),
        JSON.stringify(permissions)
      );

      if (!permissions) {
        throw redirect(
          "/app",
          await flash(request, error(claims, "Failed to parse claims"))
        );
      }
    }

    return permissions;
  }
}

export async function getCurrentUser(
  request: Request,
  client: SupabaseClient<Database>
) {
  const { userId } = await requireAuthSession(request);

  const user = await getUserById(client, userId);
  if (user?.error || user?.data === null) {
    throw redirect(
      "/app",
      await flash(request, error(user.error, "Failed to get user"))
    );
  }

  return user.data;
}

export async function getUserById(
  client: SupabaseClient<Database>,
  id: string
) {
  return client
    .from("user")
    .select("*")
    .eq("id", id)
    .eq("active", true)
    .single();
}

export async function getUserByEmail(email: string) {
  return getSupabaseAdmin()
    .from("user")
    .select("*")
    .eq("email", email)
    .single();
}

export async function getUsers(client: SupabaseClient<Database>) {
  return client
    .from("user")
    .select("id, firstName, lastName, fullName, email, avatarUrl")
    .eq("active", true)
    .order("lastName");
}

export async function insertAttribute(
  client: SupabaseClient<Database>,
  attribute: {
    name: string;
    attributeDataTypeId: number;
    userAttributeCategoryId: number;
    listOptions?: string[];
    canSelfManage: boolean;
    createdBy: string;
  }
) {
  // TODO: there's got to be a better way to get the max
  const sortOrders = await client
    .from("userAttribute")
    .select("sortOrder")
    .eq("userAttributeCategoryId", attribute.userAttributeCategoryId);

  if (sortOrders.error) return sortOrders;
  const maxSortOrder = sortOrders.data.reduce((max, item) => {
    return Math.max(max, item.sortOrder);
  }, 0);

  return client
    .from("userAttribute")
    .upsert([{ ...attribute, sortOrder: maxSortOrder + 1 }])
    .select("id");
}

export async function insertAttributeCategory(
  client: SupabaseClient<Database>,
  attributeCategory: {
    name: string;
    public: boolean;
    createdBy: string;
  }
) {
  return client
    .from("userAttributeCategory")
    .upsert([attributeCategory])
    .select("id");
}

export async function insertEmployee(
  client: SupabaseClient<Database>,
  employee: EmployeeRow
) {
  return client.from("employee").insert([employee]);
}

async function insertUser(
  client: SupabaseClient<Database>,
  user: Omit<User, "fullName">
) {
  return client.from("user").insert([user]).select("*");
}

function makeClaimsFromEmployeeType({
  data,
}: {
  data: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    feature:
      | { id: string; name: string }
      | { id: string; name: string }[]
      | null;
  }[];
}) {
  const claims: Record<string, boolean> = {};

  data.forEach((permission) => {
    if (permission.feature === null || Array.isArray(permission.feature)) {
      throw new Error(
        `TODO: permission.feature is an array or null for permission ${JSON.stringify(
          permission,
          null,
          2
        )}`
      );
    }

    const module = permission.feature.name.toLowerCase();

    claims[`${module}_view`] = permission.view;
    claims[`${module}_create`] = permission.create;
    claims[`${module}_update`] = permission.update;
    claims[`${module}_delete`] = permission.delete;
  });

  return claims;
}

function isClaimPermission(key: string, value: unknown) {
  const action = key.split("_")[1];
  return (
    action !== undefined &&
    ["view", "create", "update", "delete"].includes(action) &&
    typeof value === "boolean"
  );
}

export function makeEmptyPermissionsFromFeatures(data: Feature[]) {
  return data.reduce<Record<string, { id: string; permission: Permission }>>(
    (acc, module) => {
      acc[module.name] = {
        id: module.id,
        permission: {
          view: false,
          create: false,
          update: false,
          delete: false,
        },
      };
      return acc;
    },
    {}
  );
}

export function makePermissionsFromClaims(claims: Json[] | null) {
  if (typeof claims !== "object" || claims === null) return null;
  let permissions: Record<string, Permission> = {};

  Object.entries(claims).forEach(([key, value]) => {
    if (isClaimPermission(key, value)) {
      const [module, action] = key.split("_");
      if (!(module in permissions)) {
        permissions[module] = {
          view: false,
          create: false,
          update: false,
          delete: false,
        };
      }

      switch (action) {
        case "view":
          permissions[module].view = value as boolean;
        case "create":
          permissions[module].create = value as boolean;
        case "update":
          permissions[module].update = value as boolean;
        case "delete":
          permissions[module].delete = value as boolean;
      }
    }
  });

  return permissions;
}

export function makePermissionsFromEmployeeType(
  data: EmployeeTypePermission[]
) {
  const result: Record<string, { id: string; permission: Permission }> = {};
  if (!data) return result;
  data.forEach((permission) => {
    if (Array.isArray(permission.feature) || !permission.feature) {
      // hmm... TODO: handle this
      throw new Error(
        `TODO: permission.Feature is an array or null for permission ${JSON.stringify(
          permission,
          null,
          2
        )}`
      );
    } else {
      result[permission.feature.name] = {
        id: permission?.feature?.id!,
        permission: {
          view: permission.view,
          create: permission.create,
          update: permission.update,
          delete: permission.delete,
        },
      };
    }
  });

  return result;
}

async function setUserClaims(userId: string, claims: Record<string, boolean>) {
  return getSupabaseAdmin().auth.admin.updateUserById(userId, {
    app_metadata: claims,
  });
}

export async function updateEmployee(
  client: SupabaseClient<Database>,
  {
    id,
    employeeType,
    permissions,
  }: {
    id: string;
    employeeType: string;
    permissions: Record<string, Permission>;
  }
): Promise<Result> {
  const updateEmployeeEmployeeType = await client
    .from("employee")
    .upsert([{ id, employeeTypeId: employeeType }]);

  if (updateEmployeeEmployeeType.error)
    return error(updateEmployeeEmployeeType.error, "Failed to update employee");

  return updatePermissions(client, { id, permissions });
}

export async function updatePermissions(
  client: SupabaseClient<Database>,
  {
    id,
    permissions,
    addOnly = false,
  }: { id: string; permissions: Record<string, Permission>; addOnly?: boolean }
): Promise<Result> {
  if (await client.rpc("is_claims_admin")) {
    const getClaims = await getClaimsById(client, id);

    if (getClaims.error) return error(getClaims.error, "Failed to get claims");

    const currentClaims =
      typeof getClaims.data !== "object" ||
      Array.isArray(getClaims.data) ||
      getClaims.data === null
        ? {}
        : getClaims.data;

    const newClaims: Record<string, boolean> = {};
    Object.entries(permissions).forEach(([name, permission]) => {
      const module = name.toLowerCase();
      if (!addOnly || permission.view)
        newClaims[`${module}_view`] = permission.view;
      if (!addOnly || permission.create)
        newClaims[`${module}_create`] = permission.create;
      if (!addOnly || permission.update)
        newClaims[`${module}_update`] = permission.update;
      if (!addOnly || permission.delete)
        newClaims[`${module}_delete`] = permission.delete;
    });

    const claimsUpdate = await setUserClaims(id, {
      ...currentClaims,
      ...newClaims,
    });
    if (claimsUpdate.error)
      return error(claimsUpdate.error, "Failed to update claims");

    await redis.del(getPermissionCacheKey(id));

    return success("Permissions updated");
  } else {
    return error(null, "You do not have permission to update permissions");
  }
}

export async function updateAttribute(
  client: SupabaseClient<Database>,
  attribute: {
    id?: number;
    name: string;
    listOptions?: string[];
    canSelfManage: boolean;
    updatedBy: string;
  }
) {
  if (!attribute.id) throw new Error("id is required");
  return client
    .from("userAttribute")
    .update({
      name: attribute.name,
      listOptions: attribute.listOptions,
      canSelfManage: attribute.canSelfManage,
      updatedBy: attribute.updatedBy,
    })
    .eq("id", attribute.id);
}

export async function updateAttributeCategory(
  client: SupabaseClient<Database>,
  attributeCategory: {
    id: number;
    name: string;
    public: boolean;
    updatedBy: string;
  }
) {
  const { id, ...update } = attributeCategory;
  return client.from("userAttributeCategory").update(update).eq("id", id);
}

export async function updateAttributeSortOrder(
  client: SupabaseClient<Database>,
  updates: {
    id: number;
    sortOrder: number;
    updatedBy: string;
  }[]
) {
  const updatePromises = updates.map(({ id, sortOrder, updatedBy }) =>
    client.from("userAttribute").update({ sortOrder, updatedBy }).eq("id", id)
  );
  return Promise.all(updatePromises);
}

export async function upsertEmployeeType(
  client: SupabaseClient<Database>,
  employeeType: { id?: string; name: string; color: string | null }
) {
  return client.from("employeeType").upsert([employeeType]).select("id");
}

export async function upsertEmployeeTypePermissions(
  client: SupabaseClient<Database>,
  employeeTypeId: string,
  permissions: { id: string; permission: Permission }[]
) {
  const employeeTypePermissions = permissions.map(({ id, permission }) => ({
    employeeTypeId,
    featureId: id,
    view: permission.view,
    create: permission.create,
    update: permission.update,
    delete: permission.delete,
  }));

  return client.from("employeeTypePermission").upsert(employeeTypePermissions);
}

export async function upsertGroup(
  client: SupabaseClient<Database>,
  {
    id,
    name,
  }: {
    id: string;
    name: string;
  }
) {
  return client.from("group").upsert([{ id, name }]);
}

export async function upsertGroupMembers(
  client: SupabaseClient<Database>,
  groupId: string,
  selections: string[]
) {
  const deleteExisting = await client
    .from("membership")
    .delete()
    .eq("groupId", groupId);

  if (deleteExisting.error) return deleteExisting;

  // separate each id according to whether it is a group or a user
  const memberGroups = selections
    .filter((id) => id.startsWith("group_"))
    .map((id) => ({
      groupId,
      memberGroupId: id.slice(6),
    }));

  const memberUsers = selections
    .filter((id) => id.startsWith("user_"))
    .map((id) => ({
      groupId,
      memberUserId: id.slice(5),
    }));

  return client.from("membership").insert([...memberGroups, ...memberUsers]);
}
