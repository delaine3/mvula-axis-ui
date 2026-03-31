import { apiClient } from "../../../lib/apiClient";
import type { Vendor, CreateVendorPayload } from "../types/vendor";

export async function getVendors(): Promise<Vendor[]> {
  const response = await apiClient.get("/vendors");
  return response.data;
}

export async function createVendor(
  payload: CreateVendorPayload,
): Promise<Vendor> {
  const response = await apiClient.post("/vendors", payload);
  return response.data;
}
