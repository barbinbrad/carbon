import type {
  getAbilities,
  getAttribute,
  getAttributeCategories,
  getAttributeCategory,
  getPeople,
  getNotes,
} from "~/services/resources";

export type Ability = NonNullable<
  Awaited<ReturnType<typeof getAbilities>>["data"]
>[number];

export type AbilityDatum = {
  id: number;
  week: number;
  value: number;
};

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
