import { createFileRoute } from "@tanstack/react-router";
import { MyDragList } from "../components/my-drag-list/my-drag-list";

export const Route = createFileRoute("/text")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <MyDragList />
    </div>
  );
}
