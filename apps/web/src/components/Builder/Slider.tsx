import * as RadixSlider from "@radix-ui/react-slider";
import { useId } from "react";
import { Label } from "./Label";

export function Slider(
  props: RadixSlider.SliderProps & { label: React.ReactNode },
) {
  let { label, value } = props;
  let labelId = useId();
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <Label id={labelId}>{label}</Label>
        <div>{value}</div>
      </div>

      <RadixSlider.Root
        {...props}
        aria-labelledby={labelId}
        className="relative flex h-5 w-full touch-none select-none items-center"
      >
        <RadixSlider.Track className="relative h-[3px] grow rounded-full bg-gray-200 dark:bg-gray-700">
          <RadixSlider.Range className="absolute h-full rounded-full bg-cyan-900 dark:bg-cyan-600" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="trans block aspect-square w-4 rounded-full border border-gray-700 bg-white shadow-sm hover:bg-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-900 focus-visible:ring-offset-2 dark:bg-gray-200 dark:hover:bg-gray-300" />
      </RadixSlider.Root>
    </div>
  );
}
