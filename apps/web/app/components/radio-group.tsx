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
                  "text-xs",
                  "outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-offset-2",
                  "border-gray-800",
                  "hover:bg-primary-200",
                  "dark:bg-gray-800",
                  "dark:hover:bg-gray-600",
                  "data-[state=checked]:border-2",
                  "data-[state=checked]:border-accent-orange",
                  "data-[state=checked]:bg-primary-50",
                  "data-[state=checked]:hover:bg-primary-50",
                  "data-[state=checked]:border-cyan-800",
                  "data-[state=checked]:dark:bg-primary-900",
                  "data-[state=checked]:dark:text-gray-50",
                  "data-[state=checked]:dark:hover:bg-primary-900",
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
