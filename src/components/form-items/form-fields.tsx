import { Edit } from "lucide-react";
import { Control } from "react-hook-form";
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
	name: Path<FormValues>;
	label: string;
	disabled?: boolean;
	description?: string;
	control: Control<{
    elements: {
        id: string;
        type: string;
        label: string;
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        value?: any;
    }[];
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
}, any>;
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

import { Path } from "react-hook-form";

interface FormValues {
	elements: {
		id: string;
		type: string;
		label: string;
		disabled?: boolean;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		value?: any;
	}[];
}

interface SelectProps extends CommonProps, SelectData {}

export function SelectFormField({
	items,
	name,
	label,
	description,
	disabled,
	control,
}: SelectProps) {
	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<Select
						onValueChange={field.onChange}
						disabled={disabled}
						value={field.value}
					>
						<FormControl>
							<SelectTrigger className="w-54">
								<SelectValue />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{items.map((v, i) => (
								<div key={i} className="flex gap-x-2">
									<Button size="icon" variant="ghost">
										<Edit />
									</Button>
									<SelectItem value={v.toString()}>{v}</SelectItem>
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
	description,
	disabled,
	control,
}: CheckboxProps) {
	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => (
				<FormItem className="flex flex-row p-2">
					<FormControl>
						<Checkbox
							checked={field.value}
							onCheckedChange={field.onChange}
							disabled={disabled}
							onChange={field.onChange}
						/>
					</FormControl>
					<div className="space-y-1 leading-none">
						<FormLabel>{label}</FormLabel>
						<FormDescription>{description}</FormDescription>
						<FormMessage />
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
	control,
	disabled,
}: InputProps) {
	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => {
				return (
					<FormItem>
						<FormLabel>{label}</FormLabel>
						<FormControl>
							<Input {...field} disabled={disabled} className="w-54" />
						</FormControl>
						<FormDescription>{description}</FormDescription>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
