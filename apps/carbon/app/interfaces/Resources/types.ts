import type {
  getAttribute,
  getAttributeCategories,
  getAttributeCategory,
  getPeople,
  getNotes,
  getAbility,
  getAbilities,
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

export type Note = NonNullable<
  Awaited<ReturnType<typeof getNotes>>["data"]
>[number];

export type Person = NonNullable<
  Awaited<ReturnType<typeof getPeople>>["data"]
>[number];
