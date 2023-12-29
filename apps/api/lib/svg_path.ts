// Inspired by: https://github.com/jerosoler/waveform-path
import { Path } from "$lib/path.ts";
import type { RenderParams } from "$lib/schemas.ts";

interface BaseLinearPathConfig {
  width: number;
  height: number;
  strokeLinecap: "square" | "butt" | "round";
  strokeWidth: number;
}

export interface MirrorPathConfig extends BaseLinearPathConfig {
  type: "mirror";
}

export interface StepsPathConfig extends BaseLinearPathConfig {
  type: "steps";
}

export interface BarsPathConfig extends BaseLinearPathConfig {
  type: "bars";
}

export type LinearPathConfig =
  | MirrorPathConfig
  | StepsPathConfig
  | BarsPathConfig;

export function linearPath(data: Array<number>, config: RenderParams) {
  const { type, height, strokeWidth, strokeLinecap } = config;
  const sampleLength = data.length;
  const width = config.width / sampleLength;
  let path = Path.create();

  // We need to know the linecap here so that we can adjust the
  // height of the bars to account for the linecap.
  let capHeight =
    strokeLinecap === "round" || strokeLinecap === "square"
      ? strokeWidth / 2
      : 0;

  if (type === "mirror") {
    const adjustedHeight = height - capHeight * 2;
    const verticalCenter = height / 2;

    for (let i = 0; i < sampleLength; i++) {
      let dataVal = data[i];

      {
        // Loop through the bars once to draw the bottom side of the waveform
        let x = i * width;
        let maxY = adjustedHeight / 2;

        // Move to the initial y point
        // Start in the vertical center
        let startY = verticalCenter;

        // Draw the line down
        let endY = verticalCenter + dataVal * maxY;

        path.moveTo(x, startY);
        path.vlineTo(endY);
      }

      // Now draw the top of the waveform
      {
        let x = i * width;
        let maxY = (adjustedHeight / 2) * -1;

        // Move to the initial y point
        // Start in the vertical center
        let startY = verticalCenter;

        // Draw the line either up or down depending on if we're mirroring
        let endY = verticalCenter + dataVal * maxY;

        path.moveTo(x, startY);
        path.vlineTo(endY);
      }
    }

    return path.end();
  } else if (type === "steps") {
    const verticalCenter = height / 2;

    // Linecap has no effect on this type, but we still need to adjust the
    // height based on the stroke width.
    // TODO: Can we emulate the linecap effect here?
    const adjustedHeight = height - strokeWidth * 2;
    for (let i = 0; i < sampleLength; i++) {
      let dataVal = data[i];

      // If positive, we're drawing up, if negative, we're drawing down
      let positive = i % 2 ? 1 : -1;
      let maxY = adjustedHeight / 2;
      let stepOffset = 50;

      let startX = i * width;
      // Start in the vertical center
      let startY = verticalCenter;

      let midX = startX + (width * stepOffset) / 100;
      let midY = startY + dataVal * maxY * -positive;

      let endX = midX + (width * stepOffset) / 100;
      let endY = startY;

      path.moveTo(startX, startY);
      path.lineTo(midX, midY);
      path.lineTo(endX, endY);
    }
    return path.end();
  } else if (type === "bars") {
    let invert = false;
    const adjustedHeight = height - capHeight * 2;

    for (let i = 0; i < sampleLength; i++) {
      let dataVal = data[i];
      let maxY = height - capHeight;

      let startX = i * width;
      let startY = maxY;
      let endY = maxY - dataVal * adjustedHeight;

      if (invert) {
        startY = 0;
        endY = dataVal * maxY;
      }

      path.moveTo(startX, startY);
      path.vlineTo(endY);
    }
    return path.end();
  } else {
    throw new Error("UNKNOWN TYPE");
  }
}
