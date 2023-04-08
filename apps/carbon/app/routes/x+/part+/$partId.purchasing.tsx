import { PartPurchasingForm } from "~/modules/parts";

export default function PartPurchasingRoute() {
  return (
    <PartPurchasingForm
      initialValues={{
        partId: "FAS01234",
      }}
    />
  );
}
