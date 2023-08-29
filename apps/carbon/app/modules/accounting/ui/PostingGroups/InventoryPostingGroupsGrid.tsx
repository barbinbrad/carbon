import type { InventoryPostingGroup } from "~/modules/accounting";

type InventoryPostingGroupsProps = {
  data: InventoryPostingGroup[];
  count: number;
};

const InventoryPostingGroupsGrid = ({
  data,
  count,
}: InventoryPostingGroupsProps) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default InventoryPostingGroupsGrid;
