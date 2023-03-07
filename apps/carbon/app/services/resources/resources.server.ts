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

export async function deleteLocation(
  client: SupabaseClient<Database>,
  locationId: string
) {
  return client.from("location").delete().eq("id", locationId);
}

export async function deleteNote(
  client: SupabaseClient<Database>,
  noteId: string
) {
  return client.from("userNote").update({ active: false }).eq("id", noteId);
}

export async function deleteShift(
  client: SupabaseClient<Database>,
  shiftId: string
) {
  // TODO: Set all employeeShifts to null
  return client.from("shift").update({ active: false }).eq("id", shiftId);
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
  employeeAbilityId: string
) {
  return client
    .from("employeeAbility")
    .select(
      `id, lastTrainingDate, trainingDays, trainingCompleted, user(id, fullName, avatarUrl)`
    )
    .eq("abilityId", abilityId)
    .eq("id", employeeAbilityId)
    .eq("active", true)
    .single();
}

export async function getEmployeeAbilities(
  client: SupabaseClient<Database>,
  employeeId: string
) {
  return client
    .from("employeeAbility")
    .select(
      `id, lastTrainingDate, trainingDays, trainingCompleted, ability(id, name, curve, shadowWeeks)`
    )
    .eq("employeeId", employeeId)
    .eq("active", true);
}

export async function getEmployeeJob(
  client: SupabaseClient<Database>,
  employeeId: string
) {
  return client
    .from("employeeJob")
    .select("title, locationId, shiftId, managerId")
    .eq("id", employeeId)
    .single();
}

export async function getEquipment(
  client: SupabaseClient<Database>,
  equipmentId: string
) {
  return client
    .from("equipment")
    .select(
      "id, name, description, operatorsRequired, equipmentType(id, name), workCell(id, name)"
    )
    .eq("id", equipmentId)
    .eq("active", true)
    .single();
}

export async function getEquipmentType(
  client: SupabaseClient<Database>,
  equipmentTypeId: string
) {
  return client
    .from("equipmentType")
    .select("id, name, color, description, equipment(id, name)")
    .eq("active", true)
    .eq("id", equipmentTypeId)
    .single();
}

export async function getEquipmentTypes(
  client: SupabaseClient<Database>,
  args?: { name: string | null } & GenericQueryFilters
) {
  let query = client
    .from("equipmentType")
    .select("id, name, color, description, equipment(id, name)", {
      count: "exact",
    })
    .eq("active", true)
    .eq("equipment.active", true);

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function getLocation(
  client: SupabaseClient<Database>,
  locationId: string
) {
  return client
    .from("location")
    .select(`id, name, latitude, longitude, timezone`)
    .eq("id", locationId)
    .single();
}

export async function getLocations(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & { name: string | null }
) {
  let query = client
    .from("location")
    .select(`id, name, latitude, longitude, timezone`, { count: "exact" });

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function getLocationsList(client: SupabaseClient<Database>) {
  return client.from("location").select(`id, name`);
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

export async function getShift(
  client: SupabaseClient<Database>,
  shiftId: string
) {
  return client
    .from("shift")
    .select(
      `id, name, startTime, endTime, locationId,
      monday, tuesday, wednesday, thursday, friday, saturday, sunday, 
      employeeShift(user(id, fullName, avatarUrl)), location(name, timezone)`
    )
    .eq("id", shiftId)
    .eq("active", true)
    .single();
}

export async function getShifts(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & { name: string | null; location: string | null }
) {
  let query = client
    .from("shift")
    .select(
      `id, name, startTime, endTime, locationId, 
      monday, tuesday, wednesday, thursday, friday, saturday, sunday,
      employeeShift(user(id, fullName, avatarUrl)), location(name, timezone)`,
      {
        count: "exact",
      }
    )
    .eq("active", true)
    .eq("employeeShift.user.active", true);

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args.location) {
    query = query.eq("locationId", args.location);
  }

  query = setGenericQueryFilters(query, args, "locationId");
  return query;
}

export async function getShiftsList(
  client: SupabaseClient<Database>,
  locationId: string | null
) {
  let query = client.from("shift").select(`id, name`).eq("active", true);

  if (locationId) {
    query = query.eq("locationId", locationId);
  }

  return query;
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

export async function upsertEmployeeJob(
  client: SupabaseClient<Database>,
  employeeId: string,
  employeeJob: {
    title: string | null;
    locationId: string | null;
    shiftId: string | null;
    managerId: string | null;
  }
) {
  return client
    .from("employeeJob")
    .upsert([{ id: employeeId, ...employeeJob }]);
}

export async function upsertEquipment(
  client: SupabaseClient<Database>,
  equipment:
    | {
        name: string;
        description: string;
        equipmentTypeId: string;
        operatorsRequired?: number;
        workCellId?: string;
        createdBy: string;
      }
    | {
        id: string;
        name: string;
        description: string;
        equipmentTypeId: string;
        operatorsRequired?: number;
        workCellId?: string;
        updatedBy: string;
      }
) {
  if ("id" in equipment) {
    const { id, ...update } = equipment;
    return client
      .from("equipment")
      .update({ ...update })
      .eq("id", id);
  }
  return client.from("equipment").insert([equipment]).select("id");
}

export async function upsertEquipmentType(
  client: SupabaseClient<Database>,
  equipmentType:
    | {
        name: string;
        description: string;
        color: string;
        createdBy: string;
      }
    | {
        id: string;
        name: string;
        description: string;
        color: string;
        updatedBy: string;
      }
) {
  if ("id" in equipmentType) {
    const { id, ...update } = equipmentType;
    return client
      .from("equipmentType")
      .update({ ...update })
      .eq("id", id);
  }
  return client.from("equipmentType").insert([equipmentType]).select("id");
}

export async function upsertLocation(
  client: SupabaseClient<Database>,
  location: {
    id?: string;
    name: string;
    timezone: string;
    latitude: number | null;
    longitude: number | null;
  }
) {
  const { id, ...update } = location;
  if (id) {
    return client
      .from("location")
      .update({ ...update })
      .eq("id", id);
  }
  return client.from("location").insert([update]).select("id");
}

export async function upsertShift(
  client: SupabaseClient<Database>,
  shift: {
    id?: string;
    name: string;
    startTime: string;
    endTime: string;
    locationId: string;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  }
) {
  const { id, ...update } = shift;
  if (id) {
    return client
      .from("shift")
      .update({ ...update })
      .eq("id", id);
  }

  return client.from("shift").insert([update]).select("id");
}
