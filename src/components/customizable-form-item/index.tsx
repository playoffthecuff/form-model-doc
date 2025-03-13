import CustomizableCheckbox from "./checkbox";
import CustomizableInput from "./input";
import CustomizableSelect from "./select";

interface CommonProps {
  id: string;
  label: string;
  disabled?: boolean;
  className?: string;
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
  errorMessage?: string;
}

export interface SelectProps extends CommonProps, SelectData {}

export type FormItemProps =
  | (CommonProps & { type: "checkbox" } & CheckboxData)
  | (CommonProps & { type: "select" } & SelectData)
  | (CommonProps & { type: "input" } & InputData);

export default function CustomizableFormItem(props: FormItemProps) {
  const { type, id, label, disabled, className } = props;
  return (
    <div className={className}>
      {type === "checkbox" && (
        <CustomizableCheckbox
          label={label}
          id={id}
          checked={props.checked}
          disabled={disabled}
        />
      )}
      {type === "select" && (
        <CustomizableSelect
          defaultValue={props.defaultValue}
          label={label}
          id={id}
          disabled={disabled}
          items={props.items}
        />
      )}
      {type === "input" && (
        <CustomizableInput
          defaultValue={props.defaultValue}
          label={label}
          id={id}
          disabled={disabled}
        />
      )}
    </div>
  );
}
