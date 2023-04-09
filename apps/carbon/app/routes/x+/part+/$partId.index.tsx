import { PartForm } from "~/modules/parts";

export default function PartBasicRoute() {
  return (
    <PartForm
      initialValues={{
        id: "FAS01234",
        name: "Fastnerer such and such",
        description: "",
      }}
    />
  );
}
