import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useId } from "react";
import { Button } from "~/components/ui/button";
import { color } from "~/styles/tokens.stylex";

export function LoadForm(props: { onLoad: (url: string) => void; xstyle?: StyleXStyles }) {
  let inputId = useId();
  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        let url = new FormData(evt.currentTarget).get("url");
        if (typeof url === "string" && url) props.onLoad(url);
      }}
      {...stylex.props(styles.root, props.xstyle)}
    >
      <label htmlFor={inputId} {...stylex.props(styles.visuallyHidden)}>
        Audio link
      </label>
      <input
        id={inputId}
        name="url"
        type="url"
        required
        placeholder="Paste a link to an MP3"
        {...stylex.props(styles.input)}
      />
      <Button type="submit" variant="outline" xstyle={styles.button}>
        Load
      </Button>
    </form>
  );
}

const styles = stylex.create({
  root: {
    display: "flex",
    gap: 8,
  },
  input: {
    flex: 1,
    minInlineSize: 0,
    minBlockSize: 44,
    paddingInline: 14,
    font: "inherit",
    fontSize: 15,
    color: "inherit",
    backgroundColor: color.bg,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: color.borderSubtle,
    borderRadius: 10,
    outline: {
      default: "none",
      ":focus-visible": `2px solid ${color.focusRing}`,
    },
    outlineOffset: 2,
    "::placeholder": {
      color: color.textMuted,
    },
  },
  button: {
    minBlockSize: 44,
    paddingInline: 16,
    borderRadius: 10,
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
