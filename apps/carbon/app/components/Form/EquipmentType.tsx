import { useDisclosure, useMount } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useMemo, useRef, useState } from "react";
import type { getEquipmentTypesList } from "~/modules/resources";
import { EquipmentTypeForm } from "~/modules/resources";
import { path } from "~/utils/path";
import type { ComboboxProps } from "./Combobox";
import CreatableCombobox from "./CreatableCombobox";

type EquipmentTypeSelectProps = Omit<ComboboxProps, "options">;

const EquipmentType = (props: EquipmentTypeSelectProps) => {
  const equipmentTypeFetcher =
    useFetcher<Awaited<ReturnType<typeof getEquipmentTypesList>>>();

  const newEquipmentTypeModal = useDisclosure();
  const [created, setCreated] = useState<string>("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  useMount(() => {
    equipmentTypeFetcher.load(path.to.api.equipmentTypes);
  });

  const options = useMemo(
    () =>
      equipmentTypeFetcher.data?.data
        ? equipmentTypeFetcher.data?.data.map((c) => ({
            value: c.id,
            label: c.name,
          }))
        : [],
    [equipmentTypeFetcher.data]
  );

  return (
    <>
      <CreatableCombobox
        ref={triggerRef}
        options={options}
        {...props}
        label={props?.label ?? "EquipmentType"}
        onCreateOption={(option) => {
          newEquipmentTypeModal.onOpen();
          setCreated(option);
        }}
      />
      {newEquipmentTypeModal.isOpen && (
        <EquipmentTypeForm
          type="modal"
          onClose={() => {
            setCreated("");
            newEquipmentTypeModal.onClose();
            triggerRef.current?.click();
          }}
          initialValues={{
            name: created,
            description: "",
            setupHours: 0,
          }}
        />
      )}
    </>
  );
};

EquipmentType.displayName = "EquipmentType";

export default EquipmentType;
