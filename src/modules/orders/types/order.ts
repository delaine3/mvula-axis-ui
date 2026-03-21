export type OrderStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
export interface Order {
  id: number;
  vendor: string;
  description: string;
  status: OrderStatus;
  totalAmount: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}
