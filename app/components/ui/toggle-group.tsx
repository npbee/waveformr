import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";

/**
 * Pick exactly one of a few options, shown as buttons. Arrow keys move
 * between them.
 */
export function ToggleGroup<T extends string>(props: {
  /** null when the current value matches none of the options. */
  value: T | null;
  onValueChange: (value: T) => void;
  /** One of these is required: the group needs a name. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  disabled?: boolean;
  children: ReactNode;
  xstyle?: StyleXStyles;
}) {
  return (
    <BaseToggleGroup<T>
      value={props.value === null ? [] : [props.value]}
      disabled={props.disabled}
      // Pressing the selected option empties the group; keep it selected.
      onValueChange={([next]) => {
        if (next !== undefined) props.onValueChange(next);
      }}
      aria-label={props["aria-label"]}
      aria-labelledby={props["aria-labelledby"]}
      {...stylex.props(props.xstyle)}
    >
      {props.children}
    </BaseToggleGroup>
  );
}

export function Toggle<T extends string>(props: {
  value: T;
  "aria-label"?: string;
  children?: ReactNode;
  /** Styles for each state; `pressed` is the selected option. */
  xstyle: (state: { pressed: boolean }) => StyleXStyles;
}) {
  let { xstyle, ...rest } = props;
  return (
    <BaseToggle<T>
      {...rest}
      className={(state) => stylex.props(xstyle(state)).className}
      style={(state) => stylex.props(xstyle(state)).style}
    />
  );
}
