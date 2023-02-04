import type {
  getAttribute,
  getAttributeCategories,
  getAttributeCategory,
  getPeople,
} from "~/services/resources";

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

export type Person = NonNullable<
  Awaited<ReturnType<typeof getPeople>>["data"]
>[number];