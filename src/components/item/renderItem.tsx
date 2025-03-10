import clsx from "clsx";
import { GripVertical, Pencil, Save } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { ConfirmDialog } from "../confirm-dialog";
import CustomizableFormItem from "../customizable-form-item";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { RenderItem } from "./Item";

export const renderItem: (args: RenderItem) => React.ReactElement = ({
  dragOverlay,
  dragging,
  index,
  fadeIn,
  onRemove,
  itemData,
  listeners,
  ref,
  style,
  transform,
  transition,
  value,
}) => {
  const [editMode, setEditMode] = useState(false);
  const toggleMode = () => setEditMode(!editMode);
  const [label, setLabel] = useState(itemData?.label);
  const handleLabelChange = (v: string) => setLabel(v);
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      style={{
        ...style,
        opacity: dragging || fadeIn ? 0.5 : 1,
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        transition: transition ?? undefined,
      }}
      className="flex gap-4 p-2 border rounded-md bg-background"
    >
      <div className="flex-1 flex flex-col gap-4">
        {itemData && <CustomizableFormItem {...itemData} />}
        {editMode && <Input onChange={handleLabelChange} />}
      </div>
      <div className="flex flex-col gap-2">
        <ConfirmDialog
          question="r u sure?"
          description="it removing item from the list"
          handleConfirm={onRemove}
        />
        <Button
          size="icon"
          variant="outline"
          className="active:cursor-grabbing grid justify-center items-center"
          style={{ gridTemplateAreas: `"stack"` }}
          onClick={toggleMode}
        >
          <Pencil
            style={{ gridArea: "stack" }}
            className={cn(
              "scale-100 opacity-100 transition-all duration-200",
              editMode && "scale-0 opacity-0"
            )}
          />
          <Save
            style={{ gridArea: "stack" }}
            className={clsx(
              "scale-0 opacity-0 transition-all duration-200",
              editMode && "scale-100 opacity-100"
            )}
          />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="active:cursor-grabbing"
          {...listeners}
        >
          <GripVertical />
        </Button>
      </div>
    </div>
  );
};
