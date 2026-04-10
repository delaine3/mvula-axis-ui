import FloatingInput from "./FloatingInput";
import { Trash2 } from "lucide-react";

export type LineItemFormValue = {
  productName: string;
  quantity: number;
  unitPrice: number;
};

type LineItemRowProps = {
  index: number;
  item: LineItemFormValue;
  onChange: (
    index: number,
    field: keyof LineItemFormValue,
    value: string | number,
  ) => void;
  onRemove: (index: number) => void;
  disableRemove: boolean;
};

export default function LineItemRow({
  index,
  item,
  onChange,
  onRemove,
  disableRemove,
}: LineItemRowProps) {
  return (
    <div className="item-row">
      <FloatingInput
        id={`product-name-${index}`}
        label="Product Name"
        value={item.productName}
        onChange={(value) => onChange(index, "productName", value)}
      />

      <FloatingInput
        id={`quantity-${index}`}
        label="Quantity"
        type="number"
        value={String(item.quantity)}
        onChange={(value) => onChange(index, "quantity", Number(value))}
      />

      <FloatingInput
        id={`unit-price-${index}`}
        label="Unit Price"
        type="number"
        value={String(item.unitPrice)}
        onChange={(value) => onChange(index, "unitPrice", Number(value))}
      />

      <button
        type="button"
        className="icon-button icon-button-delete"
        disabled={disableRemove}
        onClick={() => onRemove(index)}
        title="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
