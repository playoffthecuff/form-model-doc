import { MeasuringStrategy } from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
  type AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { FormItemProps } from "../customizable-form-item";
import { renderItem } from "../item/renderItem";
import { Sortable } from "../my-drag-list/sortable";

export const SourceDragItems = ({items}: {items: FormItemProps[]}) => {
  const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  return (
    <Sortable
      animateLayoutChanges={animateLayoutChanges}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      removable
      handle
      renderItem={renderItem}
      modifiers={[restrictToWindowEdges]}
      itemCount={20}
      strategy={verticalListSortingStrategy}
      items={items}
    />
  );
};
