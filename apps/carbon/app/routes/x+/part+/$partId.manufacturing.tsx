import { PartManufacturingForm } from "~/modules/parts";

export default function PartManufacturingRoute() {
  return (
    <PartManufacturingForm
      initialValues={{
        partId: "FAS01234",
      }}
    />
  );
}
