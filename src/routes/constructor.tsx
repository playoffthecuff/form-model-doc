import { createFileRoute } from "@tanstack/react-router";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";

export const Route = createFileRoute("/constructor")({
  component: Constructor,
});

function Constructor() {
  return (
    <div className="flex">
      <div className="p-4 text-lg w-1/2"/>

      <div className="p-4 text-lg w-1/2">
        <Checkbox />
        <Input placeholder="Text..." />
        <RadioGroup defaultValue="a" className="flex flex-col space-y-1">
          <RadioGroupItem value="a" />
          <RadioGroupItem value="b" />
          <RadioGroupItem value="c" />
        </RadioGroup>
        <Select defaultValue="m@example.com">
          <SelectTrigger>
            <SelectValue placeholder="Select a verified email to display" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="m@example.com">m@example.com</SelectItem>
            <SelectItem value="m@google.com">m@google.com</SelectItem>
            <SelectItem value="m@support.com">m@support.com</SelectItem>
          </SelectContent>
        </Select>
        <Switch />
      </div>
    </div>
  );
}
