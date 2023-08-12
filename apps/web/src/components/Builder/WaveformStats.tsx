import { memo, useMemo } from "react";

export let WaveformStats = memo(function FileInfo(props: {
  duration: number;
  sampleRate: number;
}) {
  let { duration, sampleRate } = props;
  let formattedDuration = useMemo(() => formatTime(duration), [duration]);
  let formattedSampleRate = useMemo(
    () => formatSampleRate(sampleRate),
    [sampleRate],
  );
  return (
    <dl className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
      <div className="flex gap-1">
        <dd className="sr-only">Duration</dd>
        <dt>{formattedDuration}</dt>
      </div>
      <span>&bull;</span>
      <div className="flex gap-1">
        <dd className="sr-only">Sample Rate</dd>
        <dt>{formattedSampleRate}</dt>
      </div>
    </dl>
  );
});

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = `${Math.floor(seconds % 60)}`.padStart(2, "0");

  return `${min} min ${sec} sec`;
}

function formatSampleRate(rate: number) {
  let n = new Intl.NumberFormat("en-US").format(rate);

  return `${n} Hz`;
}
