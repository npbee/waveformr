import { useRef, useState } from "react";

export type AudioStatus = "idle" | "loading" | "playing" | "paused" | "error";

/**
 * Playback state for one audio source. Spread `audioProps` onto an `<audio>`
 * element; everything else drives the controls.
 */
export function useAudioPlayer(src: string) {
  const ref = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<AudioStatus>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function play() {
    const audio = ref.current;
    if (!audio) return;
    setStatus("loading");
    // Rejects on autoplay blocks or a pause() racing the load.
    audio.play().catch(() => setStatus(audio.paused ? "paused" : "playing"));
  }

  function pause() {
    ref.current?.pause();
  }

  function toggle() {
    if (ref.current?.paused ?? true) play();
    else pause();
  }

  function seek(time: number) {
    const audio = ref.current;
    if (!audio) return;
    audio.currentTime = time;
    // Update right away; the next timeupdate can be ~250ms out.
    setCurrentTime(time);
  }

  const audioProps = {
    ref,
    src,
    // Metadata only: the full file loads on first play.
    preload: "metadata",
    onDurationChange: (evt) => setDuration(evt.currentTarget.duration || 0),
    onTimeUpdate: (evt) => setCurrentTime(evt.currentTarget.currentTime),
    onWaiting: () => setStatus("loading"),
    onPlaying: () => setStatus("playing"),
    onPause: () => setStatus("paused"),
    onEnded: () => setStatus("paused"),
    onError: () => setStatus("error"),
  } satisfies React.ComponentProps<"audio">;

  return {
    audioProps,
    status,
    isPlaying: status === "playing",
    currentTime,
    duration,
    progress: duration > 0 ? currentTime / duration : 0,
    play,
    pause,
    toggle,
    seek,
  };
}
