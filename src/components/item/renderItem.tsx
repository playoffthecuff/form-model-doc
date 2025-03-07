import { GripVertical, X } from "lucide-react";
import { Button } from "../ui/button";
import type { RenderItem } from "./Item";

export const renderItem: (args: RenderItem) => React.ReactElement = ({
  dragOverlay,
  dragging,
  index,
  fadeIn,
  listeners,
  ref,
  style,
  transform,
  transition,
  value,
}) => {
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      {...listeners}
      style={{
        ...style,
        opacity: dragging || fadeIn ? 0.5 : 1,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        transition: transition ?? undefined,
        background: dragOverlay ? 'gainsboro' : 'white',
        padding: '8px',
        border: '1px solid #ccc',
        height: 56 + 2 * (index ?? 0),
      }}
      className="flex gap-2 items-center"
    >
      <div className="flex-1">{value}</div>
      <Button size="icon" variant="outline" className="active:cursor-grabbing"><X/></Button>
      <Button size="icon" variant="outline" className="active:cursor-grabbing"><GripVertical/></Button>
    </div>
  );
};
