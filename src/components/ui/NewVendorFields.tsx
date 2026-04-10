import type { CreateVendorPayload } from "../../modules/vendors/types/vendor";
import AddressFields from "./AddressFields";
import ContactFields from "./ContactFields";
import FloatingInput from "./FloatingInput";
import ToggleField from "./ToggleField";

type NewVendorFieldsProps = {
  newVendor: CreateVendorPayload;
  onVendorFieldChange: <K extends keyof CreateVendorPayload>(
    key: K,
    value: CreateVendorPayload[K],
  ) => void;
  onVendorAddressFieldChange: (
    key: keyof CreateVendorPayload["address"],
    value: string,
  ) => void;
};

export default function NewVendorFields({
  newVendor,
  onVendorFieldChange,
  onVendorAddressFieldChange,
}: NewVendorFieldsProps) {
  return (
    <div className="card" style={{ background: "var(--bg-surface-soft)" }}>
      <h3 style={{ marginTop: 0 }}>New Vendor Details</h3>

      <div style={{ display: "grid", gap: "16px" }}>
        <FloatingInput
          id="vendor-name"
          label="Vendor Name"
          value={newVendor.name}
          onChange={(value) => onVendorFieldChange("name", value)}
        />

        <FloatingInput
          id="vendor-category"
          label="Category"
          value={newVendor.category}
          onChange={(value) => onVendorFieldChange("category", value)}
        />

        <FloatingInput
          id="vendor-website"
          label="Website"
          type="url"
          value={newVendor.website ?? ""}
          onChange={(value) => onVendorFieldChange("website", value)}
        />

        <FloatingInput
          id="vendor-tax"
          label="Tax Number"
          value={newVendor.taxNumber ?? ""}
          onChange={(value) => onVendorFieldChange("taxNumber", value)}
        />

        <AddressFields
          address={newVendor.address}
          onChange={onVendorAddressFieldChange}
          idPrefix="vendor-address"
        />

        <ContactFields
          contactPerson={newVendor.contactPerson ?? ""}
          contactNumber={newVendor.contactNumber ?? ""}
          email={newVendor.email ?? ""}
          onContactPersonChange={(value) =>
            onVendorFieldChange("contactPerson", value)
          }
          onContactNumberChange={(value) =>
            onVendorFieldChange("contactNumber", value)
          }
          onEmailChange={(value) => onVendorFieldChange("email", value)}
          idPrefix="vendor-contact"
        />

        <FloatingInput
          id="payment-terms"
          label="Payment Terms"
          value={newVendor.paymentTerms ?? ""}
          onChange={(value) => onVendorFieldChange("paymentTerms", value)}
        />

        <FloatingInput
          id="preferred-currency"
          label="Preferred Currency"
          value={newVendor.preferredCurrency ?? ""}
          onChange={(value) => onVendorFieldChange("preferredCurrency", value)}
        />

        <ToggleField
          label="Offers Delivery?"
          value={newVendor.offersDelivery}
          onChange={(value) => onVendorFieldChange("offersDelivery", value)}
        />

        <FloatingInput
          id="vendor-notes"
          label="Notes"
          value={newVendor.notes ?? ""}
          onChange={(value) => onVendorFieldChange("notes", value)}
          multiline
        />
      </div>
    </div>
  );
}
