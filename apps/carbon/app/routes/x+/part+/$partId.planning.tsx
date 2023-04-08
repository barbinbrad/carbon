import { PartPlanningForm } from "~/modules/parts";

export default function PartPlanningRoute() {
  return (
    <PartPlanningForm
      initialValues={{
        partId: "FAS01234",
      }}
    />
  );
}
