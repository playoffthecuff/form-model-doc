import clsx from "clsx";
import { Check, Edit, PlusIcon, Trash2 } from "lucide-react";
import { ChangeEventHandler, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export interface NameCoefficientData {
	name: string;
	k: number | string;
}

function InputButton({
	defaultValue = { name: "", k: "" },
	mounted = false,
	onSubmit,
	index,
	onDelete,
	onEdit,
	existingNames,
	existingCoefficients,
}: {
	mounted?: boolean;
	onSubmit?: (name: string, coefficient: number, i: number) => void;
	defaultValue?: NameCoefficientData;
	index: number;
	onDelete?: (i: number) => void;
	onEdit?: (name: string, coefficient: number, i: number) => void;
	existingNames?: Set<string>;
	existingCoefficients?: Set<string | number>;
}) {
	const [redaction, setRedaction] = useState(false);
	const [nameValue, setNameValue] = useState(defaultValue.name);
	const [coefficientValue, setCoefficientValue] = useState(
		defaultValue.k,
	);
	const [dirty, setDirty] = useState(false);

	const isDuplicateName =
		(existingNames?.has(nameValue) && nameValue !== defaultValue.name) ?? false;
	const isDuplicateCoefficient =
		(existingCoefficients?.has(Number(coefficientValue)) &&
			Number(coefficientValue) !== Number(defaultValue.k)) ??
		false;
	const isDisabled =
		!nameValue ||
		!coefficientValue ||
		isDuplicateName ||
		isDuplicateCoefficient;

	const handleClick = () => {
		if (
			!mounted &&
			onSubmit &&
			typeof coefficientValue === "number" &&
			!isDuplicateCoefficient &&
			!isDuplicateName
		) {
			onSubmit(nameValue, coefficientValue, index);
			setNameValue("");
			setCoefficientValue("");
		}
		if (
			mounted &&
			onEdit &&
			dirty &&
			redaction &&
			typeof coefficientValue === "number" &&
			!isDuplicateName &&
			!isDuplicateCoefficient
		)
			onEdit(nameValue, coefficientValue, index);
		if (mounted && !redaction) {
			setRedaction(true);
			setDirty(false);
		}
		if (mounted && redaction) setRedaction(false);
		if (mounted && redaction && !dirty) handleDelete();
	};
	const handleOnNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setNameValue(e.target.value);
		setDirty(true);
	};
	const handleOnCoefficientChange: ChangeEventHandler<HTMLInputElement> = (
		e,
	) => {
		const v = +e.target.value;
		if (isNaN(v)) return;
		setCoefficientValue(v);
		setDirty(true);
	};
	const handleDelete = () => {
		if (onDelete) onDelete(index);
		if (existingNames?.size === 1) setDirty(false);
		setDirty(false);
	};

	return (
		<div className="flex gap-2">
			<Input
				disabled={mounted && !redaction}
				value={nameValue}
				onChange={handleOnNameChange}
				className="w-24 rounded-sm px-2"
				placeholder="Name"
			/>
			<Input
				disabled={mounted && !redaction}
				value={coefficientValue}
				onChange={handleOnCoefficientChange}
				className="w-26 rounded-sm px-2"
				placeholder="Coefficient"
				type="number"
			/>
			<Button
				size="icon"
				onClick={handleClick}
				style={{ gridTemplateAreas: '"icon"' }}
				className="grid justify-center items-center"
				disabled={isDisabled}
				variant={mounted ? "outline" : "default"}
			>
				<PlusIcon
					className={clsx(
						"transition-all duration-200",
						mounted && "scale-0 opacity-0",
					)}
					style={{ gridArea: "icon" }}
				/>
				<Edit
					className={clsx(
						"scale-0 opacity-0 transition-all duration-200",
						mounted && !redaction && "scale-100 opacity-100",
					)}
					style={{ gridArea: "icon" }}
				/>
				<Trash2
					className={clsx(
						"scale-0 opacity-0 transition-all duration-200",
						mounted && redaction && !dirty && "scale-100 opacity-100",
					)}
					style={{ gridArea: "icon" }}
				/>
				<Check
					className={clsx(
						"scale-0 opacity-0 transition-all duration-200",
						mounted && redaction && dirty && "scale-100 opacity-100",
					)}
					style={{ gridArea: "icon" }}
				/>
			</Button>
		</div>
	);
}

export default function InputsSelect({
	initData,
	disabled = false,
	className,
	onChange,
}: {
	initData: NameCoefficientData[];
	disabled?: boolean;
	className?: string;
	onChange?: (dirty: boolean) => void;
}) {
	const [data, setData] = useState(initData);
	const existingNames = new Set(data.map((v) => v.name));
	const existingCoefficients = new Set(data.map((v) => v.k));
	const handleSubmit = (name: string, k: number, i: number) => {
		setData((data) => {
			const newData = [
				...data.slice(0, i),
				{ name, k },
				...data.slice(i),
			];
			return newData;
		});
		if (onChange) onChange(true);
	};
	const handleDelete = (idx: number) => {
		setData(data.filter((_, i) => i !== idx));
		if (onChange) onChange(data.length > 1);
	};
	const handleEdit = (name: string, k: number, i: number) => {
		setData((data) => {
			const newData = [
				...data.slice(0, i),
				{ name, k },
				...data.slice(i + 1),
			];
			return newData;
		});
		if (onChange) onChange(true);
	};
	return (
		<Select disabled={disabled}>
			<SelectTrigger className={clsx("w-full", className)}>
				<SelectValue placeholder="Units of measure"/>
			</SelectTrigger>
			<SelectContent className="flex flex-col">
				{data.map((v, i) => (
					<div key={i} className="flex gap-x-2 mb-1">
						<InputButton
							mounted={true}
							defaultValue={{ name: v.name, k: v.k }}
							onDelete={handleDelete}
							onEdit={handleEdit}
							index={i}
							existingNames={existingNames}
							existingCoefficients={existingCoefficients}
						/>
					</div>
				))}
				<div className="flex gap-x-2 mb-1">
					<InputButton
						mounted={false}
						onSubmit={handleSubmit}
						index={data.length}
						existingNames={existingNames}
						existingCoefficients={existingCoefficients}
					/>
				</div>
			</SelectContent>
		</Select>
	);
}
