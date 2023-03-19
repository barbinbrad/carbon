import { Select, createFilter } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import type { getCustomersList } from "~/modules/sales";
import { mapRowsToOptions } from "~/utils/form";

type CustomerSelectProps = {
  value?: string;
  onChange?: (
    newValue: { value: string | number; label: string } | null
  ) => void;
};

const CustomerSelect = ({ value, onChange }: CustomerSelectProps) => {
  const customerFetcher =
    useFetcher<Awaited<ReturnType<typeof getCustomersList>>>();

  useEffect(() => {
    if (customerFetcher.type === "init") {
      customerFetcher.load("/api/sales/customers");
    }
  }, [customerFetcher]);

  const options = mapRowsToOptions({
    data: customerFetcher.data?.data,
    value: "id",
    label: "name",
  });

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
