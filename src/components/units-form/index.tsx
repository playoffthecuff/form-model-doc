import clsx from "clsx";
import { Check, Edit, Plus, Trash2, Undo } from "lucide-react";
import { ChangeEventHandler, useEffect, useState } from "react";
import { ConfirmPopover } from "../confirm-popover";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { NameCoefficientData } from "./input-button";
import InputsSelect from "./inputs-select";
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
	onSubmit,
	onDelete,
	data,
	idx,
}: {
	onSubmit?: (d: UnitData, i: number) => void;
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
		if (index === 2 && onSubmit) {
			onSubmit(unitData, idx);
			reset();
		}
		if (index === 1) {
			reset();
		}
	};
	const handleDelete = () => {
		if (onDelete) {
			onDelete(idx);
			reset();
		}
	};
	const handleNamePatch: ChangeEventHandler<HTMLInputElement> = (e) => {
		setUnitData({ ...unitData, name: e.target.value });
		setNameDirty(e.target.value !== data.name);
	};
	const handleUnitPatch = (
		unit: string,
		coefficient: number,
		index: number,
	) => {
		const units = [...data.units];
		units[index] = unit;
		const k = [...data.k];
		k[index] = coefficient;
		const newData = { ...unitData, units, k };
		setUnitData(newData);
		setUnitDirty(true);
	};
	const handleDefaultPatch = (d: string) => {
		setUnitData({ ...unitData, default: d });
		setUnitDirty(true);
	};
	useEffect(() => {
		if (nameDirty || unitDirty) {
			setIndex(2);
		} else if (index === 2) {
			setIndex(1);
		}
	}, [nameDirty, unitDirty, index]);
	useEffect(() => {
		setUnitData(data);
	}, [data]);
	const nameCoefficientData: NameCoefficientData[] = unitData.k.map((v, i) => ({
		k: v,
		unit: data.units[i],
		default: unitData.default,
	}));

	return (
		<div className="border-t pt-4 flex gap-x-2 w-96">
			<Input
				placeholder="Name"
				value={unitData.name}
				disabled={index === 0}
				onChange={handleNamePatch}
				className={clsx(
					index === 0 && "border-transparent",
					"text-end disabled:opacity-100 disabled:text-muted-foreground",
				)}
			/>
			<InputsSelect
				initData={nameCoefficientData}
				disabled={index === 0}
				className={clsx(
					index === 0 && "border-transparent",
					"disabled:opacity-100 disabled:data-[placeholder]:text-muted-foreground data-[placeholder]:text-foreground",
				)}
				onPatch={handleUnitPatch}
				onDefaultPatch={handleDefaultPatch}
			/>
			<MultiIconButton
				icons={[Edit, Undo, Check]}
				onClick={handleClick}
				variant="ghost"
				currentIndex={index}
			/>
			<ConfirmPopover
				description="Delete Item"
				question="Are you sure?"
				variant="ghost"
				icon={<Trash2 />}
				onConfirm={handleDelete}
			/>
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
		setData(data.filter((_, i) => i !== idx));
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
					onSubmit={handleEdit}
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
			<div>
				<p className="text-muted-foreground opacity-60">Hello World</p>
			</div>
		</div>
	);
}
