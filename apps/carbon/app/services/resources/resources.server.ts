import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DataType, Employee } from "~/interfaces/Users/types";
import { getEmployees } from "~/services/users";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";

export async function deleteAbility(
  client: SupabaseClient<Database>,
  abilityId: string,
  hardDelete = false
) {
  return hardDelete
    ? client.from("ability").delete().eq("id", abilityId)
    : client.from("ability").update({ active: false }).eq("id", abilityId);
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
  return client
    .from("userAttributeCategory")
    .update({ active: false })
    .eq("id", attributeCategoryId);
}

export async function deleteEmployeeAbility(
  client: SupabaseClient<Database>,
  employeeAbilityId: string
) {
  return client
    .from("employeeAbility")
    .update({ active: false })
    .eq("id", employeeAbilityId);
}

export async function deleteNote(
  client: SupabaseClient<Database>,
  noteId: string
) {
  return client.from("userNote").update({ active: false }).eq("id", noteId);
}

export async function getAbilities(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & { name: string | null }
) {
  let query = client
    .from("ability")
    .select(
      `id, name, curve, shadowWeeks, employeeAbility(user(id, fullName, avatarUrl))`,
      {
        count: "exact",
      }
    )
    .eq("active", true)
    .eq("employeeAbility.active", true)
    .eq("employeeAbility.user.active", true);

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  query = setGenericQueryFilters(query, args, "name");
  return query;
}

export async function getAbility(
  client: SupabaseClient<Database>,
  abilityId: string
) {
  return client
    .from("ability")
    .select(
      `id, name, curve, shadowWeeks, employeeAbility(id, user(id, fullName, avatarUrl, active), lastTrainingDate, trainingDays, trainingCompleted)`,
      {
        count: "exact",
      }
    )
    .eq("id", abilityId)
    .eq("active", true)
    .eq("employeeAbility.active", true)
    .eq("employeeAbility.user.active", true)
    .single();
}

