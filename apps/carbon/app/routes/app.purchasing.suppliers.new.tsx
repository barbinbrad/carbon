import { SupplierForm } from "~/interfaces/Purchasing/Suppliers";

export default function SuppliersNewRoute() {
  const initialValues = {
    name: "",
  };
  return <SupplierForm initialValues={initialValues} />;
}
