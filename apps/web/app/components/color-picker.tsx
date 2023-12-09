import * as RadioGroup from "@radix-ui/react-radio-group";
import { useId } from "react";
import invariant from "tiny-invariant";
import { Icon } from "./icons";
import { Label } from "./label";

interface ColorPickerProps {
  defaultValue: RadioGroup.RadioGroupProps["defaultValue"];
  label: React.ReactNode;
  disabled?: boolean;
  name: string;
}

export interface ColorStop {
  color: string;
  offset: number;
}

export type Color =
  | { type: "hex"; name: string; value: string; check?: string }
  | { type: "gradient"; name: string; value: string }
  | { type: "none"; name: string; value: "transparent" };

export let colors: Color[] = [
  { type: "hex", name: "rich-black", value: "#001219ff", check: "#001219" },
  { type: "hex", name: "midnight-green", value: "#005f73" },
  { type: "hex", name: "dark-cyan", value: "#0a9396" },
  { type: "hex", name: "tiffany-blue", value: "#94d2bd" },
  { type: "hex", name: "vanilla", value: "#e9d8a6" },
  { type: "hex", name: "gamboge", value: "#ee9b00" },
  { type: "hex", name: "alloy-orange", value: "#ca6702" },
  { type: "hex", name: "rust", value: "#bb3e03" },
  { type: "hex", name: "rufous", value: "#ae2012" },
  { type: "hex", name: "auburn", value: "#9b2226" },
  {
    name: "gradient1",
    type: "gradient",
    value:
      "linear-gradient(#0a9396 0%, #005f73 25%, #ee9b00 50%, #ca6702 75%, #9b2226 100%)",
  },
  {
    name: "gradient2",
    type: "gradient",
    value: "linear-gradient(#94d2bd 0%, #ae2012 50%, #005f73 100%)",
  },
  {
    name: "gradient3",
    type: "gradient",
    value: "linear-gradient(#94d2bd 0%, #bb3e03 100%)",
  },
  { type: "none", name: "Transparent", value: "transparent" },
];

export function getColor(colorName: string): Color {
  let color = colors.find((col) => col.name === colorName);
  invariant(color);
  return color;
}

export function ColorPicker(props: ColorPickerProps) {
  let { defaultValue, name, label, disabled } = props;
  let labelId = useId();

  return (
    <div
      className={`flex flex-col gap-2 ${
        disabled ? "pointer-events-none cursor-not-allowed opacity-50" : ""
      }`}
    >
      <Label id={labelId}>{label}</Label>
      <RadioGroup.Root
        defaultValue={defaultValue}
        aria-labelledby={labelId}
        name={name}
        disabled={disabled}
      >
        <div className="grid grid-cols-7 gap-3">
          {colors.map((color) => {
            return (
              <RadioGroup.Item
                key={color.value}
                aria-label={color.name}
                value={color.value}
                style={{
                  background: color.value,
                  transitionProperty: "opacity, transform",
                }}
                className={`flex aspect-square w-full items-center justify-center rounded-full ring-cyan-800 transition-all hover:opacity-75 focus:outline-none focus-visible:ring focus-visible:ring-offset-2 active:scale-95 ${
                  disabled ? "cursor-not-allowed" : ""
                } ${
                  color.type === "none"
                    ? "border border-gray-400 dark:border-gray-400"
                    : ""
                }`}
              >
                <RadioGroup.Indicator
                  className={`${
                    color.type === "none"
                      ? "text-gray-900 dark:text-gray-50"
                      : "text-white dark:text-gray-900"
                  }`}
                >
                  <Icon name="check" size="1.3em" />
                </RadioGroup.Indicator>
              </RadioGroup.Item>
            );
          })}
        </div>
      </RadioGroup.Root>
    </div>
  );
}

function colorToBg(color: Color) {
  if (color.type === "hex") {
    return color.value;
  }

  if (color.type === "none") {
    return "transparent";
  }

  let stops = color.values.map(
    (colorStop) => `${colorStop.color} ${colorStop.offset}%`,
  );

  return `linear-gradient(0deg, ${stops.join(", ")})`;
}
