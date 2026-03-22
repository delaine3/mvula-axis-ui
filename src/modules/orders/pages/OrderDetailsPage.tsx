import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/ordersApi";

function formatDate(value?: string) {
  if (!value) return "N/A";

  return new Date(value).toLocaleString();
}

function formatCurrency(value?: number) {
  if (value === undefined || value === null) return "E0.00";

  return `E${value.toFixed(2)}`;
}

export function OrderDetailsPage() {
  const { orderId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  const order = data?.items.find((o) => o.id === Number(orderId));

  if (isLoading) {
    return (
      <section>
        <div className="page-header">
          <h2 className="page-title">Order Details</h2>
          <Link to="/orders" className="button-link button-secondary">
            Back to Orders
          </Link>
        </div>

        <div className="state-card">
          <h3 className="state-title">Loading order...</h3>
          <p className="state-text">
            Please wait while the order details load.
          </p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <div className="page-header">
          <h2 className="page-title">Order Details</h2>
          <Link to="/orders" className="button-link button-secondary">
            Back to Orders
          </Link>
        </div>

        <div className="state-card">
          <h3 className="state-title">Failed to load order</h3>
          <p className="state-text">
            Something went wrong while loading this order.
          </p>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section>
        <div className="page-header">
          <h2 className="page-title">Order Details</h2>
          <Link to="/orders" className="button-link button-secondary">
            Back to Orders
          </Link>
        </div>

        <div className="state-card">
          <h3 className="state-title">Order not found</h3>
          <p className="state-text">The requested order could not be found.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="page-header">
        <h2 className="page-title">Order #{order.id}</h2>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link
            to={`/orders/${order.id}/edit`}
            className="button-link button-secondary"
          >
            Edit Order
          </Link>

          <Link to="/orders" className="button-link button-secondary">
            Back to Orders
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Order Summary</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <p className="muted-text" style={{ marginBottom: "6px" }}>
                Vendor
              </p>
              <p style={{ marginTop: 0 }}>{order.vendor || "N/A"}</p>
            </div>

            <div>
              <p className="muted-text" style={{ marginBottom: "6px" }}>
                Status
              </p>
              <p style={{ marginTop: 0 }}>{order.status}</p>
            </div>
            <div>
              <p className="muted-text" style={{ marginBottom: "6px" }}>
                Is Paid?
              </p>
              <p style={{ marginTop: 0 }}>{order.isPaid ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="muted-text" style={{ marginBottom: "6px" }}>
                Total Amount
              </p>
              <p style={{ marginTop: 0 }}>
                {formatCurrency(order.totalAmount)}
              </p>
            </div>

            <div>
              <p className="muted-text" style={{ marginBottom: "6px" }}>
                Created By
              </p>
              <p style={{ marginTop: 0 }}>{order.createdBy || "N/A"}</p>
            </div>

            <div>
              <p className="muted-text" style={{ marginBottom: "6px" }}>
                Updated By
              </p>
              <p style={{ marginTop: 0 }}>{order.updatedBy || "N/A"}</p>
            </div>

            <div>
              <p className="muted-text" style={{ marginBottom: "6px" }}>
                Created At
              </p>
              <p style={{ marginTop: 0 }}>{formatDate(order.createdAt)}</p>
            </div>

            <div>
              <p className="muted-text" style={{ marginBottom: "6px" }}>
                Updated At
              </p>
              <p style={{ marginTop: 0 }}>{formatDate(order.updatedAt)}</p>
            </div>
          </div>

          <div style={{ marginTop: "16px" }}>
            <p className="muted-text" style={{ marginBottom: "6px" }}>
              Description
            </p>
            <p style={{ marginTop: 0 }}>{order.description || "N/A"}</p>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Vendor Details</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <p className="muted-text" style={{ marginBottom: "6px" }}>
                Vendor Name
              </p>
              <p style={{ marginTop: 0 }}>{order.vendor || "N/A"}</p>
            </div>

            <div>
              <p className="muted-text" style={{ marginBottom: "6px" }}>
                Location
              </p>
              <p style={{ marginTop: 0 }}>{order.vendorLocation || "N/A"}</p>
            </div>

            <div>
              <p className="muted-text" style={{ marginBottom: "6px" }}>
                Contact Person
              </p>
              <p style={{ marginTop: 0 }}>
                {order.vendorContactPerson || "N/A"}
              </p>
            </div>

            <div>
              <p className="muted-text" style={{ marginBottom: "6px" }}>
                Contact Number
              </p>
              <p style={{ marginTop: 0 }}>
                {order.vendorContactNumber || "N/A"}
              </p>
            </div>

            <div>
              <p className="muted-text" style={{ marginBottom: "6px" }}>
                Email
              </p>
              <p style={{ marginTop: 0 }}>{order.vendorEmail || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Items</h3>

          {order.items.length === 0 ? (
            <p className="muted-text">No items on this order.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td>
                        {formatCurrency(
                          item.lineTotal ?? item.quantity * item.unitPrice,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
