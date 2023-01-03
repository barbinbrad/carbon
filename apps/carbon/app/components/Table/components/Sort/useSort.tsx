import { useUrlParams } from "~/hooks";

export function useSort() {
  const [params, setParams] = useUrlParams();
  const sorts = params.getAll("sort");

  const isSorted = (columnId: string): -1 | null | 1 => {
    if (sorts.includes(`${columnId}:asc`)) return 1;
    if (sorts.includes(`${columnId}:desc`)) return -1;
    return null;
  };

  const reorderSorts = (newOrder: string[]) => {
    setParams({ sort: newOrder });
  };

  const removeSortBy = (sort: string) => {
    setParams({ sort: sorts.filter((s) => s !== sort) });
  };

  const toggleSortBy = (columnId: string) => {
    const existingSort = [...sorts];
    const sortAsc = `${columnId}:asc`;
    const sortDesc = `${columnId}:desc`;

    if (existingSort.includes(sortAsc)) {
      setParams({
        sort: existingSort.filter((s) => s !== sortAsc).concat(sortDesc),
      });
    } else if (existingSort.includes(sortDesc)) {
      setParams({ sort: existingSort.filter((s) => s !== sortDesc) });
    } else {
      setParams({ sort: existingSort.concat(sortAsc) });
    }
  };

  const toggleSortByDirection = (columnId: string) => {
    const existingSort = [...sorts];
    const sortAsc = `${columnId}:asc`;
    const sortDesc = `${columnId}:desc`;

    if (existingSort.includes(sortAsc)) {
      setParams({
        sort: existingSort.filter((s) => s !== sortAsc).concat(sortDesc),
      });
    } else if (existingSort.includes(sortDesc)) {
      setParams({
        sort: existingSort.filter((s) => s !== sortDesc).concat(sortAsc),
      });
    }
  };

  return {
    sorts,
    isSorted,
    reorderSorts,
    removeSortBy,
    toggleSortBy,
    toggleSortByDirection,
  };
}
