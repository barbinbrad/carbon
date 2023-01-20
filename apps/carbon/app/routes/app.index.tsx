import { Box } from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import { Customer, Supplier } from "~/components/Form";
import { UserSelect } from "~/components/Selectors";

export default function AppRoute() {
  return (
    <Box maxW={400} p={4}>
      <ValidatedForm
        validator={{}}
        defaultValues={{
          customer: "65f49bca-c301-4656-994d-6e5a43cd9296",
          supplier: "f9a5d989-cb5f-41f6-9c16-69910a0c4b0e",
        }}
      >
        <Customer name="customer" label="Customer" />
        <Supplier name="supplier" label="Supplier" />
      </ValidatedForm>
      <UserSelect
        isMulti
        placeholder="Select users"
        selectionsMaxHeight={"calc(100vh - 120px)"}
        value={"00000000-0000-0000-0000-000000000000"}
      />
    </Box>
  );
}
