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
import clsx from "clsx";
import { Edit, GripVertical } from "lucide-react";
import { nanoid } from "nanoid";
import { ReactNode, useState } from "react";
import { ConfirmDialog } from "../confirm-dialog";
import { FormItemType } from "../customizable-form-item";
import CustomizableCheckbox from "../customizable-form-item/checkbox";
import CustomizableInput from "../customizable-form-item/input";
import CustomizableSelect from "../customizable-form-item/select";
import {
  CheckboxFormField,
  InputFormField,
  SelectFormField,
} from "../form-items/form-fields";
import { Button } from "../ui/button";

type FormElement = {
  id: string;
  type: FormItemType;
  label: string;
  origin: string;
  handleRemove?: (id: string) => void;
};

const restrictToVertical: Modifier = ({ transform }) => {
  return { ...transform, x: 0 };
};

const availableFields: FormElement[] = [
  { id: "input", type: "input", label: "Текстовое поле", origin: "template" },
  { id: "checkbox", type: "checkbox", label: "Чекбокс", origin: "template" },
  {
    id: "select",
    type: "select",
    label: "Выпадающий список",
    origin: "template",
  },
];

function ItemWrapper({
  children,
  setNodeRef,
  listeners,
  attributes,
  transform,
  transition,
  editable = false,
  id,
  handleRemove,
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
  handleRemove?: (id: string) => void;
  className?: string;
}) {
  const handleConfirm = () => {
    if (handleRemove && id) handleRemove(id);
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className={clsx(
        "p-2 border rounded-md flex gap-x-4 bg-background",
        className
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex flex-1">{children}</div>
      <div className="flex flex-col gap-y-2">
        <ConfirmDialog
          question="Вы уверены?"
          description="Удаление элемента формы"
          disabled={!editable}
          handleConfirm={handleConfirm}
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
}: {
  item: FormElement;
  className?: string;
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
          name="Чекбокс"
          description="Описание"
          disabled
        />
      )}
      {item.type === "input" && (
        <InputFormField
          label={item.label}
          name="Текстовое поле"
          defaultValue="Значение по умолчанию"
          description="Описание"
          disabled
        />
      )}
      {item.type === "select" && (
        <SelectFormField
          items={["Значение по умолчанию"]}
          label={item.label}
          defaultValue="Значение по умолчанию"
          name="Выпадающий список"
          description="Описание"
          disabled
        />
      )}
    </ItemWrapper>
  );
}

function SortableItem({ item }: { item: FormElement }) {
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
      handleRemove={item.handleRemove}
      id={item.id}
    >
      {item.type === "checkbox" && (
        <CheckboxFormField
          label={item.label}
          name="Чекбокс"
          description="Описание"
        />
      )}
      {item.type === "input" && (
        <InputFormField
          label={item.label}
          name="Текстовое поле"
          defaultValue="Значение по умолчанию"
          description="Описание"
        />
      )}
      {item.type === "select" && (
        <SelectFormField
          items={["Значение по умолчанию"]}
          label={item.label}
          defaultValue="Значение по умолчанию"
          name="Выпадающий список"
          description="Описание"
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
  const handleRemove = (id: string) =>
    setFormElements(formElements.filter((el) => el.id !== id));

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

    if (active.data.current?.type === "template" && isOverWorkspace) {
      setAnimateDuration(0);
      const newItem: FormElement = {
        ...active.data.current.item,
        id: nanoid(),
        origin: "workspace",
        handleRemove,
      };
      setFormElements((prev) => [...prev, newItem]);
      return;
    }
    const oldIndex = formElements.findIndex((item) => item.id === activeId);
    const newIndex = formElements.findIndex((item) => item.id === over?.id);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      setFormElements((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={activeItem?.origin === "workspace" ? [restrictToVertical] : []}
    >
      <div className="grid grid-cols-2 gap-x-4 p-4">
        <DroppableArea>
          <SortableContext
            items={formElements.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {formElements.map((item) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </SortableContext>
        </DroppableArea>

        <div className="p-4 border rounded flex flex-col gap-y-4">
          {availableFields.map((item) => (
            <DraggableTemplateItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <DragOverlay
        dropAnimation={{
          duration: animateDuration,
          easing: "linear",
        }}
      >
        {activeItem ? (
          <DraggableTemplateItem key={activeItem.id} item={activeItem} />
        ) : // <ItemWrapper transform={null} className="bg-background">{activeItem.label}</ItemWrapper>
        null}
      </DragOverlay>
    </DndContext>
  );
}
