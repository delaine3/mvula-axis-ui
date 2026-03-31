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

export interface CreateOrderPayload {
  vendorId: number;
  isPaid: boolean;
  description: string;
  status: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export async function deleteOrder(orderId: number) {
  await apiClient.delete(`/orders/${orderId}`);
}

export interface UpdateOrderPayload {
  vendorId: number;
  isPaid: boolean;
  description: string;
  status: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export async function updateOrder(orderId: number, payload: unknown) {
  const response = await fetch(`http://localhost:8080/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update order");
  }

  return response.json();
}

export async function createOrder(payload: unknown) {
  const response = await fetch("http://localhost:8080/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  return response.json();
}
