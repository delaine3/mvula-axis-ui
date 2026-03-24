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
  vendorId: number;
  vendorName: string;
  description: string;
  isPaid: boolean;
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
export interface VendorAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
}

export interface Vendor {
  id: number;
  name: string;
  category: string;
  isActive: boolean;
  website?: string;
  taxNumber?: string;
  address: VendorAddress;
  offersDelivery: boolean;
  contactPerson?: string;
  contactNumber?: string;
  email?: string;
  notes?: string;
  paymentTerms?: string;
  preferredCurrency?: string;
  createdAt: string;
  updatedAt: string;
}
