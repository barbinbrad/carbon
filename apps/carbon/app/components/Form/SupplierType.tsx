import { useDisclosure, useMount } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useMemo, useRef, useState } from "react";
import { useRouteData } from "~/hooks";
import type {
  SupplierType as SupplierTypeType,
  getSupplierTypesList,
} from "~/modules/purchasing";
import { SupplierTypeForm } from "~/modules/purchasing";
import { path } from "~/utils/path";
import type { ComboboxProps } from "./Combobox";
import CreatableCombobox from "./CreatableCombobox";

type SupplierTypeSelectProps = Omit<ComboboxProps, "options">;

const SupplierType = (props: SupplierTypeSelectProps) => {
  const supplierTypeFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierTypesList>>>();

  const sharedSupplierData = useRouteData<{
    supplierTypes: SupplierTypeType[];
  }>(path.to.supplierRoot);

  const newSupplierTypeModal = useDisclosure();
  const [created, setCreated] = useState<string>("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const hasSupplierData = sharedSupplierData?.supplierTypes;

  useMount(() => {
    if (!hasSupplierData) supplierTypeFetcher.load(path.to.api.supplierTypes);
  });

  const options = useMemo(() => {
    const dataSource =
      (hasSupplierData
        ? sharedSupplierData.supplierTypes
        : supplierTypeFetcher.data?.data) ?? [];

    return dataSource.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  }, [
    supplierTypeFetcher.data?.data,
    hasSupplierData,
    sharedSupplierData?.supplierTypes,
  ]);

  return (
    <>
      <CreatableCombobox
        ref={triggerRef}
        options={options}
        {...props}
        label={props?.label ?? "SupplierType"}
        onCreateOption={(option) => {
          newSupplierTypeModal.onOpen();
          setCreated(option);
        }}
      />
      {newSupplierTypeModal.isOpen && (
        <SupplierTypeForm
          type="modal"
          onClose={() => {
            setCreated("");
            newSupplierTypeModal.onClose();
            triggerRef.current?.click();
          }}
          initialValues={{
            name: created,
            color: "#000000",
          }}
        />
      )}
    </>
  );
};

SupplierType.displayName = "SupplierType";

export default SupplierType;
