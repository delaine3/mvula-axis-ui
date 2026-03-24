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

export interface CreateVendorPayload {
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
}
