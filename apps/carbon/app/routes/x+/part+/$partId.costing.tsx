import { PartCostingForm } from "~/modules/parts";

export default function PartCostingRoute() {
  return (
    <PartCostingForm
      initialValues={{
        partId: "FAS01234",
      }}
    />
  );
}
