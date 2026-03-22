import { useState } from "react";
import { createOrder } from "../api/ordersApi";
import { useNavigate } from "react-router-dom";

export function CreateOrderPage() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [items, setItems] = useState([
    { productName: "", quantity: 1, unitPrice: 0 },
  ]);
  return (
    <section>
      <h2>Create Order</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          await createOrder({
            vendor,
            description,
            status,
            items,
          });

          navigate("/orders");
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
        <button type="submit">Create Order</button>
      </form>
    </section>
  );
}
