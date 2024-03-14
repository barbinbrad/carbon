import { useDisclosure, useMount } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useMemo, useRef, useState } from "react";
import type { getDepartmentsList } from "~/modules/resources";
import { DepartmentForm } from "~/modules/resources";
import { path } from "~/utils/path";
import type { ComboboxProps } from "./Combobox";
import CreatableCombobox from "./CreatableCombobox";

type DepartmentSelectProps = Omit<ComboboxProps, "options">;

const Department = (props: DepartmentSelectProps) => {
  const departmentFetcher =
    useFetcher<Awaited<ReturnType<typeof getDepartmentsList>>>();

  const newDepartmentModal = useDisclosure();
  const [created, setCreated] = useState<string>("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  useMount(() => {
    departmentFetcher.load(path.to.api.departments);
  });

  const options = useMemo(
    () =>
      departmentFetcher.data?.data
        ? departmentFetcher.data?.data.map((c) => ({
            value: c.id,
            label: c.name,
          }))
        : [],
    [departmentFetcher.data]
  );

  return (
    <>
      <CreatableCombobox
        ref={triggerRef}
        options={options}
        {...props}
        label={props?.label ?? "Department"}
        onCreateOption={(option) => {
          newDepartmentModal.onOpen();
          setCreated(option);
        }}
      />
      {newDepartmentModal.isOpen && (
        <DepartmentForm
          type="modal"
          onClose={() => {
            setCreated("");
            newDepartmentModal.onClose();
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

Department.displayName = "Department";

export default Department;
