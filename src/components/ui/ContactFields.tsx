import FloatingInput from "./FloatingInput";

type ContactFieldsProps = {
  contactPerson: string;
  contactNumber: string;
  email: string;
  onContactPersonChange: (value: string) => void;
  onContactNumberChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  idPrefix?: string;
};

export default function ContactFields({
  contactPerson,
  contactNumber,
  email,
  onContactPersonChange,
  onContactNumberChange,
  onEmailChange,
  idPrefix = "contact",
}: ContactFieldsProps) {
  return (
    <>
      <FloatingInput
        id={`${idPrefix}-person`}
        label="Contact Person"
        value={contactPerson}
        onChange={onContactPersonChange}
      />

      <FloatingInput
        id={`${idPrefix}-number`}
        label="Contact Number"
        value={contactNumber}
        type="tel"
        onChange={onContactNumberChange}
      />

      <FloatingInput
        id={`${idPrefix}-email`}
        label="Email"
        value={email}
        type="email"
        onChange={onEmailChange}
      />
    </>
  );
}