export async function getAttribute(
  client: SupabaseClient<Database>,
  attributeId: string
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

async function getAttributes(
  client: SupabaseClient<Database>,
  userIds: string[]
) {
  return client
    .from("userAttributeCategory")
    .select(
      `id, name,
      userAttribute(id, name, listOptions, canSelfManage,
        attributeDataType(id, isBoolean, isDate, isNumeric, isText, isUser),
        userAttributeValue(
          id, userId, valueBoolean, valueDate, valueNumeric, valueText, valueUser, user!userAttributeValue_userId_fkey(id, fullName, avatarUrl)
        )
      )`
    )
    .eq("userAttribute.active", true)
    .in("userAttribute.userAttributeValue.userId", [userIds])
    .order("sortOrder", { foreignTable: "userAttribute", ascending: true });
}

export async function getAttributeCategories(
  client: SupabaseClient<Database>,
  args?: { name: string | null } & GenericQueryFilters
) {
  let query = client
    .from("userAttributeCategory")
    .select(
      "id, name, protected, public, userAttribute(id, name, attributeDataType(id))",
      {
        count: "exact",
      }
    )
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
  id: string
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

export async function getEmployeeAbility(
  client: SupabaseClient<Database>,
  abilityId: string,
  employeeId: string
) {
  return client
    .from("employeeAbility")
    .select(
      `id, lastTrainingDate, trainingDays, trainingCompleted, user(id, fullName, avatarUrl)`
    )
    .eq("abilityId", abilityId)
    .eq("id", employeeId)
    .eq("active", true)
    .single();
}

export async function getNotes(
  client: SupabaseClient<Database>,
  userId: string
) {
  return client
    .from("userNote")
    .select(
      // need to use user!notes_createdBy_fkey instead of user because there
      // are two possible users that could be joined on (the other is userId)
      "id, note, createdAt, user!notes_createdBy_fkey(id, fullName, avatarUrl)"
    )
    .eq("userId", userId)
    .eq("active", true)
    .order("createdAt");
}

type UserAttributeId = string;

export type PersonAttributeValue = {
  userAttributeValueId: string;
  value: boolean | string | number;
  dataType?: DataType;
  user?: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
};

type PersonAttributes = Record<UserAttributeId, PersonAttributeValue>;

type Person = Employee & {
  attributes: PersonAttributes;
};

export async function getPeople(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    name: string | null;
    type: string | null;
    active: boolean | null;
  }
) {
  const employees = await getEmployees(client, args);
  if (employees.error) return employees;

  if (!employees.data) throw new Error("Failed to get employee data");

  const userIds = employees.data.map((employee) => {
    if (!employee.user || Array.isArray(employee.user))
      throw new Error("employee.user is an array");
    return employee.user.id;
  });

  const attributeCategories = await getAttributes(client, userIds);
  if (attributeCategories.error) return attributeCategories;

  const people: Person[] = employees.data.map((employee) => {
    if (!employee.user || Array.isArray(employee.user))
      throw new Error("employee.user is an array");

    const userId = employee.user.id;

    const employeeAttributes =
      attributeCategories.data.reduce<PersonAttributes>((acc, category) => {
        if (!category.userAttribute || !Array.isArray(category.userAttribute))
          return acc;
        category.userAttribute.forEach((attribute) => {
          if (
            attribute.userAttributeValue &&
            Array.isArray(attribute.userAttributeValue) &&
            !Array.isArray(attribute.attributeDataType)
          ) {
            const userAttributeId = attribute.id;
            const userAttributeValue = attribute.userAttributeValue.find(
              (attributeValue) => attributeValue.userId === userId
            );
            const value =
              typeof userAttributeValue?.valueBoolean === "boolean"
                ? userAttributeValue.valueBoolean
                : userAttributeValue?.valueDate ||
                  userAttributeValue?.valueNumeric ||
                  userAttributeValue?.valueText ||
                  userAttributeValue?.valueUser;

            if (value && userAttributeValue?.id) {
              acc[userAttributeId] = {
                userAttributeValueId: userAttributeValue.id,
                dataType: attribute.attributeDataType?.id as DataType,
                value,
                user: !Array.isArray(userAttributeValue.user)
                  ? userAttributeValue.user
                  : undefined,
              };
            }
          }
        });
        return acc;
      }, {});

    return {
      ...employee,
      attributes: employeeAttributes,
    };
  });

  return {
    count: employees.count,
    data: people,
    error: null,
  };
}

export async function insertAbility(
  client: SupabaseClient<Database>,
  ability: {
    name: string;
    curve: {
      data: {
        week: number;
        value: number;
      }[];
    };
    shadowWeeks: number;
    createdBy: string;
  }
) {
  return client.from("ability").insert([ability]).select("id");
}

export async function insertEmployeeAbilities(
  client: SupabaseClient<Database>,
  abilityId: string,
  employeeIds: string[]
) {
  const employeeAbilities = employeeIds.map((employeeId) => ({
    abilityId,
    employeeId,
    trainingCompleted: true,
  }));

  return client.from("employeeAbility").insert(employeeAbilities).select("id");
}

export async function insertAttribute(
  client: SupabaseClient<Database>,
  attribute: {
    name: string;
    attributeDataTypeId: number;
    userAttributeCategoryId: string;
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

export async function insertNote(
  client: SupabaseClient<Database>,
  note: {
    userId: string;
    note: string;
    createdBy: string;
  }
) {
  return client.from("userNote").insert([note]).select("id");
}

export async function updateAbility(
  client: SupabaseClient<Database>,
  id: string,
  ability: Partial<{
    name: string;
    curve: {
      data: {
        week: number;
        value: number;
      }[];
    };
    shadowWeeks: number;
  }>
) {
  return client.from("ability").update(ability).eq("id", id);
}

export async function updateAttribute(
  client: SupabaseClient<Database>,
  attribute: {
    id?: string;
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
    id: string;
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
    id: string;
    sortOrder: number;
    updatedBy: string;
  }[]
) {
  const updatePromises = updates.map(({ id, sortOrder, updatedBy }) =>
    client.from("userAttribute").update({ sortOrder, updatedBy }).eq("id", id)
  );
  return Promise.all(updatePromises);
}

export async function upsertEmployeeAbility(
  client: SupabaseClient<Database>,
  employeeAbility: {
    id?: string;
    abilityId: string;
    employeeId: string;
    trainingCompleted: boolean;
    trainingDays?: number;
  }
) {
  const { id, ...update } = employeeAbility;
  if (id) {
    return client
      .from("employeeAbility")
      .update({ ...update })
      .eq("id", id);
  }

  const deactivatedId = await client
    .from("employeeAbility")
    .select("id")
    .eq("employeeId", employeeAbility.employeeId)
    .eq("abilityId", employeeAbility.abilityId)
    .eq("active", false)
    .single();

  if (deactivatedId.data?.id) {
    return client
      .from("employeeAbility")
      .update({ ...update, active: true })
      .eq("id", deactivatedId.data.id);
  }

  return client
    .from("employeeAbility")
    .insert([{ ...update }])
    .select("id");
}
