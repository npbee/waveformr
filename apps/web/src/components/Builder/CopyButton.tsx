import { useEffect, useMemo, useState } from "react";
import { Button } from "./Button";
import { Copy } from "./Icons";

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
    <Button
      icon={<Copy />}
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
    </Button>
  );
}
