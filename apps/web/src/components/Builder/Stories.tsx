import { Select, SelectItem } from "./Select";

export function Stories() {
  return (
    <div className="p-4">
      <Story name="Select">
        <Select defaultValue="2" aria-label="Color type">
          <SelectItem value="1">Item 1</SelectItem>
          <SelectItem value="2">Item 2</SelectItem>
          <SelectItem value="3">Item 3</SelectItem>
        </Select>
      </Story>
    </div>
  );
}

function Story(props: { name: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2>{props.name}</h2>
      <div>{props.children}</div>
    </div>
  );
}
