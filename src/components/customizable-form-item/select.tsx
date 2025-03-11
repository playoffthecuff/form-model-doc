import type { SelectProps } from ".";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CustomizableSelect = ({
  items,
  defaultValue,
  placeholder,
  label,
  id,
  errorMessage,
  disabled = false,
}: SelectProps) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <Select defaultValue={defaultValue} disabled={disabled}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((v, i) => (
          <SelectItem key={i} value={v}>
            {v}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {errorMessage}
  </div>
);

export default CustomizableSelect;
