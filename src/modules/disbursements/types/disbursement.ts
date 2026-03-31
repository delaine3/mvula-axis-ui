export type PayeeType =
  | "EMPLOYEE"
  | "CONTRACTOR"
  | "SUPPLIER"
  | "SERVICE_PROVIDER"
  | "LANDLORD"
  | "OTHER";

export type DisbursementStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERPAID"
  | "CANCELLED";

export interface DisbursementPayment {
  id: number;
  datePaid: string;
  amountPaid: number;
  paymentMethod?: string;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface Disbursement {
  id: number;
  payeeName: string;
  payeeType: PayeeType;
  serviceDescription: string;
  totalCharged: number;
  totalPaid: number;
  balanceOutstanding: number;
  currency: string;
  dueDate?: string;
  status: DisbursementStatus;
  isInstallment: boolean;
  installmentCount?: number;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  payments: DisbursementPayment[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface CreateDisbursementRequest {
  payeeName: string;
  payeeType: PayeeType;
  serviceDescription: string;
  totalCharged: number;
  currency: string;
  dueDate?: string;
  isInstallment: boolean;
  installmentCount?: number;
  notes?: string;
  disbursementStatus: string;
}
