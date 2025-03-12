import { useState } from "react";
import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragMoveEvent,
  type Modifier,
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

// 🔹 **Функция модификатора для ограничения по вертикали**
const restrictToVertical: Modifier = ({ transform }) => {
  return { ...transform, x: 0 };
};

// Компонент шаблонного элемента
function DraggableTemplateItem({ item }: { item: FormElement }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `template-${item.id}`,
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

// Компонент рабочего элемента
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

// Ловушка для удаления
function TrashZone() {
  const { setNodeRef } = useDroppable({ id: "trash-zone" });

  return (
    <div
      ref={setNodeRef}
      className="mt-4 p-4 border-2 border-red-500 border-dashed text-center"
    >
      Удалить элемент
    </div>
  );
}

// Основной компонент конструктора
export default function DndFormBuilder() {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [activeItem, setActiveItem] = useState<FormElement | null>(null);
  const [isOutside, setIsOutside] = useState(false);

  // Определяем дроп-зону рабочей области
  const { setNodeRef: setFormAreaRef } = useDroppable({ id: "form-area" });

  const handleDragStart = (event: any) => {
    const { active } = event;
    const draggedItem = formElements.find((item) => item.id === active.id);
    setActiveItem(draggedItem || active.data.current?.item || null);
    setIsOutside(false);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    if (!event.over) {
      setIsOutside(true);
    } else {
      setIsOutside(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;
    const activeId = active.id;

    console.log("Drag End →", { activeId, overId: over?.id, isOutside });

    // Удаление элемента при выносе за пределы
    if (isOutside || over?.id === "trash-zone") {
      setFormElements((prev) => prev.filter((item) => item.id !== activeId));
      return;
    }

    // Если переносим из шаблона (создание нового)
    if (active.data.current?.type === "template") {
      const newItem: FormElement = {
        ...active.data.current.item,
        id: nanoid(),
      };
      setFormElements((prev) => [...prev, newItem]);
      return;
    }

    // Перемещение внутри рабочей области
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
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      modifiers={activeItem ? [restrictToVertical] : []} // Ограничиваем только для активного элемента
    >
      <div className="grid grid-cols-2 gap-4 p-4">
        {/* Рабочая область (левая зона) */}
        <div
          ref={setFormAreaRef}
          className="min-h-[300px] p-4 border-2 border-dashed rounded"
        >
          <SortableContext
            items={formElements.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {formElements.map((item) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </SortableContext>
        </div>

        {/* Доступные элементы (правая зона) */}
        <div className="p-4 border rounded bg-gray-100">
          {availableFields.map((item) => (
            <DraggableTemplateItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Ловушка для удаления */}
      <TrashZone />
    </DndContext>
  );
}
