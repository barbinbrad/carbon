import { useUrlParams } from "~/hooks";
import { parseNumberFromUrlParam } from "~/utils/http";

export function usePagination(count: number) {
  const [params, setParams] = useUrlParams();
  const pageSize = parseNumberFromUrlParam(params, "limit", 15);
  const offset = parseNumberFromUrlParam(params, "offset", 0);

  const pageIndex = Math.floor(offset / pageSize) + 1;
  const pageCount = Math.ceil(count / pageSize);
  const canPreviousPage = pageIndex > 1;
  const canNextPage = pageIndex < Math.ceil(count / pageSize);

  const gotoPage = (page: number) => {
    setParams({
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
  };

  const previousPage = () => {
    gotoPage(pageIndex - 1);
  };

  const nextPage = () => {
    gotoPage(pageIndex + 1);
  };

  const setPageSize = (pageSize: number) => {
    setParams({
      offset: 0,
      limit: pageSize,
    });
  };

  return {
    count,
    offset,
    pageIndex,
    pageCount,
    pageSize,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  };
}
