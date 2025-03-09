import { MeasuringStrategy } from "@dnd-kit/core";
import {
  type AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Sortable } from "./sortable";
import { renderItem } from "../item/renderItem";
import {restrictToWindowEdges,  restrictToVerticalAxis} from '@dnd-kit/modifiers';

export const MyDragList = () => {
  const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  return (
    <Sortable
      animateLayoutChanges={animateLayoutChanges}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      removable
      handle
      renderItem={renderItem}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      itemCount={20}
      strategy={verticalListSortingStrategy}
    />
  );
};
