import { apiClient } from "../../../lib/apiClient";
import type { Order, PaginatedResponse } from "../types/order";

interface GetOrdersParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
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
interface CreateOrderPayload {
  vendor: string;
  description: string;
  status: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export async function createOrder(payload: CreateOrderPayload) {
  const response = await apiClient.post("/orders", payload);
  return response.data;
}

export async function deleteOrder(orderId: number) {
  await apiClient.delete(`/orders/${orderId}`);
}
interface UpdateOrderPayload {
  vendor: string;
  description: string;
  status: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export async function updateOrder(
  orderId: number,
  payload: UpdateOrderPayload,
) {
  const response = await apiClient.put(`/orders/${orderId}`, payload);
  return response.data;
}
