import type {
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  type AnimateLayoutChanges,
  type NewIndexGetter,
  useSortable,
} from "@dnd-kit/sortable";
import type { WrapperStyle } from "./sortable";
import { Item } from "../item/Item";
import type { FormItemProps } from "../customizable-form-item";

interface SortableItemProps<T> {
  animateLayoutChanges?: AnimateLayoutChanges;
  disabled?: boolean;
  getNewIndex?: NewIndexGetter;
  id: UniqueIdentifier;
  index: number;
  itemData?: T;
  handle: boolean;
  useDragOverlay?: boolean;
  onRemove?(id: UniqueIdentifier): void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  style(values: any): React.CSSProperties;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  renderItem?(args: any): React.ReactElement;
  wrapperStyle: WrapperStyle;
}

export function SortableItem({
  disabled,
  animateLayoutChanges,
  getNewIndex,
  handle,
  id,
  index,
  itemData,
  onRemove,
  style,
  renderItem,
  useDragOverlay,
  wrapperStyle,
}: SortableItemProps<FormItemProps>) {
  const {
    active,
    attributes,
    isDragging,
    isSorting,
    listeners,
    overIndex,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
    disabled,
    getNewIndex,
  });

  return (
    <Item
      ref={setNodeRef}
      value={id}
      disabled={disabled}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
      renderItem={renderItem}
      index={index}
      itemData={itemData}
      style={style({
        index,
        id,
        isDragging,
        isSorting,
        overIndex,
      })}
      onRemove={onRemove ? () => onRemove(id) : undefined}
      transform={transform}
      transition={transition}
      wrapperStyle={wrapperStyle?.({ index, isDragging, active, id })}
      listeners={listeners}
      data-index={index}
      data-id={id}
      dragOverlay={!useDragOverlay && isDragging}
      {...attributes}
    />
  );
}