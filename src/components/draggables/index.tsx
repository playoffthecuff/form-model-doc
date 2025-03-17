import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DraggableAttributes,
	Modifier,
	pointerWithin,
	useDraggable,
	useDroppable,
} from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS, Transform } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Edit, GripVertical } from "lucide-react";
import { ReactNode, useState } from "react";
import { Control, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { ConfirmPopover } from "../confirm-popover";
import {
	CheckboxFormField,
	InputFormField,
	SelectFormField,
} from "../form-items/form-fields";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

const restrictToVertical: Modifier = ({ transform }) => {
	return { ...transform, x: 0 };
};

function ItemWrapper({
	children,
	setNodeRef,
	listeners,
	attributes,
	transform,
	transition,
	editable = false,
	id,
	onRemove,
	className,
}: {
	children: ReactNode;
	setNodeRef?: (element: HTMLElement | null) => void;
	listeners?: SyntheticListenerMap;
	attributes?: DraggableAttributes;
	transform: Transform | null;
	transition?: string;
	editable?: boolean;
	id?: string;
	onRemove?: () => void;
	className?: string;
}) {
	const handleRemove = () => {
		if (onRemove && id) onRemove();
	};
	return (
		<div
			ref={setNodeRef}
			{...attributes}
			className={clsx(
				"p-2 border rounded-md flex gap-x-4 bg-background",
				className,
			)}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
			}}
		>
			<div className="flex flex-1">{children}</div>
			<div className="flex flex-col gap-y-2">
				<ConfirmPopover
					description="Удаление элемента формы"
					question="Вы уверены?"
					onConfirm={handleRemove}
					disabled={!editable}
				/>
				<Button size="icon" variant="outline" disabled={!editable}>
					<Edit />
				</Button>
				<Button
					size="icon"
					variant="outline"
					{...listeners}
					className="hover:cursor-grab active:cursor-grabbing"
				>
					<GripVertical />
				</Button>
			</div>
		</div>
	);
}

