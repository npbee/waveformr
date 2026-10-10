import * as RadixSlider from "@radix-ui/react-slider";
import { useId } from "react";
import { Label } from "./label";
import { useLocalValue } from "./use-local-value";

interface SliderProps {
  label: React.ReactNode;
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export function Slider(props: SliderProps) {
  let { label, value: committed, onValueChange, min, max, step } = props;
  let labelId = useId();
  const [value, setValue] = useLocalValue(committed);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <Label id={labelId}>{label}</Label>
        <div>{value}</div>
      </div>

      <RadixSlider.Root
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => {
          setValue(next);
          onValueChange(next);
        }}
        aria-labelledby={labelId}
        className="relative flex h-5 w-full touch-none select-none items-center"
      >
        <RadixSlider.Track className="relative h-[3px] grow rounded-full bg-gray-200 dark:bg-gray-700">
          <RadixSlider.Range className="bg-cyan-900 dark:bg-cyan-600 absolute h-full rounded-full" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="trans focus-visible:ring-cyan-900 block aspect-square w-4 rounded-full border border-gray-700 bg-white shadow-sm hover:bg-primary-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:bg-gray-200 dark:hover:bg-gray-300" />
      </RadixSlider.Root>
    </div>
  );
}
