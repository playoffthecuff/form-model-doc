import { Check, Undo, X } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";

export function ConfirmPopover({onConfirm, onUndo, description, question, disabled}: {disabled?: boolean; onConfirm?: () => void; onUndo?: () => void; description: string; question: string;}) {
  const [open, setOpen] = useState(false);
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setOpen(false);
  }
  const handleUndo = () => {
    if (onUndo) onUndo();
    setOpen(false);
  }
  const handleOpen = () => {
    setOpen(!open);
  }
  const handleClose = () => {
    setOpen(false);
  }
  return (
    <Popover open={open}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button variant="outline" size="icon" onClick={handleOpen}><X/></Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit" onInteractOutside={handleClose}>
        <div className="flex flex-col gap-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{question}</h4>
            <p className="font-medium text-muted-foreground">
              {description}
            </p>
        <div className="flex gap-x-6 mt-4">
          <Button variant="outline" size="icon" onClick={handleUndo}><Undo/></Button>
          <Button size="icon" onClick={handleConfirm}><Check /></Button>
        </div>             
          </div>
          </div>
      </PopoverContent>
    </Popover>
  )
}
