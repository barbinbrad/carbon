import type { SalesPostingGroup } from "~/modules/accounting";

type SalesPostingGroupsProps = {
  data: SalesPostingGroup[];
  count: number;
};

const SalesPostingGroupsGrid = ({ data, count }: SalesPostingGroupsProps) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default SalesPostingGroupsGrid;
