import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import * as stylex from "@stylexjs/stylex";
import type { ReactElement, ReactNode } from "react";
import { Kbd } from "~/components/ui/kbd";
import { color } from "~/styles/tokens.stylex";

/**
 * A short label shown on hover or focus, with an optional keyboard shortcut.
 * `children` must be a single element that accepts a ref and props, like a
 * Button; it becomes the trigger.
 */
export function Tooltip(props: {
  label: ReactNode;
  /** Keys in order, e.g. ["⌘", "\\"]. */
  shortcut?: readonly string[];
  side?: "top" | "bottom" | "left" | "right";
  children: ReactElement;
}) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger delay={400} render={props.children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={props.side ?? "bottom"} sideOffset={6}>
          <BaseTooltip.Popup {...stylex.props(styles.popup, props.shortcut && styles.withShortcut)}>
            {props.label}
            {props.shortcut ? (
              <span {...stylex.props(styles.shortcut)}>
                {props.shortcut.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
              </span>
            ) : null}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}

const styles = stylex.create({
  popup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingBlock: 4,
    paddingInline: 8,
    fontSize: 13,
    fontWeight: 500,
    color: color.bg,
    backgroundColor: color.text,
    borderRadius: 6,
    opacity: {
      default: 1,
      ":is([data-starting-style], [data-ending-style])": 0,
    },
    transitionProperty: "opacity",
    transitionDuration: {
      default: "0s",
      "@media (prefers-reduced-motion: no-preference)": "120ms",
    },
  },
  // Keycaps sit closer to the edge than text would.
  withShortcut: {
    paddingInlineEnd: 4,
  },
  shortcut: {
    display: "flex",
    gap: 2,
  },
});
