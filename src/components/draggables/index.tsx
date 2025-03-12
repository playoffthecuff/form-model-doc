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
import { Edit, GripVertical, X } from "lucide-react";
import { nanoid } from "nanoid";
import { ReactNode, useState } from "react";
import { ConfirmDialog } from "../confirm-dialog";
import { Button } from "../ui/button";

type FormElement = {
  id: string;
  type: string;
  label: string;
  origin: string;
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
}: {
  children: ReactNode;
  setNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
  transform: Transform | null;
  transition?: string;
  editable?: boolean;
}) {
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className="p-2 border rounded bg-gray-200 flex gap-x-4"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex flex-1">{children}</div>
      <div className="flex flex-col gap-y-2">
        <ConfirmDialog
          question="r u sure?"
          description="it removing item from the list"
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

function DraggableTemplateItem({ item }: { item: FormElement }) {
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
    >
      <div>{item.label}</div>
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
    >
      <div>{item.label}</div>
    </ItemWrapper>
  );
}

function DroppableArea({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id: "droppable-area" });

  return (
    <div
      ref={setNodeRef}
      className="min-h-[300px] p-4 border-2 border-dashed rounded"
    >
      {children}
    </div>
  );
}

export default function FormBuilder() {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [activeItem, setActiveItem] = useState<FormElement | null>(null);
  const [animateDuration, setAnimateDuration] = useState(0);

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

        <div className="p-4 border rounded bg-gray-100">
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
          <ItemWrapper transform={null}>{activeItem.label}</ItemWrapper>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
