import { useEffect, useRef, useState } from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import { clsx } from "clsx";

const trackUrl =
  "https://res.cloudinary.com/dhhjogfy6//video/upload/q_auto/v1575831765/audio/rest.mp3";

const waveformUrl = (params: string) =>
  process.env.NODE_ENV === "development"
    ? `http://localhost:8000/render?url=${trackUrl}&type=bars${params}`
    : `https://api.waveformr.com/render?url=${trackUrl}&type=bars${params}`;

export function AudioPlayer() {
  const ref = useRef<HTMLAudioElement>(null);
  const [mediaTime, setMediaTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [state, setState] = useState<"playing" | "paused" | "idle">("idle");

  function togglePlay() {
    const audio = ref.current;

    if (audio) {
      setState((currentState) =>
        currentState === "playing" ? "paused" : "playing",
      );
      audio.paused ? audio.play() : audio.pause();
    }
  }

  useEffect(() => {
    ref.current?.load();
  }, []);

  let playedPercent = duration === 0 ? 0 : round(mediaTime / duration, 6);
  let played = `${playedPercent * 100}%`;

  return (
    <div className="border p-4 shadow-2xl bg-gray-900 rounded-lg dark:border-gray-800 dark:bg-gray-950 dark:border-2">
      <audio
        src={trackUrl}
        ref={ref}
        onLoadedMetadata={(evt) => {
          setDuration(Math.round(evt.currentTarget.duration));
        }}
        onTimeUpdate={(evt) => {
          setMediaTime(evt.currentTarget.currentTime);
        }}
      />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex gap-3 items-center">
              <div className="">
                <img
                  alt="Artist image of The Air on Earth"
                  src="/taoe.jpg"
                  className="w-10 md:w-12 aspect-square rounded"
                />
              </div>
              <div>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg md:text-xl font-medium text-gray-50 hover:underline block"
                  href="https://open.spotify.com/track/5fqgN15DVKhH7TjUkvjVQD"
                >
                  Rest
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-300 hover:underline block"
                  href="https://open.spotify.com/artist/4beU4ZRfDapoH3orvpJthM"
                >
                  The Air on Earth
                </a>
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            {state === "idle" ? null : (
              <CurrentTime currentTime={mediaTime} duration={duration} />
            )}
            <TogglePlayButton state={state} onClick={togglePlay} />
          </div>
        </div>
        <div
          className="relative w-full flex flex-col gap-0.5"
          style={{ "--played": played } as React.CSSProperties}
        >
          <img
            alt=""
            src={waveformUrl(`&height=60&stroke=cbd5e1`)}
            className="h-full"
          />
          <img
            alt=""
            src={waveformUrl(`&stroke=linear-gradient(red, blue)&height=60`)}
            className="h-auto absolute w-full top-0 left-0"
            style={{
              clipPath: `polygon(0% 0%, var(--played) 0%, var(--played) 100%, 0% 100%)`,
            }}
          />
          <div className="bottom-half flex-1 relative">
            <img
              alt=""
              src={waveformUrl(`&height=30&stroke=475569`)}
              className="h-full scale-y-flip opacity-100"
            />
            <img
              src={waveformUrl(`&stroke=333333&height=30`)}
              className="h-auto absolute w-full top-0 left-0 scale-y-flip opacity-100"
              style={{
                clipPath: `polygon(0% 0%, var(--played) 0%, var(--played) 100%, 0% 100%)`,
              }}
            />
          </div>
          <div className="absolute h-full w-full">
            <Scrubber
              value={[mediaTime]}
              min={0}
              max={duration}
              aria-valuetext={`${mediaTime} seconds`}
              state={state}
              onValueChange={(value) => {
                setMediaTime(value[0]);
                const audio = ref.current;
                if (audio) {
                  audio.currentTime = value[0];
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CurrentTime(props: { currentTime: number; duration: number }) {
  const { currentTime, duration } = props;
  return (
    <div className="flex gap-2 text-xs font-medium text-gray-300">
      <div>{formatDuration(currentTime)}</div>
      <span className="text-xs">/</span>
      <div>{formatDuration(duration)}</div>
    </div>
  );
}

function TogglePlayButton(
  props: React.ComponentPropsWithoutRef<"button"> & {
    state: "playing" | "paused" | "loading" | "idle";
  },
) {
  const { state, ...rest } = props;

  return (
    <button
      {...rest}
      className="text-4xl text-gray-50"
      aria-label={state === "playing" ? "Pause" : "Play"}
    >
      {state === "playing" ? (
        <PauseIcon />
      ) : state === "loading" ? (
        <div>...</div>
      ) : (
        <PlayIcon />
      )}
    </button>
  );
}

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-play-circle"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-pause-circle"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="10" x2="10" y1="15" y2="9" />
      <line x1="14" x2="14" y1="15" y2="9" />
    </svg>
  );
}

function formatDuration(seconds: number) {
  const min = String(Math.floor(seconds / 60) % 60).padStart(2, "0");
  const sec = String(Math.floor(seconds) % 60).padStart(2, "0");

  return `${min}:${sec}`;
}

function Scrubber(
  props: RadixSlider.SliderProps & { state: "playing" | "paused" | "idle" },
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { state, ...rest } = props;
  return (
    <RadixSlider.Root
      ref={rootRef}
      className="flex h-full [&>*]:h-full"
      style={
        { "--mouse-left": "0%", "--mouse-opacity": "0%" } as React.CSSProperties
      }
      {...rest}
      onMouseLeave={() => {
        const rootEl = rootRef.current;
        if (!rootEl) return;
        rootEl.style.setProperty("--mouse-opacity", `0%`);
      }}
    >
      <RadixSlider.Track
        className="grow rounded-full bg-none relative"
        onMouseMove={(evt) => {
          const x = evt.clientX;
          const rootEl = rootRef.current;
          if (!rootEl) return;
          const rootLeft = rootEl.getBoundingClientRect().left;
          const diff = x - rootLeft;
          const percentLeft = diff / rootEl.getBoundingClientRect().width;

          rootEl.style.setProperty("--mouse-left", `${percentLeft * 100}%`);
          rootEl.style.setProperty("--mouse-opacity", `50%`);
        }}
      >
        <RadixSlider.Range className="bg-none h-full absolute" />
      </RadixSlider.Track>
      <div
        className="absolute w-[2px] bg-accent-orange opacity-0 h-full"
        style={{ left: "var(--mouse-left)", opacity: "var(--mouse-opacity)" }}
      ></div>
      <RadixSlider.Thumb
        aria-label="Current time"
        aria-valuetext={`${props.value?.[0]} seconds`}
        className={clsx(
          state === "idle" ? "opacity-0" : "opacity-100",
          "bg-none",
          `transition-all ring-gray-200 outline-none focus-visible:bg-accent-orange focus-visible:opacity-100 block w-[2px] rounded-lg h-full focus-visible:ring-2`,
        )}
      />
    </RadixSlider.Root>
  );
}

function round(num: number, precision: number = 0) {
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
}
