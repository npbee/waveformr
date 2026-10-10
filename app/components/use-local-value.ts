import { useState } from "react";

/**
 * Local copy of a URL-backed value. Controls update instantly while the
 * navigation (and its loader) is pending, then follow the URL once it commits,
 * including on back/forward.
 */
export function useLocalValue<T>(value: T) {
  const [local, setLocal] = useState(value);
  const [synced, setSynced] = useState(value);
  if (!Object.is(synced, value)) {
    setSynced(value);
    setLocal(value);
  }
  return [local, setLocal] as const;
}
