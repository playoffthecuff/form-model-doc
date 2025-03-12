import { createFileRoute } from "@tanstack/react-router";
import FormBuilder from "../components/draggables";

export const Route = createFileRoute("/tests")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <FormBuilder />
    </>
  );
}
