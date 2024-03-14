import { useDisclosure, useMount } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useMemo, useRef, useState } from "react";
import { useRouteData } from "~/hooks";
import type { SupplierStatus } from "~/modules/purchasing";
import type { getCustomerTypesList } from "~/modules/sales";
import { CustomerTypeForm } from "~/modules/sales";
import { path } from "~/utils/path";
import type { ComboboxProps } from "./Combobox";
import CreatableCombobox from "./CreatableCombobox";

type CustomerTypeSelectProps = Omit<ComboboxProps, "options">;

const CustomerType = (props: CustomerTypeSelectProps) => {
  const customerTypeFetcher =
    useFetcher<Awaited<ReturnType<typeof getCustomerTypesList>>>();

  const sharedCustomerData = useRouteData<{
    customerTypes: SupplierStatus[];
  }>(path.to.customerRoot);

  const newCustomerTypeModal = useDisclosure();
  const [created, setCreated] = useState<string>("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const hasSupplierData = sharedCustomerData?.customerTypes;

  useMount(() => {
    if (!hasSupplierData) customerTypeFetcher.load(path.to.api.customerTypes);
  });

  const options = useMemo(() => {
    const dataSource =
      (hasSupplierData
        ? sharedCustomerData.customerTypes
        : customerTypeFetcher.data?.data) ?? [];

    return dataSource.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  }, [
    customerTypeFetcher.data?.data,
    hasSupplierData,
    sharedCustomerData?.customerTypes,
  ]);

  return (
    <>
      <CreatableCombobox
        ref={triggerRef}
        options={options}
        {...props}
        label={props?.label ?? "CustomerType"}
        onCreateOption={(option) => {
          newCustomerTypeModal.onOpen();
          setCreated(option);
        }}
      />
      {newCustomerTypeModal.isOpen && (
        <CustomerTypeForm
          type="modal"
          onClose={() => {
            setCreated("");
            newCustomerTypeModal.onClose();
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

CustomerType.displayName = "CustomerType";

export default CustomerType;
