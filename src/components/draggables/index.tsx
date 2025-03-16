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
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS, Transform } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Edit, GripVertical } from "lucide-react";
import { nanoid } from "nanoid";
import { ReactNode, useEffect, useState } from "react";
import { Control, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { ConfirmPopover } from "../confirm-popover";
import { FormItemType } from "../customizable-form-item";
import {
	CheckboxFormField,
	InputFormField,
	SelectFormField,
} from "../form-items/form-fields";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type FormElement = {
	id: string;
	type: FormItemType;
	label: string;
	origin: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	schema?: z.ZodObject<any>;
	defaultValue?: string | boolean;
};

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
	disabled,
	index,
	control,
}: {
	item: FormElement;
	className?: string;
	disabled?: boolean;
	index: number;
	control: Control<
		{
			elements: {
				id: string;
				type: string;
				label: string;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				defaultValue?: any;
			}[];
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any
	>;
}) {
	const { attributes, listeners, setNodeRef } = useDraggable({
		id: `template-${item.id}`,
		data: { type: "template", item, origin: "template" },
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
					name={`elements.${index}.id`}
					description="Описание"
					disabled={disabled}
					control={control}
				/>
			)}
			{item.type === "input" && (
				<InputFormField
					label={item.label}
					name={`elements.${index}.id`}
					description="Описание"
					disabled={disabled}
					control={control}
				/>
			)}
			{item.type === "select" && (
				<SelectFormField
					items={["Значение по умолчанию"]}
					label={item.label}
					name={`elements.${index}.id`}
					description="Описание"
					disabled={disabled}
					control={control}
				/>
			)}
		</ItemWrapper>
	);
}

function SortableItem({
	item,
	className,
	disabled,
	index,
	onRemove,
	control,
}: {
	item: { id: string; type: string; label: string };
	className?: string;
	disabled?: boolean;
	index: number;
	onRemove?: () => void;
	control: Control<
		{
			elements: {
				id: string;
				type: string;
				label: string;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				defaultValue?: any;
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
					name={`elements.${index}.id`}
					description="Описание"
					disabled={disabled}
					control={control}
				/>
			)}
			{item.type === "input" && (
				<InputFormField
					label={item.label}
					name={`elements.${index}.id`}
					description="Описание"
					disabled={disabled}
					control={control}
				/>
			)}
			{item.type === "select" && (
				<SelectFormField
					items={["Значение по умолчанию", "Другое значение"]}
					label={item.label}
					name={`elements.${index}.id`}
					description="Описание"
					disabled={disabled}
					control={control}
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

export default function FormBuilder() {
	const [formElements, setFormElements] = useState<FormElement[]>([]);
	const [activeItem, setActiveItem] = useState<FormElement | null>(null);
	const [animateDuration, setAnimateDuration] = useState(0);

	const elementSchema = z.object({
		id: z.string(),
		type: z.string(),
		label: z.string(),
		defaultValue: z.any(),
	});

	const schema = z.object({
		elements: z.array(elementSchema).default([]),
	});

	const { control, handleSubmit, reset } = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			elements: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "elements",
	});

	const tempForm = useForm({
		defaultValues: {
			elements: [
				{
					id: "checkbox",
					type: "checkbox",
					label: "чекбокс",
					defaultValue: false,
				},
				{
					id: "input",
					type: "input",
					label: "текстовое поле",
					defaultValue: "Значение по умолчанию",
				},
				{
					id: "select",
					type: "select",
					label: "выпадающий список",
					defaultValue: "Значение по умолчанию",
				},
			],
		},
	});

	const templateControl = tempForm.control;

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		reset();
	}, [schema, reset]);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleDragStart = (event: any) => {
		const { active } = event;
		const draggedItem = formElements.find((item) => item.id === active.id);
		setActiveItem(draggedItem || active.data.current?.item || null);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		setActiveItem(null);
		const { active, over } = event;
		const activeId = active.id;
		setAnimateDuration(200);
		if (!over) return;

		const isOverWorkspace = over.id === "droppable-area";
		const type = active.data.current?.type;
		if (type === "template" && isOverWorkspace) {
			setAnimateDuration(0);
			append({
				id: nanoid(),
				label: "",
				type,
				defaultValue: tempForm.getValues(active.data.current?.item.id)
			})
			return;
		}
		const oldIndex = formElements.findIndex((item) => item.id === activeId);
		const newIndex = formElements.findIndex((item) => item.id === over?.id);

		if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
			setFormElements((prev) => arrayMove(prev, oldIndex, newIndex));
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
				<form
					onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
					className="space-y-4"
				>
					<DroppableArea>
						<SortableContext
							items={formElements.map((item) => item.id)}
							strategy={verticalListSortingStrategy}
						>
							{fields.map((field, index) => (
								<SortableItem
									item={field}
									key={field.id}
									onRemove={() => remove(index)}
									control={control}
									index={index}
								/>
							))}
						</SortableContext>
					</DroppableArea>
					<Input />
				</form>

				<div className="p-4 border rounded">
					<form className="flex flex-col gap-y-4">
						<DraggableTemplateItem
							item={{
								id: "checkbox",
								label: "Чекбокс",
								origin: "template",
								type: "checkbox",
							}}
							control={templateControl}
							disabled
							index={0}
						/>
						<DraggableTemplateItem
							item={{
								id: "input",
								label: "Текстовое поле",
								origin: "template",
								type: "input",
							}}
							control={templateControl}
							disabled
							index={1}
						/>
						<DraggableTemplateItem
							item={{
								id: "select",
								label: "Выпадающий список",
								origin: "template",
								type: "select",
							}}
							control={templateControl}
							index={2}
							disabled
						/>
					</form>
				</div>
			</div>

			<DragOverlay
				dropAnimation={{
					duration: animateDuration,
					easing: "linear",
				}}
			>
				{activeItem ? (
					<DraggableTemplateItem
						key={activeItem.id}
						item={activeItem}
						disabled
						index={0}
						control={templateControl}
					/>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}
