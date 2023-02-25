import type {
  getAttribute,
  getAttributeCategories,
  getAttributeCategory,
  getPeople,
  getNotes,
  getAbility,
  getAbilities,
  getEmployeeAbilities,
  getShifts,
  getLocations,
} from "~/services/resources";

export type Ability = NonNullable<
  Awaited<ReturnType<typeof getAbility>>["data"]
>;

export type Abilities = NonNullable<
  Awaited<ReturnType<typeof getAbilities>>["data"]
>;

export type AbilityDatum = {
  week: number;
  value: number;
};

export type AbilityEmployees = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getAbility>>["data"]>["employeeAbility"]
>;

export enum AbilityEmployeeStatus {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Complete = "Complete",
}

export function getTrainingStatus(
  employeeAbility: {
    lastTrainingDate: string | null;
    trainingDays: number;
    trainingCompleted: boolean | null;
  } | null
) {
  if (!employeeAbility) return undefined;
  if (employeeAbility.trainingCompleted) return AbilityEmployeeStatus.Complete;
  if (employeeAbility.trainingDays > 0) return AbilityEmployeeStatus.InProgress;
  return AbilityEmployeeStatus.NotStarted;
}

export type Attribute = NonNullable<
  Awaited<ReturnType<typeof getAttribute>>["data"]
>;

export type AttributeCategory = NonNullable<
  Awaited<ReturnType<typeof getAttributeCategories>>["data"]
>[number];

export type AttributeCategoryDetail = NonNullable<
  Awaited<ReturnType<typeof getAttributeCategory>>["data"]
>;

export type AttributeDataType = {
  id: number;
  label: string;
  isBoolean: boolean;
  isDate: boolean;
  isList: boolean;
  isNumeric: boolean;
  isText: boolean;
};

export type EmployeeAbility = NonNullable<
  Awaited<ReturnType<typeof getEmployeeAbilities>>["data"]
>[number];

export type Note = NonNullable<
  Awaited<ReturnType<typeof getNotes>>["data"]
>[number];

export type Person = NonNullable<
  Awaited<ReturnType<typeof getPeople>>["data"]
>[number];

export type Shift = NonNullable<
  Awaited<ReturnType<typeof getShifts>>["data"]
>[number];

export type ShiftLocation = NonNullable<
  Awaited<ReturnType<typeof getLocations>>["data"]
>[number];
