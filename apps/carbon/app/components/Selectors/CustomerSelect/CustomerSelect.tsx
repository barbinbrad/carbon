import { createFilter, Select, useMount } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import type { getCustomersList } from "~/modules/sales";

type CustomerSelectProps = {
  value?: string;
  onChange?: (
    newValue: { value: string | number; label: string } | null
  ) => void;
};

const CustomerSelect = ({ value, onChange }: CustomerSelectProps) => {
  const customerFetcher =
    useFetcher<Awaited<ReturnType<typeof getCustomersList>>>();

  useMount(() => {
    customerFetcher.load("/api/sales/customers");
  });

  const options =
    customerFetcher.data?.data?.map((customer) => ({
      value: customer.id,
      label: customer.name,
    })) ?? [];

  return (
    <Select
      options={options}
      // Only search the labels (not the values)
      filterOption={createFilter({
        matchFrom: "any",
        stringify: (option) => `${option.label}`,
      })}
      isLoading={customerFetcher.state === "loading"}
      isMulti={false}
      placeholder="Select customer"
      onChange={onChange ? (newValue) => onChange(newValue) : undefined}
    />
  );
};

export default CustomerSelect;
