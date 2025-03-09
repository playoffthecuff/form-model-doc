import { Link } from "@tanstack/react-router";
import type { SelectProps } from ".";
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
  disabled = false,
}: SelectProps) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <Select defaultValue={defaultValue} disabled={disabled}>
      <SelectTrigger id={id}>
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
    You can manage email addresses in your{" "}
    <Link to="/text">email settings</Link>
  </div>
);

export default CustomizableSelect;
