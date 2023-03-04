import { useDeferredValue } from "react";
import { useFileSizeString } from "./state";

export function FileSize() {
  let fileSize = useFileSizeString();
  let deferredFileSize = useDeferredValue(fileSize);
  let isStale = fileSize !== deferredFileSize;
  return (
    <p
      className={`text-xs font-semibold text-gray11 dark:text-grayDark11 ${
        isStale ? "opacity-50" : "opacity-100"
      }`}
    >
      {deferredFileSize}
    </p>
  );
}
