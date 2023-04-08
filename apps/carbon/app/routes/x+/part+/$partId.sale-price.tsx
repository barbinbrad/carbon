import { PartSalePriceForm } from "~/modules/parts";

export default function PartSalePriceRoute() {
  return (
    <PartSalePriceForm
      initialValues={{
        partId: "FAS01234",
      }}
    />
  );
}
