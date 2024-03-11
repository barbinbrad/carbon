import { useDisclosure, useMount } from "@carbon/react";
import { getLocalTimeZone } from "@internationalized/date";
import { useFetcher } from "@remix-run/react";
import { useMemo, useRef, useState } from "react";
import type { getLocationsList } from "~/modules/resources";
import { LocationForm } from "~/modules/resources";
import { path } from "~/utils/path";
import type { ComboboxProps } from "./Combobox";
import CreatableCombobox from "./CreatableCombobox";

type LocationSelectProps = Omit<ComboboxProps, "options">;

const Location = (props: LocationSelectProps) => {
  const locationFetcher =
    useFetcher<Awaited<ReturnType<typeof getLocationsList>>>();

  const newLocationModal = useDisclosure();
  const [created, setCreated] = useState<string>("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  useMount(() => {
    locationFetcher.load(path.to.api.locations);
  });

  const options = useMemo(
    () =>
      locationFetcher.data?.data
        ? locationFetcher.data?.data.map((c) => ({
            value: c.id,
            label: c.name,
          }))
        : [],
    [locationFetcher.data]
  );

  console.log("value", props.value);

  return (
    <>
      <CreatableCombobox
        ref={triggerRef}
        options={options}
        {...props}
        label={props?.label ?? "Location"}
        onCreateOption={(option) => {
          newLocationModal.onOpen();
          setCreated(option);
        }}
      />
      {newLocationModal.isOpen && (
        <LocationForm
          type="modal"
          onClose={() => {
            setCreated("");
            newLocationModal.onClose();
            triggerRef.current?.click();
          }}
          initialValues={{
            name: created,
            timezone: getLocalTimeZone(),
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
          }}
        />
      )}
    </>
  );
};

Location.displayName = "Location";

export default Location;
