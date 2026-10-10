import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

/**
 * Download the rendered SVG or copy its link. Disabled until `renderUrl` is
 * known, which needs the page's origin and so waits for hydration.
 */
export function ExportActions(props: {
  renderUrl: string | null;
  filename: string;
  xstyle?: StyleXStyles;
}) {
  let [copy, setCopy] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (copy === "idle") return;
    let timeout = setTimeout(() => setCopy("idle"), 2000);
    return () => clearTimeout(timeout);
  }, [copy]);

  return (
    <div {...stylex.props(styles.root, props.xstyle)}>
      <Button
        nativeButton={false}
        render={<a href={props.renderUrl ?? undefined} download={props.filename} />}
        disabled={!props.renderUrl}
        xstyle={styles.button}
      >
        <DownloadIcon />
        Download SVG
      </Button>
      <Button
        variant="outline"
        disabled={!props.renderUrl}
        onClick={() => {
          if (!props.renderUrl) return;
          navigator.clipboard.writeText(props.renderUrl).then(
            () => setCopy("copied"),
            () => setCopy("error"),
          );
        }}
        xstyle={styles.button}
      >
        <LinkIcon />
        <span aria-live="polite">
          {copy === "copied" ? "Copied" : copy === "error" ? "Couldn't copy" : "Copy link"}
        </span>
      </Button>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  button: {
    flex: "1 1 140px",
    textDecorationLine: "none",
  },
});
