import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  dragOverlay: boolean;
  dragging: boolean;
  sorting: boolean;
  index: number | undefined;
  fadeIn: boolean;
  listeners: DraggableSyntheticListeners;
  ref: React.Ref<HTMLElement>;
  style: React.CSSProperties | undefined;
  transform?: Transform | null;
  transition?: string | null;
  value: React.ReactNode;
}

function TestItem(props: Props) {
  return (
    <div className="p-4 flex gap-2 border rounded-md">
      <p>{props.value}</p>
      <Button size="icon">
        <X />
      </Button>
      <Button size="icon">
        <GripVertical />
      </Button>
    </div>
  );
}
export default TestItem;
