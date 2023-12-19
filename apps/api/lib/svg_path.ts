// Inspired by: https://github.com/jerosoler/waveform-path
import { Path } from "$lib/path.ts";

interface BaseLinearPathConfig {
  width: number;
  height: number;
  strokeLinecap: "square" | "butt" | "round";
  strokeWidth: number;
}

export interface MirrorPathConfig extends BaseLinearPathConfig {
  type: "mirror";
  options?: {
    bars?: Array<{
      height?: number;
      offset?: number;
    }>;
  };
}

export interface StepsPathConfig extends BaseLinearPathConfig {
  type: "steps";
  options?: {
    steps?: Array<{
      height?: number;
      offset?: number;
      step?: number;
    }>;
  };
}

export interface BarsPathConfig extends BaseLinearPathConfig {
  type: "bars";
  options?: {
    invert?: boolean;
    bars?: Array<{
      height?: number;
      offset?: number;
    }>;
  };
}

export type LinearPathConfig =
  | MirrorPathConfig
  | StepsPathConfig
  | BarsPathConfig;

export const defaultConfig: LinearPathConfig = {
  type: "mirror",
  width: 800,
  height: 100,
  strokeLinecap: "round",
  strokeWidth: 2,
  options: {
    bars: [{ height: 100, offset: 0 }],
  },
};

export function linearPath(
  data: Array<number>,
  config: LinearPathConfig = defaultConfig,
) {
  const { type, height, strokeWidth, strokeLinecap } = config;
  const sampleLength = data.length;
  const width = config.width / sampleLength;
  let path = Path.create();

  // We need to know the linecap here so that we can adjust the
  // height of the bars to account for the linecap.
  const capHeight =
    strokeLinecap === "round" || strokeLinecap === "square" ? strokeWidth : 0;

  const defaultheight = height - capHeight;

  if (type === "mirror") {
    const { bars = [{ height: defaultheight }] } = config.options ?? {};
    const halfHeight = height / 2;
    const barsLength = bars.length;

    for (let i = 0; i < sampleLength; i++) {
      let dataVal = data[i];

      // Loop through the bars once to draw the bottom side of the waveform
      for (let j = 0; j < barsLength; j++) {
        let bar = bars[j];
        let x = i * width;
        let maxY = height / 2;

        let offset = bar.offset ?? 0;
        let barHeight = (bar.height ?? 100) + offset;

        // Move to the initial y point
        let startY =
          // Start in the vertical center
          halfHeight +
          // Then go to the offset point relative to the max y value
          ((dataVal * offset) / 100) * maxY;

        // Draw the line either up or down depending on if we're mirroring
        let endY = halfHeight + ((dataVal * barHeight) / 100) * maxY;

        path.moveTo(x, startY);
        path.vlineTo(endY);
      }

      // Now draw the top of the waveform
      for (let j = 0; j < barsLength; j++) {
        let bar = bars[j];
        let x = i * width;
        let maxY = halfHeight * -1;

        let offset = bar.offset ?? 0;
        let barHeight = (bar.height ?? 100) + offset;

        // Move to the initial y point
        let startY =
          // Start in the vertical center
          halfHeight +
          // Then go to the offset point relative to the max y value
          ((dataVal * offset) / 100) * maxY;

        // Draw the line either up or down depending on if we're mirroring
        let endY = halfHeight + ((dataVal * barHeight) / 100) * maxY;

        path.moveTo(x, startY);
        path.vlineTo(endY);
      }
    }

    return path.end();
  } else if (type === "steps") {
    let { steps = [{ height: defaultheight }] } = config.options ?? {};
    const halfHeight = height / 2;
    const stepsLength = steps.length;
    for (let i = 0; i < sampleLength; i++) {
      let dataVal = data[i];

      // Loop through the bars once to draw the bottom side of the waveform
      for (let j = 0; j < stepsLength; j++) {
        let positive = i % 2 ? 1 : -1;
        let step = steps[j];
        let maxY = height / 2;
        let offset = step.offset ?? 0;
        let stepHeight = (step.height ?? 100) + offset;
        let stepOffset = step.step ?? 50;

        let startX = i * width;
        let startY =
          // Start in the vertical center
          halfHeight +
          // Then go to the offset point relative to the max y value
          ((dataVal * offset) / 100) * maxY * -positive;

        let midX = startX + (width * stepOffset) / 100;
        let midY = startY + ((dataVal * stepHeight) / 100) * maxY * -positive;

        let endX = midX + (width * stepOffset) / 100;
        let endY = startY;

        path.moveTo(startX, startY);
        path.lineTo(midX, midY);
        path.lineTo(endX, endY);
      }
    }
    return path.end();
  } else if (type === "bars") {
    let { bars = [{ height: defaultheight }], invert } = config.options ?? {};
    const barsLength = bars.length;

    for (let i = 0; i < sampleLength; i++) {
      let dataVal = data[i];

      for (let j = 0; j < barsLength; j++) {
        let bar = bars[j];
        let maxY = height;
        let offset = bar.offset ?? 0;
        let barHeight = (bar.height ?? 100) + offset;

        let startX = i * width;
        let startY = maxY;
        let endY = maxY - ((dataVal * barHeight) / 100) * maxY;

        if (invert) {
          startY = 0;
          endY = ((dataVal * barHeight) / 100) * maxY;
        }

        path.moveTo(startX, startY);
        path.vlineTo(endY);
      }
    }
    return path.end();
  } else {
    throw new Error("UNKNOWN TYPE");
  }
}
