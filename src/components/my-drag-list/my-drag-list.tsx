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
import { Sortable } from "./sortable";

const items: FormItemProps[] = [
  { type: "checkbox", id: "c1", label: "what 1" },
  { type: "select", id: "s1", items: ["1", "2", "3"], label: "in some 1" },
  {type: "checkbox", id: "c2", label: "what 2"},
  {type: "checkbox", id: "c3", label: "what 3"},
  { type: "select", id: "s2", items: ["4", "5", "6", "7"], label: "in some 2" },
];

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
      items={items}
    />
  );
};
