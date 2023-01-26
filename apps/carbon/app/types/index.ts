import type { OptionBase } from "@carbon/react";
import type { TypedResponse } from "@remix-run/node";
import type { ReactElement } from "react";
import type { ValidationErrorResponseData } from "remix-validated-form";

export type Authenticated<T> = T & {
  role?: Role;
  permission?: string;
};

export type FormActionData = Promise<
  TypedResponse<ValidationErrorResponseData> | TypedResponse<Result>
>;

export type NavItem = Omit<Route, "icon"> & {
  icon: ReactElement;
};

export type Result = {
  success: boolean;
  message?: string;
};

export type Role = "employee" | "customer" | "supplier";

export type Route = {
  name: string;
  to: string;
  icon?: any;
};

export interface SelectOption extends OptionBase {
  label: string;
  value: string;
}
