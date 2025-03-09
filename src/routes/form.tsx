import { createFileRoute } from "@tanstack/react-router";
import CustomizableFormItem from "../components/customizable-form-item";

export const Route = createFileRoute("/form")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <CustomizableFormItem type="checkbox" id="cb1" label="test 1" />
      <CustomizableFormItem type="checkbox" id="cb2" label="test 2"/>
      <CustomizableFormItem type="select" id="sel1" label="test 3" items={["1", "2", "3"]}/>
    </div>
  );
}
