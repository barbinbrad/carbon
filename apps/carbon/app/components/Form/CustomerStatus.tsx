import { useDisclosure, useMount } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useMemo, useRef, useState } from "react";
import { useRouteData } from "~/hooks";
import type {
  CustomerStatus as CustomerStatusStatus,
  getCustomerStatusesList,
} from "~/modules/sales";
import { CustomerStatusForm } from "~/modules/sales";
import { path } from "~/utils/path";
import type { ComboboxProps } from "./Combobox";
import CreatableCombobox from "./CreatableCombobox";

type CustomerStatusSelectProps = Omit<ComboboxProps, "options">;

const CustomerStatus = (props: CustomerStatusSelectProps) => {
  const customerStatusFetcher =
    useFetcher<Awaited<ReturnType<typeof getCustomerStatusesList>>>();

  const sharedCustomerData = useRouteData<{
    customerStatuses: CustomerStatusStatus[];
  }>(path.to.customerRoot);

  const newCustomerStatusModal = useDisclosure();
  const [created, setCreated] = useState<string>("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const hasCustomerData = sharedCustomerData?.customerStatuses;

  useMount(() => {
    if (!hasCustomerData)
      customerStatusFetcher.load(path.to.api.customerStatuses);
  });

  const options = useMemo(() => {
    const dataSource =
      (hasCustomerData
        ? sharedCustomerData.customerStatuses
        : customerStatusFetcher.data?.data) ?? [];

    return dataSource.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  }, [
    customerStatusFetcher.data?.data,
    hasCustomerData,
    sharedCustomerData?.customerStatuses,
  ]);

  return (
    <>
      <CreatableCombobox
        ref={triggerRef}
        options={options}
        {...props}
        label={props?.label ?? "CustomerStatus"}
        onCreateOption={(option) => {
          newCustomerStatusModal.onOpen();
          setCreated(option);
        }}
      />
      {newCustomerStatusModal.isOpen && (
        <CustomerStatusForm
          type="modal"
          onClose={() => {
            setCreated("");
            newCustomerStatusModal.onClose();
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

CustomerStatus.displayName = "CustomerStatus";

export default CustomerStatus;
