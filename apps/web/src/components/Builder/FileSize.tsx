import { useDeferredValue } from "react";
import { useFileSizeString } from "./state";

export function FileSize() {
  let fileSize = useFileSizeString();
  let deferredFileSize = useDeferredValue(fileSize);
  let isStale = fileSize !== deferredFileSize;
  return (
    <p
      className={`text-xs font-semibold text-gray-600 dark:text-gray-400 ${
        isStale ? "opacity-50" : "opacity-100"
      }`}
    >
      {deferredFileSize}
    </p>
  );
}
