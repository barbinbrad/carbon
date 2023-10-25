import { Select } from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { useControlField, useField } from "remix-validated-form";
import type { getSupplierContacts } from "~/modules/purchasing";
import { path } from "~/utils/path";

const SupplierContact = ({
  name,
  label = "Supplier Contact",
  supplier,
  helperText,
  isReadOnly = false,
  onChange,
}: {
  name: string;
  label?: string;
  supplier?: string;
  helperText?: string;
  isReadOnly?: boolean;
  onChange?: (value?: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
}) => {
  const { error, getInputProps, defaultValue } = useField(name);

  const [supplierContact, setSupplierContact] = useControlField<{
    value: string | number;
    label: string;
  } | null>(name);

  const supplierContactsFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierContacts>>>();

  useEffect(() => {
    if (supplier)
      supplierContactsFetcher.load(path.to.api.supplierContacts(supplier));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier]);

  const supplierContacts = useMemo(
    () =>
      supplierContactsFetcher.data?.data?.map((c) => ({
        value: c.id,
        // @ts-ignore
        label: `${c.contact.firstName} ${c.contact.lastName}`,
      })) ?? [],
    [supplierContactsFetcher.data]
  );

  useEffect(() => {
    // if the initial value is in the options, set it, otherwise set to null
    if (supplierContacts) {
      setSupplierContact(
        supplierContacts.find((s) => s.value === defaultValue) ?? null
      );

      if (onChange) {
        const contact =
          supplierContactsFetcher.data?.data?.find((c) => c.id === defaultValue)
            ?.contact ?? undefined;

        if (Array.isArray(contact)) throw new Error("Contact is an array");
        if (contact) onChange(contact);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierContacts, defaultValue]);

  const onContactChange = (newValue?: { label: string; value: string }) => {
    setSupplierContact(newValue ?? null);
    if (onChange) {
      const contact =
        supplierContactsFetcher.data?.data?.find(
          (c) => c.id === newValue?.value
        )?.contact ?? undefined;

      if (Array.isArray(contact)) throw new Error("Contact is an array");

      onChange(contact);
    }
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Select
        {...getInputProps({
          // @ts-ignore
          id: name,
        })}
        options={supplierContacts}
        value={supplierContact}
        onChange={onContactChange}
        // @ts-ignore
        isReadOnly={isReadOnly}
        w="full"
      />
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default SupplierContact;
