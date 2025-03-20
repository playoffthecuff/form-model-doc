import { Check, Undo, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

export function ConfirmDialog({
  question,
  description,
  handleConfirm,
  disabled,
}: {
  question: string;
  description: string;
  handleConfirm?: () => void;
  disabled?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={disabled} className="disabled:opacity-60 disabled:hover:cursor-auto">
        <Button variant="outline" size="icon" disabled={disabled} asChild  className="p-2">
          <X className="aria-disabled:hover:cursor-auto aria-disabled:hover:bg-background" aria-disabled={disabled}/>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{question}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
              <Undo />
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
              <Check />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
