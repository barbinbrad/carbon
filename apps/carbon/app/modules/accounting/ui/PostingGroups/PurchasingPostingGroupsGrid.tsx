import type { PurchasingPostingGroup } from "~/modules/accounting";

type PurchasingPostingGroupsProps = {
  data: PurchasingPostingGroup[];
  count: number;
};

const PurchasingPostingGroupsGrid = ({
  data,
  count,
}: PurchasingPostingGroupsProps) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default PurchasingPostingGroupsGrid;
