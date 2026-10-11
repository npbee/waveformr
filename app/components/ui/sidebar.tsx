import { Collapsible } from "@base-ui/react/collapsible";
import { SidebarSimpleIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { IconButton } from "~/components/ui/icon-button";
import { color } from "~/styles/tokens.stylex";

/**
 * Two-column grid: the main content, then the sidebar. Closing the sidebar
 * shrinks its column, so the main content grows into the space.
 */
function Root(props: {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  xstyle?: StyleXStyles;
}) {
  let { children, xstyle, ...rest } = props;
  return (
    <Collapsible.Root
      defaultOpen
      {...rest}
      className={(state) =>
        stylex.props(styles.root, state.open && styles.rootOpen, xstyle).className
      }
      style={(state) => stylex.props(styles.root, state.open && styles.rootOpen, xstyle).style}
    >
      {children}
    </Collapsible.Root>
  );
}

function Trigger(props: { icon?: ReactNode; "aria-label"?: string; xstyle?: StyleXStyles }) {
  return (
    <Collapsible.Trigger
      render={
        <IconButton
          variant="ghost"
          size="sm"
          icon={props.icon ?? <SidebarSimpleIcon weight="bold" mirrored />}
          aria-label={props["aria-label"] ?? "Toggle sidebar"}
          xstyle={props.xstyle}
        />
      }
    />
  );
}

/**
 * The panel. Stays mounted while closed so its controls keep their state.
 * `xstyle` lands on an inner wrapper: a `display` on the panel itself would
 * override the [hidden] that hides it when closed.
 */
function Content(props: { children?: ReactNode; "aria-label": string; xstyle?: StyleXStyles }) {
  return (
    <Collapsible.Panel
      keepMounted
      render={<aside aria-label={props["aria-label"]} />}
      className={(state) => stylex.props(contentStyles(state)).className}
      style={(state) => stylex.props(contentStyles(state)).style}
    >
      <div {...stylex.props(styles.body, props.xstyle)}>{props.children}</div>
    </Collapsible.Panel>
  );
}

export const Sidebar = { Root, Trigger, Content };

const width = "20rem";

const styles = stylex.create({
  // Lengths on both ends: `auto` would only interpolate where interpolate-size
  // is supported.
  root: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 0rem",
    overflow: "clip",
    transitionProperty: "grid-template-columns",
    transitionDuration: {
      default: "0s",
      "@media (prefers-reduced-motion: no-preference)": "200ms",
    },
    transitionTimingFunction: "cubic-bezier(0.77, 0, 0.175, 1)",
  },
  rootOpen: {
    gridTemplateColumns: `minmax(0, 1fr) ${width}`,
  },
  // Fixed width inside a column that shrinks, so the panel slides out of view
  // instead of squeezing its contents.
  content: {
    inlineSize: width,
    overflowY: "auto",
    overscrollBehavior: "contain",
    backgroundColor: color.surface,
    borderInlineStartWidth: 2,
    borderInlineStartStyle: "solid",
    borderInlineStartColor: color.border,
    // Base UI waits for the panel's own transitions before hiding it. This one
    // keeps the panel visible for the length of the column's slide, so match
    // the root's duration.
    transitionProperty: "visibility",
    transitionDuration: {
      default: "0s",
      "@media (prefers-reduced-motion: no-preference)": "200ms",
    },
  },
  contentClosed: {
    visibility: "hidden",
  },
  body: {
    minBlockSize: "100%",
  },
});

function contentStyles(state: Collapsible.Panel.State) {
  let closed = state.transitionStatus === "starting" || state.transitionStatus === "ending";
  return [styles.content, closed && styles.contentClosed];
}
