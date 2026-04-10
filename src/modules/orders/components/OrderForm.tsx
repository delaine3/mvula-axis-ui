import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Vendor, CreateVendorPayload } from "../../vendors/types/vendor";
import {
  FloatingSelect,
  type SelectOption,
} from "../../../components/ui/FloatingSelect";
import ToggleField from "../../../components/ui/ToggleField";
import FloatingInput from "../../../components/ui/FloatingInput";
import LineItemsField from "../../../components/ui/LineItemsField";
import NewVendorFields from "../../../components/ui/NewVendorFields";

export interface OrderFormItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderFormValues {
  useNewVendor: boolean;
  isPaid: boolean;
  vendorId: string;
  newVendor: CreateVendorPayload;
  description: string;
  status: OrderStatus;
  items: OrderFormItem[];
}
interface OrderFormProps {
  mode: "create" | "update";
  initialValues: OrderFormValues;
  onSubmit: (values: OrderFormValues) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string;
  vendors: Vendor[];
}
type OrderStatus = "PENDING" | "ORDERED" | "DELIVERED" | "CANCELLED";
const statusOptions: SelectOption<OrderStatus>[] = [
  { value: "PENDING", label: "Pending" },
  { value: "ORDERED", label: "Ordered" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];
export function OrderForm({
  mode,
  initialValues,
  onSubmit,
  isSubmitting,
  errorMessage,
  vendors,
}: OrderFormProps) {
  const [useNewVendor, setUseNewVendor] = useState(initialValues.useNewVendor);
  const [isPaid, setIsPaid] = useState(initialValues.isPaid);

  const [vendorId, setVendorId] = useState(initialValues.vendorId);
  const [newVendor, setNewVendor] = useState<CreateVendorPayload>(
    initialValues.newVendor,
  );
  const [description, setDescription] = useState(initialValues.description);
  const [status, setStatus] = useState<OrderStatus>(initialValues.status);
  const [items, setItems] = useState<OrderFormItem[]>(initialValues.items);

  function getValidationError(): string | null {
    if (!useNewVendor && !vendorId.trim()) {
      return "Please select a vendor";
    }
    if (useNewVendor && !newVendor.name.trim()) {
      return "Vendor name is required";
    }

    if (items.some((item) => !item.productName.trim())) {
      return "All items must have a product name";
    }
    return null;
  }

  const validationError = getValidationError();
  const isInvalid = Boolean(validationError);
  useEffect(() => {
    setIsPaid(initialValues.isPaid);
    setUseNewVendor(initialValues.useNewVendor);
    setVendorId(initialValues.vendorId);
    setNewVendor(initialValues.newVendor);
    setDescription(initialValues.description);
    setStatus(initialValues.status);
    setItems(initialValues.items);
  }, [initialValues]);

  const pageTitle = mode === "create" ? "Create Order" : "Update Order";
  const submitLabel = isSubmitting
    ? mode === "create"
      ? "Creating..."
      : "Saving..."
    : mode === "create"
      ? "Create Order"
      : "Save Changes";

  const updateVendorField = <K extends keyof CreateVendorPayload>(
    key: K,
    value: CreateVendorPayload[K],
  ) => {
    setNewVendor((prev) => ({ ...prev, [key]: value }));
  };

  const updateVendorAddressField = (
    key: keyof CreateVendorPayload["address"],
    value: string,
  ) => {
    setNewVendor((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [key]: value,
      },
    }));
  };

  return (
    <section>
      <div className="page-header">
        <h2 className="page-title">{pageTitle}</h2>
        <Link to="/orders" className="button-link button-secondary">
          Back to Orders
        </Link>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const validationError = getValidationError();

          if (validationError) {
            alert(validationError);
            return;
          }

          await onSubmit({
            useNewVendor,
            isPaid,
            vendorId,
            newVendor,
            description,
            status,
            items,
          });
        }}
      >
        <div className="vertical-form">
          <ToggleField
            label="Is this a new vendor?"
            value={useNewVendor}
            onChange={setUseNewVendor}
          />

          {!useNewVendor ? (
            <FloatingSelect
              required
              id="vendorId"
              label="Vendor"
              value={vendorId}
              placeholderOption="Select vendor"
              options={vendors.map((vendor) => ({
                value: String(vendor.id),
                label: vendor.name,
              }))}
              onChange={(value) => setVendorId(value)}
            />
          ) : (
            <div>
              <NewVendorFields
                newVendor={newVendor}
                onVendorFieldChange={updateVendorField}
                onVendorAddressFieldChange={updateVendorAddressField}
              />
            </div>
          )}
          <ToggleField
            label="Has this order been fully paid for?"
            value={isPaid}
            onChange={setIsPaid}
          />
          <FloatingInput
            id="description"
            label="Description"
            value={description}
            onChange={setDescription}
            multiline
          />
          <FloatingSelect<OrderStatus>
            id="status"
            label="Status"
            value={status}
            options={statusOptions}
            onChange={setStatus}
          />
          <LineItemsField items={items} onChange={setItems} />
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              className="button"
              type="submit"
              disabled={isSubmitting || isInvalid}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
