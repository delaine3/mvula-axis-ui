import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import type { Vendor, CreateVendorPayload } from "../../vendors/types/vendor";

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
  status: string;
  items: OrderFormItem[];
}

interface OrderFormProps {
  mode: "create" | "edit";
  initialValues: OrderFormValues;
  onSubmit: (values: OrderFormValues) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string;
  vendors: Vendor[];
}

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
  const [status, setStatus] = useState(initialValues.status);
  const [items, setItems] = useState<OrderFormItem[]>(initialValues.items);

  useEffect(() => {
    setIsPaid(initialValues.isPaid);
    setUseNewVendor(initialValues.useNewVendor);
    setVendorId(initialValues.vendorId);
    setNewVendor(initialValues.newVendor);
    setDescription(initialValues.description);
    setStatus(initialValues.status);
    setItems(initialValues.items);
  }, [initialValues]);

  const isInvalid =
    (!useNewVendor && !vendorId.trim()) ||
    (useNewVendor && !newVendor.name.trim()) ||
    items.some((item) => !item.productName.trim());

  const pageTitle = mode === "create" ? "Create Order" : "Edit Order";
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

      <div className="card">
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (!useNewVendor && !vendorId.trim()) {
              alert("Please select a vendor");
              return;
            }

            if (useNewVendor && !newVendor.name.trim()) {
              alert("Vendor name is required");
              return;
            }

            if (items.some((item) => !item.productName.trim())) {
              alert("All items must have a product name");
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
          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                Is this a new vendor?
              </label>

              <div
                className="toggle-group"
                role="group"
                aria-label="Is this a new vendor?"
              >
                <button
                  type="button"
                  className={`toggle-option ${!useNewVendor ? "toggle-option--active" : ""}`}
                  onClick={() => setUseNewVendor(false)}
                >
                  No
                </button>

                <button
                  type="button"
                  className={`toggle-option ${useNewVendor ? "toggle-option--active" : ""}`}
                  onClick={() => setUseNewVendor(true)}
                >
                  Yes
                </button>
              </div>
            </div>

            {!useNewVendor ? (
              <div className="form-field select-wrapper">
                <select
                  id="vendorId"
                  className="floating-select"
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                >
                  <option value="">Select vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={String(vendor.id)}>
                      {vendor.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="vendorId" className="floating-label">
                  Vendor
                </label>
              </div>
            ) : (
              <div
                className="card"
                style={{ background: "var(--bg-surface-soft)" }}
              >
                <h3 style={{ marginTop: 0 }}>New Vendor Details</h3>

                <div style={{ display: "grid", gap: "16px" }}>
                  <div className="form-field">
                    <input
                      id="vendor-name"
                      className="floating-input"
                      placeholder=" "
                      value={newVendor.name}
                      onChange={(e) =>
                        updateVendorField("name", e.target.value)
                      }
                    />
                    <label htmlFor="vendor-name" className="floating-label">
                      Vendor Name
                    </label>
                  </div>

                  <div className="form-field">
                    <input
                      id="vendor-category"
                      className="floating-input"
                      placeholder=" "
                      value={newVendor.category}
                      onChange={(e) =>
                        updateVendorField("category", e.target.value)
                      }
                    />
                    <label htmlFor="vendor-category" className="floating-label">
                      Category
                    </label>
                  </div>

                  <div className="form-field">
                    <input
                      id="vendor-website"
                      className="floating-input"
                      placeholder=" "
                      value={newVendor.website ?? ""}
                      onChange={(e) =>
                        updateVendorField("website", e.target.value)
                      }
                    />
                    <label htmlFor="vendor-website" className="floating-label">
                      Website
                    </label>
                  </div>

                  <div className="form-field">
                    <input
                      id="vendor-tax"
                      className="floating-input"
                      placeholder=" "
                      value={newVendor.taxNumber ?? ""}
                      onChange={(e) =>
                        updateVendorField("taxNumber", e.target.value)
                      }
                    />
                    <label htmlFor="vendor-tax" className="floating-label">
                      Tax Number
                    </label>
                  </div>

                  <div className="form-field">
                    <input
                      id="address-line1"
                      className="floating-input"
                      placeholder=" "
                      value={newVendor.address.addressLine1}
                      onChange={(e) =>
                        updateVendorAddressField("addressLine1", e.target.value)
                      }
                    />
                    <label htmlFor="address-line1" className="floating-label">
                      Address Line 1
                    </label>
                  </div>

                  <div className="form-field">
                    <input
                      id="address-line2"
                      className="floating-input"
                      placeholder=" "
                      value={newVendor.address.addressLine2 ?? ""}
                      onChange={(e) =>
                        updateVendorAddressField("addressLine2", e.target.value)
                      }
                    />
                    <label htmlFor="address-line2" className="floating-label">
                      Address Line 2
                    </label>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div className="form-field">
                      <input
                        id="city"
                        className="floating-input"
                        placeholder=" "
                        value={newVendor.address.city}
                        onChange={(e) =>
                          updateVendorAddressField("city", e.target.value)
                        }
                      />
                      <label htmlFor="city" className="floating-label">
                        City
                      </label>
                    </div>

                    <div className="form-field">
                      <input
                        id="state"
                        className="floating-input"
                        placeholder=" "
                        value={newVendor.address.stateOrProvince}
                        onChange={(e) =>
                          updateVendorAddressField(
                            "stateOrProvince",
                            e.target.value,
                          )
                        }
                      />
                      <label htmlFor="state" className="floating-label">
                        State / Province
                      </label>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div className="form-field">
                      <input
                        id="postal"
                        className="floating-input"
                        placeholder=" "
                        value={newVendor.address.postalCode}
                        onChange={(e) =>
                          updateVendorAddressField("postalCode", e.target.value)
                        }
                      />
                      <label htmlFor="postal" className="floating-label">
                        Postal Code
                      </label>
                    </div>

                    <div className="form-field">
                      <input
                        id="country"
                        className="floating-input"
                        placeholder=" "
                        value={newVendor.address.country}
                        onChange={(e) =>
                          updateVendorAddressField("country", e.target.value)
                        }
                      />
                      <label htmlFor="country" className="floating-label">
                        Country
                      </label>
                    </div>
                  </div>

                  <div className="form-field">
                    <input
                      id="contact-person"
                      className="floating-input"
                      placeholder=" "
                      value={newVendor.contactPerson ?? ""}
                      onChange={(e) =>
                        updateVendorField("contactPerson", e.target.value)
                      }
                    />
                    <label htmlFor="contact-person" className="floating-label">
                      Contact Person
                    </label>
                  </div>

                  <div className="form-field">
                    <input
                      id="contact-number"
                      className="floating-input"
                      placeholder=" "
                      value={newVendor.contactNumber ?? ""}
                      onChange={(e) =>
                        updateVendorField("contactNumber", e.target.value)
                      }
                    />
                    <label htmlFor="contact-number" className="floating-label">
                      Contact Number
                    </label>
                  </div>

                  <div className="form-field">
                    <input
                      id="vendor-email"
                      className="floating-input"
                      placeholder=" "
                      value={newVendor.email ?? ""}
                      onChange={(e) =>
                        updateVendorField("email", e.target.value)
                      }
                    />
                    <label htmlFor="vendor-email" className="floating-label">
                      Email
                    </label>
                  </div>

                  <div className="form-field">
                    <input
                      id="payment-terms"
                      className="floating-input"
                      placeholder=" "
                      value={newVendor.paymentTerms ?? ""}
                      onChange={(e) =>
                        updateVendorField("paymentTerms", e.target.value)
                      }
                    />
                    <label htmlFor="payment-terms" className="floating-label">
                      Payment Terms
                    </label>
                  </div>

                  <div className="form-field">
                    <input
                      id="preferred-currency"
                      className="floating-input"
                      placeholder=" "
                      value={newVendor.preferredCurrency ?? ""}
                      onChange={(e) =>
                        updateVendorField("preferredCurrency", e.target.value)
                      }
                    />
                    <label
                      htmlFor="preferred-currency"
                      className="floating-label"
                    >
                      Preferred Currency
                    </label>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 600,
                      }}
                    >
                      Offers Delivery
                    </label>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <label>
                        <input
                          type="radio"
                          checked={newVendor.offersDelivery}
                          onChange={() =>
                            updateVendorField("offersDelivery", true)
                          }
                        />{" "}
                        Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          checked={!newVendor.offersDelivery}
                          onChange={() =>
                            updateVendorField("offersDelivery", false)
                          }
                        />{" "}
                        No
                      </label>
                    </div>
                  </div>

                  <div className="form-field">
                    <input
                      id="vendor-notes"
                      className="floating-input"
                      placeholder=" "
                      value={newVendor.notes ?? ""}
                      onChange={(e) =>
                        updateVendorField("notes", e.target.value)
                      }
                    />
                    <label htmlFor="vendor-notes" className="floating-label">
                      Notes
                    </label>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                Has this order been fully paid for?
              </label>

              <div
                className="toggle-group"
                role="group"
                aria-label="Has this order been fully paid for?"
              >
                <button
                  type="button"
                  className={`toggle-option ${!isPaid ? "toggle-option--active" : ""}`}
                  onClick={() => setIsPaid(false)}
                >
                  No
                </button>

                <button
                  type="button"
                  className={`toggle-option ${isPaid ? "toggle-option--active" : ""}`}
                  onClick={() => setIsPaid(true)}
                >
                  Yes
                </button>
              </div>
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

              <div style={{ display: "grid", gap: "12px" }}>
                {items.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="form-field">
                      <input
                        id={`product-name-${index}`}
                        className="floating-input"
                        placeholder=" "
                        value={item.productName}
                        onChange={(e) => {
                          const nextItems = [...items];
                          nextItems[index].productName = e.target.value;
                          setItems(nextItems);
                        }}
                      />
                      <label
                        htmlFor={`product-name-${index}`}
                        className="floating-label"
                      >
                        Product Name
                      </label>
                    </div>

                    <div className="form-field">
                      <input
                        id={`quantity-${index}`}
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
                      <label
                        htmlFor={`quantity-${index}`}
                        className="floating-label"
                      >
                        Quantity
                      </label>
                    </div>

                    <div className="form-field">
                      <input
                        id={`unit-price-${index}`}
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
                      <label
                        htmlFor={`unit-price-${index}`}
                        className="floating-label"
                      >
                        Unit Price
                      </label>
                    </div>

                    <button
                      type="button"
                      className="icon-button icon-button-delete"
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
