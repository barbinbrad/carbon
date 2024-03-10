import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useRef } from "react";
import {
  SupplierLocationForm,
  type SupplierLocation as SupplierLocationType,
  type getSupplierLocations,
} from "~/modules/purchasing";
import { path } from "~/utils/path";

import { useDisclosure } from "@carbon/react";
import type { ComboboxProps } from "./Combobox";
import CreatableCombobox from "./CreatableCombobox";

type SupplierLocationSelectProps = Omit<
  ComboboxProps,
  "options" | "onChange"
> & {
  supplier?: string;
  onChange?: (supplier: SupplierLocationType | null) => void;
};

const SupplierLocation = (props: SupplierLocationSelectProps) => {
  const supplierLocationsFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierLocations>>>();

  const newLocationModal = useDisclosure();
  // const [created, setCreated] = useState<string>("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (props?.supplier) {
      supplierLocationsFetcher.load(
        path.to.api.supplierLocations(props.supplier)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.supplier]);

  const options = useMemo(
    () =>
      supplierLocationsFetcher.data?.data?.map((c) => ({
        value: c.id,
        label: `${c.address?.addressLine1} ${c.address?.city}, ${c.address?.state}`,
      })) ?? [],

    [supplierLocationsFetcher.data]
  );

  const onChange = (newValue: { label: string; value: string } | null) => {
    const location =
      supplierLocationsFetcher.data?.data?.find(
        (location) => location.id === newValue?.value
      ) ?? null;

    props.onChange?.(location as SupplierLocationType | null);
  };

  return (
    <>
      <CreatableCombobox
        ref={triggerRef}
        options={options}
        {...props}
        label={props?.label ?? "Supplier Location"}
        onChange={onChange}
        onCreateOption={(option) => {
          newLocationModal.onOpen();
          // setCreated(option);
        }}
      />
      {newLocationModal.isOpen && (
        <SupplierLocationForm
          supplierId={props.supplier!}
          type="modal"
          onClose={() => {
            // setCreated("");
            newLocationModal.onClose();
            triggerRef.current?.click();
          }}
          initialValues={{}}
        />
      )}
    </>
  );
};

export default SupplierLocation;
