import clsx from "clsx";
import { Check, Edit, Plus, Trash2 } from "lucide-react";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import InputsSelect, { NameCoefficientData } from "./inputs-select";
import MultiIconButton from "./multi-icon-button";

export interface UnitData {
	name: string;
	units: string[];
	k: number[];
	default: string;
}

const initialData: UnitData[] = [
	{
		name: "Length",
		units: ["mm", "cm", "m", "km"],
		k: [0.001, 0.01, 1, 1000],
		default: "m",
	},
	{
		name: "Weight",
		units: ["g", "kg", "ton"],
		k: [0.0001, 1, 1000],
		default: "kg",
	},
	{ name: "Velocity", units: ["m/s", "km/h"], k: [1, 3.6], default: "m/s" },
	{
		name: "Voltage",
		units: ["mV", "V", "kV", "MV"],
		k: [0.001, 1, 1000, 1000000],
		default: "V",
	},
];

function UnitsFormItem({
	onEdit,
	onDelete,
	data,
	idx,
}: {
	onEdit?: (d: UnitData, i: number) => void;
	onDelete?: (i: number) => void;
	data: UnitData;
	idx: number;
}) {
	const [unitData, setUnitData] = useState<UnitData>(data);
	const [index, setIndex] = useState(0);
	const [nameDirty, setNameDirty] = useState(false);
	const [unitDirty, setUnitDirty] = useState(false);

	const reset = () => {
		setIndex(0);
		setNameDirty(false);
		setUnitDirty(false);
	};

	const handleClick = (i: number) => {
		if (i === 0) setIndex(1);
		if (index === 2 && onEdit) {
			onEdit(unitData, idx);
			reset();
		}
		if (index === 1 && onDelete) {
			onDelete(idx);
      setTimeout(() => setUnitData(data),1000);
			reset();
		}
	};
	const handleNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setUnitData({ ...unitData, name: e.target.value });
		setNameDirty(!!e.target.value);
	};
	const handleUnitChange = (dirty: boolean) => {
		setUnitDirty(dirty);
	};
	useEffect(() => {
		if (nameDirty || unitDirty) {
			setIndex(2);
		}
	}, [nameDirty, unitDirty]);

	const nameCoefficientData: NameCoefficientData[] = unitData.k.map((v, i) => ({
		k: v,
		name: data.units[i],
	}));

	return (
		<div className="border-t pt-4 flex gap-x-2">
			<Input
				placeholder="Name"
				value={unitData.name}
				disabled={index === 0}
				onChange={handleNameChange}
				className={clsx(
					index === 0 && "border-none",
					"text-end disabled:opacity-100",
				)}
			/>
			<InputsSelect
				initData={nameCoefficientData}
				disabled={index === 0}
				className={clsx(
					index === 0 && "border-none",
					"disabled:opacity-100 data-[placeholder]:text-foreground",
				)}
				onChange={handleUnitChange}
			/>
			<MultiIconButton
				icons={[Edit, Trash2, Check]}
				onClick={handleClick}
				variant="ghost"
				currentIndex={index}
			/>
      <Button onClick={() => setUnitData(data)}/>
		</div>
	);
}

export default function UnitsForm() {
	const [data, setData] = useState<UnitData[]>(initialData);
	const [newUnit, setNewUnit] = useState<UnitData>({
		name: "",
		units: [""],
		k: [0],
		default: "",
	});

	const addUnit = () => {
		if (!newUnit.name || newUnit.units.length === 0 || newUnit.k.length === 0)
			return;
		setData([...data, newUnit]);
		setNewUnit({ name: "", units: [], k: [], default: "" });
	};

	const handleEdit = (d: UnitData, i: number) => {
		setData([...data.slice(0, i), d, ...data.slice(i + 1)]);
	};

	const handleDelete = (idx: number) => {
    console.log()
		setData(data.filter((_, i) => i !== idx));
		//mdn Array.filter;
	};

	return (
		<div className="flex flex-col gap-y-4 p-4 border rounded-md w-fit">
			{data.map((v, i) => (
				<div key={i} className="flex gap-x-2 items-center">
					<div className="w-20 text-end">{v.name}:</div>
					<Select value={v.default}>
						<SelectTrigger className="w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{v.units.map((unit, i) => (
								<SelectItem value={unit} key={i}>
									{unit}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button variant="ghost" size="icon">
						<Edit />
					</Button>
				</div>
			))}
			{data.map((v, i) => (
				<UnitsFormItem
					key={i}
					data={v}
					onEdit={handleEdit}
					idx={i}
					onDelete={handleDelete}
				/>
			))}

			<div className="border-t pt-4 flex flex-col gap-y-2">
				<Input
					placeholder="Category Name"
					value={newUnit.name}
					onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
				/>
				<InputsSelect initData={[]} />
				<Button onClick={addUnit}>
					<Plus className="mr-2" /> Add Category
				</Button>
			</div>
		</div>
	);
}
