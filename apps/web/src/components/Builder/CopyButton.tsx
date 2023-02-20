import { useEffect, useMemo, useState } from "react";

interface CopyButtonProps {
  children: React.ReactNode;
  onCopy: () => Promise<unknown>;
}

export function CopyButton(props: CopyButtonProps) {
  let { children, onCopy } = props;
  let [state, setState] = useState<"idle" | "copying" | "copied" | "error">(
    "idle"
  );
  let copy = useMemo(() => {
    console.log(state);
    if (state === "copied") {
      return "Copied!";
    } else if (state === "error") {
      return "Error copying.";
    } else {
      return children;
    }
  }, [state, children]);

  useEffect(() => {
    let timeout: number;
    console.log(state);
    if (state === "copied" || state === "error") {
      timeout = setTimeout(() => {
        setState("idle");
      }, 2000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  });
  return (
    <button
      onClick={async () => {
        try {
          setState("copying");
          await onCopy();
          setState("copied");
        } catch (err) {
          setState("error");
        }
      }}
    >
      {copy}
    </button>
  );
}