function DraggableTemplateItem({
	item,
	className,
	index,
	control,
	disabled = false,
}: {
	item: { id: string; type: string; label: string };
	className?: string;
	index: number;
	disabled?: boolean;
	control: Control<
		{
			elements: (
				| {
						id: string;
						type: string;
						label: string;
						value: boolean;
				  }
				| {
						id: string;
						type: string;
						label: string;
						value: string;
				  }
			)[];
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any
	>;
}) {
	const { attributes, listeners, setNodeRef } = useDraggable({
		id: `template-${item.id}`,
		data: { type: "template", item, origin: "template", index },
	});
	return (
		<ItemWrapper
			attributes={attributes}
			listeners={listeners}
			setNodeRef={setNodeRef}
			transform={null}
			className={className}
		>
			{item.type === "checkbox" && (
				<CheckboxFormField
					label={item.label}
					name={`elements.${index}.value`}
					description="Описание"
					control={control}
					disabled={disabled}
				/>
			)}
			{item.type === "input" && (
				<InputFormField
					label={item.label}
					name={`elements.${index}.value`}
					description="Описание"
					control={control}
					disabled={disabled}
				/>
			)}
			{item.type === "select" && (
				<SelectFormField
					options={["Значение по умолчанию"]}
					label={item.label}
					name={`elements.${index}.value`}
					description="Описание"
					control={control}
					disabled={disabled}
				/>
			)}
		</ItemWrapper>
	);
}

function SortableItem({
	item,
	className,
	index,
	onRemove,
	disabled = false,
	control,
}: {
	item: { id: string; type: string; label: string };
	className?: string;
	index: number;
	disabled?: boolean;
	onRemove?: () => void;
	control: Control<
		{
			elements: {
				id: string;
				type: string;
				label: string;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				value?: any;
			}[];
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any
	>;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: item.id,
			data: { type: "sortable", item, origin: "workspace" },
		});
	return (
		<ItemWrapper
			attributes={attributes}
			setNodeRef={setNodeRef}
			listeners={listeners}
			transform={transform}
			transition={transition}
			editable
			onRemove={onRemove}
			id={item.id}
			className={className}
		>
			{item.type === "checkbox" && (
				<CheckboxFormField
					label={item.label}
					name={`elements.${index}.value`}
					description="Описание"
					control={control}
					disabled={disabled}
				/>
			)}
			{item.type === "input" && (
				<InputFormField
					label={item.label}
					name={`elements.${index}.value`}
					description="Описание"
					control={control}
					disabled={disabled}
				/>
			)}
			{item.type === "select" && (
				<SelectFormField
					options={["Значение по умолчанию", "Другое значение"]}
					label={item.label}
					name={`elements.${index}.value`}
					description="Описание"
					control={control}
					disabled={disabled}
				/>
			)}
		</ItemWrapper>
	);
}

function DroppableArea({ children }: { children: React.ReactNode }) {
	const { setNodeRef } = useDroppable({ id: "droppable-area" });

	return (
		<div
			ref={setNodeRef}
			className="min-h-80 p-4 border-2 border-dashed rounded flex flex-col gap-y-4"
		>
			{children}
		</div>
	);
}

const elementSchema = z.object({
	id: z.string(),
	type: z.string(),
	label: z.string(),
	value: z.any(),
});

type ElementSchema = z.infer<typeof elementSchema>;

interface DragElement {
	item: ElementSchema;
	index: number;
	origin: string;
	type: string;
}

export default function FormBuilder() {
	const [activeItem, setActiveItem] = useState<DragElement | null>(null);
	const [animateDuration, setAnimateDuration] = useState(0);

	const schema = z.object({
		elements: z.array(elementSchema).default([]),
	});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			elements: [],
		},
	});

	const { fields, append, remove, move } = useFieldArray({
		control: form.control,
		name: "elements",
	});

	const templateForm = useForm({
		defaultValues: {
			elements: [
				{
					id: "checkbox",
					type: "checkbox",
					label: "Чекбокс",
					value: false,
				},
				{
					id: "input",
					type: "input",
					label: "Текстовое поле",
					value: "Значение по умолчанию",
				},
				{
					id: "select",
					type: "select",
					label: "Выпадающий список",
					value: "Значение по умолчанию",
				},
			],
		},
	});

	const tempArr = useFieldArray({
		control: templateForm.control,
		name: "elements",
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	// useEffect(() => {
	// 	reset();
	// }, [schema, reset]);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleDragStart = (event: any) => {
		const { active } = event;
		setActiveItem(active.data.current || null);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		setActiveItem(null);
		const { active, over } = event;
		const activeId = active.id;
		setAnimateDuration(200);
		console.log(fields, activeId);
		if (!over) return;

		const isOverWorkspace = over.id === "droppable-area";
		const elementType = active.data.current?.type;
		const type = active.data.current?.item.type;
		const value = active.data.current?.item.value;
		const label = active.data.current?.item.label;

		if (elementType === "template" && isOverWorkspace) {
			setAnimateDuration(0);
			const newElement = {
				id: "",
				label,
				type,
				value,
			};
			append(newElement);
			return;
		}
		const oldIndex = fields.findIndex(
			(elem) => elem.id === activeId,
		);
		const newIndex = fields.findIndex(
			(elem) => elem.id === over?.id,
		);

		if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
			move(oldIndex, newIndex);
		}
	};

	const onSubmit = (data: z.infer<typeof schema>) =>
		console.log("SUBMIT", data);

	return (
		<DndContext
			collisionDetection={pointerWithin}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			modifiers={activeItem?.origin === "workspace" ? [restrictToVertical] : []}
		>
			<div className="grid grid-cols-2 gap-x-4 p-4">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
						className="space-y-4"
					>
						<DroppableArea>
							<SortableContext
								items={fields.map((elem) => elem.id)}
								strategy={verticalListSortingStrategy}
							>
								{fields.map((field, index) => (
									<SortableItem
										item={field}
										key={field.id}
										onRemove={() => remove(index)}
										control={form.control}
										index={index}
									/>
								))}
							</SortableContext>
						</DroppableArea>
						<Button onClick={() => console.log(form.getValues())}>Test</Button>
					</form>
				</Form>
				<div className="p-4 border rounded">
					<Form {...templateForm}>
						<form className="flex flex-col gap-y-4">
							{tempArr.fields.map((field, index) => (
								<DraggableTemplateItem
									item={field}
									key={field.id}
									control={templateForm.control}
									index={index}
									disabled
								/>
							))}
						</form>
					</Form>
				</div>
			</div>

			<DragOverlay
				dropAnimation={{
					duration: animateDuration,
					easing: "linear",
				}}
			>
				{activeItem ? (
					<Form {...templateForm}>
						<DraggableTemplateItem
							key={activeItem.item.id}
							item={activeItem.item}
							index={activeItem.index}
							control={templateForm.control}
						/>
					</Form>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}
