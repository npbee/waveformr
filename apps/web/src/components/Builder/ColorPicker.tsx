import * as RadioGroup from "@radix-ui/react-radio-group";
import { colord, extend } from "colord";
import namesPlugins from "colord/plugins/names";
import { useId, useMemo } from "react";
import { Check } from "./Icons";
import { Label } from "./Label";

extend([namesPlugins]);

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: React.ReactNode;
}

export let colors = [
  { name: "rich-black", value: "#001219ff", check: "#001219ff" },
  { name: "midnight-green", value: "#005f73ff" },
  { name: "dark-cyan", value: "#0a9396ff" },
  { name: "tiffany-blue", value: "#94d2bdff" },
  { name: "vanilla", value: "#e9d8a6ff" },
  { name: "gamboge", value: "#ee9b00ff" },
  { name: "alloy-orange", value: "#ca6702ff" },
  { name: "rust", value: "#bb3e03ff" },
  { name: "rufous", value: "#ae2012ff" },
  { name: "auburn", value: "#9b2226ff" },
];

export function ColorPicker(props: ColorPickerProps) {
  let { value, onChange, label } = props;
  let labelId = useId();
  let hexValue = useMemo(
    () => (value.startsWith("#") ? value : colord(value).toHex()),
    [value]
  );

  return (
    <div className="flex flex-col gap-2">
      <Label id={labelId}>{label}</Label>
      <RadioGroup.Root
        value={hexValue}
        aria-labelledby={labelId}
        onValueChange={onChange}
      >
        <div className="grid grid-cols-5 gap-3">
          {colors.map((color) => {
            return (
              <RadioGroup.Item
                key={color.value}
                aria-label={color.name}
                value={color.value}
                style={{
                  backgroundColor: color.value,
                  transitionProperty: "opacity, transform",
                }}
                className={`flex aspect-square w-full items-center justify-center rounded-full ring-cyan-800 transition-all hover:opacity-75 focus:outline-none focus-visible:ring focus-visible:ring-offset-2 active:scale-95`}
              >
                <RadioGroup.Indicator className="text-white">
                  <Check size="1.3em" />
                </RadioGroup.Indicator>
              </RadioGroup.Item>
            );
          })}
        </div>
      </RadioGroup.Root>
    </div>
  );
}
