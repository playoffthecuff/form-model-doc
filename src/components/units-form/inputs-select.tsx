import clsx from "clsx";
import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { InputButton, NameCoefficientData } from "./input-button";

export default function InputsSelect({
	initData,
	disabled = false,
	className,
	onChange,
	onPost,
	onPatch,
	onDelete,
	onDefaultPatch,
}: {
	initData: NameCoefficientData[];
	disabled?: boolean;
	className?: string;
	onChange?: (index: number, unit: string, k: number) => void;
	onPatch?: (unit: string, k: number, index: number) => void;
	onPost?: (data: NameCoefficientData) => void;
	onDelete?: (index: number) => void;
	onDefaultPatch?: (d: string) => void;
}) {
	const [data, setData] = useState(initData);
	const existingNames = new Set(data.map((v) => v.unit));
	const existingCoefficients = new Set(data.map((v) => v.k));
	const handlePost = (unit: string, k: number) => {
		const newData = [...data, { unit, k, default: data[0].default }];
		setData(newData);
	};
	const handleDelete = (idx: number) => {
		setData(data.filter((_, i) => i !== idx));
		if (onDelete) onDelete(idx);
	};
	const handlePatch = (unit: string, k: number, i: number, d: string) => {
		if (
			initData[i].k === k &&
			initData[i].unit === unit &&
			initData[i].default === d
		) {
			return;
		}
		setData((data) => {
			const newData = [
				...data.slice(0, i),
				{ unit, k, default: d },
				...data.slice(i + 1),
			];
			return newData;
		});
		if (onPatch) onPatch(unit, k, i);
	};
	const handleDefaultChange = (d: string) => {
		setData([...data].map((v) => ({ ...v, default: d })));
		if (onDefaultPatch) onDefaultPatch(d);
	};

	return (
		<Select disabled={disabled}>
			<SelectTrigger className={clsx("w-full", className)}>
				<SelectValue placeholder={`Default: ${data[0]?.default ?? ""}`} />
			</SelectTrigger>
			<SelectContent className="flex flex-col">
				{data.map((v, i) => (
					<div key={i} className="flex gap-x-2 mb-1">
						<InputButton
							mounted={true}
							defaultValue={{ unit: v.unit, k: v.k, default: v.default }}
							onDelete={handleDelete}
							onPatch={handlePatch}
							index={i}
							existingNames={existingNames}
							existingCoefficients={existingCoefficients}
							onRadioChange={handleDefaultChange}
						/>
					</div>
				))}
				<div className="flex gap-x-2 mt-4">
					<InputButton
						mounted={false}
						onPost={handlePost}
						index={data.length}
						existingNames={existingNames}
						existingCoefficients={existingCoefficients}
					/>
				</div>
			</SelectContent>
		</Select>
	);
}
