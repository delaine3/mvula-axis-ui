import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDisbursement, getDisbursements } from "../api/disbursementApi";
import { DataTable } from "../../../components/ui/DataTable";
import { getDisbursementColumns } from "../../columns/disbursementColumns";
import type {
  Disbursement,
  DisbursementStatus,
  PageResponse,
  PayeeType,
} from "../types/disbursement";

export function DisbursementsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [pageData, setPageData] = useState<PageResponse<Disbursement> | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [search, setSearch] = useState("");
  const [payeeTypeFilter, setPayeeTypeFilter] = useState<PayeeType | undefined>(
    undefined,
  );
  const [statusFilter, setStatusFilter] = useState<
    DisbursementStatus | undefined
  >(undefined);

  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  async function loadDisbursements(
    page = 0,
    size = pageSize,
    nextSortBy = sortBy,
    nextSortDirection = sortDirection,
    nextSearch = search,
    nextStatusFilter = statusFilter,
    nextPayeeTypeFilter = payeeTypeFilter,
  ) {
    setLoading(true);
    setIsError(false);

    try {
      const data = await getDisbursements({
        page,
        size,
        sort: `${nextSortBy},${nextSortDirection}`,
        search: nextSearch.trim() || undefined,
        status: nextStatusFilter,
        payeeType: nextPayeeTypeFilter,
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
    void loadDisbursements();
  }, []);

  function handleSort(columnId: string) {
    const nextSortBy = columnId;
    const nextSortDirection: "asc" | "desc" =
      sortBy === columnId && sortDirection === "asc" ? "desc" : "asc";

    setSortBy(nextSortBy);
    setSortDirection(nextSortDirection);

    void loadDisbursements(
      0,
      pageSize,
      nextSortBy,
      nextSortDirection,
      search,
      statusFilter,
      payeeTypeFilter,
    );
  }

  function handlePreviousPage() {
    if (!pageData || pageData.first) return;

    void loadDisbursements(
      pageData.number - 1,
      pageSize,
      sortBy,
      sortDirection,
      search,
      statusFilter,
      payeeTypeFilter,
    );
  }

  function handleNextPage() {
    if (!pageData || pageData.last) return;

    void loadDisbursements(
      pageData.number + 1,
      pageSize,
      sortBy,
      sortDirection,
      search,
      statusFilter,
      payeeTypeFilter,
    );
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);

    void loadDisbursements(
      0,
      size,
      sortBy,
      sortDirection,
      search,
      statusFilter,
      payeeTypeFilter,
    );
  }

  function handleCreateClick() {
    navigate("/disbursements/new");
  }

  const deleteMutation = useMutation({
    mutationFn: deleteDisbursement,
    onSuccess: () => {
      void loadDisbursements(
        pageData?.number ?? 0,
        pageSize,
        sortBy,
        sortDirection,
        search,
        statusFilter,
        payeeTypeFilter,
      );
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
          value: search,
          placeholder: "Search disbursements",
          onChange: (value) => {
            setSearch(value);
            void loadDisbursements(
              0,
              pageSize,
              sortBy,
              sortDirection,
              value,
              statusFilter,
              payeeTypeFilter,
            );
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
