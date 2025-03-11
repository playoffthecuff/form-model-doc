import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { MultipleContainers } from "./multiple-container";

const items = {
  A: ["A2", "A3", "A1"],
  B: ["B1", "B2", "B3"],
};

export const SourceTargetDragColumns = () => (
  <MultipleContainers handle items={items} modifiers={[restrictToWindowEdges]}/>
);
