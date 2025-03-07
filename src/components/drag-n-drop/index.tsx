import { DndContext, UniqueIdentifier, type DragEndEvent } from "@dnd-kit/core";
import { Draggable } from "./draggable";
import { Droppable } from "./droppable";
import { useState } from "react";

export function DragNDrop() {
  const containers = ['A', 'B', 'C'];
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const draggableMarkup = (
    <Draggable id="draggable"><div className="p-4 border rounded hover:cursor-grab active:cursor-grabbing bg-background">Drag me</div></Draggable>
  );
  const droppableMarkup = (<div className="p-4 border border-dashed inline-block">Drop here</div>);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {parent === null ? draggableMarkup : null}

      {containers.map((id) => (
        <Droppable key={id} id={id}>
          {parent === id ? draggableMarkup : droppableMarkup}
        </Droppable>
      ))}
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const {over} = event;

    setParent(over ? over.id : null);
  }
}
