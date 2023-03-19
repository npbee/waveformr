import * as RadioGroup from "@radix-ui/react-radio-group";
import { useId } from "react";
import invariant from "tiny-invariant";
import { Check } from "./Icons";
import { Label } from "./Label";

interface ColorPickerProps {
  value: string;
  onChange: (colorName: string) => void;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface ColorStop {
  color: string;
  offset: number;
}

export type Color =
  | { type: "hex"; name: string; value: string; check?: string }
  | { type: "gradient"; name: string; values: ColorStop[] }
  | { type: "none"; name: "none" };

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
    values: [
      { offset: 0, color: "#0a9396" },
      { offset: 25, color: "#005f73" },
      { offset: 50, color: "#ee9b00" },
      { offset: 75, color: "#ca6702" },
      { offset: 100, color: "#9b2226" },
    ],
  },
  {
    name: "gradient2",
    type: "gradient",
    values: [
      { offset: 0, color: "#94d2bd" },
      { offset: 50, color: "#ae2012" },

      { offset: 100, color: "#005f73" },
    ],
  },
  {
    name: "gradient3",
    type: "gradient",
    values: [
      { offset: 0, color: "#94d2bd" },

      { offset: 100, color: "#bb3e03" },
    ],
  },
  { type: "none", name: "none" },
];

export function getColor(colorName: string): Color {
  let color = colors.find((col) => col.name === colorName);
  invariant(color);
  return color;
}

export function ColorPicker(props: ColorPickerProps) {
  let { value, onChange, label, disabled } = props;
  let labelId = useId();

  return (
    <div
      className={`flex flex-col gap-2 ${
        disabled ? "pointer-events-none cursor-not-allowed opacity-50" : ""
      }`}
    >
      <Label id={labelId}>{label}</Label>
      <RadioGroup.Root
        value={value}
        aria-labelledby={labelId}
        onValueChange={onChange}
        disabled={disabled}
      >
        <div className="grid grid-cols-7 gap-3">
          {colors.map((color) => {
            return (
              <RadioGroup.Item
                key={color.name}
                aria-label={color.name}
                value={color.name}
                style={{
                  background: colorToBg(color),
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

function colorToBg(color: Color) {
  if (color.type === "hex") {
    return color.value;
  }

  if (color.type === "none") {
    return "transparent";
  }

  let stops = color.values.map(
    (colorStop) => `${colorStop.color} ${colorStop.offset}%`
  );

  return `linear-gradient(0deg, ${stops.join(", ")})`;
}
