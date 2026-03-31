import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteDisbursement } from "../api/disbursementApi";

import { createDisbursement, getDisbursements } from "../api/disbursementApi";
import { DataTable } from "../../../components/ui/DataTable";
import { getDisbursementColumns } from "../../columns/disbursementColumns";
import type {
  CreateDisbursementRequest,
  Disbursement,
  PageResponse,
} from "../types/disbursement";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function DisbursementsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [pageData, setPageData] = useState<PageResponse<Disbursement> | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [payeeNameFilter, setPayeeNameFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  async function loadDisbursements(
    page = 0,
    size = pageSize,
    nextSortBy = sortBy,
    nextSortDirection = sortDirection,
    nextPayeeNameFilter = payeeNameFilter,
  ) {
    setLoading(true);
    setIsError(false);

    try {
      const data = await getDisbursements({
        page,
        size,
        sort: `${nextSortBy},${nextSortDirection}`,
        payeeName: nextPayeeNameFilter || undefined,
      });

      setPageData(data);
    } catch (error) {
      console.error("Failed to load disbursements:", error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDisbursements(0, pageSize);
  }, []);

  function handleSort(columnId: string) {
    let nextSortBy = columnId;
    let nextSortDirection: "asc" | "desc" = "asc";

    if (sortBy === columnId) {
      nextSortDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    setSortBy(nextSortBy);
    setSortDirection(nextSortDirection);

    void loadDisbursements(
      0,
      pageSize,
      nextSortBy,
      nextSortDirection,
      payeeNameFilter,
    );
  }

  function handlePreviousPage() {
    if (!pageData || pageData.first) return;
    void loadDisbursements(
      pageData.number - 1,
      pageSize,
      sortBy,
      sortDirection,
      payeeNameFilter,
    );
  }

  function handleNextPage() {
    if (!pageData || pageData.last) return;
    void loadDisbursements(
      pageData.number + 1,
      pageSize,
      sortBy,
      sortDirection,
      payeeNameFilter,
    );
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    void loadDisbursements(0, size, sortBy, sortDirection, payeeNameFilter);
  }

  function handleCreateClick() {
    navigate("/disbursements/new");
  }
  const deleteMutation = useMutation({
    mutationFn: deleteDisbursement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disbursements"] });
    },
  });

  const columns = getDisbursementColumns({
    onDelete: (id) => deleteMutation.mutate(id),
  });
  return (
    <section style={{ padding: "1.5rem" }}>
      <DataTable
        title="Disbursements"
        data={pageData?.content ?? []}
        columns={columns}
        isLoading={loading}
        isError={isError}
        emptyMessage="No disbursements found."
        sorting={{
          sortBy,
          direction: sortDirection,
          onSort: handleSort,
        }}
        onRowClick={(disbursement) =>
          navigate(`/disbursements/${disbursement.id}`)
        }
        search={{
          value: payeeNameFilter,
          placeholder: "Search",
          onChange: (value) => {
            setPayeeNameFilter(value);
            void loadDisbursements(0, pageSize, sortBy, sortDirection, value);
          },
        }}
        createAction={{
          label: "Create Disbursement",
          onClick: handleCreateClick,
        }}
        pagination={{
          page: pageData?.number ?? 0,
          totalPages: pageData?.totalPages ?? 1,
          size: pageData?.size ?? pageSize,
          onPreviousPage: handlePreviousPage,
          onNextPage: handleNextPage,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
    </section>
  );
}
