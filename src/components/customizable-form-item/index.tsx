import CustomizableCheckbox from "./checkbox";
import CustomizableSelect from "./select";

interface CommonProps {
  id: string;
  label: string;
  disabled?: boolean;
  className?: string;
}

interface CheckBoxData {
  checked?: boolean;
}

export interface CheckBoxProps extends CommonProps, CheckBoxData {}

interface SelectData{
  defaultValue?: string;
  items: string[];
  placeholder?: string;
  errorMessage?: string;
}

export interface SelectProps extends CommonProps, SelectData {}

export type FormItemProps =
  | (CommonProps & { type: "checkbox" } & CheckBoxData)
  | (CommonProps & { type: "select" } & SelectData);

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
          placeholder={props.placeholder}
        />
      )}
    </div>
  );
}
