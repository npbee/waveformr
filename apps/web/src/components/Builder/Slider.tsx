import * as RadixSlider from "@radix-ui/react-slider";
import { useId } from "react";
import { Label } from "./Label";

export function Slider(
  props: RadixSlider.SliderProps & { label: React.ReactNode }
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
        <RadixSlider.Track className="relative h-[3px] grow rounded-full bg-gray7 dark:bg-grayDark8">
          <RadixSlider.Range className="absolute h-full rounded-full bg-violet10 dark:bg-violetDark10" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="block aspect-square w-4 rounded-full border-violet10 bg-violet10 shadow-sm hover:bg-violet9 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet10 focus-visible:ring-offset-2 dark:border-grayDark8 dark:bg-grayDark12 dark:hover:bg-grayDark11" />
      </RadixSlider.Root>
    </div>
  );
}
