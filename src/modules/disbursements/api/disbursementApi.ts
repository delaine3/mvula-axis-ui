import type {
  CreateDisbursementPaymentRequest,
  CreateDisbursementRequest,
  Disbursement,
  DisbursementStatus,
  PageResponse,
  PayeeType,
} from "../types/disbursement";

const BASE_URL = "http://localhost:8080/disbursements";

export interface GetDisbursementsParams {
  page?: number;
  size?: number;
  sort?: string;
  payeeName?: string;
  payeeType?: PayeeType;
  status?: DisbursementStatus;
  serviceDescription?: string;
  search?: string;
}

export async function getDisbursements(
  params: GetDisbursementsParams = {},
): Promise<PageResponse<Disbursement>> {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 0));
  searchParams.set("size", String(params.size ?? 10));
  searchParams.set("sort", params.sort ?? "createdAt,desc");

  if (params.payeeName?.trim()) {
    searchParams.set("payeeName", params.payeeName);
  }

  if (params.payeeType) {
    searchParams.set("payeeType", params.payeeType);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.serviceDescription?.trim()) {
    searchParams.set("serviceDescription", params.serviceDescription);
  }
  if (params.search?.trim()) {
    searchParams.set("search", params.search);
  }
  const response = await fetch(`${BASE_URL}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch disbursements");
  }

  return response.json();
}

export async function getDisbursementById(id: number): Promise<Disbursement> {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch disbursement");
  }

  return response.json();
}

export async function createDisbursement(
  payload: CreateDisbursementRequest,
): Promise<Disbursement> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create disbursement");
  }

  return response.json();
}

export async function updateDisbursement(
  id: number,
  payload: CreateDisbursementRequest,
): Promise<Disbursement> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update disbursement");
  }

  return response.json();
}

export async function deleteDisbursement(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete disbursement");
  }
}
export async function addDisbursementPayment(
  disbursementId: number,
  payload: CreateDisbursementPaymentRequest,
): Promise<Disbursement> {
  const response = await fetch(`${BASE_URL}/${disbursementId}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to add payment");
  }

  return response.json();
}
