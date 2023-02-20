import { colord, extend } from "colord";
import namesPlugins from "colord/plugins/names";
import { useMemo } from "react";
import { HexColorPicker } from "react-colorful";
import { Label } from "./Label";

extend([namesPlugins]);

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: React.ReactNode;
}

export function ColorPicker(props: ColorPickerProps) {
  let { value, onChange, label } = props;
  let hexValue = useMemo(
    () => (value.startsWith("#") ? value : colord(value).toHex()),
    [value]
  );

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="[&>.react-colorful]:w-full">
        <HexColorPicker color={hexValue} onChange={onChange} />
      </div>
    </div>
  );
}
