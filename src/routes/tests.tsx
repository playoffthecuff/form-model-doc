import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tests")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <p>React fragment test 1</p>
      <p>React fragment test 2</p>
      <p>React fragment test 3</p>
      <abvgdeyka></abvgdeyka>
    </>
  );
}
