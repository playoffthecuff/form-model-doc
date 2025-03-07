import { MeasuringStrategy } from "@dnd-kit/core";
import {
  type AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Sortable, type Props as SortableProps } from "./Sortable";
import { renderItem } from "../item/renderItem";
import {restrictToWindowEdges,  restrictToVerticalAxis} from '@dnd-kit/modifiers';

export const MyDragList = () => {
  const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  const props: Partial<SortableProps> = {
    strategy: verticalListSortingStrategy,
    itemCount: 20,
  };

  return (
    <Sortable
      {...props}
      animateLayoutChanges={animateLayoutChanges}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      removable
      handle
      renderItem={renderItem}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    />
  );
};
