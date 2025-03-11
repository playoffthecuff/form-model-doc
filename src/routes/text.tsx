import { createFileRoute } from "@tanstack/react-router";
import { SourceTargetDragColumns } from "../components/form-drag-list/source-target";
// import { FormDragList } from "../components/form-drag-list";
// import { SourceDragItems } from "../components/form-drag-list/source";

export const Route = createFileRoute("/text")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex gap-8">
      <SourceTargetDragColumns />
      {/* <FormDragList
        items={[
          { type: "checkbox", id: "c1", label: "what 1" },
          {
            type: "select",
            id: "s1",
            items: ["1", "2", "3"],
            label: "in some 1",
          },
          { type: "checkbox", id: "c2", label: "what 2" },
          { type: "checkbox", id: "c3", label: "what 3" },
          {
            type: "select",
            id: "s2",
            items: ["4", "5", "6", "7"],
            label: "in some 2",
          },
        ]}
      />
      <SourceDragItems
        items={[
          { type: "checkbox", id: "c1", label: "Checkbox", disabled: true },
          {
            type: "select",
            id: "s1",
            items: [],
            label: "Select",
            disabled: true,
          },
        ]}
      /> */}
    </div>
  );
}
