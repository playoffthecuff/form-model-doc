import { Check, Edit, Plus, Trash2 } from "lucide-react";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import MultiIconButton from "./multi-icon-button";

export interface NameCoefficientData {
	unit: string;
	k: number | string;
	default: string;
}

export function InputButton({
	defaultValue = { unit: "", k: "", default: "" },
	mounted = false,
	onPost,
	index,
	onDelete,
	onPatch,
	onRadioChange,
	existingNames,
	existingCoefficients,
}: {
	mounted?: boolean;
	onPost?: (unit: string, coefficient: number) => void;
	defaultValue?: NameCoefficientData;
	index: number;
	onDelete?: (index: number) => void;
	onPatch?: (
		unit: string,
		coefficient: number,
		index: number,
		d: string,
	) => void;
	onRadioChange?: (v: string) => void;
	existingNames?: Set<string>;
	existingCoefficients?: Set<string | number>;
}) {
	const [editing, setEditing] = useState(false);
	const [nameValue, setNameValue] = useState(defaultValue.unit);
	const [coefficientValue, setCoefficientValue] = useState(defaultValue.k);
	const [dirty, setDirty] = useState(false);
	const [radioValue, setRadioValue] = useState<string>(defaultValue.default);
  useEffect(() => {
    setRadioValue(defaultValue.default);
  }, [defaultValue.default])
	const isDuplicateName =
		(existingNames?.has(nameValue) && nameValue !== defaultValue.unit) ?? false;
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
			onPost &&
			typeof coefficientValue === "number" &&
			!isDuplicateCoefficient &&
			!isDuplicateName
		) {
			onPost(nameValue, coefficientValue);
			setNameValue("");
			setCoefficientValue("");
		}
		if (
			mounted &&
			dirty &&
			editing &&
			typeof coefficientValue === "number" &&
			onPatch
		) {
			if (
				nameValue !== defaultValue.unit ||
				coefficientValue !== defaultValue.k ||
				radioValue !== defaultValue.default
			) {
				onPatch(nameValue, coefficientValue, index, radioValue);
			} else {
				if (nameValue === defaultValue.unit) setNameValue(defaultValue.unit);
				if (coefficientValue === defaultValue.k)
					setCoefficientValue(defaultValue.k);
			}
		}
		if (mounted && !editing) {
			setEditing(true);
			setDirty(false);
		}
		if (mounted && editing) setEditing(false);
		if (mounted && editing && !dirty) handleDelete();
	};
	const handleOnNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		const newValue = e.target.value;
		setNameValue(newValue);
    if (radioValue === defaultValue.default) {
      setRadioValue(newValue);
      if (onRadioChange) onRadioChange(newValue);
    }
		if (
			newValue === defaultValue.unit &&
			coefficientValue === defaultValue.k &&
			radioValue === defaultValue.default
		) {
			setDirty(false);
		} else {
			setDirty(true);
		}
	};
	const handleOnCoefficientChange: ChangeEventHandler<HTMLInputElement> = (
		e,
	) => {
		const v = +e.target.value;
		// biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
		if (isNaN(v)) return;
		setCoefficientValue(v);
		if (
			nameValue === defaultValue.unit &&
			v === defaultValue.k &&
			radioValue === defaultValue.default
		) {
			setDirty(false);
		} else {
			setDirty(true);
		}
	};
	const handleDelete = () => {
		if (onDelete) onDelete(index);
		if (existingNames?.size === 1) setDirty(false);
		setDirty(false);
	};
	const handleOnDefaultChange = () => {
		let newValue = "";
		if (defaultValue.default === nameValue) newValue = "";
		if (defaultValue.default !== nameValue) newValue = nameValue;
		setRadioValue(newValue);
		if (onRadioChange) onRadioChange(newValue);
	};

	return (
		<div className="flex gap-2">
			<div className="h-9 w-8 flex flex-col justify-center items-center ml-1">
				{defaultValue.unit && (
					<RadioGroup value={radioValue}>
						<RadioGroupItem value={nameValue} onClick={handleOnDefaultChange} />
					</RadioGroup>
				)}
			</div>
			<Input
				disabled={mounted && !editing}
				value={nameValue}
				onChange={handleOnNameChange}
				className="w-24 rounded-sm px-2"
				placeholder="Name"
			/>
			<Input
				disabled={mounted && !editing}
				value={coefficientValue}
				onChange={handleOnCoefficientChange}
				className="w-26 rounded-sm px-2"
				placeholder="Coefficient"
				type="number"
			/>
			<MultiIconButton
				icons={[Plus, Edit, Trash2, Check]}
				currentIndex={
					mounted && !editing
						? 1
						: mounted && editing && !dirty
							? 2
							: mounted && editing && dirty
								? 3
								: 0
				}
				onClick={handleClick}
				variant={mounted ? "outline" : "default"}
				disabled={isDisabled}
			/>
		</div>
	);
}
