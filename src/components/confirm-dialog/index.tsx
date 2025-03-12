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
      <AlertDialogTrigger disabled={disabled}>
        <Button variant="outline" size="icon" disabled={disabled}>
          <X />
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
