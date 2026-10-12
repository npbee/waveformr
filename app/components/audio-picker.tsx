import { Popover } from "@base-ui/react/popover";
import { ArrowRightIcon, LinkIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { useId, useState } from "react";
import { Button } from "~/components/ui/button";
import { color } from "~/styles/tokens.stylex";

/**
 * The audio file's name; pressing it opens a form to load another by link.
 * Audio is only ever loaded from a URL, never uploaded.
 */
export function AudioPicker(props: { title: string; onLoad: (url: string) => void }) {
  let [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        render={
          <Button
            variant="ghost"
            size="sm"
            iconStart={<PencilSimpleIcon weight="bold" />}
            aria-label={`Change audio: ${props.title}`}
            xstyle={styles.trigger}
          />
        }
      >
        <span {...stylex.props(styles.title)}>{props.title}</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="end" sideOffset={8}>
          <Popover.Popup {...stylex.props(styles.popup)}>
            <LinkForm
              onLoad={(url) => {
                setOpen(false);
                props.onLoad(url);
              }}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

/**
 * One outlined strip holding a link icon, the input and a submit button,
 * built like the SegmentedControl: 2px border, 2px padding, inset button.
 */
function LinkForm(props: { onLoad: (url: string) => void }) {
  let inputId = useId();
  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        let url = new FormData(evt.currentTarget).get("url");
        if (typeof url === "string" && url) props.onLoad(url);
      }}
      {...stylex.props(styles.group)}
    >
      <label htmlFor={inputId} {...stylex.props(styles.visuallyHidden)}>
        Audio link
      </label>
      <LinkIcon aria-hidden weight="bold" {...stylex.props(styles.groupIcon)} />
      <input
        id={inputId}
        name="url"
        type="url"
        required
        placeholder="Paste a link to an MP3"
        {...stylex.props(styles.input)}
      />
      <Button type="submit" aria-label="Load" xstyle={styles.submit}>
        <ArrowRightIcon aria-hidden weight="bold" />
      </Button>
    </form>
  );
}

const styles = stylex.create({
  trigger: {
    minInlineSize: 0,
    fontSize: 13,
    color: color.textMuted,
  },
  // Long names truncate instead of pushing the header apart.
  title: {
    maxInlineSize: "16rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  // No frame of its own: the form's strip is the whole popup.
  popup: {
    inlineSize: "min(22rem, 100vw - 24px)",
    outline: "none",
  },
  // No focus ring: the input takes focus as soon as the popup opens, so the
  // caret is enough and a ring would just double the border.
  group: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 2,
    paddingInlineStart: 10,
    backgroundColor: color.bg,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: color.border,
    borderRadius: 8,
  },
  groupIcon: {
    flexShrink: 0,
    color: color.textMuted,
  },
  input: {
    flex: 1,
    minInlineSize: 0,
    padding: 0,
    font: "inherit",
    fontSize: 14,
    color: "inherit",
    backgroundColor: "transparent",
    borderWidth: 0,
    outline: "none",
    "::placeholder": {
      color: color.textMuted,
    },
  },
  // Inset like a SegmentedControl segment: 28px tall, radius 8 minus the
  // padding.
  submit: {
    flexShrink: 0,
    inlineSize: 28,
    minBlockSize: 28,
    paddingInline: 0,
    borderWidth: 0,
    borderRadius: 5,
  },
  visuallyHidden: {
    position: "absolute",
    inlineSize: 1,
    blockSize: 1,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
  },
});
