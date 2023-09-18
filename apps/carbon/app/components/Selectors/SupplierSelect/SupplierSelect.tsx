import { createFilter, Select } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import type { getSuppliersList } from "~/modules/purchasing";

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
    supplierFetcher.load("/api/purchasing/suppliers");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options =
    supplierFetcher.data?.data?.map((supplier) => ({
      value: supplier.id,
      label: supplier.name,
    })) ?? [];

  return (
    <Select
      options={options}
      // Only search the labels (not the values)
      filterOption={createFilter({
        matchFrom: "any",
        stringify: (option) => `${option.label}`,
        ignoreAccents: false,
      })}
      isLoading={supplierFetcher.state === "loading"}
      isMulti={false}
      placeholder="Select supplier"
      onChange={onChange ? (newValue) => onChange(newValue) : undefined}
    />
  );
};

export default SupplierSelect;
