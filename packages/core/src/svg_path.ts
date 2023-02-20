import { Path } from "./path";

interface BaseLinearPathOptions {
  width: number;
  height: number;
}

interface MirrorPathConfig extends BaseLinearPathOptions {
  type: "mirror";
  bars?: Array<{
    height?: number;
    offset?: number;
  }>;
}

interface StepsPathConfig extends BaseLinearPathOptions {
  type: "steps";
  steps?: Array<{
    height?: number;
    offset?: number;
    step?: number;
  }>;
}

interface BarsPathConfig extends BaseLinearPathOptions {
  type: "bars";
  invert?: boolean;
  bars?: Array<{
    height?: number;
    offset?: number;
  }>;
}

export type LinearPathOptions =
  | MirrorPathConfig
  | StepsPathConfig
  | BarsPathConfig;

const defaultOptions: LinearPathOptions = {
  type: "mirror",
  bars: [{ height: 100, offset: 0 }],
  width: 800,
  height: 100,
};

export function linearPath(
  data: Array<number>,
  options: LinearPathOptions = defaultOptions
) {
  const { type, height } = options;
  const sampleLength = data.length;
  const width = options.width / sampleLength;
  let path = Path.create();

  if (type === "mirror") {
    const { bars = [{ height: 100 }] } = options;
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
    let { steps = [{ height: 100 }] } = options;
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
    let { bars = [{ height: 100 }], invert } = options;
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
