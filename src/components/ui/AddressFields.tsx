import FloatingInput from "./FloatingInput";
import FormRow from "./FormRow";

export type AddressFormValue = {
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
};

type AddressFieldsProps = {
  address: AddressFormValue;
  onChange: (field: keyof AddressFormValue, value: string) => void;
  idPrefix?: string;
};

export default function AddressFields({
  address,
  onChange,
  idPrefix = "address",
}: AddressFieldsProps) {
  return (
    <>
      <FloatingInput
        id={`${idPrefix}-line1`}
        label="Address Line 1"
        value={address.addressLine1}
        onChange={(value) => onChange("addressLine1", value)}
      />

      <FloatingInput
        id={`${idPrefix}-line2`}
        label="Address Line 2"
        value={address.addressLine2 ?? ""}
        onChange={(value) => onChange("addressLine2", value)}
      />

      <FormRow>
        <FloatingInput
          id={`${idPrefix}-city`}
          label="City"
          value={address.city}
          onChange={(value) => onChange("city", value)}
        />

        <FloatingInput
          id={`${idPrefix}-state`}
          label="State / Province"
          value={address.stateOrProvince}
          onChange={(value) => onChange("stateOrProvince", value)}
        />
      </FormRow>

      <FormRow>
        <FloatingInput
          id={`${idPrefix}-postal`}
          label="Postal Code"
          value={address.postalCode}
          onChange={(value) => onChange("postalCode", value)}
        />

        <FloatingInput
          id={`${idPrefix}-country`}
          label="Country"
          value={address.country}
          onChange={(value) => onChange("country", value)}
        />
      </FormRow>
    </>
  );
}
