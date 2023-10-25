import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { purchaseInvoiceStatusType } from "~/modules/invoicing";
import { useSuppliers } from "~/stores";
import { path } from "~/utils/path";

const PurchaseInvoicesTableFilters = () => {
  const [suppliers] = useSuppliers();
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const borderColor = useColor("gray.200");

  const supplierOptions = suppliers
    .filter((supplier) => supplier.id && supplier.name)
    .map((supplier) => ({
      label: supplier.name,
      value: supplier.id,
    }));

  const purchaseInvoiceStatusOptions = purchaseInvoiceStatusType.map(
    (status) => ({
      label: status,
      value: status,
    })
  );

  return (
    <HStack
      px={4}
      py={3}
      justifyContent="space-between"
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      w="full"
    >
      <HStack spacing={2}>
        <DebouncedInput
          param="search"
          size="sm"
          minW={180}
          placeholder="Search"
        />
        <Select
          size="sm"
          value={purchaseInvoiceStatusOptions.find(
            (type) => type.value === params.get("status")
          )}
          isClearable
          options={purchaseInvoiceStatusOptions}
          onChange={(selected) => {
            setParams({ status: selected?.value });
          }}
          aria-label="Status"
          placeholder="Status"
        />
        <Select
          size="sm"
          value={supplierOptions.find(
            (supplier) => supplier.value === params.get("supplierId")
          )}
          isClearable
          options={supplierOptions}
          onChange={(selected) => {
            setParams({ supplierId: selected?.value });
          }}
          aria-label="Supplier"
          placeholder="Supplier"
        />
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "invoicing") && (
          <Button
            as={Link}
            to={path.to.newPurchaseInvoice}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Purchase Invoice
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default PurchaseInvoicesTableFilters;
