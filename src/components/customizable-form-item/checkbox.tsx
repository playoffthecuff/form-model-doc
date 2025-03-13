import type { CheckboxProps } from ".";
import { Checkbox } from "../ui/checkbox";

const CustomizableCheckbox = ({
  label,
  disabled = false,
  id,
  checked,
}: CheckboxProps) => (
  <div className="flex gap-y-2 flex-col">
    <label
      htmlFor={id}
      className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {label}
    </label>
    <Checkbox id={id} disabled={disabled} checked={checked} />
  </div>
);

export default CustomizableCheckbox;
