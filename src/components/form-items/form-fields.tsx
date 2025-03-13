import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CommonProps {
  name: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

interface CheckboxData {
  checked?: boolean;
}

interface InputData {
  defaultValue?: string;
}

export interface CheckboxProps extends CommonProps, CheckboxData {}
export interface InputProps extends CommonProps, InputData {}
export type FormItemType = "checkbox" | "input" | "select";

interface SelectData {
  defaultValue?: string;
  items: string[];
}

interface SelectProps extends CommonProps, SelectData {}

export function SelectFormField({
  items,
  defaultValue,
  name,
  label,
  description,
  disabled = false,
}: SelectProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={defaultValue}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
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
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CheckboxFormField({
  name,
  label,
  disabled = false,
  checked,
  description,
}: CheckboxProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={checked}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
}

export function InputFormField({
  name,
  description,
  label,
  disabled = false,
  defaultValue,
}: InputProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} disabled={disabled} defaultValue={defaultValue} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
