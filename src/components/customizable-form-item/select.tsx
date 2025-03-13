import { Edit } from "lucide-react";
import type { SelectProps } from ".";
import { Button } from "../ui/button";
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
  label,
  id,
  errorMessage,
  disabled = false,
}: SelectProps) => (
  <div className="flex flex-col gap-y-2">
    <label htmlFor={id} className="leading-none">
      {label}
    </label>
    <Select defaultValue={defaultValue} disabled={disabled}>
      <SelectTrigger id={id} className="w-54">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((v, i) => (
          <div key={i} className="flex gap-x-2">
            <Button size="icon" variant="ghost">
              <Edit />
            </Button>
            <SelectItem value={v}>
              <div>{v}</div>
            </SelectItem>
          </div>
        ))}
      </SelectContent>
    </Select>
    {errorMessage}
  </div>
);

export default CustomizableSelect;
