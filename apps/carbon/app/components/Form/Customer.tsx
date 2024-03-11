import { useDisclosure } from "@carbon/react";
import { useMemo, useRef, useState } from "react";
import { CustomerForm } from "~/modules/sales";
import { useCustomers } from "~/stores";
import type { ComboboxProps } from "./Combobox";
import CreatableCombobox from "./CreatableCombobox";

type CustomerSelectProps = Omit<ComboboxProps, "options">;

const Customer = (props: CustomerSelectProps) => {
  const [suppliers] = useCustomers();
  const newCustomersModal = useDisclosure();
  const [created, setCreated] = useState<string>("");
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
        label={props?.label ?? "Customer"}
        onCreateOption={(option) => {
          newCustomersModal.onOpen();
          setCreated(option);
        }}
      />
      {newCustomersModal.isOpen && (
        <CustomerForm
          type="modal"
          onClose={() => {
            setCreated("");
            newCustomersModal.onClose();
            triggerRef.current?.click();
          }}
          initialValues={{
            name: created,
          }}
        />
      )}
    </>
  );
};

Customer.displayName = "Customer";

export default Customer;
