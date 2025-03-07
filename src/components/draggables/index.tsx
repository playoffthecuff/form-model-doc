import { useState } from "react";
// biome-ignore lint/style/useImportType: <explanation>
import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { nanoid } from "nanoid";

// Тип элемента формы
type FormElement = {
  id: string;
  type: string;
  label: string;
};

// Исходные элементы шаблона
const availableFields: FormElement[] = [
  { id: "input", type: "input", label: "Текстовое поле" },
  { id: "checkbox", type: "checkbox", label: "Чекбокс" },
  { id: "select", type: "select", label: "Выпадающий список" },
];

// Компонент шаблонного элемента (справа)
function DraggableTemplateItem({ item }: { item: FormElement }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `template-${item.id}`, // Уникальный ID для шаблона
    data: { type: "template", item },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-2 border rounded bg-white cursor-grab"
    >
      {item.label}
    </div>
  );
}

// Компонент перетаскиваемого элемента в рабочей области (сортируемый)
function SortableItem({ item }: { item: FormElement }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-2 border rounded bg-gray-200 cursor-grab"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {item.label}
    </div>
  );
}

// Компонент рабочей области (левая зона)
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

// Основной компонент конструктора формы
export default function FormBuilder() {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [activeItem, setActiveItem] = useState<FormElement | null>(null);
  const [isOutside, setIsOutside] = useState(false);

  const handleDragStart = (event: any) => {
    const { active } = event;
    const draggedItem = formElements.find((item) => item.id === active.id);
    setActiveItem(draggedItem || active.data.current?.item || null);
    setIsOutside(false);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      console.log("set out")
      setIsOutside(true); // Если элемент покинул рабочую область
    } else {
      console.log("set in")
      setIsOutside(false); // Если элемент внутри
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("DRAG END")
    setActiveItem(null);
    const { active, over } = event;
    const activeId = active.id;

    // Удаление элемента при выносе за пределы
    console.log(isOutside)
    if (isOutside && formElements.some((item) => item.id === activeId)) {
      console.log("OUTSIDE")
      setFormElements((prev) => prev.filter((item) => item.id !== activeId));
      return;
    }

    // Если перетаскиваемый элемент из шаблона (создание нового)
    if (active.data.current?.type === "template") {
      const newItem: FormElement = {
        ...active.data.current.item,
        id: nanoid(), // Уникальный ID
      };
      setFormElements((prev) => [...prev, newItem]);
      return;
    }

    // Если перемещение внутри рабочей области
    const oldIndex = formElements.findIndex((item) => item.id === activeId);
    const newIndex = formElements.findIndex((item) => item.id === over?.id);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      setFormElements((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 gap-4 p-4">
        {/* Рабочая область (левая зона) */}
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

        {/* Доступные элементы (правая зона) */}
        <div className="p-4 border rounded bg-gray-100">
          {availableFields.map((item) => (
            <DraggableTemplateItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Drag Overlay (эффект перетаскивания) */}
      <DragOverlay>
        {activeItem ? (
          <div className="p-2 border rounded bg-gray-400 cursor-grab">
            {activeItem.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
