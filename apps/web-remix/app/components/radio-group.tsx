import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { Label } from "./label";
import { useId } from "react";
import clsx from "clsx";

interface Item {
  label: string;
  value: string;
}

interface RadioGroupProps<I extends Item> {
  items: ReadonlyArray<I>;
  label: React.ReactNode;
  defaultValue: RadixRadioGroup.RadioGroupProps["defaultValue"];
  name: string;
}

export function RadioGroup<I extends Item>(props: RadioGroupProps<I>) {
  let { items, defaultValue, label, name } = props;
  let labelId = useId();

  return (
    <RadixRadioGroup.Root
      className={`flex flex-col gap-2`}
      defaultValue={defaultValue}
      aria-labelledby={labelId}
      name={name}
    >
      <Label id={labelId}>{label}</Label>
      <div
        className={`grid gap-2`}
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(65px, 1fr))` }}
      >
        {items.map((item) => {
          return (
            <div className="grid" key={item.value}>
              <RadixRadioGroup.Item
                className={clsx(
                  `focus-visible:ring-slate-400`,
                  "cursor-pointer",
                  "rounded",
                  "border",
                  "px-3",
                  "py-1.5",
                  "text-sm",
                  "outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-offset-2",
                  "border-gray-800",
                  "hover:bg-gray-50",
                  "dark:bg-gray-800",
                  "dark:hover:bg-gray-600",
                  "data-[state=checked]:border-cyan-800",
                  "data-[state=checked]:bg-cyan-900",
                  "data-[state=checked]:text-cyan-50",
                  "data-[state=checked]:hover:bg-cyan-900",
                  "data-[state=checked]:border-cyan-800",
                  "data-[state=checked]:dark:bg-cyan-900",
                  "data-[state=checked]:dark:text-cyan-50",
                )}
                value={item.value}
                id={item.value}
              >
                {item.label}
              </RadixRadioGroup.Item>
            </div>
          );
        })}
      </div>
    </RadixRadioGroup.Root>
  );
}
