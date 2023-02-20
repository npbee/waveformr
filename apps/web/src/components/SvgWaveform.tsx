import { linearPath as linearPath, LinearPathOptions } from "@waveformr/core";

export type SvgWaveformProps = LinearPathOptions & {
  id?: string;
  data: Array<number>;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
};

export function SvgWavform(props: SvgWaveformProps) {
  let {
    id,
    fill,
    stroke,
    strokeWidth = 2,
    strokeLinecap = "round",
    data,
    width,
    height,
    ...rest
  } = props;

  let path = linearPath(data, {
    ...rest,
    width,
    height,
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" id={id}>
      <path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
      />
    </svg>
  );
}
