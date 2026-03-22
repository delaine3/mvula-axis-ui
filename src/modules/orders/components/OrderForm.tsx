import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

export interface OrderFormItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderFormValues {
  vendor: string;
  description: string;
  status: string;
  items: OrderFormItem[];
}

interface OrderFormProps {
  mode: "create" | "edit";
  initialValues: OrderFormValues;
  onSubmit: (values: OrderFormValues) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string;
}

export function OrderForm({
  mode,
  initialValues,
  onSubmit,
  isSubmitting,
  errorMessage,
}: OrderFormProps) {
  const [vendor, setVendor] = useState(initialValues.vendor);
  const [description, setDescription] = useState(initialValues.description);
  const [status, setStatus] = useState(initialValues.status);
  const [items, setItems] = useState<OrderFormItem[]>(initialValues.items);
  const isInvalid =
    !vendor.trim() || items.some((item) => !item.productName.trim());

  useEffect(() => {
    setVendor(initialValues.vendor);
    setDescription(initialValues.description);
    setStatus(initialValues.status);
    setItems(initialValues.items);
  }, [initialValues]);
  useEffect(() => {
    setVendor(initialValues.vendor);
    setDescription(initialValues.description);
    setStatus(initialValues.status);
    setItems(initialValues.items);
  }, [initialValues]);

  const pageTitle = mode === "create" ? "Create Order" : "Edit Order";
  const submitLabel = isSubmitting
    ? mode === "create"
      ? "Creating..."
      : "Saving..."
    : mode === "create"
      ? "Create Order"
      : "Save Changes";

  return (
    <section>
      <div className="page-header">
        <h2 className="page-title">{pageTitle}</h2>
        <Link to="/orders" className="button-link button-secondary">
          Back to Orders
        </Link>
      </div>

      <div className="card">
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            // frontend validation
            if (!vendor.trim()) {
              alert("Vendor is required");
              return;
            }

            const hasEmptyItem = items.some((item) => !item.productName.trim());

            if (hasEmptyItem) {
              alert("All items must have a product name");
              return;
            }

            await onSubmit({
              vendor,
              description,
              status,
              items,
            });
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            <div className="form-field">
              <input
                id="vendor"
                className="floating-input"
                placeholder=" "
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              />
              <label htmlFor="vendor" className="floating-label">
                Vendor
              </label>
            </div>

            <div className="form-field">
              <input
                id="description"
                className="floating-input"
                placeholder=" "
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <label htmlFor="description" className="floating-label">
                Description
              </label>
            </div>
            <div>
              <div className="form-field select-wrapper">
                <select
                  id="status"
                  className="floating-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="ORDERED">ORDERED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>

                <label htmlFor="status" className="floating-label">
                  Status
                </label>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: 600,
                }}
              >
                Items
              </label>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                {items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr auto",
                      gap: "12px",
                      padding: "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      background: "#f8fafc",
                    }}
                  >
                    <div className="form-field">
                      <input
                        id="product-name"
                        className="floating-input"
                        placeholder=" "
                        value={item.productName}
                        onChange={(e) => {
                          const nextItems = [...items];
                          nextItems[index].productName = e.target.value;
                          setItems(nextItems);
                        }}
                      />
                      <label htmlFor="unit-price" className="floating-label">
                        Product name
                      </label>
                    </div>

                    <div className="form-field">
                      <input
                        id="quantity"
                        className="floating-input"
                        type="number"
                        placeholder=" "
                        value={item.quantity}
                        onChange={(e) => {
                          const nextItems = [...items];
                          nextItems[index].quantity = Number(e.target.value);
                          setItems(nextItems);
                        }}
                      />
                      <label htmlFor="quantity" className="floating-label">
                        Quantity
                      </label>
                    </div>

                    <div className="form-field">
                      <input
                        id="unit-price"
                        className="floating-input"
                        type="number"
                        placeholder=" "
                        value={item.unitPrice}
                        onChange={(e) => {
                          const nextItems = [...items];
                          nextItems[index].unitPrice = Number(e.target.value);
                          setItems(nextItems);
                        }}
                      />
                      <label htmlFor="unit-price" className="floating-label">
                        Unit Price
                      </label>
                    </div>
                    <button
                      type="button"
                      className="icon-button"
                      disabled={items.length === 1}
                      onClick={() => {
                        if (items.length === 1) return;
                        setItems(items.filter((_, i) => i !== index));
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "12px" }}>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => {
                    const lastItem = items[items.length - 1];

                    if (!lastItem.productName.trim()) {
                      alert("Fill in the current item first");
                      return;
                    }

                    setItems([
                      ...items,
                      { productName: "", quantity: 1, unitPrice: 0 },
                    ]);
                  }}
                >
                  Add Item
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                className="button"
                type="submit"
                disabled={isSubmitting || isInvalid}
              >
                {submitLabel}
              </button>

              {errorMessage && <p className="muted-text">{errorMessage}</p>}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
