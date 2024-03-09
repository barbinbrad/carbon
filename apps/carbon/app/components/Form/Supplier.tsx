import { useDisclosure } from "@carbon/react";
import { useMemo, useRef, useState } from "react";
import { SupplierForm } from "~/modules/purchasing";
import { useSuppliers } from "~/stores";
import type { ComboboxProps } from "./Combobox";
import CreatableCombobox from "./CreatableCombobox";

type SupplierSelectProps = Omit<ComboboxProps, "options">;

const Supplier = (props: SupplierSelectProps) => {
  const [suppliers] = useSuppliers();
  const newSuppliersModal = useDisclosure();
  const [createdSupplier, setCreatedSupplier] = useState<string>("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const options = useMemo(
    () =>
      suppliers.map((c) => ({
        value: c.id,
        label: c.name,
      })) ?? [],
    [suppliers]
  );

  return (
    <>
      <CreatableCombobox
        ref={triggerRef}
        options={options}
        {...props}
        label={props?.label ?? "Supplier"}
        onCreateOption={(option) => {
          newSuppliersModal.onOpen();
          setCreatedSupplier(option);
        }}
      />
      {newSuppliersModal.isOpen && (
        <SupplierForm
          type="modal"
          onClose={() => {
            setCreatedSupplier("");
            newSuppliersModal.onClose();
            triggerRef.current?.click();
          }}
          initialValues={{
            name: createdSupplier,
          }}
        />
      )}
    </>
  );
};

Supplier.displayName = "Supplier";

export default Supplier;
