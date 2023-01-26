import { Select, createFilter } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import type { getSuppliersList } from "~/services/purchasing";
import { mapRowsToOptions } from "~/utils/form";

type SupplierSelectProps = {
  value?: string;
  onChange?: (
    newValue: { value: string | number; label: string } | null
  ) => void;
};

const SupplierSelect = ({ value, onChange }: SupplierSelectProps) => {
  const supplierFetcher =
    useFetcher<Awaited<ReturnType<typeof getSuppliersList>>>();

  useEffect(() => {
    if (supplierFetcher.type === "init") {
      supplierFetcher.load("/resource/purchasing/suppliers");
    }
  }, [supplierFetcher]);

  const options = mapRowsToOptions({
    data: supplierFetcher.data?.data,
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
      isLoading={supplierFetcher.state === "loading"}
      isMulti={false}
      placeholder="Select supplier"
      onChange={onChange ? (newValue) => onChange(newValue) : undefined}
    />
  );
};

export default SupplierSelect;
