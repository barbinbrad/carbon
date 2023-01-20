import { Select, createFilter } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import type { getCustomersList } from "~/services/sales";
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
    customerFetcher.load("/resource/sales/customers");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
