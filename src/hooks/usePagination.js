import {
  useMemo,
  useState,
} from "react";

export default function usePagination(
  data = [],
  pageSize = 10
) {
  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const totalPages =
    Math.ceil(
      data.length /
        pageSize
    );

  const paginatedData =
    useMemo(() => {
      const start =
        (currentPage -
          1) *
        pageSize;

      return data.slice(
        start,
        start + pageSize
      );
    }, [
      data,
      currentPage,
      pageSize,
    ]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  };
}