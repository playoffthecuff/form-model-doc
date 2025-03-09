import type { CheckBoxProps } from ".";
import { Checkbox } from "../ui/checkbox";

const CustomizableCheckbox = ({
  label,
  disabled = false,
  id,
  checked,
}: CheckBoxProps) => (
  <div className="flex gap-x-2">
    <Checkbox id={id} disabled={disabled} checked={checked} />
    <label
      htmlFor={id}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {label}
    </label>
  </div>
);

export default CustomizableCheckbox;
