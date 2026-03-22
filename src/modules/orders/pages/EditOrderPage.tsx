import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/ordersApi";
import { useState, useEffect } from "react";
import { updateOrder } from "../api/ordersApi";
export function EditOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  const order = data?.items.find((o) => o.id === Number(orderId));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [items, setItems] = useState([
    { productName: "", quantity: 1, unitPrice: 0 },
  ]);

  useEffect(() => {
    if (!order) return;

    setVendor(order.vendor);
    setDescription(order.description);
    setStatus(order.status);
    setItems(order.items);
  }, [order]);

  if (isLoading) return <p>Loading order...</p>;
  if (isError) return <p>Failed to load order</p>;
  if (!order) return <p>Order not found</p>;
  return (
    <section>
      <h2>Edit Order</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            setErrorMessage("");
            setIsSubmitting(true);
            await updateOrder(order.id, {
              vendor,
              description,
              status,
              items: items.map((item) => ({
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              })),
            });

            navigate("/orders");
          } catch (error) {
            console.error("Failed to edit order", error);
            setErrorMessage("Failed to edit order");
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <div>
          <label>Vendor</label>
          <input value={vendor} onChange={(e) => setVendor(e.target.value)} />
        </div>
        <div>
          <label>Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PENDING">PENDING</option>
            <option value="ORDERED">ORDERED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <div>
          <label>Items</label>

          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr auto",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <input
                placeholder="Product name"
                value={item.productName}
                onChange={(e) => {
                  const nextItems = [...items];
                  nextItems[index].productName = e.target.value;
                  setItems(nextItems);
                }}
              />

              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => {
                  const nextItems = [...items];
                  nextItems[index].quantity = Number(e.target.value);
                  setItems(nextItems);
                }}
              />

              <input
                type="number"
                placeholder="Unit price"
                value={item.unitPrice}
                onChange={(e) => {
                  const nextItems = [...items];
                  nextItems[index].unitPrice = Number(e.target.value);
                  setItems(nextItems);
                }}
              />
              <button
                type="button"
                disabled={items.length === 1}
                onClick={() => {
                  if (items.length === 1) return;
                  setItems(items.filter((_, i) => i !== index));
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setItems([
                ...items,
                { productName: "", quantity: 1, unitPrice: 0 },
              ]);
            }}
          >
            Add Item
          </button>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}{" "}
        </button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </section>
  );
}
