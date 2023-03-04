import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { Label } from "./Label";
import { useId } from "react";

interface Item {
  label: string;
  value: string;
}

interface RadioGroupProps<I extends Item> {
  items: ReadonlyArray<I>;
  onChange: (val: I["value"]) => void;
  value: I["value"];
  label: React.ReactNode;
}

export function RadioGroup<I extends Item>(props: RadioGroupProps<I>) {
  let { items, onChange, value, label } = props;
  let labelId = useId();

  return (
    <RadixRadioGroup.Root
      className={`flex flex-col gap-2`}
      value={value}
      onValueChange={onChange}
      aria-labelledby={labelId}
    >
      <Label id={labelId}>{label}</Label>
      <div
        className={`grid gap-2`}
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(65px, 1fr))` }}
      >
        {items.map((item) => {
          const checked = item.value === value;
          return (
            <div className="grid" key={item.value}>
              <RadixRadioGroup.Item
                checked={checked}
                className={`cursor-pointer rounded border px-3 py-1.5 text-sm outline-none hover:bg-gray3 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:hover:bg-grayDark3 ${
                  checked
                    ? "border-violet9 bg-violet3 text-violet12 dark:border-violetDark9 dark:bg-violetDark3 dark:text-violetDark12"
                    : "border-gray12 dark:border-grayDark8 dark:bg-grayDark2"
                }`}
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
