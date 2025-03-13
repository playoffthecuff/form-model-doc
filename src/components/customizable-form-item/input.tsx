import { InputProps } from ".";
import { Input } from "../ui/input";

const CustomizableInput = ({
  label,
  disabled = false,
  id,
  defaultValue,
}: InputProps) => (
  <div className="flex flex-col gap-y-2">
    <label
      htmlFor={id}
      className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {label}
    </label>
    <Input id={id} disabled={disabled} defaultValue={defaultValue} className="w-54"/>
  </div>
);

export default CustomizableInput;
