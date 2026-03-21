import { apiClient } from "../../../lib/apiClient";
import type { Order, PaginatedResponse } from "../types/order";

interface GetOrdersParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
}

export async function getOrders(
  params: GetOrdersParams = {},
): Promise<PaginatedResponse<Order>> {
  const response = await apiClient.get("/orders", {
    params,
  });

  return response.data;
}
