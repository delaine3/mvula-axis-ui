import LineItemRow, { type LineItemFormValue } from "./LineItemRow";

type LineItemsFieldProps = {
  label?: string;
  items: LineItemFormValue[];
  onChange: (items: LineItemFormValue[]) => void;
};

export default function LineItemsField({
  label = "Items",
  items,
  onChange,
}: LineItemsFieldProps) {
  const handleItemChange = (
    index: number,
    field: keyof LineItemFormValue,
    value: string | number,
  ) => {
    const nextItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );

    onChange(nextItems);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    const lastItem = items[items.length - 1];

    if (!lastItem.productName.trim()) {
      alert("Fill in the current item first");
      return;
    }

    onChange([
      ...items,
      {
        productName: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <div style={{ display: "grid", gap: "12px" }}>
        {items.map((item, index) => (
          <LineItemRow
            key={index}
            index={index}
            item={item}
            onChange={handleItemChange}
            onRemove={handleRemoveItem}
            disableRemove={items.length === 1}
          />
        ))}
      </div>

      <div style={{ marginTop: "12px" }}>
        <button
          className="button button-secondary"
          type="button"
          onClick={handleAddItem}
        >
          Add Item
        </button>
      </div>
    </div>
  );
}
