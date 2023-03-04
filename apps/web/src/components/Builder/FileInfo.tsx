import { memo, useMemo } from "react";

export let FileInfo = memo(function FileInfo(props: {
  name: string;
  duration: number;
}) {
  let { name, duration } = props;
  let formattedDuration = useMemo(() => formatTime(duration), [duration]);
  return (
    <p className="flex items-center gap-1 text-xs text-gray11">
      <span>{name}</span>
      <span>&bull;</span>
      <span>{formattedDuration}</span>
    </p>
  );
});

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = `${Math.floor(seconds % 60)}`.padStart(2, "0");

  return `${min}:${sec}`;
}
