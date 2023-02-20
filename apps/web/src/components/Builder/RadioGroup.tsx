import * as RadixRadioGroup from "@radix-ui/react-radio-group";

interface Item {
  label: string;
  value: string;
}

interface RadioGroupProps<I extends Item> {
  items: ReadonlyArray<I>;
  onChange: (val: I["value"]) => void;
  value: I["value"];
}

export function RadioGroup<I extends Item>(props: RadioGroupProps<I>) {
  let { items, onChange, value } = props;

  return (
    <RadixRadioGroup.Root
      className="flex flex-col gap-2.5"
      value={value}
      onValueChange={onChange}
      aria-label="View density"
    >
      {items.map((item) => {
        const checked = item.value === value;
        return (
          <div className="flex items-center" key={item.value}>
            <RadixRadioGroup.Item
              checked={checked}
              className="shadow-blackA7 hover:bg-violet3 h-[25px] w-[25px] cursor-default rounded-full bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
              value={item.value}
              id={item.value}
            >
              <RadixRadioGroup.Indicator className="after:bg-violet11 relative flex h-full w-full items-center justify-center after:block after:h-[11px] after:w-[11px] after:rounded-[50%] after:content-['']" />
            </RadixRadioGroup.Item>
            <label
              className="pl-[15px] text-[15px] leading-none text-white"
              htmlFor="r1"
            >
              {item.label}
            </label>
          </div>
        );
      })}
    </RadixRadioGroup.Root>
  );
}
