import { PartInventoryForm } from "~/modules/parts";

export default function PartInventoryRoute() {
  return (
    <PartInventoryForm
      initialValues={{
        partId: "FAS01234",
      }}
    />
  );
}
